import http from 'node:http'
import { readFile } from 'node:fs/promises'
import { createReadStream, statSync } from 'node:fs'
import { join, normalize } from 'node:path'

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000
const ROOT = join(process.cwd(), 'dist')

const server = http.createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent(req.url || '/')
    if (urlPath === '/' || urlPath === '') urlPath = '/index.html'

    // Prevent path traversal
    const filePath = normalize(join(ROOT, urlPath))
    if (!filePath.startsWith(ROOT)) {
      res.statusCode = 403
      return void res.end('Forbidden')
    }

    const stat = statSync(filePath, { throwIfNoEntry: false })
    if (!stat || !stat.isFile()) {
      // Fallback to SPA index
      const html = await readFile(join(ROOT, 'index.html'))
      res.setHeader('Content-Type', 'text/html; charset=utf-8')
      return void res.end(html)
    }

    const stream = createReadStream(filePath)
    stream.on('error', () => {
      res.statusCode = 500
      res.end('Internal Server Error')
    })
    stream.pipe(res)
  } catch (e) {
    res.statusCode = 500
    res.end('Internal Server Error')
  }
})

server.listen(PORT, () => {
  console.log(`[server] listening on :${PORT}`)
})
