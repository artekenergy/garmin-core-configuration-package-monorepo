Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

Push-Location (Join-Path $PSScriptRoot '..')
try {
  Write-Host 'Building HMI UI...'
  pnpm build

  $dist = Join-Path $PWD 'dist'
  $webDir = Join-Path $PWD '..\..\garmin-bundle\web'
  $bundleDir = Join-Path $PWD '..\..\garmin-bundle'

  if (-not (Test-Path $webDir)) { New-Item -ItemType Directory -Path $webDir | Out-Null }

  Write-Host 'Deploying to garmin-bundle/web...'

  Copy-Item -Force (Join-Path $dist 'index.html') (Join-Path $webDir 'index1.html')

  $assetsSrc = Join-Path $dist 'assets'
  $assetsDest = Join-Path $webDir 'hmi-assets'
  if (Test-Path $assetsDest) { Remove-Item -Recurse -Force $assetsDest }
  Copy-Item -Recurse -Force $assetsSrc $assetsDest

  Copy-Item -Force (Join-Path $dist 'schema.json') (Join-Path $webDir 'schema.json')
  Copy-Item -Force (Join-Path $dist 'hardware-config.json') (Join-Path $webDir 'hardware-config.json')

  $configDir = Join-Path $bundleDir 'configuration'
  if (-not (Test-Path $configDir)) { New-Item -ItemType Directory -Path $configDir | Out-Null }

  $index1 = Join-Path $webDir 'index1.html'
  $html = Get-Content -Raw $index1
  $ts = [int](((Get-Date).ToUniversalTime() - [datetime]'1970-01-01').TotalSeconds)
  $replacement = '/hmi-assets/$1?v=' + $ts + '"'
  $html = [regex]::Replace($html, '/assets/([^"]*)"', $replacement)
  Set-Content -NoNewline -Path $index1 -Value $html

  $timestamp = Get-Date -Format yyyyMMdd_HHmmss
  $zipName = 'garmin-hmi-deployment-' + $timestamp + '.zip'
  $zipPath = Join-Path $bundleDir $zipName
  if (Test-Path $zipPath) { Remove-Item -Force $zipPath }

  $stage = Join-Path $bundleDir ('__stage_' + $timestamp)
  New-Item -ItemType Directory -Path $stage | Out-Null
  Copy-Item -Recurse -Force (Join-Path $bundleDir 'web') (Join-Path $stage 'web')
  if (Test-Path (Join-Path $bundleDir 'services')) { Copy-Item -Recurse -Force (Join-Path $bundleDir 'services') (Join-Path $stage 'services') }
  if (Test-Path (Join-Path $bundleDir 'configuration')) { Copy-Item -Recurse -Force (Join-Path $bundleDir 'configuration') (Join-Path $stage 'configuration') }

  Compress-Archive -Path (Join-Path $stage '*') -DestinationPath $zipPath -Force
  Remove-Item -Recurse -Force $stage

  $zipInfo = Get-Item $zipPath
  $zipSizeMB = [Math]::Round(($zipInfo.Length / 1MB), 2)
  Write-Host ('Deployment package created: {0} ({1} MB)' -f $zipInfo.FullName, $zipSizeMB)

  Write-Host 'Deployment complete.' -ForegroundColor Green
}
finally {
  Pop-Location
}

