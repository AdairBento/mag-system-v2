# 🚀 Guia de Release - MAG System V2

## 📝 Como Criar uma Release

### 1️⃣ Atualizar CHANGELOG.md

Antes de criar a release, documente as mudanças:

```markdown
## [X.Y.Z] - YYYY-MM-DD

### Added
- Nova funcionalidade A
- Nova funcionalidade B

### Changed
- Mudança C

### Fixed
- Bug fix D
```

### 2️⃣ Commitar o CHANGELOG

```bash
git add CHANGELOG.md
git commit -m "docs: update changelog for vX.Y.Z"
git push origin main
```

### 3️⃣ Criar e Pushar a Tag

```bash
# Criar tag localmente
git tag -a vX.Y.Z -m "Release vX.Y.Z"

# Pushar para o GitHub
git push origin vX.Y.Z
```

### 4️⃣ Aguardar Workflow

O workflow `.github/workflows/release.yml` será acionado automaticamente e:

1. ✅ Rodará todos os testes
2. 🛠️ Fará build de todos os packages
3. 📝 Extrairá notas do CHANGELOG.md
4. 🎯 Criará a release no GitHub

### 5️⃣ Verificar Release

Acesse: `https://github.com/AdairBento/mag-system-v2/releases`

---

## 📊 Semantic Versioning

Seguimos [SemVer](https://semver.org/lang/pt-BR/):

```
vMAJOR.MINOR.PATCH
```

### Quando incrementar?

- **MAJOR (X.0.0)**: Breaking changes (incompatibilidade)
  - Exemplo: `v1.0.0` → `v2.0.0`
  - Mudanças na API que quebram código existente

- **MINOR (0.X.0)**: Novas features (compatibilidade mantida)
  - Exemplo: `v2.0.0` → `v2.1.0`
  - Novos módulos, endpoints, funcionalidades

- **PATCH (0.0.X)**: Bug fixes (compatibilidade mantida)
  - Exemplo: `v2.1.0` → `v2.1.1`
  - Correções de bugs, segurança

---

## 📝 Exemplo Completo

### Cenario: Lançar v2.1.0 com novo módulo

```bash
# 1. Editar CHANGELOG.md
vim CHANGELOG.md

# Adicionar:
## [2.1.0] - 2026-02-10

### Added
- feat(api): driver module with CRUD operations
- feat(web): driver management page

# 2. Commitar
git add CHANGELOG.md
git commit -m "docs: update changelog for v2.1.0"
git push origin main

# 3. Criar tag
git tag -a v2.1.0 -m "Release v2.1.0 - Driver Module"

# 4. Pushar tag
git push origin v2.1.0

# 5. Aguardar workflow (2-5 minutos)
# 6. Verificar em: https://github.com/AdairBento/mag-system-v2/releases/tag/v2.1.0
```

---

## ✅ Checklist de Release

Antes de criar a release:

- [ ] Todos os testes passando localmente (`pnpm test`)
- [ ] Build bem-sucedido (`pnpm build`)
- [ ] CI/CD verde no GitHub Actions
- [ ] CHANGELOG.md atualizado
- [ ] Versão no `package.json` atualizada (opcional)
- [ ] Documentação atualizada (se necessário)
- [ ] Breaking changes documentadas (se MAJOR)
- [ ] Migration guide criado (se MAJOR)

---

## 🚫 O que NÃO Fazer

❌ **Não criar release sem CHANGELOG**
```bash
# Ruim
git tag v2.1.0
git push origin v2.1.0
```

❌ **Não usar versões sem 'v' prefix**
```bash
# Ruim
git tag 2.1.0

# Correto
git tag v2.1.0
```

❌ **Não pular versões**
```bash
# Ruim
v2.0.0 → v2.2.0 (pulou v2.1.0)

# Correto
v2.0.0 → v2.1.0 → v2.2.0
```

---

## 🔄 Rollback de Release

Se precisar reverter:

```bash
# 1. Deletar tag local
git tag -d vX.Y.Z

# 2. Deletar tag remota
git push origin :refs/tags/vX.Y.Z

# 3. Deletar release no GitHub UI
# GitHub → Releases → Release vX.Y.Z → Delete

# 4. Recriar com correções
git tag -a vX.Y.Z -m "Release vX.Y.Z (fixed)"
git push origin vX.Y.Z
```

---

## 📖 Recursos

- [Semantic Versioning](https://semver.org/lang/pt-BR/)
- [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/)
- [GitHub Releases](https://docs.github.com/pt/repositories/releasing-projects-on-github/about-releases)
- [Conventional Commits](https://www.conventionalcommits.org/pt-br/)

---

**Última atualização:** Fevereiro 2026
