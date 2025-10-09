;(() => {
  const $ = (sel) => document.querySelector(sel)
  const logEl = $("#log")
  const statusEl = $("#ws-status")
  const connectBtn = $("#connect-btn")
  const disconnectBtn = $("#disconnect-btn")
  const btnReqWduInfo = $("#req-wdu-info")
  const btnSubAll = $("#sub-all")
  const chkAutoSubIndex2 = $("#auto-sub-index2")
  const urlEl = $("#ws-url")
  // Registry of reusable momentary controls keyed by signalId
  const controlsBySignal = new Map() // signalId -> { button, badge, isDown, pressOnly }
  const signalValueViews = new Map() // signalId -> { el, valueEl, unitEl, scaleInput, unitSelect, scale, valueKind, tempUnit }
  // Optional per-signal scaling overrides (divisors). These take precedence when present.
  // Derived from native mappings or observation: temps often DEC3 (1e3), voltage often 0.1 (1e1)
  const signalScaleOverrides = new Map([
    [2, 1e3], // signal-value-int-temp
    [3, 1e3], // signal-value-ext-temp
    [4, 1e3], // signal-value-starter-battery-voltage (millivolts)
  ])
  // Optional per-signal formatting (e.g., decimals)
  const signalFormatOverrides = new Map([
    [4, { decimals: 2 }], // Voltage: display 2 decimals (e.g., 12.69)
  ])

  let ws = null
  let shouldAutoReconnect = true
  let reconnectTimer = null
  let reconnectAttempt = 0
  const INITIAL_RECONNECT_DELAY = 1000
  const MAX_RECONNECT_DELAY = 30000
  const PROTOCOL = {
    // message type codes
    systemCmd: 48,
    systemReq: 49,
    mfdStatus: 16,
    acknowledgement: 128,
    // system command subtypes
    serviceProviderHeartbeat: 0, // data[5]
    wduInfo: 6,
    wduHeartbeat: 5,
    // ack subtypes
    acknowledgementAck: 0,
  }

  // Heuristic temperature decoder: returns Celsius
  function decodeTemperatureC(data, raw) {
    // Prefer 8-byte frames when present
    if (Array.isArray(data) && data.length >= 5) {
      // Candidate A: integer + hundredths from bytes [3] and [4]
      const intPart = data[3] | 0
      const fracPart = (data[4] | 0) / 100 // 104 -> 1.04
      const candA = intPart + fracPart
      if (candA >= -40 && candA <= 125) return candA
    }
    if (typeof raw === "number") {
      // Candidate B: Celsius millidegrees
      const candB = raw / 1e3
      if (candB >= -40 && candB <= 125) return candB
      // Candidate C: Kelvin millidegrees
      const candC = raw / 1e3 - 273.15
      if (candC >= -40 && candC <= 125) return candC
    }
    // Fallback: best-effort
    return typeof raw === "number" ? raw : NaN
  }

  // Build a dimmer control message (17/3)
  function buildDimmerCommand(signalId, valuePercent, dimmerIndex) {
    const lo = signalId & 0xff
    const hi = (signalId >> 8) & 0xff
    const idx = Number(dimmerIndex) | 0 // which dimmer within the signal (often 0)
    const pct = Math.max(0, Math.min(100, Number(valuePercent) || 0))
    // Use 0.1% resolution like the native app: t = round(percent * 10)
    const t = Math.round(pct * 10)
    const tLo = t & 0xff
    const tHi = (t >> 8) & 0xff
    return {
      messagetype: 17,
      messagecmd: 3,
      size: 5,
      data: [lo, hi, idx, tLo, tHi],
    }
  }

  function pageWsUrl() {
    const isHttps = window.location.protocol === "https:"
    const scheme = isHttps ? "wss://" : "ws://"
    const host = window.location.host // includes host:port
    return `${scheme}${host}/ws`
  }
  function clearReconnectTimer() {
    if (reconnectTimer !== null) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }
  function scheduleReconnect(evt) {
    if (!shouldAutoReconnect) {
      log("Auto-reconnect disabled; skipping reconnect", {
        code: evt?.code,
        reason: evt?.reason,
      })
      return
    }

    reconnectAttempt = Math.min(reconnectAttempt + 1, 10)
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, reconnectAttempt - 1),
      MAX_RECONNECT_DELAY
    )

    log(`Scheduling reconnect in ${Math.round(delay / 1000)}s`, {
      code: evt?.code,
      reason: evt?.reason || "",
    })

    clearReconnectTimer()
    reconnectTimer = window.setTimeout(() => {
      reconnectTimer = null
      connect()
    }, delay)
  }

  // --- Signal metadata ---
  let signalMeta = new Map() // id -> description
  let signalIds = [] // numeric ids for subscription data
  async function loadSignalInfo() {
    try {
      const resp = await fetch("signal-info.json")
      if (!resp.ok) return
      const json = await resp.json()
      const map = new Map()
      const ids = []
      for (const item of json) {
        map.set(item.signalId, item.description || String(item.signalId))
        ids.push(Number(item.signalId))
      }
      ids.sort((a, b) => a - b)
      signalMeta = map
      signalIds = ids
      log("Loaded signal-info.json (", json.length, "signals)")
    } catch (e) {
      log("Failed to load signal-info.json:", e.message || e)
    }
  }

  function setStatus(state) {
    if (!statusEl) return
    statusEl.textContent = state
    statusEl.classList.remove("connected", "connecting", "disconnected")
    statusEl.classList.add(state)
  }

  function log(...args) {
    if (!logEl) return
    const line = args
      .map((a) => (typeof a === "string" ? a : JSON.stringify(a)))
      .join(" ")
    const ts = new Date().toISOString()
    logEl.textContent += `\n[${ts}] ${line}`
    logEl.scrollTop = logEl.scrollHeight
  }

  function connect() {
    shouldAutoReconnect = true
    clearReconnectTimer()
    if (
      ws &&
      (ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING)
    ) {
      log("Already connected or connecting")
      return
    }

    const target = pageWsUrl()
    if (urlEl) urlEl.textContent = target
    setStatus("connecting")

    try {
      ws = new WebSocket(target)
    } catch (e) {
      log("WebSocket constructor error:", e.message || e)
      setStatus("disconnected")
      scheduleReconnect({ code: 0, reason: e.message || "constructor error" })
      return
    }

    ws.addEventListener("open", () => {
      reconnectAttempt = 0
      clearReconnectTimer()
      setStatus("connected")
      if (connectBtn) connectBtn.disabled = true
      if (disconnectBtn) disconnectBtn.disabled = false
      log("WS open")
      // Enable dimmer sliders on connect
      document
        .querySelectorAll(
          'input[type="range"][data-signal-id][data-dimmer-index]'
        )
        .forEach((el) => (el.disabled = false))

      // Optional: request WDU info on connect, similar to the app's handshake
      const reqWduInfo = {
        messagetype: PROTOCOL.systemReq, // 49
        messagecmd: 1,
        size: 3,
        data: [0, 0, 0],
      }
      wsSend(reqWduInfo)

      // Optional: auto-subscribe to all signals on connect
      if (!chkAutoSubIndex2 || chkAutoSubIndex2.checked) {
        sendSubscribeAllSignals()
      }

      // Send initial snapshot for dimmers (one per control state)
      for (const [key, entry] of dimmerControls) {
        if (entry && entry.input) {
          const [sigStr, idxStr] = key.split(":")
          const sig = Number(sigStr)
          const idx = Number(idxStr) || 0
          const pct = Number(entry.input.value) || 0
          const msg = buildDimmerCommand(sig, pct, idx)
          wsSend(msg)
        }
      }
    })

    ws.addEventListener("message", (evt) => {
      try {
        const parsed = JSON.parse(evt.data)
        // Only enrich MFD STATUS (16) with signal name; avoid guessing for channel info (32)
        if (
          parsed.messagetype === PROTOCOL.mfdStatus &&
          Array.isArray(parsed.data) &&
          parsed.data.length >= 2
        ) {
          const sig = parsed.data[0] | (parsed.data[1] << 8)
          const name = signalMeta.get(sig)
          if (name) {
            log("IN <=", { ...parsed, _signalName: name })
          } else {
            log("IN <=", parsed)
          }

          // Update UI indicators for any registered control based on 16/1 frames
          if (
            parsed.messagecmd === 1 &&
            Array.isArray(parsed.data) &&
            parsed.data.length >= 3
          ) {
            const ctl = controlsBySignal.get(sig)
            if (ctl) {
              const isOn = parsed.data[2] === 1
              if (ctl.badge) {
                ctl.badge.textContent = isOn ? "pressed" : "released"
                ctl.badge.classList.toggle("on", isOn)
                ctl.badge.classList.toggle("off", !isOn)
              }
              if (ctl.button) {
                ctl.button.classList.toggle("active", isOn)
              }
            }
          }

          // Dimmer status frames: messagetype 16, messagecmd 3, data: [lo, hi, idx, valLo, valHi]
          if (
            parsed.messagecmd === 3 &&
            Array.isArray(parsed.data) &&
            parsed.data.length >= 5
          ) {
            const idx = parsed.data[2] | 0
            const val = parsed.data[3] | (parsed.data[4] << 8)
            // Normalize back to percent: if value exceeds 100, assume 0.1% resolution
            const pctNorm = val > 100 ? val / 10 : val
            const pct = Math.max(0, Math.min(100, Math.round(pctNorm)))
            const dimKey = `${sig}:${idx}`
            const entry = dimmerControls.get(dimKey)
            if (entry) {
              // Avoid feedback loop: only update UI if it's not actively being dragged or if value differs
              if (!entry.dragging || entry.input !== document.activeElement) {
                entry.input.value = String(pct)
                if (entry.valueEl) entry.valueEl.textContent = `${pct}%`
              }
            }
          }

          // Numeric signal value frames: messagetype 16, messagecmd 5
          // Formats observed:
          //  - Short (>=4 bytes): [lo, hi, valLo, valHi]
          //  - Extended (>=8 bytes): [lo, hi, r0, r1, valLo, valHi, meta0, meta1]
          //    where meta0 often encodes decimal precision category (e.g., DEC3 => 3), or subtype.
          if (
            parsed.messagecmd === 5 &&
            Array.isArray(parsed.data) &&
            parsed.data.length >= 4
          ) {
            const view = signalValueViews.get(sig)
            if (view) {
              // Prefer extended layout value if present (bytes 4-5)
              const hasExtended = parsed.data.length >= 8
              const raw = hasExtended
                ? (parsed.data[4] | (parsed.data[5] << 8)) >>> 0
                : (parsed.data[2] | (parsed.data[3] << 8)) >>> 0

              // Determine divisor
              let divisor = 0
              const override = signalScaleOverrides.get(sig)
              if (override) {
                divisor = override
              } else if (hasExtended) {
                const meta0 = parsed.data[6] >>> 0
                // If meta0 looks like a decimal exponent in the range 1..6, use it.
                // Some devices encode DEC3 as 3 (divide by 1e3). If meta0 is out of range, ignore.
                if (meta0 >= 1 && meta0 <= 6) {
                  divisor = Math.pow(10, meta0)
                }
              }

              // Compute base SI value
              let baseValue
              if (divisor && Number.isFinite(divisor) && divisor !== 1) {
                baseValue = raw / divisor
              } else {
                baseValue = raw * view.scale
              }

              let display = baseValue
              let decimals = 0

              // Temperature special-case
              if (view.valueKind === "temperature") {
                const celsius = decodeTemperatureC(parsed.data, raw)
                if (view.tempUnit === "F") {
                  display = (celsius * 9) / 5 + 32
                } else {
                  display = celsius
                }
                decimals = 2
              } else {
                // Non-temperature: pick decimals based on divisor
                if (divisor === 1e3) decimals = 3
                else if (divisor === 1e2) decimals = 2
                else if (divisor === 1e1) decimals = 1
              }

              // Apply per-signal formatting overrides (non-temperature)
              if (view.valueKind !== "temperature") {
                const fmt = signalFormatOverrides.get(sig)
                if (fmt && typeof fmt.decimals === "number") {
                  decimals = fmt.decimals
                }
              }

              // Render
              if (Number.isFinite(display)) {
                if (typeof decimals === "number" && decimals > 0) {
                  view.valueEl.textContent = String(
                    Number(display.toFixed(decimals))
                  )
                } else {
                  view.valueEl.textContent = String(display)
                }
              } else {
                view.valueEl.textContent = String(raw)
              }
            }
          }
        } else {
          log("IN <=", parsed)
        }

        // Auto-ACK the WDU heartbeat to keep the connection alive
        if (
          parsed.messagetype === PROTOCOL.systemCmd &&
          parsed.messagecmd === PROTOCOL.wduHeartbeat
        ) {
          const ack = {
            messagetype: PROTOCOL.acknowledgement, // 128
            messagecmd: PROTOCOL.acknowledgementAck, // 0
            size: 1,
            data: [0x00],
          }
          wsSend(ack)
        }
      } catch (_e) {
        log("IN <= (raw)", String(evt.data))
      }
    })

    ws.addEventListener("error", (evt) => {
      log("WS error", evt.message || "")
    })

    ws.addEventListener("close", (evt) => {
      setStatus("disconnected")
      if (connectBtn) connectBtn.disabled = false
      if (disconnectBtn) disconnectBtn.disabled = true
      log("WS closed", {
        code: evt.code,
        reason: evt.reason,
        wasClean: evt.wasClean,
      })
      // Disable dimmer sliders on disconnect
      document
        .querySelectorAll(
          'input[type="range"][data-signal-id][data-dimmer-index]'
        )
        .forEach((el) => (el.disabled = true))

      scheduleReconnect(evt)
    })
  }

  function disconnect() {
    shouldAutoReconnect = false
    reconnectAttempt = 0
    clearReconnectTimer()
    if (ws) {
      try {
        ws.close(1000, "client disconnect")
      } catch (_e) {}
    }
  }

  function wsSend(obj) {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      log("Cannot send, WS not open")
      return
    }

    // Small helpers
    function idToLoHi(id) {
      return [id & 0xff, (id >> 8) & 0xff]
    }
    try {
      const payload = JSON.stringify(obj)
      ws.send(payload)
      log("OUT =>", obj)
    } catch (e) {
      log("Send error", e.message || e)
    }
  }

  // --- Subscription helpers ---
  async function sendSubscribeAllSignals() {
    // Build data as [lo,hi] pairs for every signalId from signal-info.json
    if (!signalIds || signalIds.length === 0) {
      await loadSignalInfo()
    }
    if (!signalIds || signalIds.length === 0) {
      log("No signals available to subscribe")
      return
    }
    const data = []
    for (const id of signalIds) {
      const lo = id & 0xff
      const hi = (id >> 8) & 0xff
      data.push(lo, hi)
    }
    const msg = { messagetype: 96, messagecmd: 0, size: data.length, data }
    log(
      `Subscribing to ${signalIds.length} signals (payload size=${data.length} bytes)`
    )
    wsSend(msg)
  }

  function sendSubAll() {
    // Subscribe to all signal IDs listed in signal-info.json for MFD STATUS (16)
    sendSubscribeAllSignals()
  }

  // Reusable momentary control component
  function createMomentaryControl(buttonEl, badgeEl, signalId) {
    if (!buttonEl) return
    const pressOnly = buttonEl.hasAttribute("data-press-only")
    const state = {
      button: buttonEl,
      badge: badgeEl || null,
      isDown: false,
      signalId,
      pressOnly,
    }
    controlsBySignal.set(signalId, state)

    function press() {
      if (state.isDown) return
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        log("Cannot send - not connected")
        return
      }
      state.isDown = true
      // Immediate local hint; for press-only, this is the only visual state
      state.button.classList.add("pressing")
      if (state.pressOnly && state.badge) {
        state.badge.textContent = "pressed"
        state.badge.classList.add("on")
        state.badge.classList.remove("off")
      }
      const lo = signalId & 0xff
      const hi = (signalId >> 8) & 0xff
      const pressMessage = {
        messagetype: 17,
        messagecmd: 1,
        size: 3,
        data: [lo, hi, 1],
      }
      log(`Sending press Signal ${signalId}:`, JSON.stringify(pressMessage))
      ws.send(JSON.stringify(pressMessage))
    }

    function release() {
      if (!state.isDown) return
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        state.isDown = false
        return
      }
      state.isDown = false
      state.button.classList.remove("pressing")
      if (state.pressOnly && state.badge) {
        state.badge.textContent = "released"
        state.badge.classList.remove("on")
        state.badge.classList.add("off")
      }
      const lo = signalId & 0xff
      const hi = (signalId >> 8) & 0xff
      const releaseMessage = {
        messagetype: 17,
        messagecmd: 1,
        size: 3,
        data: [lo, hi, 0],
      }
      log(`Sending release Signal ${signalId}:`, JSON.stringify(releaseMessage))
      ws.send(JSON.stringify(releaseMessage))
    }

    buttonEl.addEventListener(
      "pointerdown",
      (e) => {
        e.preventDefault()
        try {
          buttonEl.setPointerCapture(e.pointerId)
        } catch (_e) {}
        press()
      },
      { passive: false }
    )
    buttonEl.addEventListener(
      "pointerup",
      (e) => {
        e.preventDefault()
        release()
      },
      { passive: false }
    )
    buttonEl.addEventListener("pointercancel", () => release())
    buttonEl.addEventListener("pointerleave", () => release())
    // As a safety net when capture is lost without a proper pointerup
    buttonEl.addEventListener("lostpointercapture", () => release())

    return { press, release }
  }

  // --- Dimmer control wiring ---
  const dimmerControls = new Map() // key: `${signalId}:${idx}` -> { input, valueEl, dragging, lastSent, lastSentTs }
  function createDimmerControl(inputEl, valueEl, signalId, dimmerIndex = 0) {
    if (!inputEl) return
    const key = `${signalId}:${dimmerIndex}`
    const state = {
      input: inputEl,
      valueEl: valueEl || null,
      dragging: false,
      lastSent: null,
      lastSentTs: 0,
    }
    dimmerControls.set(key, state)

    const updateBadge = () => {
      const pct = Number(inputEl.value) || 0
      if (valueEl) valueEl.textContent = `${pct}%`
    }

    const send = () => {
      if (!ws || ws.readyState !== WebSocket.OPEN) return
      const pct = Number(inputEl.value) || 0
      const t = Math.round(Math.max(0, Math.min(100, pct)) * 10)
      if (state.lastSent === t) return // dedupe
      state.lastSent = t
      const msg = buildDimmerCommand(signalId, pct, dimmerIndex)
      wsSend(msg)
    }

    // Throttle sending to avoid spamming during drag; 50ms cadence
    let rafId = null
    let pending = false
    let lastSentAt = 0
    const scheduleSend = () => {
      if (rafId) {
        pending = true
        return
      }
      rafId = requestAnimationFrame(() => {
        const now = performance.now ? performance.now() : Date.now()
        // 20Hz max (~50ms)
        if (now - lastSentAt >= 50) {
          send()
          lastSentAt = now
        }
        rafId = null
        if (pending) {
          pending = false
          scheduleSend()
        }
      })
    }

    inputEl.addEventListener("input", () => {
      updateBadge()
      scheduleSend()
    })
    inputEl.addEventListener("change", () => {
      updateBadge()
      send()
    })
    inputEl.addEventListener("pointerdown", () => {
      state.dragging = true
    })
    inputEl.addEventListener("pointerup", () => {
      state.dragging = false
    })
    updateBadge()

    if (ws && ws.readyState === WebSocket.OPEN) {
      inputEl.disabled = false
    }
  }

  // (MFD control removed)

  function sendReqWduInfo() {
    const reqWduInfo = {
      messagetype: PROTOCOL.systemReq,
      messagecmd: 1,
      size: 3,
      data: [0, 0, 0],
    }
    wsSend(reqWduInfo)
  }

  const clearLogBtn = $("#clear-log")
  if (clearLogBtn) {
    clearLogBtn.addEventListener("click", () => {
      if (logEl) logEl.textContent = ""
    })
  }
  if (connectBtn) connectBtn.addEventListener("click", connect)
  if (disconnectBtn) disconnectBtn.addEventListener("click", disconnect)
  if (btnReqWduInfo) btnReqWduInfo.addEventListener("click", sendReqWduInfo)
  if (btnSubAll) btnSubAll.addEventListener("click", sendSubAll)
  function initializeDeclarativeControls(root = document) {
    const scope =
      root && typeof root.querySelectorAll === "function" ? root : document

    scope.querySelectorAll("button[data-signal-id]").forEach((btn) => {
      if (btn.dataset.wiredMomentary === "true") return
      const idAttr = btn.getAttribute("data-signal-id")
      const sigId = Number(idAttr)
      if (!Number.isFinite(sigId)) return
      const badge =
        btn.nextElementSibling &&
        btn.nextElementSibling.classList.contains("badge")
          ? btn.nextElementSibling
          : null
      createMomentaryControl(btn, badge, sigId)
      btn.dataset.wiredMomentary = "true"
    })

    scope
      .querySelectorAll(
        'input[type="range"][data-signal-id][data-dimmer-index]'
      )
      .forEach((input) => {
        if (input.dataset.wiredDimmer === "true") return
        const sig = Number(input.getAttribute("data-signal-id"))
        const idx = Number(input.getAttribute("data-dimmer-index")) || 0
        const valueElId = input.id ? `${input.id}-value` : null
        const valueEl = valueElId ? document.getElementById(valueElId) : null
        if (!Number.isFinite(sig)) return
        createDimmerControl(input, valueEl, sig, idx)
        input.dataset.wiredDimmer = "true"
      })

    scope.querySelectorAll(".signal-value[data-signal-id]").forEach((box) => {
      if (box.dataset.wiredValue === "true") return
      const sig = Number(box.getAttribute("data-signal-id"))
      if (!Number.isFinite(sig)) return
      const unit = box.getAttribute("data-unit") || ""
      const valueKind = box.getAttribute("data-value-kind") || ""
      const tempUnitAttr = box.getAttribute("data-temp-unit") || "C"
      const scaleAttr = box.getAttribute("data-scale")
      const scaleInput = box.querySelector(".scale-input")
      const unitSelect = box.querySelector(".unit-select")
      const valueEl = box.querySelector(".value")
      const unitEl = box.querySelector(".unit")
      if (unitEl)
        unitEl.textContent =
          unit || (valueKind === "temperature" ? "°" + tempUnitAttr : "")
      const entry = {
        el: box,
        valueEl,
        unitEl,
        scaleInput,
        unitSelect,
        scale: Number(scaleAttr) || 1,
        valueKind,
        tempUnit: tempUnitAttr === "F" ? "F" : "C",
      }
      if (scaleInput) {
        scaleInput.value = String(entry.scale)
        scaleInput.addEventListener("change", () => {
          const v = Number(scaleInput.value)
          entry.scale = Number.isFinite(v) ? v : 1
        })
      }
      if (unitSelect && entry.valueKind === "temperature") {
        unitSelect.value = entry.tempUnit
        unitSelect.addEventListener("change", () => {
          entry.tempUnit = unitSelect.value === "F" ? "F" : "C"
          if (entry.unitEl) entry.unitEl.textContent = "°" + entry.tempUnit
        })
      }
      signalValueViews.set(sig, entry)
      box.dataset.wiredValue = "true"
    })
  }

  window.initializeDeclarativeControls = initializeDeclarativeControls
  initializeDeclarativeControls(document)

  // Auto-connect on load
  if (urlEl) urlEl.textContent = pageWsUrl()
  setStatus("disconnected")
  loadSignalInfo()
  connect()
})()
