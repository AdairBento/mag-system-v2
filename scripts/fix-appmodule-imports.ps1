Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️  $m" -ForegroundColor Cyan }
function Die($m){ throw $m }

$path = "apps/api/src/app.module.ts"
if (!(Test-Path $path)) { Die "Não achei $path" }

$app = Get-Content $path -Raw

# Pega módulos importados vindos de ./modules/
$mods = @()
$rx = [regex]"import\s*\{\s*([A-Za-z0-9_]+Module)\s*\}\s*from\s*'\.\/modules\/[^']+'\s*;"
foreach ($m in $rx.Matches($app)) {
  $mods += $m.Groups[1].Value
}
$mods = $mods | Select-Object -Unique

if ($mods.Count -eq 0) { Ok "Nenhum import de Module detectado. Nada a fazer."; exit 0 }

# Encontra bloco imports: [ ... ]
$blockRx = [regex]"imports\s*:\s*\[(?<inside>[\s\S]*?)\]"
$match = $blockRx.Match($app)
if (-not $match.Success) { Die "Não encontrei 'imports: [ ... ]' no AppModule." }

$inside = $match.Groups["inside"].Value

$added = 0
foreach ($m in $mods) {
  if ($inside -notmatch "\b$([regex]::Escape($m))\b") {
    $inside = "    $m,`n" + $inside
    $added++
  }
}

if ($added -eq 0) { Ok "Imports[] já contém todos módulos. Nada a fazer."; exit 0 }

$new = $app.Substring(0, $match.Groups["inside"].Index) + $inside + $app.Substring($match.Groups["inside"].Index + $match.Groups["inside"].Length)
Set-Content -LiteralPath $path -Value $new -Encoding UTF8

Ok "AppModule corrigido: $added módulos adicionados em imports[]"
