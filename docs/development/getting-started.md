# 🚀 Getting Started

## Pré-requisitos

- Node.js 20+
- pnpm 8+
- PostgreSQL 14+
- Docker (opcional)

## Instalação

\\\ash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/mag-system-v2.git
cd mag-system-v2

# 2. Instale dependências
pnpm install

# 3. Configure variáveis de ambiente
cp .env.example .env
# Edite .env com suas credenciais

# 4. Setup database
pnpm db:migrate
pnpm db:seed

# 5. Inicie desenvolvimento
pnpm dev
\\\

## Acessos

- **API:** http://localhost:3001
- **Web:** http://localhost:3000
- **Swagger:** http://localhost:3001/api
- **Prisma Studio:** \pnpm db:studio\

## Estrutura

\\\
mag-system-v2/
├── apps/api/     # Backend NestJS
├── apps/web/     # Frontend Next.js
└── packages/     # Shared packages
\\\

## Próximos Passos

1. Leia [Architecture](../architecture/overview.md)
2. Veja [Coding Standards](./coding-standards.md)
3. Configure seu [Editor](./editor-setup.md)
