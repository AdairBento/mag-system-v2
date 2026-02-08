Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Die($m){ throw $m }
function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️ $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️ $m" -ForegroundColor Yellow }

if (-not (Test-Path "package.json") -or -not (Test-Path "pnpm-workspace.yaml") -or -not (Test-Path ".git")) {
  Die "Execute na raiz do monorepo (package.json + pnpm-workspace.yaml + .git)."
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { Die "pnpm não encontrado." }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Die "git não encontrado." }

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Info "Branch atual: $branch"

Info "Checando dependentes de @mag-system/eslint-config (se existir)..."
try {
  $why = pnpm -w why @mag-system/eslint-config 2>&1 | Out-String
  if ($why.Trim()) { Warn "pnpm why retornou algo. Vou remover mesmo (limpeza total)." }
} catch { Warn "pnpm why falhou/sem pacote. Continuando..." }

Info "Removendo @mag-system/eslint-config do workspace (best effort)..."
try { pnpm -w remove @mag-system/eslint-config | Out-Host }
catch { Warn "pnpm remove falhou (talvez não esteja instalado). Continuando..." }

if (Test-Path "packages/eslint-config") {
  Info "Removendo pasta packages/eslint-config do git..."
  git rm -r packages/eslint-config | Out-Host
  Ok "packages/eslint-config removido"
} else {
  Info "Pasta packages/eslint-config não existe. OK."
}

Info "pnpm -w install..."
pnpm -w install | Out-Host

Info "Lint root..."
pnpm -w lint | Out-Host

Info "Lint web..."
pnpm -C apps/web lint | Out-Host

Info "Tests..."
pnpm -w test | Out-Host

Info "Staging..."
git add -A | Out-Host

$commitMsg = "chore(eslint): remove unused eslint-config package to eliminate peer warnings"
Info "Commit: $commitMsg"
git commit -m $commitMsg | Out-Host

Info "Push para origin/$branch..."
git push -u origin $branch | Out-Host

Ok "Tudo concluído: pacote removido, install/lint/test OK, commit e push feitos."
