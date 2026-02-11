Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

function Ok($m){ Write-Host "✅ $m" -ForegroundColor Green }
function Info($m){ Write-Host "ℹ️  $m" -ForegroundColor Cyan }
function Warn($m){ Write-Host "⚠️  $m" -ForegroundColor Yellow }
function Die($m){ throw $m }

if (!(Test-Path ".git")) { Die "Rode este script na raiz do repositório (onde existe .git)." }

Info "🔒 Habilitando suporte a path longo (Git)..."
git config core.longpaths true | Out-Null

Info "🧹 Limpando artefatos (dist/.next/coverage/.turbo) - SAFE SCOPED..."

$dirsToDelete = @(
  "apps/*/dist",
  "packages/*/dist",
  "apps/web/.next",
  "apps/web/out",
  "coverage",
  ".turbo",
  ".eslintcache"
)

foreach ($p in $dirsToDelete) {
  Get-ChildItem -Path $p -Force -ErrorAction SilentlyContinue | ForEach-Object {
    $rel = $_.FullName.Replace((Get-Location).Path, ".")
    Write-Host "   🗑️  $rel" -ForegroundColor DarkGray
    Remove-Item $_.FullName -Recurse -Force -ErrorAction SilentlyContinue
  }
}

Info "🧽 Limpando arquivos de build (scoped)..."
Get-ChildItem -Recurse -Force -File -Include "*.tsbuildinfo","*.js.map","*.d.ts.map" -ErrorAction SilentlyContinue |
  Where-Object {
    $_.FullName -notmatch '\\node_modules\\' -and
    (
      $_.FullName -match '\\dist\\' -or
      $_.FullName -match '\\.next\\' -or
      $_.FullName -match '\\coverage\\' -or
      $_.FullName -match '\\out\\' -or
      $_.Name -like "*.tsbuildinfo"
    )
  } |
  ForEach-Object {
    $rel = $_.FullName.Replace((Get-Location).Path, ".")
    Write-Host "   🗑️  $rel" -ForegroundColor DarkGray
    Remove-Item $_.FullName -Force -ErrorAction SilentlyContinue
  }

Ok "Artefatos removidos."

Info "🧩 Ajustando .gitignore..."
$gitignore = ".gitignore"
if (!(Test-Path $gitignore)) {
  Warn ".gitignore não encontrado. Criando um mínimo seguro..."
  @"
node_modules/
dist/
build/
.next/
out/
coverage/
.turbo/
.env
.env.local
.env*.local
*.log
pnpm-debug.log*
npm-debug.log*
.eslintcache
*.tsbuildinfo
"@ | Set-Content -Encoding UTF8 $gitignore
} else {
  $content = Get-Content $gitignore -Raw
  $lines = $content -split "`n"

  # remover exceção legacy do ESLint
  $lines = $lines | Where-Object { $_.Trim() -ne "!.eslintrc.js" }

  # garantir entradas úteis
  if (-not ($lines | Where-Object { $_.Trim() -eq "*.tsbuildinfo" })) { $lines += "*.tsbuildinfo" }
  if (-not ($lines | Where-Object { $_.Trim() -eq ".eslintcache" })) { $lines += ".eslintcache" }

  ($lines -join "`n").TrimEnd() + "`n" | Set-Content -Encoding UTF8 $gitignore
}
Ok ".gitignore ok."

Info "📊 Git status (antes):"
git status --short | Select-Object -First 80 | ForEach-Object { Write-Host "   $_" -ForegroundColor White }

Info "📦 pnpm install..."
pnpm -w install

Info "🧪 Rodando verify (ou fallback)..."
try {
  pnpm -w verify
  Ok "verify OK."
} catch {
  Warn "verify falhou/não existe. Rodando fallback..."
  pnpm -w type-check
  pnpm -w lint
  pnpm -w test
  Ok "fallback OK."
}

Info "📊 Git status (final):"
$final = git status --short
if ($final) {
  $final | Select-Object -First 120 | ForEach-Object { Write-Host "   $_" -ForegroundColor White }
} else {
  Ok "Nenhuma mudança pendente."
}

Write-Host ""
Write-Host "💾 Fazer commit das mudanças? (S/N)" -ForegroundColor Yellow
$resp = Read-Host
if ($resp -match "^(s|S)$") {
  $hasChanges = (git status --porcelain)
  if (-not $hasChanges) { Warn "Não há mudanças para commitar."; exit 0 }

  git add -A

  $msg = @"
chore(clean): remove build artifacts and normalize ignore

- Remove dist/.next/coverage/.turbo (scoped)
- Remove tsbuildinfo + maps in build scopes
- Normalize .gitignore (drop legacy ESLint exception)
- Run pnpm verify (or fallback)
"@

  git commit -m $msg
  Ok "Commit feito."
} else {
  Warn "Commit pulado."
}

Ok "🏁 Automação concluída."
