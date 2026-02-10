#!/usr/bin/env pwsh
# =========================================
# MAG System - Dev Doctor 🩺
# =========================================
# Diagnóstico automático antes de rodar pnpm dev
# Detecta: porta ocupada, $connect() duplicado, .env, etc.
#
# Uso: .\scripts\dev-doctor.ps1
# =========================================

param(
    [switch]$AutoFix = $false,  # Corrige automaticamente (kill processos)
    [switch]$Silent = $false    # Apenas retorna exit code
)

$ErrorActionPreference = "Stop"
$ProgressPreference = 'SilentlyContinue'

# Cores para output
function Write-Success { Write-Host "✅ $args" -ForegroundColor Green }
function Write-Warning-Custom { Write-Host "⚠️  $args" -ForegroundColor Yellow }
function Write-Error-Custom { Write-Host "❌ $args" -ForegroundColor Red }
function Write-Info { Write-Host "ℹ️  $args" -ForegroundColor Cyan }

# Banner
if (-not $Silent) {
    Write-Host ""
    Write-Host "╔═══════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║   MAG System - Dev Doctor 🩺         ║" -ForegroundColor Cyan
    Write-Host "╚═══════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

$issues = @()
$warnings = @()

# =========================================
# CHECK 1: Porta 3001 ocupada?
# =========================================
Write-Info "Verificando porta 3001..."

$port3001 = netstat -ano | Select-String ":3001" | Where-Object { $_ -match "LISTENING" }

if ($port3001) {
    $pidMatch = $port3001 -match "\s+(\d+)\s*$"
    $pid = $matches[1]
    
    $process = Get-Process -Id $pid -ErrorAction SilentlyContinue
    
    if ($process) {
        $processName = $process.ProcessName
        $processPath = $process.Path
        
        Write-Error-Custom "Porta 3001 ocupada!"
        Write-Host "  PID: $pid"
        Write-Host "  Processo: $processName"
        Write-Host "  Path: $processPath"
        
        # Se for node.exe do projeto atual
        if ($processPath -and $processPath -match "mag-system") {
            Write-Warning-Custom "Detectado Node.js do projeto MAG System"
            
            if ($AutoFix) {
                Write-Info "Matando processo $pid..."
                Stop-Process -Id $pid -Force
                Start-Sleep -Seconds 1
                Write-Success "Processo eliminado!"
            } else {
                Write-Host ""
                Write-Host "💡 Para corrigir automaticamente, execute:"
                Write-Host "   .\scripts\dev-doctor.ps1 -AutoFix" -ForegroundColor Yellow
                Write-Host ""
                Write-Host "💡 Ou manualmente:"
                Write-Host "   taskkill /F /PID $pid" -ForegroundColor Yellow
            }
        } else {
            Write-Warning-Custom "Processo externo usando porta 3001"
            Write-Host "  Execute manualmente: taskkill /F /PID $pid"
        }
        
        $issues += "Porta 3001 ocupada (PID $pid)"
    }
} else {
    Write-Success "Porta 3001 livre"
}

# =========================================
# CHECK 2: Porta 3000 ocupada?
# =========================================
Write-Info "Verificando porta 3000 (frontend)..."

$port3000 = netstat -ano | Select-String ":3000" | Where-Object { $_ -match "LISTENING" }

if ($port3000) {
    Write-Warning-Custom "Porta 3000 já está em uso (Next.js provavelmente rodando)"
    $warnings += "Porta 3000 ocupada"
} else {
    Write-Success "Porta 3000 livre"
}

# =========================================
# CHECK 3: Arquivo .env existe?
# =========================================
Write-Info "Verificando arquivo .env..."

if (Test-Path ".env") {
    Write-Success "Arquivo .env encontrado"
    
    # Verificar se DATABASE_URL está definida
    $envContent = Get-Content ".env" -Raw
    
    if ($envContent -match "DATABASE_URL\s*=") {
        Write-Success "DATABASE_URL configurada"
    } else {
        Write-Error-Custom "DATABASE_URL não encontrada no .env"
        $issues += "DATABASE_URL ausente"
    }
    
    # Verificar PORT
    if ($envContent -match "PORT\s*=\s*(\d+)") {
        $configuredPort = $matches[1]
        if ($configuredPort -ne "3001") {
            Write-Warning-Custom "PORT configurada como $configuredPort (padrão é 3001)"
            $warnings += "Porta customizada: $configuredPort"
        }
    } else {
        Write-Info "PORT não configurada (usará padrão 3001)"
    }
    
} else {
    Write-Error-Custom "Arquivo .env não encontrado!"
    Write-Info "Copie .env.example para .env: cp .env.example .env"
    $issues += ".env ausente"
}

# =========================================
# CHECK 4: $connect() duplicado?
# =========================================
Write-Info "Verificando chamadas $connect() duplicadas..."

$connectCalls = Get-ChildItem -Recurse -Filter *.ts -Path "apps\api\src" -ErrorAction SilentlyContinue |
    Select-String "\$connect\(" |
    Where-Object { $_.Line -notmatch "//" } # Ignora comentários

$connectCount = ($connectCalls | Measure-Object).Count

if ($connectCount -eq 0) {
    Write-Warning-Custom "Nenhuma chamada $connect() encontrada (verificar se PrismaService existe)"
    $warnings += "$connect() não encontrado"
} elseif ($connectCount -eq 1) {
    Write-Success "Apenas 1 chamada $connect() (correto)"
} else {
    Write-Error-Custom "$connectCount chamadas $connect() encontradas!"
    Write-Host ""
    Write-Host "Localizações:"
    $connectCalls | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
    }
    $issues += "$connectCount chamadas $connect() (deveria ser 1)"
}

# =========================================
# CHECK 5: node_modules instalados?
# =========================================
Write-Info "Verificando node_modules..."

if (Test-Path "node_modules") {
    Write-Success "node_modules encontrado"
} else {
    Write-Error-Custom "node_modules não encontrado!"
    Write-Info "Execute: pnpm install"
    $issues += "node_modules ausente"
}

# =========================================
# CHECK 6: Prisma Client gerado?
# =========================================
Write-Info "Verificando Prisma Client..."

$prismaClient = "packages\database\node_modules\.prisma\client\index.js"
if (Test-Path $prismaClient) {
    Write-Success "Prisma Client gerado"
} else {
    Write-Error-Custom "Prisma Client não gerado!"
    Write-Info "Execute: cd packages\database && npx prisma generate"
    $issues += "Prisma Client não gerado"
}

# =========================================
# RELATÓRIO FINAL
# =========================================
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host "         RELATÓRIO FINAL 📊          " -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

if ($issues.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Success "TUDO OK! Sistema pronto para rodar 🚀"
    Write-Host ""
    Write-Host "Execute agora: pnpm dev" -ForegroundColor Green
    exit 0
} else {
    if ($issues.Count -gt 0) {
        Write-Host "❌ PROBLEMAS CRÍTICOS ($($issues.Count)):" -ForegroundColor Red
        $issues | ForEach-Object { Write-Host "   - $_" -ForegroundColor Red }
        Write-Host ""
    }
    
    if ($warnings.Count -gt 0) {
        Write-Host "⚠️  AVISOS ($($warnings.Count)):" -ForegroundColor Yellow
        $warnings | ForEach-Object { Write-Host "   - $_" -ForegroundColor Yellow }
        Write-Host ""
    }
    
    Write-Host "💡 Corrija os problemas acima antes de rodar pnpm dev" -ForegroundColor Cyan
    
    # Salvar relatório em arquivo
    $reportPath = "docs/DEV_DOCTOR_REPORT_$(Get-Date -Format 'yyyyMMdd_HHmmss').md"
    
    $reportContent = @"
# Dev Doctor Report

**Data:** $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')

## Problemas Críticos

$($issues | ForEach-Object { "- $_" } | Out-String)

## Avisos

$($warnings | ForEach-Object { "- $_" } | Out-String)

## Recomendações

1. Corrija os problemas críticos listados acima
2. Execute novamente: `.\scripts\dev-doctor.ps1`
3. Se tudo OK, rode: `pnpm dev`

---
Relatório gerado automaticamente por dev-doctor.ps1
"@
    
    New-Item -Path $reportPath -ItemType File -Value $reportContent -Force | Out-Null
    Write-Info "Relatório salvo em: $reportPath"
    
    exit 1
}
