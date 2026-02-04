# 🚗 MAG System V2

[![CI](https://github.com/AdairBento/mag-system-v2/workflows/CI/badge.svg)](https://github.com/AdairBento/mag-system-v2/actions)
[![codecov](https://codecov.io/gh/AdairBento/mag-system-v2/branch/main/graph/badge.svg)](https://codecov.io/gh/AdairBento/mag-system-v2)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?logo=typescript)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-20.x-green.svg?logo=node.js)](package.json)
[![PNPM](https://img.shields.io/badge/pnpm-8.x-orange.svg?logo=pnpm)](package.json)
[![NestJS](https://img.shields.io/badge/NestJS-10.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.x-000000?logo=next.js)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)

**Sistema Profissional de Gestão de Locação de Veículos**

Monorepo moderno com NestJS (backend), Next.js (frontend) e Prisma (database).

---

## 🏗️ Arquitetura

```
mag-system-v2/
├── packages/          # Código compartilhado
│   ├── core/          # Validators, DTOs, Utils (56 componentes)
│   ├── database/      # Prisma ORM (22 models)
│   └── shared-types/  # TypeScript types
│
└── apps/
    ├── api/           # Backend NestJS (24 módulos)
    └── web/           # Frontend Next.js (13 páginas)
```

---

## 🚀 Quick Start

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar database
cp .env.example .env
# Edite .env com suas credenciais PostgreSQL

# 3. Rodar migrations
pnpm db:migrate

# 4. (Opcional) Popular database
pnpm db:seed

# 5. Iniciar desenvolvimento
pnpm dev
# API: http://localhost:3001
# Web: http://localhost:3000
```

---

## 📦 Packages

### @mag-system/core

Lógica de negócio compartilhada:

- **Validators**: 15 schemas Zod
- **DTOs**: 24 interfaces
- **Utils**: 17 funções (CPF, CNPJ, dates, money)
- **Errors**: 7 classes customizadas
- **Constants**: Regras de negócio

### @mag-system/database

Prisma ORM com PostgreSQL:

- 22 models (User, Client, Driver, Vehicle, Rental, etc)
- Migrations versionadas
- Seed data com faker

---

## 🛠️ Stack Tecnológica

**Backend:**

- NestJS 10
- Prisma ORM
- PostgreSQL 14+
- JWT Authentication
- Swagger/OpenAPI

**Frontend:**

- Next.js 14 (App Router)
- React Query
- Tailwind CSS
- shadcn/ui
- Zod validation

**DevOps:**

- Turborepo (monorepo)
- pnpm (package manager)
- Docker + Docker Compose
- GitHub Actions (CI/CD)
- Renovate (auto-updates)

---

## 📚 Documentação

- [🤝 Contributing Guide](./CONTRIBUTING.md) - Como contribuir
- [🛣️ Roadmap](./ROADMAP.md) - Plano de desenvolvimento
- [📈 Progresso Atual](./PROGRESSO_ATUAL.md) - Status atual
- [📦 Core Package](./packages/core/README.md) - Documentação do core
- [🚀 Getting Started](./docs/development/getting-started.md) - Guia de início
- [🛡️ Branch Protection](/.github/BRANCH_PROTECTION.md) - Configuração de segurança

---

## 🎯 Status Atual

**Completo (✅):**

- Packages (core, database, types)
- API estrutura base
- Auth + Clients modules
- Validações + DTOs
- CI/CD pipeline
- Templates profissionais

**Em Progresso (🔨):**

- Frontend Next.js
- Dashboard e layouts

**Próximo (📋):**

- Drivers, Vehicles, Rentals modules
- E2E tests
- Desenvolvimento incremental

---

## 🧪 Testes

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E tests (API)
pnpm test:e2e
```

**Coverage atual:** Integrado com [Codecov](https://codecov.io/gh/AdairBento/mag-system-v2)

---

## 🐛 Reportar Bugs

Encontrou um bug? [Abra uma issue](https://github.com/AdairBento/mag-system-v2/issues/new/choose) usando nosso template.

---

## 📝 License

MIT © 2026 MAG Locação

---

## ⭐ Star History

Se este projeto te ajudou, considere dar uma ⭐!

[![Star History Chart](https://api.star-history.com/svg?repos=AdairBento/mag-system-v2&type=Date)](https://star-history.com/#AdairBento/mag-system-v2&Date)
