param(
  [ValidateSet('main','dev')]
  [string]$Branch,
  [string]$DeployRoot = 'C:\Users\deej\deploy'
)

$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$ecosystem = Join-Path $PSScriptRoot 'pm2\ecosystem.config.cjs'
$targetPath = if ($Branch -eq 'main') { Join-Path $DeployRoot 'deejpotter-main' } else { Join-Path $DeployRoot 'deejpotter-dev' }
$appName = if ($Branch -eq 'main') { 'deejpotter-prod' } else { 'deejpotter-staging' }

& (Join-Path $PSScriptRoot 'setup-deploy-clones.ps1') -DeployRoot $DeployRoot

Push-Location $targetPath
try {
  git fetch --all --prune
  git checkout $Branch
  git reset --hard ("origin/" + $Branch)

  yarn install --frozen-lockfile
  yarn build
  pm2 startOrReload $ecosystem --only $appName
  pm2 save
}
finally {
  Pop-Location
}

Write-Host "Deployment complete for $Branch ($appName)." -ForegroundColor Green
