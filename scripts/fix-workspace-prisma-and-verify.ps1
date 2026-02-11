param(
  [switch]$NoPrompt
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️  $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️  $m" -ForegroundColor Yellow }
function Die($m){ throw $m }

function Run([string]$Title, [scriptblock]$Cmd) {
  Info $Title
  & $Cmd
  $code = $LASTEXITCODE
  if ($code -ne 0) { throw "Falhou ($code): $Title" }
}

if (!(Test-Path ".git")) { Die "Rode na raiz do repo (onde existe .git)." }

New-Item -ItemType Directory -Force logs | Out-Null
$log = "logs\fix-workspace-prisma-verify-" + (Get-Date -Format "yyyyMMdd-HHmmss") + ".log"
Info "🧾 Log: $log"

git config core.longpaths true | Out-Null

if (!$NoPrompt) {
  $ans = Read-Host "Vai rodar install + prisma generate + build + type-check + verify. Continuar? (S/N)"
  if ($ans -notin @("S","s","Y","y")) { Die "Abortado pelo usuário." }
}

if (Test-Path ".\auto-clean-verify.ps1") {
  Info "🧹 Removendo lixo auto-clean-verify.ps1 (raiz)..."
  Remove-Item ".\auto-clean-verify.ps1" -Force
}

Run "📦 pnpm install (workspace)..." { pnpm -w install | Out-Host }

if (Test-Path ".\packages\database") {
  Run "🧬 Prisma generate em packages/database..." { pnpm -C packages/database exec prisma generate | Out-Host }
} else {
  Warn "packages/database não encontrado."
}

Run "🏗️ Build (@mag-system/shared-types, @mag-system/database, @mag-system/core)..." {
  pnpm -w build --filter @mag-system/shared-types --filter @mag-system/database --filter @mag-system/core | Out-Host
}

Run "🧪 Type-check API..." { pnpm -C apps/api type-check | Out-Host }

Run "✅ Verify completo..." { pnpm -w verify | Out-Host }

Ok "Workspace + prisma + builds + verify: OK"

Info "📊 Git status:"
git status --short | Select-Object -First 120 | ForEach-Object { Write-Host "   $_" -ForegroundColor White }

Ok "🏁 Finalizado."
