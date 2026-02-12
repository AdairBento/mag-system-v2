$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️  $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️  $m" -ForegroundColor Yellow }
function Die($m){ Write-Host "❌ $m" -ForegroundColor Red; Read-Host "Pressione ENTER para sair"; exit 1 }

# Resolve caminhos a partir da raiz do repo
$repoRoot = Split-Path $PSScriptRoot -Parent
Set-Location $repoRoot

$schema = Join-Path $repoRoot "packages\database\prisma\schema.prisma"
if (-not (Test-Path $schema)) { Die "Schema não encontrado em: $schema" }

Info "Validando Prisma schema..."
Info "Repo: $repoRoot"
Info "Schema: $schema"

# Captura output e exitcode sem encerrar o script
function Run-Cmd([string]$title, [scriptblock]$cmd) {
  Info $title
  $out = & $cmd 2>&1 | Out-String
  $code = $LASTEXITCODE
  return @{ Code = $code; Out = $out }
}

# 1) Melhor prática: prisma do workspace filtrado
$r1 = Run-Cmd "Tentativa 1/3: pnpm --filter @mag-system/database exec prisma validate" {
  pnpm --filter @mag-system/database exec prisma validate --schema $schema
}
if ($r1.Code -eq 0) { Ok "Schema válido (via pnpm filter exec)."; exit 0 }

# Se o erro for justamente "NO_SCRIPT prisma", já troca automaticamente
if ($r1.Out -match "ERR_PNPM_RECURSIVE_RUN_NO_SCRIPT") {
  Warn "Detectado: pacote não possui script 'prisma'. Alternando para pnpm exec..."
}

# 2) Fallback: prisma da raiz do workspace
$r2 = Run-Cmd "Tentativa 2/3: pnpm exec prisma validate" {
  pnpm exec prisma validate --schema $schema
}
if ($r2.Code -eq 0) { Ok "Schema válido (via pnpm exec)."; exit 0 }

# 3) Último fallback: npx
$r3 = Run-Cmd "Tentativa 3/3: npx prisma validate" {
  npx prisma validate --schema $schema
}
if ($r3.Code -eq 0) { Ok "Schema válido (via npx)."; exit 0 }

# Se chegou aqui, falhou tudo
Write-Host "`n==================== OUTPUT (1) ====================" -ForegroundColor DarkGray
Write-Host $r1.Out
Write-Host "==================== OUTPUT (2) ====================" -ForegroundColor DarkGray
Write-Host $r2.Out
Write-Host "==================== OUTPUT (3) ====================" -ForegroundColor DarkGray
Write-Host $r3.Out
Write-Host "====================================================`n" -ForegroundColor DarkGray

Die "Falha ao validar schema em todas as tentativas."
