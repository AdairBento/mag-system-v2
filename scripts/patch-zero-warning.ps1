# scripts/patch-zero-warning.ps1
#Requires -Version 5.1
$ErrorActionPreference="Stop"

function Backup-File([string]$p){
  if (!(Test-Path $p)) { return }
  $ts = Get-Date -Format "yyyyMMdd-HHmmss"
  Copy-Item $p "$p.bak-$ts" -Force
}

function Read-JsonFile([string]$p){
  if (!(Test-Path $p)) { throw "Arquivo não encontrado: $p" }
  try { Get-Content $p -Raw | ConvertFrom-Json }
  catch { throw "JSON inválido em: $p`n$($_.Exception.Message)" }
}

function Write-JsonFile([string]$p, $obj){
  $json = $obj | ConvertTo-Json -Depth 50
  # UTF8 sem BOM é o mais “safe” hoje
  Set-Content -Path $p -Value $json -Encoding utf8
}

function Ensure-Hashtable($maybe){
  if ($null -eq $maybe) { return @{} }
  if ($maybe -is [hashtable]) { return $maybe }
  # PSCustomObject -> Hashtable
  $h = @{}
  $maybe.PSObject.Properties | ForEach-Object { $h[$_.Name] = $_.Value }
  return $h
}

function Ensure-JsonScript([string]$jsonPath, [string]$scriptName, [string]$scriptCmd){
  $j = Read-JsonFile $jsonPath
  $scripts = Ensure-Hashtable $j.scripts

  if (-not $scripts.ContainsKey($scriptName)) {
    Backup-File $jsonPath
    $scripts[$scriptName] = $scriptCmd
    $j.scripts = $scripts
    Write-JsonFile $jsonPath $j
  }
}

function Ensure-AliasTypecheck([string]$jsonPath){
  if (!(Test-Path $jsonPath)) { return }
  $j = Read-JsonFile $jsonPath
  if ($null -eq $j.scripts) { return }

  $scripts = Ensure-Hashtable $j.scripts
  if (-not $scripts.ContainsKey("type-check")) { return }

  if (-not $scripts.ContainsKey("typecheck")) {
    Backup-File $jsonPath
    $scripts["typecheck"] = "pnpm run type-check"
    $j.scripts = $scripts
    Write-JsonFile $jsonPath $j
  }
}

function Ensure-TurboTypecheckAlias([string]$turboPath){
  $t = Read-JsonFile $turboPath

  $containerName = $null
  if ($t.PSObject.Properties.Name -contains "tasks") { $containerName = "tasks" }
  elseif ($t.PSObject.Properties.Name -contains "pipeline") { $containerName = "pipeline" }
  else { throw "turbo.json sem 'tasks' nem 'pipeline'." }

  $c = $t.$containerName

  # já existe typecheck -> nada
  if ($c.PSObject.Properties.Name -contains "typecheck") { return }

  # só cria alias se existir type-check
  if (-not ($c.PSObject.Properties.Name -contains "type-check")) { return }

  Backup-File $turboPath

  # cria alias minimalista: typecheck depende de type-check
  $alias = [pscustomobject]@{ dependsOn = @("type-check") }
  $c | Add-Member -NotePropertyName "typecheck" -NotePropertyValue $alias -Force

  $t.$containerName = $c
  Write-JsonFile $turboPath $t
}

Write-Host "`n🧩 PATCH ZERO-WARNING (sem instalar nada)" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Repo: $(Get-Location)`n" -ForegroundColor DarkGray

# 1) Root scripts: clean + db:generate
Ensure-JsonScript ".\package.json" "clean" "node scripts/clean.mjs"
Ensure-JsonScript ".\package.json" "db:generate" "pnpm -C packages/database db:generate"

# 2) packages/database: db:generate (wiring estático)
Ensure-JsonScript ".\packages\database\package.json" "db:generate" "prisma generate"

# 3) Alias typecheck nos workspaces (se tiver type-check)
$workspaces = @(
  ".\apps\api\package.json",
  ".\apps\web\package.json",
  ".\packages\core\package.json",
  ".\packages\database\package.json",
  ".\packages\shared-types\package.json",
  ".\packages\eslint-config\package.json",
  ".\packages\typescript-config\package.json"
)
$workspaces | ForEach-Object { Ensure-AliasTypecheck $_ }

# 4) Turbo alias typecheck -> type-check
Ensure-TurboTypecheckAlias ".\turbo.json"

Write-Host "`n✅ Patch aplicado: clean/db:generate/typecheck wired (0-risk)." -ForegroundColor Green
Write-Host "💡 Próximo: rode seu checkup 0-touch de novo pra confirmar warning=0." -ForegroundColor DarkGray
