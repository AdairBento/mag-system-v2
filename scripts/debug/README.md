# 🛠️ Generate-Bugpack.ps1

Script para gerar **BUGPACK** automatizado seguindo padrão RAG.

## 🚀 Como usar

### Uso básico
\\\powershell
.\scripts\debug\Generate-Bugpack.ps1
\\\

Cria: \ugpacks/BUGPACK_<timestamp>.md\ com template vazio.

### Uso avançado (com contexto)
\\\powershell
.\scripts\debug\Generate-Bugpack.ps1 \
  -ApiPath "apps\api\src\modules\clients" \
  -WebPath "apps\web\src\app\(dashboard)\clientes" \
  -Search "ClientDto,findAll,GET" \
  -Command "pnpm -C apps/api dev"
\\\

Gera bugpack com:
- ✅ Tree do módulo clients (API)
- ✅ Tree da tela clientes (WEB)
- ✅ Busca por termos (ClientDto, findAll, GET)
- ✅ Comando já preenchido
- ✅ Git info (branch, commit, status)

## 📋 Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| \-ApiPath\ | string | Caminho do módulo API |
| \-WebPath\ | string | Caminho da tela WEB |
| \-Search\ | string | Termos para buscar (separados por vírgula) |
| \-Command\ | string | Comando que gerou o erro |

## 📝 Exemplo completo

\\\powershell
# 1. Gerar bugpack
.\scripts\debug\Generate-Bugpack.ps1 \
  -ApiPath "apps\api\src\modules\rentals" \
  -Search "RentalDto,createRental"

# 2. Abrir arquivo gerado
code bugpacks\BUGPACK_<timestamp>.md

# 3. Preencher:
#    - Seção [1]: Colar erro completo
#    - Seção [8]: Colar conteúdo de 2-3 arquivos

# 4. Enviar pro ChatGPT
\\\

## 🎯 Output

Arquivo markdown com:
- ✅ Template RAG completo
- ✅ Git info automático
- ✅ Tree dos módulos
- ✅ Busca de termos
- ✅ Timestamp

---

**Versão:** 1.0  
**Data:** 27/01/2026

