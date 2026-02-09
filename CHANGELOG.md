# [2.2.0](https://github.com/AdairBento/mag-system-v2/compare/v2.1.5...v2.2.0) (2026-02-09)

### Bug Fixes

- **turbo:** remove test outputs to fix cache warning ([#29](https://github.com/AdairBento/mag-system-v2/issues/29)) ([3bbfca9](https://github.com/AdairBento/mag-system-v2/commit/3bbfca951fe19c1b04a84d8bccca81d9f4b49caf)), closes [#26](https://github.com/AdairBento/mag-system-v2/issues/26)

### Features

- **core:** add CnhValidator with full coverage ([#28](https://github.com/AdairBento/mag-system-v2/issues/28)) ([5beee24](https://github.com/AdairBento/mag-system-v2/commit/5beee242c69e6629d35330dec2fd4044bb34bca1)), closes [#13](https://github.com/AdairBento/mag-system-v2/issues/13) [#27](https://github.com/AdairBento/mag-system-v2/issues/27)

## [2.1.5](https://github.com/AdairBento/mag-system-v2/compare/v2.1.4...v2.1.5) (2026-02-08)

### Bug Fixes

- **lint:** remove deprecated ESLint 9 flags from core ([b0a5adb](https://github.com/AdairBento/mag-system-v2/commit/b0a5adbdd9ce87a1d0fdeac5b8d25d4215335511)), closes [mag-system/core#lint](https://github.com/mag-system/core/issues/lint)

## [2.1.4](https://github.com/AdairBento/mag-system-v2/compare/v2.1.3...v2.1.4) (2026-02-05)

### Bug Fixes

- **ci:** add @mag-system/shared-types to build step ([9d65ebb](https://github.com/AdairBento/mag-system-v2/commit/9d65ebb783835d1022a864fa960fe3e656c72301))

## [2.1.3](https://github.com/AdairBento/mag-system-v2/compare/v2.1.2...v2.1.3) (2026-02-05)

### Bug Fixes

- **ci:** add type-check script and build packages before validation ([2c3233e](https://github.com/AdairBento/mag-system-v2/commit/2c3233e915e4ea19a7ec4b9cf975d1d549781ee3))

## [2.1.2](https://github.com/AdairBento/mag-system-v2/compare/v2.1.1...v2.1.2) (2026-02-05)

### Bug Fixes

- **ci:** use 'pnpm exec prisma generate' instead of 'pnpm prisma generate' ([d537d40](https://github.com/AdairBento/mag-system-v2/commit/d537d407d494f9b6d33cfef83331cc3f2df3813c))

## [2.1.1](https://github.com/AdairBento/mag-system-v2/compare/v2.1.0...v2.1.1) (2026-02-05)

### Bug Fixes

- **ci:** use Node 22.14.0 and pnpm from packageManager ([5ee3b89](https://github.com/AdairBento/mag-system-v2/commit/5ee3b890b421afbc762819979b1bbcdc30da1499))

# [2.1.0](https://github.com/AdairBento/mag-system-v2/compare/v2.0.0...v2.1.0) (2026-02-05)

### Bug Fixes

- **ci:** remove pnpm version conflicts and upgrade to action-setup@v4 ([fbcaf54](https://github.com/AdairBento/mag-system-v2/commit/fbcaf54dab7b2c4fd5bbf7e4df2eda6e793bdf94))
- **ci:** upgrade pnpm/action-setup to v4 and use packageManager from package.json ([4e02347](https://github.com/AdairBento/mag-system-v2/commit/4e023475a3e73693671f5a23a180afebcbd57930))
- correct semantic-release configuration ([dc2b974](https://github.com/AdairBento/mag-system-v2/commit/dc2b974340059b00194accc467ccf4d84c16677e))
- **deps:** update all non-major dependencies ([#3](https://github.com/AdairBento/mag-system-v2/issues/3)) ([beed613](https://github.com/AdairBento/mag-system-v2/commit/beed6130cc2a96f65f41d4945a75c86f87d56ec6))

### Features

- add test file for semantic-release validation ([3ade3dd](https://github.com/AdairBento/mag-system-v2/commit/3ade3dd47324d8b0f258d59e02c7814805354734))

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
