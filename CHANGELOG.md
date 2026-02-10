# [2.4.0](https://github.com/AdairBento/mag-system-v2/compare/v2.3.0...v2.4.0) (2026-02-10)

### Bug Fixes

- **clients:** implementar filtros completos no findAll() ([2c68195](https://github.com/AdairBento/mag-system-v2/commit/2c68195f95c490f822a5e8c8c27551d4f36b2f0f))
- **clients:** padronizar verbo HTTP para PATCH no update ([b92a7b9](https://github.com/AdairBento/mag-system-v2/commit/b92a7b9f219a5bb79648a75fa98997454b21deda))
- corrigir tipo do clientId no create do driver ([22b9191](https://github.com/AdairBento/mag-system-v2/commit/22b91911447089f8526efef64fe005aad8ba59a4))
- **lint:** remover try/catch desnecessário ([ddd561e](https://github.com/AdairBento/mag-system-v2/commit/ddd561e76dc94c82e58d88d27b442debf9302490))
- tornar email obrigatório no CreateDriverDto ([35a4bb7](https://github.com/AdairBento/mag-system-v2/commit/35a4bb7b6335d3b63427283d2803c5d86f72eca1))
- **types:** corrigir retorno do onSubmit para Promise<void> ([eb882b8](https://github.com/AdairBento/mag-system-v2/commit/eb882b8db7b370922d502dfb64ff0d29848dcaf5))
- **types:** descartar retorno do mutateAsync explicitamente ([de25d3d](https://github.com/AdairBento/mag-system-v2/commit/de25d3d348108e6bd88a2136ee877e18ae7532ed))
- **types:** tornar email obrigatório em Driver ([efb8202](https://github.com/AdairBento/mag-system-v2/commit/efb820213224e407a302078f0e055251243da0e3))
- **web:** filtrar clientes com id válido antes de passar ao modal ([bd5c9e8](https://github.com/AdairBento/mag-system-v2/commit/bd5c9e8cef7267c0d1cf56d864edca49567fc02c))
- **web:** normalizar status de motorista e corrigir tipos ([f1c4423](https://github.com/AdairBento/mag-system-v2/commit/f1c44235fd936453994dbac2e54212bd160bc94a))

### Features

- adicionar cliente HTTP para comunicação com API ([b34a49f](https://github.com/AdairBento/mag-system-v2/commit/b34a49f5d56177f5a324affcb4f07479c1bfebd8))
- adicionar DTOs de cliente ([848beb1](https://github.com/AdairBento/mag-system-v2/commit/848beb1771826a35f84e7399b9fad939f8d0e132))
- adicionar DTOs de motorista ([3dbaa40](https://github.com/AdairBento/mag-system-v2/commit/3dbaa40eb21ffca27efdbfdc57a15e80803842c8))
- adicionar endpoint POST /drivers/:id/migrate para migração de motoristas ([57aea6e](https://github.com/AdairBento/mag-system-v2/commit/57aea6ecd72ed9888e1f8956a9bff7daa2b2e1af))
- adicionar filtros search e clientId no FilterDriverDto ([73a8da6](https://github.com/AdairBento/mag-system-v2/commit/73a8da6738eedce619354f3c174eaa08747fa0ec))
- adicionar funções de máscara para CPF, CNPJ e telefone ([20a4425](https://github.com/AdairBento/mag-system-v2/commit/20a44254bd2b270784bda69022d85f21d818f7c2))
- adicionar helper para tratamento de erros da API ([7017c6a](https://github.com/AdairBento/mag-system-v2/commit/7017c6a046a7cda03d4a078cec2a8652ce0f90b1))
- adicionar lógica de migração de motoristas entre clientes ([2818b63](https://github.com/AdairBento/mag-system-v2/commit/2818b630ae92e7e12743de4a0b25831c2d3b7b5f))
- adicionar modal de formulário de cliente ([0bea6e6](https://github.com/AdairBento/mag-system-v2/commit/0bea6e65f218f017a2fb2d7c452e710afabba7d7))
- adicionar modal de motorista com sistema de migração entre clientes ([a556e07](https://github.com/AdairBento/mag-system-v2/commit/a556e07040d0277e316f899a638f572562b1c564))
- adicionar tipos de Cliente ([5439850](https://github.com/AdairBento/mag-system-v2/commit/5439850ff8416bf41c5c5f5c76ff8efe60c26557))
- adicionar tipos de Motorista ([a07114d](https://github.com/AdairBento/mag-system-v2/commit/a07114d66dfc4469fc4f2a012798bf9d3a8af713))
- adicionar UpdateClientDto ([772486b](https://github.com/AdairBento/mag-system-v2/commit/772486bb747e9d1b20341ae5a9792f9d3346adbc))
- adicionar UpdateDriverDto ([2425af5](https://github.com/AdairBento/mag-system-v2/commit/2425af5bffb870b2301c5705e16ce5ee3f33bf1b))
- **api:** adicionar graceful shutdown + detecção de porta ocupada ([9aaa132](https://github.com/AdairBento/mag-system-v2/commit/9aaa132647cc70c9ef420afba11e59af928785c0))
- criar página de clientes e motoristas com sistema de tabs completo ([9e96f11](https://github.com/AdairBento/mag-system-v2/commit/9e96f11a2c8a731ac57b55aecb2f3119b0f58d37))
- **database:** adiciona relacionamento Driver -> Client e campos compatíveis com MAG-system-webapp ([d910029](https://github.com/AdairBento/mag-system-v2/commit/d910029ee9a7663bc0edcfb5157c4209d016d67d))
- **infra:** auditoria enterprise + dev-doctor.ps1 + correções de boot ([4e4f4e0](https://github.com/AdairBento/mag-system-v2/commit/4e4f4e080b5309b6c09ebdf9df27fad2d638f01e))
- **web:** add QueryClientProvider for React Query ([5e0afaa](https://github.com/AdairBento/mag-system-v2/commit/5e0afaa9d02d118381ffd5120798a67e47ac3d73))
- **web:** wrap app with QueryProvider ([3bbaec9](https://github.com/AdairBento/mag-system-v2/commit/3bbaec9b19cdf83c054645b53b0de05297d9ce4c))

# [2.3.0](https://github.com/AdairBento/mag-system-v2/compare/v2.2.0...v2.3.0) (2026-02-09)

### Bug Fixes

- **eslint-config:** remove duplicate [@typescript-eslint](https://github.com/typescript-eslint) declarations ([#32](https://github.com/AdairBento/mag-system-v2/issues/32)) ([7af5ee6](https://github.com/AdairBento/mag-system-v2/commit/7af5ee603fcb766d7c76dfaadd3f3970409eb023))
- upgrade packages to ESLint 9 and [@typescript-eslint](https://github.com/typescript-eslint) v8 ([#30](https://github.com/AdairBento/mag-system-v2/issues/30)) ([daae6c6](https://github.com/AdairBento/mag-system-v2/commit/daae6c68c2e1618a7ecf9d8757b791013816c855))

### Features

- **core:** add CpfValidator with full coverage ([#33](https://github.com/AdairBento/mag-system-v2/issues/33)) ([6134926](https://github.com/AdairBento/mag-system-v2/commit/6134926c01d8f9d69fb97e4597ab2aae5291a2b2))

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
