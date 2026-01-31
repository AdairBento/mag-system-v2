$services = @(
    @{
        Path = "apps\api\src\modules\clients\clients.service.ts"
        Model = "client"
    },
    @{
        Path = "apps\api\src\modules\drivers\drivers.service.ts"
        Model = "driver"
    },
    @{
        Path = "apps\api\src\modules\inspections\inspections.service.ts"
        Model = "inspection"
    },
    @{
        Path = "apps\api\src\modules\rentals\rentals.service.ts"
        Model = "rental"
    },
    @{
        Path = "apps\api\src\modules\vehicles\vehicles.service.ts"
        Model = "vehicle"
    }
)

foreach ($service in $services) {
    $filePath = $service.Path
    $model = $service.Model
    
    Write-Host "Corrigindo $filePath..." -ForegroundColor Cyan
    
    $content = Get-Content $filePath -Raw
    $content = $content -replace "data: dto as any", "data: dto"
    Set-Content -Path $filePath -Value $content -NoNewline
    
    Write-Host "✓ $filePath corrigido!" -ForegroundColor Green
}

Write-Host "`n✅ Correções aplicadas!" -ForegroundColor Green
Write-Host "`nRodando lint..." -ForegroundColor Yellow

pnpm lint --force
