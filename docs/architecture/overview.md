# 🏗️ Architecture Overview

## Monorepo Structure

MAG System v2 usa monorepo com Turborepo para máxima produtividade.

### Apps

- **apps/api**: NestJS backend (REST API)
- **apps/web**: Next.js frontend (App Router)

### Packages

- **@mag-system/database**: Prisma + PostgreSQL
- **@mag-system/shared-types**: TypeScript types compartilhados
- **@mag-system/eslint-config**: Configuração ESLint
- **@mag-system/typescript-config**: Configuração TypeScript

## Tech Stack

### Backend (NestJS)
- NestJS 10
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Swagger/OpenAPI
- Redis (cache)
- Bull (queues)

### Frontend (Next.js)
- Next.js 14 (App Router)
- React 18
- React Query (TanStack Query)
- Tailwind CSS
- shadcn/ui
- Zod (validation)

### DevOps
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- Husky (Git hooks)
- Commitlint
- Prettier & ESLint

## Design Patterns

- **Backend**: MVC + Service Layer + Repository Pattern
- **Frontend**: Feature-based architecture + Hooks
- **Types**: Single source of truth (shared-types package)

## Key Principles

1. **Type Safety First**: TypeScript everywhere
2. **DRY**: Shared code em packages
3. **Separation of Concerns**: Apps independentes
4. **Convention over Configuration**: Padrões consistentes
5. **Performance**: React Query + Redis cache
