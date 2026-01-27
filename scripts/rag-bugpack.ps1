param(
  [Parameter(Mandatory = $false)]
  [string]$ProjectRoot = ".",

  # Opcional: caminho do módulo/pasta onde estoura o bug
  [Parameter(Mandatory = $false)]
  [string]$ApiPath = "",

  [Parameter(Mandatory = $false)]
  [string]$WebPath = "",

  # Opcional: termos pra buscar no repo (separados por vírgula)
  [Parameter(Mandatory = $false)]
  [string]$Search = "",

  # Opcional: comando que você rodou (pra já entrar no relatório)
  [Parameter(Mandatory = $false)]
  [string]$Command = ""
)

$ErrorActionPreference = "SilentlyContinue"

function NowStamp { (Get-Date).ToString("yyyyMMdd-HHmmss") }
function Exists($p) { return (Test-Path -LiteralPath $p) }

$stamp = NowStamp
$root = (Resolve-Path $ProjectRoot).Path
$dir = Join-Path $root "bugpacks"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

$outPath = Join-Path $dir "BUGPACK_$stamp.md"

function AddLine([string]$s = "") {
  Add-Content -Path $outPath -Value $s -Encoding UTF8
}

function Header([string]$title) {
  AddLine ""
  AddLine "## $title"
  AddLine ""
}

function CodeBlock([string]$lang, $lines) {
  AddLine "```$lang"
  foreach ($l in @($lines)) { AddLine "$l" }
  AddLine "```"
  AddLine ""
}

Set-Location $root

AddLine "# 🧩 BUGPACK (RAG) — $stamp"
AddLine ""
AddLine "**Projeto:** mag-system-v2"
AddLine "**Data:** $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
AddLine ""

Header "1) Erro completo (cole aqui)"
AddLine "> Cole o stack trace completo aqui."
AddLine ""

Header "2) Comando que gerou"
if ($Command.Trim().Length -gt 0) {
  CodeBlock "bash" @($Command)
} else {
  CodeBlock "bash" @(
    "pnpm -C apps/api dev",
    "pnpm -C apps/web dev",
    "pnpm type-check"
  )
}

Header "3) Esperado (1–3 linhas)"
AddLine "> O que deveria acontecer?"
AddLine ""

Header "4) Onde acontece (tela/rota + ação)"
AddLine "> URL/rota + passos para reproduzir."
AddLine ""

Header "5) Ambiente / Git"
$gitLines = @()
$gitLines += "pwd: $root"

try {
  $branch = (git branch --show-current 2>$null)
  if ($branch) { $gitLines += "git branch: $branch" } else { $gitLines += "git branch: (indisponível)" }

  $head = (git rev-parse --short HEAD 2>$null)
  if ($head) { $gitLines += "git head: $head" } else { $gitLines += "git head: (indisponível)" }

  $gitLines += "git status:"
  $status = (git status -sb 2>$null)
  if ($status) { $gitLines += $status } else { $gitLines += "(indisponível)" }
} catch {
  $gitLines += "git: (não disponível)"
}

CodeBlock "text" $gitLines

Header "6) Tree (API/WEB)"
if ($ApiPath.Trim().Length -gt 0) {
  if (Exists $ApiPath) {
    AddLine "**API Path:** `$ApiPath`"
    $treeApi = cmd /c "tree `"$ApiPath`" /F"
    CodeBlock "text" $treeApi
  } else {
    AddLine "⚠️ API Path informado não existe: `$ApiPath`"
    AddLine ""
  }
} else {
  AddLine "> (Opcional) Rode: `tree apps\api\src\modules\<modulo> /F` e cole aqui."
  AddLine ""
}

if ($WebPath.Trim().Length -gt 0) {
  if (Exists $WebPath) {
    AddLine "**WEB Path:** `$WebPath`"
    $treeWeb = cmd /c "tree `"$WebPath`" /F"
    CodeBlock "text" $treeWeb
  } else {
    AddLine "⚠️ WEB Path informado não existe: `$WebPath`"
    AddLine ""
  }
} else {
  AddLine "> (Opcional) Rode: `tree apps\web\src\<tela> /F` e cole aqui."
  AddLine ""
}

Header "7) Busca rápida (Select-String)"
if ($Search.Trim().Length -gt 0) {
  $terms = $Search.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_.Length -gt 0 }

  $apiRoot = Join-Path $root "apps\api\src"
  $webRoot = Join-Path $root "apps\web\src"

  # Coleta arquivos de forma compatível (sem **)
  $apiFiles = @()
  if (Test-Path $apiRoot) {
    $apiFiles = Get-ChildItem -Path $apiRoot -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -eq ".ts" }
  }

  $webFiles = @()
  if (Test-Path $webRoot) {
    $webFiles = Get-ChildItem -Path $webRoot -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -in @(".ts", ".tsx") }
  }

  foreach ($t in $terms) {
    AddLine "**Termo:** `$t`"

    $apiHits = @()
    if ($apiFiles.Count -gt 0) {
      $apiHits = Select-String -Path $apiFiles.FullName -Pattern $t -List -SimpleMatch -ErrorAction SilentlyContinue |
        ForEach-Object { "$($_.Path):$($_.LineNumber)" }
    }

    $webHits = @()
    if ($webFiles.Count -gt 0) {
      $webHits = Select-String -Path $webFiles.FullName -Pattern $t -List -SimpleMatch -ErrorAction SilentlyContinue |
        ForEach-Object { "$($_.Path):$($_.LineNumber)" }
    }

    if ($apiHits) { CodeBlock "text" $apiHits } else { AddLine "_(sem hits na API)_" ; AddLine "" }
    if ($webHits) { CodeBlock "text" $webHits } else { AddLine "_(sem hits na WEB)_" ; AddLine "" }
  }
} else {
  AddLine "> (Opcional) Use: `-Search `"clients,modal,401`" para listar arquivos relacionados."
  AddLine ""
}

Header "8) Arquivos-chave (cole 2–5 arquivos aqui)"
AddLine "- **path1:**"
AddLine "```ts"
AddLine "// cole o arquivo aqui"
AddLine "```"
AddLine ""
AddLine "- **path2:**"
AddLine "```ts"
AddLine "// cole o arquivo aqui"
AddLine "```"
AddLine ""

Write-Host "✅ BUGPACK criado em: $outPath" -ForegroundColor Green
Write-Host "➡️ Próximo passo: abrir e preencher as seções [1] e [8]" -ForegroundColor Yellow
