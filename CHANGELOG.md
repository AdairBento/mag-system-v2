## [2.1.1](https://github.com/AdairBento/mag-system-v2/compare/v2.1.0...v2.1.1) (2026-02-05)


### Bug Fixes

* **ci:** use Node 22.14.0 and pnpm from packageManager ([5ee3b89](https://github.com/AdairBento/mag-system-v2/commit/5ee3b890b421afbc762819979b1bbcdc30da1499))

# [2.1.0](https://github.com/AdairBento/mag-system-v2/compare/v2.0.0...v2.1.0) (2026-02-05)


### Bug Fixes

* **ci:** remove pnpm version conflicts and upgrade to action-setup@v4 ([fbcaf54](https://github.com/AdairBento/mag-system-v2/commit/fbcaf54dab7b2c4fd5bbf7e4df2eda6e793bdf94))
* **ci:** upgrade pnpm/action-setup to v4 and use packageManager from package.json ([4e02347](https://github.com/AdairBento/mag-system-v2/commit/4e023475a3e73693671f5a23a180afebcbd57930))
* correct semantic-release configuration ([dc2b974](https://github.com/AdairBento/mag-system-v2/commit/dc2b974340059b00194accc467ccf4d84c16677e))
* **deps:** update all non-major dependencies ([#3](https://github.com/AdairBento/mag-system-v2/issues/3)) ([beed613](https://github.com/AdairBento/mag-system-v2/commit/beed6130cc2a96f65f41d4945a75c86f87d56ec6))


### Features

* add test file for semantic-release validation ([3ade3dd](https://github.com/AdairBento/mag-system-v2/commit/3ade3dd47324d8b0f258d59e02c7814805354734))

# [2.0.0](https://github.com/AdairBento/mag-system-v2/compare/v1.0.0-beta.1...v2.0.0) (2026-02-05)

# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

## [Unreleased]

### Planejado

- E2E tests com Playwright
- Módulos de Drivers e Vehicles
- Dashboard com gráficos
- Sistema de notificações

---

## [2.0.0] - 2026-02-04

### ✨ Added (Novidades)

#### Infraestrutura Profissional

- 🔄 **CI/CD Completo**: Pipeline com 5 jobs paralelos (lint, type-check, test, build, quality-gate)
- 🤖 **Renovate Bot**: Automação de updates de dependências
- 📈 **Codecov Integration**: Cobertura de testes automática
- 🚀 **Release Workflow**: Automação de releases via tags

#### Documentação

- 🤝 **CONTRIBUTING.md**: Guia completo de contribuição (workflow, commits, testes)
- 🛡️ **SECURITY.md**: Política de segurança com processo de reporte
- 📝 **CHANGELOG.md**: Histórico de versões
- 🔒 **Branch Protection Guide**: Instruções para configurar proteções

#### Templates GitHub

- 🐛 **Bug Report Template**: Estrutura para reportar bugs
- ✨ **Feature Request Template**: Template para novas funcionalidades
- 🔄 **Pull Request Template**: Checklist profissional para PRs

#### Backend (NestJS)

- ✅ **Auth Module**: JWT authentication com refresh tokens
- ✅ **Clients Module**: CRUD completo de clientes (PF/PJ)
- ✅ **User Module**: Gestão de usuários do sistema
- 📚 **Swagger/OpenAPI**: Documentação automática da API
- 🛡️ **Security**: Helmet, CORS, Rate Limiting

#### Packages (@mag-system)

- 📦 **@mag-system/core**: 56 componentes (validators, DTOs, utils, errors)
  - 15 Validators Zod
  - 24 DTOs
  - 17 Utils (CPF, CNPJ, dates, money)
  - 7 Custom Errors
- 💾 **@mag-system/database**: 22 Prisma models
  - User, Client, Driver, Vehicle
  - Rental, Inspection, Payment
  - Migrations versionadas
  - Seed data com Faker
- 📘 **@mag-system/shared-types**: TypeScript types compartilhados

#### Frontend (Next.js 14)

- 🎨 **AppShell Layout**: Layout responsivo com sidebar
- 📄 **Dashboard Page**: Página inicial do sistema
- 🧱 **Navigation System**: Menu lateral estruturado
- 📱 **Mobile Menu**: TopBar com menu responsivo
- 🎨 **shadcn/ui**: Componentes UI profissionais

### 🔨 Changed (Mudanças)

- 📝 **README.md**: Adicionados 10 badges profissionais
- ⬆️ **Dependencies**: Atualização para versões mais recentes
- 📁 **Project Structure**: Organização em monorepo com Turborepo

### 🔧 Fixed (Correções)

- ✅ **CI Jobs**: Corrigidos workflows que falhavam
- 🔵 **Prisma Generate**: Adicionado em todos os workflows
- 📝 **Type Safety**: Correções de tipos TypeScript

### 🛡️ Security (Segurança)

- 🔐 **JWT**: Implementação segura de autenticação
- 🛡️ **Input Validation**: Zod em todas as entradas
- 🔒 **Environment Variables**: Gestão segura de secrets
- 🚫 **SQL Injection Protection**: Via Prisma ORM

### 📊 Technical Details

**Stack:**

- Backend: NestJS 10.x + Prisma ORM + PostgreSQL 14+
- Frontend: Next.js 14.x + React Query + Tailwind CSS
- DevOps: Turborepo + pnpm + Docker + GitHub Actions
- Testing: Jest + Supertest + Codecov

**Metrics:**

- 24 Módulos NestJS
- 22 Prisma Models
- 13 Páginas Next.js
- 56 Componentes Core
- 135+ Commits
- 314 Arquivos

---

## [1.0.0] - 2025-12-15

### ✨ Added

- 🏁 Versão inicial do projeto
- 📚 Setup básico do monorepo
- ⚙️ Configuração de Turborepo
- 💾 Database schema inicial

---

## Tipos de Mudanças

- **Added**: Novas funcionalidades
- **Changed**: Mudanças em funcionalidades existentes
- **Deprecated**: Funcionalidades que serão removidas
- **Removed**: Funcionalidades removidas
- **Fixed**: Correções de bugs
- **Security**: Correções de vulnerabilidades

---

[Unreleased]: https://github.com/AdairBento/mag-system-v2/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/AdairBento/mag-system-v2/compare/v1.0.0...v2.0.0
[1.0.0]: https://github.com/AdairBento/mag-system-v2/releases/tag/v1.0.0
