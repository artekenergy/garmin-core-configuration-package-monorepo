Param(
  [switch]$SkipFly
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Step($msg) {
  Write-Host "`n[$(Get-Date -Format HH:mm:ss)] $msg`n"
}

Push-Location $PSScriptRoot/..
try {
  Step 'Syncing configuration (schema + hardware)'
  pnpm run prebuild

  Step 'Building shared schema package'
  pnpm --filter @gcg/schema build

  Step 'Building and deploying HMI UI bundle (Windows)'
  if (Test-Path './packages/hmi-ui/scripts/deploy-to-web.ps1') {
    pnpm --filter @gcg/hmi-ui run deploy:web:win
  } else {
    pnpm --filter @gcg/hmi-ui build
  }

  Step 'Building web configurator (includes deployment package refresh)'
  pnpm --filter @gcg/web-configurator build

  Step "Validating exported schemas for static 'value' bindings"
  if (Test-Path './scripts/check-no-static-bindings.js') {
    node scripts/check-no-static-bindings.js
  }

  if (-not $SkipFly) {
    if (Get-Command flyctl -ErrorAction SilentlyContinue) {
      Step 'Deploying latest web configurator build to Fly.io'
      pnpm run deploy
    } else {
      Write-Warning 'flyctl not found; skipping Fly.io deployment. Run pnpm run deploy when ready.'
    }
  } else {
    Write-Host 'Skipping Fly.io deployment step as requested.'
  }

  Write-Host "`nDeployment workflow complete." -ForegroundColor Green
  Write-Host " - HMI bundle may be staged in garmin-bundle/web (if deploy-to-web.ps1 present)"
  Write-Host " - Export package refreshed under packages/web-configurator/public/deployment-package"
  Write-Host " - Web configurator build output in packages/web-configurator/dist"
}
finally {
  Pop-Location
}

