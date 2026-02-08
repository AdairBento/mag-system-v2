Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️ $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️ $m" -ForegroundColor Yellow }
function Die($m){ throw $m }

function Run($title, [scriptblock]$cmd){
  Info $title
  & $cmd
  if ($LASTEXITCODE -and $LASTEXITCODE -ne 0) { Die "$title falhou (exit $LASTEXITCODE)" }
  Ok "$title (ok)"
}

# ---------------------------
# Guard rails
# ---------------------------
if (-not (Test-Path "package.json") -or -not (Test-Path "pnpm-workspace.yaml") -or -not (Test-Path ".git")) {
  Die "Execute na raiz do monorepo (package.json + pnpm-workspace.yaml + .git)."
}
foreach($c in @("pnpm","git","node")){
  if (-not (Get-Command $c -ErrorAction SilentlyContinue)) { Die "$c não encontrado no PATH." }
}

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Info "Branch atual: $branch"

if ($branch -in @("main","master")) {
  Warn "Você está na branch '$branch'. Recomendo rodar em uma branch de trabalho."
}

# ---------------------------
# 1) Fix turbo outputs warning
# ---------------------------
if (Test-Path ".\turbo.json") {
  Info "Ajustando turbo.json (test.outputs = [])..."

  $turbo = Get-Content ".\turbo.json" -Raw | ConvertFrom-Json

  if ($turbo.PSObject.Properties.Name -contains "pipeline") {
    if (-not ($turbo.pipeline.PSObject.Properties.Name -contains "test")) {
      $turbo.pipeline | Add-Member -NotePropertyName "test" -NotePropertyValue (@{}) -Force
    }
    if (-not ($turbo.pipeline.test.PSObject.Properties.Name -contains "outputs")) {
      $turbo.pipeline.test | Add-Member -NotePropertyName "outputs" -NotePropertyValue @() -Force
    } else {
      $turbo.pipeline.test.outputs = @()
    }
  }
  elseif ($turbo.PSObject.Properties.Name -contains "tasks") {
    if (-not ($turbo.tasks.PSObject.Properties.Name -contains "test")) {
      $turbo.tasks | Add-Member -NotePropertyName "test" -NotePropertyValue (@{}) -Force
    }
    if (-not ($turbo.tasks.test.PSObject.Properties.Name -contains "outputs")) {
      $turbo.tasks.test | Add-Member -NotePropertyName "outputs" -NotePropertyValue @() -Force
    } else {
      $turbo.tasks.test.outputs = @()
    }
  }

  $turbo | ConvertTo-Json -Depth 50 | Set-Content ".\turbo.json" -Encoding UTF8
  Ok "turbo.json ajustado"
} else {
  Warn "turbo.json não encontrado (ok)."
}

# ---------------------------
# 2) Ensure root package.json scripts (via JSON manipulation)
# ---------------------------
Info "Garantindo scripts verify/doctor no package.json..."

$pkgPath = ".\package.json"
$pkgRaw = Get-Content $pkgPath -Raw
$pkg = $pkgRaw | ConvertFrom-Json

# Criar scripts se não existir
if (-not $pkg.scripts) {
  $pkg | Add-Member -NotePropertyName "scripts" -NotePropertyValue ([PSCustomObject]@{}) -Force
}

# Adicionar verify e doctor (usa Add-Member para garantir)
if (-not ($pkg.scripts.PSObject.Properties.Name -contains "verify")) {
  $pkg.scripts | Add-Member -NotePropertyName "verify" -NotePropertyValue "pnpm -w install && pnpm -w lint && pnpm -C apps/web lint && pnpm -w test" -Force
}
if (-not ($pkg.scripts.PSObject.Properties.Name -contains "doctor")) {
  $pkg.scripts | Add-Member -NotePropertyName "doctor" -NotePropertyValue "pwsh -NoProfile -File scripts/doctor.ps1" -Force
}

$pkg | ConvertTo-Json -Depth 50 | Set-Content $pkgPath -Encoding UTF8
Ok "scripts verify/doctor garantidos"

# ---------------------------
# 3) Install
# ---------------------------
Run "pnpm -w install" { pnpm -w install | Out-Host }

# ---------------------------
# 4) Lint
# ---------------------------
Run "pnpm -w lint" { pnpm -w lint | Out-Host }
Run "pnpm -C apps/web lint" { pnpm -C apps/web lint | Out-Host }

# ---------------------------
# 5) Test
# ---------------------------
Run "pnpm -w test" { pnpm -w test | Out-Host }

# ---------------------------
# 6) Commit + push (if changes)
# ---------------------------
$changes = (git status --porcelain) | Out-String
if ([string]::IsNullOrWhiteSpace($changes)) {
  Ok "Repo limpo (sem mudanças)."
  exit 0
}

Info "Mudanças detectadas:"
git status --porcelain

Info "Staging..."
git add -A | Out-Host

$commitMsg = "chore(repo): doctor (auto fixes + verify)"
Info "Commit: $commitMsg"
git commit -m $commitMsg | Out-Host

Info "Push para origin/$branch..."
git push -u origin $branch | Out-Host

Ok "DOCTOR finalizado: correções aplicadas, verify ok, commit + push feitos."
