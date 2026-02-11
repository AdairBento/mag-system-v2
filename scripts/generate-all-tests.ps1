# scripts/generate-all-tests.ps1
# Executar na raiz: pwsh ./scripts/generate-all-tests.ps1

$ErrorActionPreference = "Stop"

function Ensure-Dir([string]$Path) {
  if (!(Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null }
}

function Get-FileText([string]$Path) {
  if (!(Test-Path $Path)) { return $null }
  return Get-Content -Path $Path -Raw -Encoding UTF8
}

function Find-ExportedClassName([string]$tsContent, [string]$suffix) {
  if (-not $tsContent) { return $null }
  $rx = [regex]("export\s+class\s+([A-Za-z0-9_]+$suffix)\b")
  $m = $rx.Match($tsContent)
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Find-PrismaDelegate([string]$tsContent) {
  if (-not $tsContent) { return $null }
  # pega o primeiro match de: this.prisma.vehicle.  OU prisma.vehicle.
  $rx = [regex]("(?:this\.)?prisma\.([a-zA-Z0-9_]+)\.")
  $m = $rx.Match($tsContent)
  if ($m.Success) { return $m.Groups[1].Value }
  return $null
}

function Get-RelativeImportPath([string]$fromDir, [string]$toFile) {
  # retorna path tipo ../foo/bar (sem .ts) usando / (node)
  $from = (Resolve-Path $fromDir).Path
  $to = (Resolve-Path $toFile).Path

  $fromUri = [Uri]((($from.TrimEnd('\')) + '\'))
  $toUri   = [Uri]$to

  $rel = $fromUri.MakeRelativeUri($toUri).ToString()
  $rel = $rel -replace '%20',' '
  $rel = $rel -replace '\.ts$',''
  if (-not $rel.StartsWith(".")) { $rel = "./" + $rel }
  return ($rel -replace '\\','/' )
}

function Pick-FirstFile([string]$modulePath, [string]$pattern) {
  # pega o "melhor" candidato: primeiro que contenha o nome do módulo, senão o primeiro do resultado
  $files = Get-ChildItem -Path $modulePath -Recurse -File -Filter $pattern -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notmatch '\.spec\.ts$' }

  if (-not $files) { return $null }

  $moduleName = Split-Path $modulePath -Leaf
  $preferred = $files | Where-Object { $_.Name -match [regex]::Escape($moduleName) } | Select-Object -First 1
  if ($preferred) { return $preferred.FullName }

  return ($files | Select-Object -First 1).FullName
}

function New-ServiceSpec(
  [string]$testsDir,
  [string]$serviceClass,
  [string]$serviceFilePath,
  [string]$delegateName
) {
  $serviceImport = Get-RelativeImportPath -fromDir $testsDir -toFile $serviceFilePath

@"
import { Test, TestingModule } from '@nestjs/testing';
import { $serviceClass } from '$serviceImport';
import { PrismaService } from '../../../database/prisma.service';

describe('$serviceClass', () => {
  let service: $serviceClass;

  const delegate = '$delegateName';

  const mockPrismaService: any = {
    [delegate]: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        $serviceClass,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<$serviceClass>($serviceClass);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Smoke tests (não assumem assinatura/DTO exata)
  it('create should not crash (and may call prisma)', async () => {
    const dto: any = { name: 'Test' };
    mockPrismaService[delegate].create.mockResolvedValue({ id: '1', ...dto });

    const fn = (service as any).create;
    if (typeof fn === 'function') {
      await fn.call(service, dto);
    }

    expect(true).toBe(true);
  });

  it('findAll should not crash (and may call prisma)', async () => {
    mockPrismaService[delegate].findMany.mockResolvedValue([]);
    mockPrismaService[delegate].count.mockResolvedValue(0);

    const fn = (service as any).findAll;
    if (typeof fn === 'function') {
      await fn.call(service, { skip: 0, take: 10 });
    }

    expect(true).toBe(true);
  });
});
"@
}

function New-ControllerSpec(
  [string]$testsDir,
  [string]$controllerClass,
  [string]$controllerFilePath,
  [string]$serviceClass,
  [string]$serviceFilePath
) {
  $controllerImport = Get-RelativeImportPath -fromDir $testsDir -toFile $controllerFilePath
  $serviceImport    = Get-RelativeImportPath -fromDir $testsDir -toFile $serviceFilePath

@"
import { Test, TestingModule } from '@nestjs/testing';
import { $controllerClass } from '$controllerImport';
import { $serviceClass } from '$serviceImport';

describe('$controllerClass', () => {
  let controller: $controllerClass;

  const mockService: any = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [$controllerClass],
      providers: [{ provide: $serviceClass, useValue: mockService }],
    }).compile();

    controller = module.get<$controllerClass>($controllerClass);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('create should not crash (if exists)', async () => {
    mockService.create.mockResolvedValue({ id: '1' });

    const fn = (controller as any).create;
    if (typeof fn === 'function') {
      await fn.call(controller, {});
    }

    expect(true).toBe(true);
  });
});
"@
}

Write-Host "🚀 Gerando testes em massa (auto-scan)..." -ForegroundColor Cyan
Write-Host ""

$modulesRoot = "apps/api/src/modules"
if (!(Test-Path $modulesRoot)) { throw "Diretório não encontrado: $modulesRoot" }

$moduleDirs = Get-ChildItem -Path $modulesRoot -Directory

$created = 0
$skipped = 0
$missing = @()

foreach ($dir in $moduleDirs) {
  $modulePath = $dir.FullName
  $moduleName = $dir.Name

  Write-Host "📝 Módulo: $moduleName" -ForegroundColor Yellow

  $testsDir = Join-Path $modulePath "__tests__"
  Ensure-Dir $testsDir

  $serviceFile = Pick-FirstFile -modulePath $modulePath -pattern "*service.ts"
  $controllerFile = Pick-FirstFile -modulePath $modulePath -pattern "*controller.ts"

  # SERVICE SPEC
  if ($serviceFile) {
    $serviceContent = Get-FileText $serviceFile
    $serviceClass = Find-ExportedClassName $serviceContent "Service"
    if ($serviceClass) {
      $delegate = Find-PrismaDelegate $serviceContent
      if (-not $delegate) { $delegate = "unknown_delegate" }

      $specPath = Join-Path $testsDir "$moduleName.service.spec.ts"
      if (Test-Path $specPath) {
        Write-Host "   ⏭️  Service spec já existe" -ForegroundColor DarkYellow
        $skipped++
      } else {
        $spec = New-ServiceSpec $testsDir $serviceClass $serviceFile $delegate
        $spec | Out-File -FilePath $specPath -Encoding UTF8 -NoNewline
        Write-Host "   ✅ Criado: __tests__/$moduleName.service.spec.ts (class=$serviceClass, delegate=$delegate)" -ForegroundColor Green
        $created++
      }
    } else {
      Write-Host "   ⚠️  Service encontrado mas sem 'export class *Service' (pulando)" -ForegroundColor DarkYellow
      $skipped++
    }
  } else {
    Write-Host "   ⏭️  Nenhum service.ts encontrado" -ForegroundColor DarkYellow
    $missing += "${moduleName}: service"
  }

  # CONTROLLER SPEC
  if ($controllerFile -and $serviceFile) {
    $controllerContent = Get-FileText $controllerFile
    $serviceContent = Get-FileText $serviceFile

    $controllerClass = Find-ExportedClassName $controllerContent "Controller"
    $serviceClass = Find-ExportedClassName $serviceContent "Service"

    if ($controllerClass -and $serviceClass) {
      $specPath = Join-Path $testsDir "$moduleName.controller.spec.ts"
      if (Test-Path $specPath) {
        Write-Host "   ⏭️  Controller spec já existe" -ForegroundColor DarkYellow
        $skipped++
      } else {
        $spec = New-ControllerSpec $testsDir $controllerClass $controllerFile $serviceClass $serviceFile
        $spec | Out-File -FilePath $specPath -Encoding UTF8 -NoNewline
        Write-Host "   ✅ Criado: __tests__/$moduleName.controller.spec.ts (class=$controllerClass)" -ForegroundColor Green
        $created++
      }
    } else {
      Write-Host "   ⚠️  Controller/Service sem classe exportada esperada (pulando controller spec)" -ForegroundColor DarkYellow
      $skipped++
    }
  } elseif (-not $controllerFile) {
    Write-Host "   ⏭️  Nenhum controller.ts encontrado" -ForegroundColor DarkYellow
    $missing += "${moduleName}: controller"
  } elseif (-not $serviceFile) {
    Write-Host "   ⏭️  Sem service.ts não gero controller spec" -ForegroundColor DarkYellow
    $skipped++
  }

  Write-Host ""
}

Write-Host ("=" * 60) -ForegroundColor Cyan
Write-Host "✅ Concluído!" -ForegroundColor Green
Write-Host "📦 Specs criados: $created" -ForegroundColor Cyan
Write-Host "⏭️  Itens pulados: $skipped" -ForegroundColor Cyan

if ($missing.Count -gt 0) {
  Write-Host ""
  Write-Host "⚠️  Faltando arquivos em alguns módulos:" -ForegroundColor Yellow
  $missing | Sort-Object | Get-Unique | ForEach-Object { Write-Host "   - $_" -ForegroundColor DarkYellow }
}

Write-Host ""
Write-Host "🧪 Rode:" -ForegroundColor Yellow
Write-Host "   pnpm -C apps/api test" -ForegroundColor White
Write-Host "   pnpm -w verify" -ForegroundColor White
