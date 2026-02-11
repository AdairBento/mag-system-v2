Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️  $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️  $m" -ForegroundColor Yellow }
function Die($m){ throw $m }

function To-PascalCase([string]$s) {
  $parts = $s -split '[-_ ]+' | Where-Object { $_ -ne '' }
  ($parts | ForEach-Object { $_.Substring(0,1).ToUpper() + $_.Substring(1) }) -join ''
}

function ReadText($p){
  if (!(Test-Path $p)) { return $null }
  return [IO.File]::ReadAllText($p, [Text.Encoding]::UTF8)
}
function WriteText($p,$c){
  $dir = Split-Path $p -Parent
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [IO.File]::WriteAllText($p, $c, [Text.Encoding]::UTF8)
}
function EnsureFile($p,$c){
  if (Test-Path $p) { return $false }
  WriteText $p $c
  return $true
}

$apiRoot = "apps/api"
$modulesRoot = Join-Path $apiRoot "src/modules"
$appModulePath = Join-Path $apiRoot "src/app.module.ts"

if (!(Test-Path $modulesRoot)) { Die "Não achei $modulesRoot (rode na raiz do repo)." }
if (!(Test-Path $appModulePath)) { Warn "Não achei $appModulePath. Vou criar módulos mas não vou registrar no AppModule."; }

$modules = Get-ChildItem -Path $modulesRoot -Directory | Select-Object -ExpandProperty Name

$created = @()

foreach ($m in $modules) {
  $dir = Join-Path $modulesRoot $m
  $pascal = To-PascalCase $m

  $servicePath = Join-Path $dir "$m.service.ts"
  $controllerPath = Join-Path $dir "$m.controller.ts"
  $modulePath = Join-Path $dir "$m.module.ts"

  $needService = !(Test-Path $servicePath)
  $needController = !(Test-Path $controllerPath)
  $needModule = !(Test-Path $modulePath)

  if (-not ($needService -or $needController -or $needModule)) { continue }

  Info "📦 Scaffold: $m"

  if ($needService) {
    $svc = @"
import { Injectable } from '@nestjs/common';

@Injectable()
export class ${pascal}Service {
  ping() {
    return { ok: true, module: '$m' };
  }
}
"@
    EnsureFile $servicePath $svc | Out-Null
    Ok "Criado: $servicePath"
  } else {
    Warn "Service já existe: $servicePath"
  }

  if ($needController) {
    $ctrl = @"
import { Controller, Get } from '@nestjs/common';
import { ${pascal}Service } from './$m.service';

@Controller('$m')
export class ${pascal}Controller {
  constructor(private readonly service: ${pascal}Service) {}

  @Get('health')
  health() {
    return this.service.ping();
  }
}
"@
    EnsureFile $controllerPath $ctrl | Out-Null
    Ok "Criado: $controllerPath"
  } else {
    Warn "Controller já existe: $controllerPath"
  }

  if ($needModule) {
    $mod = @"
import { Module } from '@nestjs/common';
import { ${pascal}Service } from './$m.service';
import { ${pascal}Controller } from './$m.controller';

@Module({
  controllers: [${pascal}Controller],
  providers: [${pascal}Service],
  exports: [${pascal}Service],
})
export class ${pascal}Module {}
"@
    EnsureFile $modulePath $mod | Out-Null
    Ok "Criado: $modulePath"
  } else {
    Warn "Module já existe: $modulePath"
  }

  $created += [PSCustomObject]@{ name=$m; pascal=$pascal }
}

if ($created.Count -eq 0) {
  Ok "Nada pra criar. Todos módulos já têm controller/service/module."
  exit 0
}

# ------------------------------------------------------------
# Registrar no app.module.ts (injeção segura)
# ------------------------------------------------------------
if (Test-Path $appModulePath) {
  Info "🔧 Registrando módulos no AppModule..."
  $app = ReadText $appModulePath

  foreach ($x in $created) {
    $m = $x.name
    $pascal = $x.pascal
    $moduleClass = "${pascal}Module"
    $importLine = "import { $moduleClass } from './modules/$m/$m.module';"

    if ($app -notmatch [regex]::Escape($importLine)) {
      # Insere import depois dos últimos imports
      $app = $app -replace "(?s)(^import .*?;\s*)+", "`$0$importLine`n"
      Ok "Import adicionado: $moduleClass"
    }

    # Adiciona no array imports: [...]
    if ($app -match "imports:\s*\[") {
      if ($app -notmatch "\b$moduleClass\b") {
        $app = $app -replace "(imports:\s*\[)", "`$1`n    $moduleClass,"
        Ok "Registrado em imports[]: $moduleClass"
      }
    } else {
      Warn "Não encontrei 'imports: [' no AppModule. Vou deixar só os imports TS."
    }
  }

  WriteText $appModulePath $app
  Ok "AppModule atualizado."
}

Ok "✅ Scaffold concluído. Rode:"
Write-Host "   pnpm -C apps/api type-check" -ForegroundColor Cyan
Write-Host "   pnpm -C apps/api test" -ForegroundColor Cyan
Write-Host "   pnpm -w verify" -ForegroundColor Cyan
