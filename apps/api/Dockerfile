# ================================
# Base - Debian Bookworm Slim
# ================================
FROM node:20-bookworm-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    wget \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@8.15.9 --activate

# ================================
# Build - Compilação
# ================================
FROM base AS build

# Copiar arquivos de configuração (melhor cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copiar package.json dos workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/

# Instalar TODAS dependências (incluindo devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar código fonte completo
COPY . .

# Gerar Prisma Client
RUN pnpm --filter @mag-system/database exec prisma generate

# Build EXPLÍCITO das dependências (ordem correta)
RUN pnpm --filter @mag-system/shared-types build
RUN pnpm --filter @mag-system/database build

# Build da API com cadeia topológica
RUN pnpm --filter @mag-system/api... build

# Deploy production bundle isolado
RUN pnpm --filter @mag-system/api deploy --prod /out

# Sanity checks - garantem que bundle está correto
RUN test -f /out/dist/main.js || (echo "ERROR: /out/dist/main.js not found!" && exit 1)
RUN test -f /out/node_modules/@mag-system/database/dist/index.js || (echo "ERROR: database dist missing in bundle!" && exit 1)

# ================================
# Runtime - Produção
# ================================
FROM node:20-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    wget \
  && rm -rf /var/lib/apt/lists/*

# Copiar bundle completo (node_modules prod + dist + Prisma Client)
COPY --from=build /out/ ./

# Criar usuário não-root
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
