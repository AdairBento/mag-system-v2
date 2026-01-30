# Script para limpar arquivos compilados que não deveriam estar em src/

Write-Host "Limpando arquivos compilados de src/..." -ForegroundColor Yellow

# Limpar arquivos .js (exceto configs)
Get-ChildItem -Path "apps", "packages" -Recurse -Include "*.js" -Exclude "*.config.js", "jest.config.js" | 
    Where-Object { $_.DirectoryName -notmatch "node_modules|dist|build|.next" -and $_.DirectoryName -match "src" } | 
    Remove-Item -Force -Verbose

# Limpar arquivos .d.ts
Get-ChildItem -Path "apps", "packages" -Recurse -Include "*.d.ts" | 
    Where-Object { $_.DirectoryName -notmatch "node_modules|dist|build|.next" -and $_.DirectoryName -match "src" } | 
    Remove-Item -Force -Verbose

# Limpar arquivos .map
Get-ChildItem -Path "apps", "packages" -Recurse -Include "*.js.map", "*.d.ts.map" | 
    Where-Object { $_.DirectoryName -notmatch "node_modules|dist|build|.next" -and $_.DirectoryName -match "src" } | 
    Remove-Item -Force -Verbose

Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
Write-Host "ℹ️ Arquivos de build devem estar apenas em: dist/, build/, .next/" -ForegroundColor Cyan
