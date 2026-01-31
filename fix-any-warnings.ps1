# Script para corrigir warnings de TypeScript nos services
$services = @(
    @{
        Path = "apps\api\src\modules\clients\clients.service.ts"
        Type = "Client"
    },
    @{
        Path = "apps\api\src\modules\drivers\drivers.service.ts"
        Type = "Driver"
    },
    @{
        Path = "apps\api\src\modules\inspections\inspections.service.ts"
        Type = "Inspection"
    },
    @{
        Path = "apps\api\src\modules\rentals\rentals.service.ts"
        Type = "Rental"
    },
    @{
        Path = "apps\api\src\modules\vehicles\vehicles.service.ts"
        Type = "Vehicle"
    }
)

foreach ($service in $services) {
    $filePath = $service.Path
    $typeName = $service.Type
    
    Write-Host "Corrigindo $filePath..." -ForegroundColor Cyan
    
    # Ler o conteúdo do arquivo
    $content = Get-Content $filePath -Raw
    
    # Adicionar import do Prisma se não existir
    if ($content -notmatch "import \{ Prisma \}") {
        $content = $content -replace "(import.*from './dto';)", "$1`nimport { Prisma } from '@prisma/client';"
    }
    
    # Substituir 'any' por tipo específico do Prisma
    $content = $content -replace "private buildWhereClause\(filters: any\)", "private buildWhereClause(filters: Prisma.${typeName}WhereInput)"
    $content = $content -replace "async findAll\(filters\?: any\)", "async findAll(filters?: Prisma.${typeName}WhereInput)"
    
    # Salvar o arquivo
    Set-Content -Path $filePath -Value $content -NoNewline
    
    Write-Host "✓ $filePath corrigido!" -ForegroundColor Green
}

Write-Host "`n✅ Todas as correções aplicadas com sucesso!" -ForegroundColor Green
Write-Host "`nRodando lint para verificar..." -ForegroundColor Yellow

# Rodar lint
pnpm lint
