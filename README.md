# 🚗 MAG System V2

[![CI](https://github.com/AdairBento/mag-system-v2/workflows/CI/badge.svg)](https://github.com/AdairBento/mag-system-v2/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node](https://img.shields.io/badge/node-20.x-green.svg)](package.json)
[![PNPM](https://img.shields.io/badge/pnpm-8.x-orange.svg)](package.json)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

**Sistema Profissional de Gestão de Locação de Veículos**

Monorepo moderno com NestJS (backend), Next.js (frontend) e Prisma (database).

---

## 🏗️ Arquitetura

\\\
mag-system-v2/
├── packages/ # Código compartilhado
│ ├── core/ # Validators, DTOs, Utils (56 componentes)
│ ├── database/ # Prisma ORM (22 models)
│ └── shared-types/ # TypeScript types
│
└── apps/
├── api/ # Backend NestJS (24 módulos)
└── web/ # Frontend Next.js (13 páginas)
\\\

---

## 🚀 Quick Start

\\\ash

# 1. Instalar dependências

pnpm install## 🚀 Quick Start

\\\ash

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

\\\

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
- Docker
- GitHub Actions

---

## 📚 Documentação

- [Roadmap](./ROADMAP.md) - Plano de desenvolvimento
- [Progresso Atual](./PROGRESSO_ATUAL.md) - Status atual
- [Core Package](./packages/core/README.md) - Documentação do core
- [Getting Started](./docs/development/getting-started.md) - Guia de início

---

## 🎯 Status Atual

**Completo (✅):**

- Packages (core, database, types)
- API estrutura base
- Auth + Clients modules
- Validações + DTOs

**Em Progresso (🔨):**

- Frontend Next.js
- Sidebar visual

**Próximo (📋):**

- Drivers, Vehicles, Rentals modules
- Desenvolvimento incremental

---

## 📝 License

MIT © 2026 MAG Locação
