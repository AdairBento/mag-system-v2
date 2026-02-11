Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️  $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️  $m" -ForegroundColor Yellow }
function Die($m){ throw $m }

function ReadText($p){
  if (!(Test-Path $p)) { return $null }
  return [IO.File]::ReadAllText($p, [Text.Encoding]::UTF8)
}
function WriteText($p,$c){
  $dir = Split-Path $p -Parent
  if ($dir -and !(Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }
  [IO.File]::WriteAllText($p, $c, [Text.Encoding]::UTF8)
}
function Backup($p){
  $stamp = Get-Date -Format "yyyyMMdd-HHmmss"
  Copy-Item $p "$p.bak-$stamp" -Force
}

$apiDir = "apps/api"
if (!(Test-Path $apiDir)) { Die "Rode na raiz do repo. Não achei apps/api." }

# -----------------------------------------
# 1) Criar/ajustar ESLint config local do API
#    Objetivo: permitir any/APIs unsafe em TESTES apenas
# -----------------------------------------
$target = Join-Path $apiDir ".eslintrc.cjs"
$existing = ReadText $target

$overrideBlock = @"
  overrides: [
    ...(base.overrides ?? []),
    {
      files: ['**/__tests__/**/*.ts', '**/*.spec.ts'],
      rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unsafe-assignment': 'off',
        '@typescript-eslint/no-unsafe-call': 'off',
        '@typescript-eslint/no-unsafe-member-access': 'off',
      },
    },
  ],
"@

if ($null -eq $existing) {
  # Tenta herdar config da raiz (caso exista). Se não existir, cria config mínima.
  $rootCandidates = @(
    ".eslintrc.cjs",
    ".eslintrc.js",
    ".eslintrc.json"
  )

  $rootRequire = $null
  foreach ($rc in $rootCandidates) {
    if (Test-Path $rc) { $rootRequire = $rc; break }
  }

  $content = if ($rootRequire) {
@"
const base = require('../../$rootRequire');

module.exports = {
  ...base,
$overrideBlock
};
"@
  } else {
@"
module.exports = {
  root: false,
  extends: [],
$overrideBlock
};
"@
  }

  WriteText $target $content
  Ok "Criado $target com override para testes"
} else {
  # Se já existir, não arrisca “merge complexo”.
  # Só garante que o override existe; se não existir, injeta antes do último '};'
  if ($existing -match "files:\s*\[\s*'\*\*\/__tests__\/\*\*\/\*\.ts'\s*,\s*'\*\*\/\*\.spec\.ts'\s*\]") {
    Ok "Override de testes já existe em $target"
  } else {
    Backup $target
    if ($existing -notmatch "module\.exports\s*=\s*\{") {
      Die "$target existe mas não parece config CJS padrão (module.exports = {...}). Prefiro não editar no escuro."
    }

    # injeta override antes do fechamento final };
    $patched = $existing -replace "\n\};\s*$", "`n$overrideBlock`n};`n"
    WriteText $target $patched
    Ok "Injetado override de testes em $target (backup criado)"
  }
}

# -----------------------------------------
# 2) Rodar lint do API (só pra validar)
# -----------------------------------------
Info "Rodando lint do API..."
& pnpm -C $apiDir lint
Ok "Lint do API executado."
