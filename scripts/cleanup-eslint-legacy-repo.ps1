Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok([string]$m){ Write-Host "OK: $m" -ForegroundColor Green }
function Info([string]$m){ Write-Host "INFO: $m" -ForegroundColor Cyan }
function Warn([string]$m){ Write-Host "WARN: $m" -ForegroundColor Yellow }

$repo = (Get-Location).Path

$flat = Join-Path $repo "eslint.config.mjs"
if (!(Test-Path $flat)) { throw "eslint.config.mjs não encontrado na raiz. Abortando." }

$stamp = (Get-Date).ToString("yyyyMMdd-HHmmss")
$bakDir = Join-Path $repo "_BACKUPS_ESLINT_CLEANUP_REPO\$stamp"
New-Item -ItemType Directory -Force -Path $bakDir | Out-Null

Info "Repo: $repo"
Info "Backup: $bakDir"
Info "Flat config OK: $flat"

$legacy = Get-ChildItem -Recurse -Force -File `
  -Include ".eslintrc",".eslintrc.*",".eslintignore",".eslintcache" `
  -ErrorAction SilentlyContinue

if (!$legacy -or $legacy.Count -eq 0) {
  Ok "Nenhum arquivo legado ESLint encontrado."
  exit 0
}

Info ("Encontrados {0} arquivos legados. Fazendo backup + remoção..." -f $legacy.Count)

foreach ($f in $legacy) {
  $rel = $f.FullName.Substring($repo.Length).TrimStart('\')
  $dest = Join-Path $bakDir $rel
  $destDir = Split-Path $dest -Parent
  if (!(Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

  Copy-Item -LiteralPath $f.FullName -Destination $dest -Force
  Remove-Item -LiteralPath $f.FullName -Force
  Ok "Removido: $rel"
}

Info "Rodando lint global (pnpm -w lint) pra validar..."
pnpm -w lint
Ok "Limpeza geral concluída e lint rodou."
