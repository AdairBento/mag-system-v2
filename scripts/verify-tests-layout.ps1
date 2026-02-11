Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$root = "apps/api/src/modules"
if (!(Test-Path $root)) {
  Write-Host "⚠️  Pasta não encontrada: $root (pulando verificação)" -ForegroundColor Yellow
  exit 0
}

# Força array sempre (0, 1 ou N resultados)
$bad = @(
  Get-ChildItem -Recurse -Path $root -Filter "*.spec.ts" -File -ErrorAction SilentlyContinue |
    Where-Object { $_.FullName -notmatch "\\__tests__\\" }
)

if ($bad.Length -gt 0) {
  Write-Host "❌ Encontrados specs fora de __tests__ (proibido):" -ForegroundColor Red
  foreach ($f in $bad) { Write-Host " - $($f.FullName)" -ForegroundColor Yellow }
  exit 1
}

Write-Host "✅ OK: nenhum spec fora de __tests__" -ForegroundColor Green
