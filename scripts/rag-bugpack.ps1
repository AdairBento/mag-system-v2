param(
  [Parameter(Mandatory = $false)]
  [string]$ProjectRoot = ".",

  [Parameter(Mandatory = $false)]
  [string]$ApiPath = "",

  [Parameter(Mandatory = $false)]
  [string]$WebPath = "",

  [Parameter(Mandatory = $false)]
  [string]$Search = "",

  [Parameter(Mandatory = $false)]
  [string]$Command = ""
)

$ErrorActionPreference = "SilentlyContinue"

function NowStamp {
  (Get-Date).ToString("yyyyMMdd-HHmmss")
}

function AddLine {
  param([string]$Path, [string]$Text = "")
  Add-Content -Path $Path -Value $Text -Encoding UTF8
}

function Header {
  param([string]$Path, [string]$Title)
  AddLine -Path $Path -Text ""
  AddLine -Path $Path -Text "## $Title"
  AddLine -Path $Path -Text ""
}

function CodeBlock {
  param([string]$Path, [string]$Lang, [object]$Lines)
  AddLine -Path $Path -Text "```$Lang"
  foreach ($l in @($Lines)) {
    AddLine -Path $Path -Text "$l"
  }
  AddLine -Path $Path -Text "```"
  AddLine -Path $Path -Text ""
}

# --- Setup paths
$stamp = NowStamp
$root = (Resolve-Path $ProjectRoot).Path
$bugpacksDir = Join-Path $root "bugpacks"
New-Item -ItemType Directory -Force -Path $bugpacksDir | Out-Null

$outPath = Join-Path $bugpacksDir "BUGPACK_$stamp.md"

Set-Location $root

# --- Header
AddLine -Path $outPath -Text "# 🧩 BUGPACK (RAG) — $stamp"
AddLine -Path $outPath -Text ""
AddLine -Path $outPath -Text "**Projeto:** mag-system-v2"
AddLine -Path $outPath -Text "**Data:** $(Get-Date -Format 'dd/MM/yyyy HH:mm:ss')"
AddLine -Path $outPath -Text ""

# --- [1]
Header -Path $outPath -Title "1) Erro completo (cole aqui)"
AddLine -Path $outPath -Text "> Cole o stack trace completo aqui."
AddLine -Path $outPath -Text ""

# --- [2]
Header -Path $outPath -Title "2) Comando que gerou"
if ($Command.Trim().Length -gt 0) {
  CodeBlock -Path $outPath -Lang "bash" -Lines @($Command)
} else {
  CodeBlock -Path $outPath -Lang "bash" -Lines @(
    "pnpm -C apps/api dev",
    "pnpm -C apps/web dev",
    "pnpm type-check"
  )
}

# --- [3]
Header -Path $outPath -Title "3) Esperado (1–3 linhas)"
AddLine -Path $outPath -Text "> O que deveria acontecer?"
AddLine -Path $outPath -Text ""

# --- [4]
Header -Path $outPath -Title "4) Onde acontece (tela/rota + ação)"
AddLine -Path $outPath -Text "> URL/rota + passos para reproduzir."
AddLine -Path $outPath -Text ""

# --- [5] Git info
Header -Path $outPath -Title "5) Ambiente / Git"
$gitLines = New-Object System.Collections.Generic.List[string]
$gitLines.Add("pwd: $root")

try {
  $branch = (git branch --show-current 2>$null)
  if ([string]::IsNullOrWhiteSpace($branch)) { $branch = "(indisponível)" }
  $gitLines.Add("git branch: $branch")

  $head = (git rev-parse --short HEAD 2>$null)
  if ([string]::IsNullOrWhiteSpace($head)) { $head = "(indisponível)" }
  $gitLines.Add("git head: $head")

  $gitLines.Add("git status:")
  $status = (git status -sb 2>$null)
  if ($status) {
    foreach ($s in @($status)) { $gitLines.Add($s) }
  } else {
    $gitLines.Add("(indisponível)")
  }
} catch {
  $gitLines.Add("git: (não disponível)")
}

CodeBlock -Path $outPath -Lang "text" -Lines $gitLines

# --- [6] Trees
Header -Path $outPath -Title "6) Tree (API/WEB)"

if ($ApiPath.Trim().Length -gt 0) {
  if (Test-Path -LiteralPath $ApiPath) {
    AddLine -Path $outPath -Text "**API Path:** `$ApiPath`"
    $treeApi = cmd /c "tree `"$ApiPath`" /F"
    CodeBlock -Path $outPath -Lang "text" -Lines $treeApi
  } else {
    AddLine -Path $outPath -Text "⚠️ API Path informado não existe: `$ApiPath`"
    AddLine -Path $outPath -Text ""
  }
} else {
  AddLine -Path $outPath -Text "> (Opcional) Rode: `tree apps\api\src\modules\<modulo> /F` e cole aqui."
  AddLine -Path $outPath -Text ""
}

if ($WebPath.Trim().Length -gt 0) {
  if (Test-Path -LiteralPath $WebPath) {
    AddLine -Path $outPath -Text "**WEB Path:** `$WebPath`"
    $treeWeb = cmd /c "tree `"$WebPath`" /F"
    CodeBlock -Path $outPath -Lang "text" -Lines $treeWeb
  } else {
    AddLine -Path $outPath -Text "⚠️ WEB Path informado não existe: `$WebPath`"
    AddLine -Path $outPath -Text ""
  }
} else {
  AddLine -Path $outPath -Text "> (Opcional) Rode: `tree apps\web\src\<tela> /F` e cole aqui."
  AddLine -Path $outPath -Text ""
}

# --- [7] Search
Header -Path $outPath -Title "7) Busca rápida (Select-String)"

if ($Search.Trim().Length -gt 0) {

  $terms = $Search.Split(",") | ForEach-Object { $_.Trim() } | Where-Object { $_.Length -gt 0 }

  $apiRoot = Join-Path $root "apps\api\src"
  $webRoot = Join-Path $root "apps\web\src"

  $apiFiles = @()
  if (Test-Path -LiteralPath $apiRoot) {
    $apiFiles = Get-ChildItem -Path $apiRoot -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -eq ".ts" }
  }

  $webFiles = @()
  if (Test-Path -LiteralPath $webRoot) {
    $webFiles = Get-ChildItem -Path $webRoot -Recurse -File -ErrorAction SilentlyContinue |
      Where-Object { $_.Extension -in @(".ts", ".tsx") }
  }

  foreach ($t in $terms) {
    AddLine -Path $outPath -Text "**Termo:** `$t`"

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

    if ($apiHits -and $apiHits.Count -gt 0) {
      CodeBlock -Path $outPath -Lang "text" -Lines $apiHits
    } else {
      AddLine -Path $outPath -Text "_(sem hits na API)_"
      AddLine -Path $outPath -Text ""
    }

    if ($webHits -and $webHits.Count -gt 0) {
      CodeBlock -Path $outPath -Lang "text" -Lines $webHits
    } else {
      AddLine -Path $outPath -Text "_(sem hits na WEB)_"
      AddLine -Path $outPath -Text ""
    }
  }

} else {
  AddLine -Path $outPath -Text "> (Opcional) Use: `-Search `"clients,modal,401`" para listar arquivos relacionados."
  AddLine -Path $outPath -Text ""
}

# --- [8] File placeholders
Header -Path $outPath -Title "8) Arquivos-chave (cole 2–5 arquivos aqui)"

AddLine -Path $outPath -Text "- **path1:**"
AddLine -Path $outPath -Text "```ts"
AddLine -Path $outPath -Text "// cole o arquivo aqui"
AddLine -Path $outPath -Text "```"
AddLine -Path $outPath -Text ""

AddLine -Path $outPath -Text "- **path2:**"
AddLine -Path $outPath -Text "```ts"
AddLine -Path $outPath -Text "// cole o arquivo aqui"
AddLine -Path $outPath -Text "```"
AddLine -Path $outPath -Text ""

Write-Host "✅ BUGPACK criado em: $outPath" -ForegroundColor Green
Write-Host "➡️ Próximo passo: abrir e preencher as seções [1] e [8]" -ForegroundColor Yellow
