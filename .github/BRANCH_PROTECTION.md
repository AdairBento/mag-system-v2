# 🛡️ Configuração de Branch Protection

## Status Atual
⚠️ **Branch `main` está DESPROTEGIDO**

## Configuração Recomendada

Para habilitar proteções profissionais no GitHub:

### 1. Acesse Configurações
```
Repositório → Settings → Branches → Add branch protection rule
```

### 2. Configure as Regras

**Branch name pattern:** `main`

#### ✅ Proteções Obrigatórias

- [x] **Require a pull request before merging**
  - [x] Require approvals: `1`
  - [x] Dismiss stale pull request approvals when new commits are pushed
  - [x] Require review from Code Owners (opcional)

- [x] **Require status checks to pass before merging**
  - [x] Require branches to be up to date before merging
  - Status checks obrigatórios:
    - `CI` (GitHub Actions workflow)
    - `codecov/patch` (se configurado)
    - `codecov/project` (se configurado)

- [x] **Require conversation resolution before merging**

- [x] **Require linear history**
  - Força squash ou rebase (sem merge commits)

- [x] **Do not allow bypassing the above settings**
  - Nem administradores podem ignorar

#### 🔒 Proteções Adicionais (Recomendadas)

- [x] **Require deployments to succeed before merging** (para produção)
- [x] **Lock branch** (se quiser impedir pushes diretos)
- [ ] **Restrict who can push to matching branches** (opcional para equipes)

### 3. Salvar
Clique em **Create** ou **Save changes**

---

## 📋 Checklist de Configuração

- [ ] Branch protection rule criada para `main`
- [ ] Exigência de 1+ review habilitada
- [ ] Status checks do CI obrigatórios
- [ ] Linear history habilitado
- [ ] Administradores não podem bypass

---

## 🎯 Benefícios

✅ **Previne acidentes:** Ninguém (nem você) pode fazer push direto no `main`
✅ **Qualidade garantida:** CI deve passar antes de merge
✅ **Code review obrigatório:** Pelo menos 1 aprovação necessária
✅ **Histórico limpo:** Força squash/rebase para commits organizados
✅ **Padrão enterprise:** Segue melhores práticas de empresas de tecnologia

---

## 📖 Referências
- [GitHub Branch Protection](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
