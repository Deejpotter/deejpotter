param(
  [string]$DeployRoot = 'C:\Users\deej\deploy'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$prodPath = Join-Path $DeployRoot 'deejpotter-main'
$devPath = Join-Path $DeployRoot 'deejpotter-dev'

New-Item -ItemType Directory -Force -Path $DeployRoot | Out-Null

Push-Location $repoRoot
try {
  git fetch --all --prune

  if (-not (Test-Path $prodPath)) {
    git clone $repoRoot $prodPath
  }
  git -C $prodPath fetch --all --prune
  git -C $prodPath checkout main
  git -C $prodPath reset --hard origin/main

  if (-not (Test-Path $devPath)) {
    git clone $repoRoot $devPath
  }
  git -C $devPath fetch --all --prune
  git -C $devPath checkout dev
  git -C $devPath reset --hard origin/dev
}
finally {
  Pop-Location
}

Write-Host "Deploy clones ready:" -ForegroundColor Green
Write-Host "  prod    $prodPath"
Write-Host "  staging $devPath"
