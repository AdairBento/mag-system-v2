# 🔍 PROMPT RAG - GUIA DE TRABALHO PROFISSIONAL

> **Objetivo:** Eliminar código inventado/alucinado usando RAG (Retrieval-Augmented Generation)

---

## ⚠️ REGRAS OBRIGATÓRIAS (ANTI-ALUCINAÇÃO)

### ❌ PROIBIDO INVENTAR:
- Arquivos, pastas, rotas, endpoints
- Nomes de funções/classes
- DTOs, schemas, tabelas, colunas
- Hooks, exports, imports

### ✅ PERMITIDO APENAS:
- Trabalhar com código fornecido
- Pedir contexto adicional se faltar
- Criar patch baseado em evidências
- Fazer perguntas específicas

---

## 📋 CHECKLIST: O QUE EU (USUÁRIO) DEVO ENVIAR

Para cada bug/correção, enviar:

### 1️⃣ ERRO COMPLETO
Stack trace inteiro + mensagem de erro

### 2️⃣ COMANDO QUE GEROU
\\\ash
pnpm -C apps/api dev
# ou
pnpm -C apps/web dev
# ou
pnpm type-check
\\\

### 3️⃣ EXPECTATIVA
O que deveria acontecer (1-3 linhas)

### 4️⃣ ONDE ACONTECE
- URL da tela (web) OU rota da API
- Ação feita (clicou em quê, salvou o quê)

### 5️⃣ TREE DO MÓDULO
\\\ash
tree apps\api\src\modules\<modulo> /F
tree apps\web\src\<tela> /F
\\\

### 6️⃣ ARQUIVOS-CHAVE (CONTEÚDO)
Cole 2-5 arquivos:
- **API:** controller, service, dto, prisma calls
- **WEB:** page, component, hook, api client

---

## 📤 FORMATO DE RESPOSTA (OBRIGATÓRIO)

\\\markdown
### Arquivos analisados
- path1
- path2

### Diagnóstico (com evidências)
**Causa 1:** (citar trecho e path)
**Causa 2:** (citar trecho e path)

### Correção proposta
1. Passo 1...
2. Passo 2...

### PATCH (diff)
\\\diff
*** <path real>
@@
- código antigo
+ código novo
\\\

### Como testar
\\\ash
pnpm -C apps/api dev
# Cenário: ...
\\\

### Checklist anti-regressão
- [ ] Item 1
- [ ] Item 2
\\\

---

## 🛠️ COMANDOS ÚTEIS (WINDOWS)

### Tree do módulo
\\\powershell
tree apps\api\src\modules\<modulo> /F
tree apps\web\src\<pasta> /F
\\\

### Ver arquivo
\\\powershell
Get-Content <path>
\\\

### Buscar termo no código
\\\powershell
Select-String -Path .\apps\api\src\**\*.ts -Pattern "<termo>"
Select-String -Path .\apps\web\src\**\*.tsx -Pattern "<termo>"
\\\

---

## 📝 TEMPLATE RÁPIDO

\\\markdown
[1] Erro completo:
(colar stack trace)

[2] Comando:
pnpm ...

[3] Esperado:
...

[4] Onde (tela/rota + ação):
...

[5] Tree:
(colar tree)

[6] Arquivos:

**path1:**
\\\	ypescript
// colar código
\\\

**path2:**
\\\	ypescript
// colar código
\\\
\\\

---

## 🎯 EXEMPLO DE USO

**EU (USUÁRIO):**
\\\
[1] Erro: Cannot find module '@mag-system/core'
[2] Comando: pnpm -C apps/api dev
[3] Esperado: API iniciar na porta 3001
[4] Onde: apps/api/src/modules/clients/clients.service.ts linha 3
[5] Tree: (colar)
[6] Arquivo: clients.service.ts (colar)
\\\

**VOCÊ (CHATGPT):**
\\\markdown
### Arquivos analisados
- apps/api/src/modules/clients/clients.service.ts
- apps/api/tsconfig.json

### Diagnóstico
**Causa:** tsconfig.json falta path alias para @mag-system/core

### PATCH
*** apps/api/tsconfig.json
+++ apps/api/tsconfig.json
@@ -5,6 +5,9 @@
   "compilerOptions": {
     "baseUrl": "./",
+    "paths": {
+      "@mag-system/core": ["../../packages/core/src"]
+    }
   }

### Como testar
pnpm -C apps/api dev
# Deve iniciar sem erros
\\\

---

**Data de criação:** 27/01/2026  
**Versão:** 1.0  
**Projeto:** MAG System V2

