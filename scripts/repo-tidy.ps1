Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️ $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️ $m" -ForegroundColor Yellow }
function Die($m){ throw $m }

# ---------------------------
# Guard rails
# ---------------------------
if (-not (Test-Path "package.json") -or -not (Test-Path "pnpm-workspace.yaml") -or -not (Test-Path ".git")) {
  Die "Execute na raiz do monorepo (package.json + pnpm-workspace.yaml + .git)."
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) { Die "pnpm não encontrado no PATH." }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Die "git não encontrado no PATH." }

$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Info "Branch atual: $branch"

# ---------------------------
# 1) Turbo warning: outputs=[]
# ---------------------------
if (Test-Path ".\turbo.json") {
  Info "Ajustando turbo.json (test.outputs = [])..."

  $turboRaw = Get-Content ".\turbo.json" -Raw
  $turbo = $turboRaw | ConvertFrom-Json

  if ($turbo.PSObject.Properties.Name -contains "pipeline") {
    if (-not ($turbo.pipeline.PSObject.Properties.Name -contains "test")) {
      $turbo.pipeline | Add-Member -NotePropertyName "test" -NotePropertyValue (@{}) -Force
    }
    if (-not ($turbo.pipeline.test.PSObject.Properties.Name -contains "outputs")) {
      $turbo.pipeline.test | Add-Member -NotePropertyName "outputs" -NotePropertyValue (@()) -Force
    } else {
      $turbo.pipeline.test.outputs = @()
    }
  }
  elseif ($turbo.PSObject.Properties.Name -contains "tasks") {
    if (-not ($turbo.tasks.PSObject.Properties.Name -contains "test")) {
      $turbo.tasks | Add-Member -NotePropertyName "test" -NotePropertyValue (@{}) -Force
    }
    if (-not ($turbo.tasks.test.PSObject.Properties.Name -contains "outputs")) {
      $turbo.tasks.test | Add-Member -NotePropertyName "outputs" -NotePropertyValue (@()) -Force
    } else {
      $turbo.tasks.test.outputs = @()
    }
  }
  else {
    Warn "turbo.json sem 'pipeline' nem 'tasks'. Criando pipeline.test.outputs=[]"
    $turbo | Add-Member -NotePropertyName "pipeline" -NotePropertyValue (@{}) -Force
    $turbo.pipeline | Add-Member -NotePropertyName "test" -NotePropertyValue (@{ outputs = @() }) -Force
  }

  $turbo | ConvertTo-Json -Depth 50 | Set-Content ".\turbo.json" -Encoding UTF8
  Ok "turbo.json ajustado"
} else {
  Warn "turbo.json não encontrado (ok)."
}

# ---------------------------
# 2) Verify (install/lint/test)
# ---------------------------
Info "pnpm -w install..."
pnpm -w install | Out-Host

Info "pnpm -w lint..."
pnpm -w lint | Out-Host

Info "pnpm -C apps/web lint..."
pnpm -C apps/web lint | Out-Host

Info "pnpm -w test..."
pnpm -w test | Out-Host

# ---------------------------
# 3) Commit + Push (only if changes)
# ---------------------------
$changes = (git status --porcelain) | Out-String
if ([string]::IsNullOrWhiteSpace($changes)) {
  Ok "Sem mudanças para commitar. Repo limpo."
  exit 0
}

Info "Staging..."
git add -A | Out-Host

$commitMsg = "chore(repo): repo tidy (turbo outputs + verify)"
Info "Commit: $commitMsg"
git commit -m $commitMsg | Out-Host

Info "Push para origin/$branch..."
git push -u origin $branch | Out-Host

Ok "Concluído: verify OK, commit + push feitos."
