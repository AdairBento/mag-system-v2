# ================================
# Base - Debian Bookworm Slim
# ================================
FROM node:22-bookworm-slim AS base
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    openssl \
    wget \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.28.2 --activate

# ================================
# Dependencies - Instalar deps
# ================================
FROM base AS dependencies

# Forçar development mode (garante devDependencies para build)
ENV NODE_ENV=development

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./
COPY .npmrc.docker .npmrc

# Copiar package.json dos workspaces
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/

# Instalar TODAS dependências (dev + prod)
RUN pnpm install --frozen-lockfile

# ================================
# Build - Compilação
# ================================
FROM dependencies AS build

# Copiar código fonte completo
COPY . .

# Gerar Prisma Client
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# Build dos workspaces em ordem
RUN pnpm --filter @mag-system/shared-types build
RUN pnpm --filter @mag-system/database build
RUN pnpm --filter @mag-system/core build
RUN pnpm --filter @mag-system/api build

# ================================
# Runtime - Produção
# ================================
FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copiar TODOS os node_modules do build (inclui tudo que precisamos)
COPY --from=build /app/node_modules ./node_modules

# Copiar código compilado da API
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/package.json ./package.json

# Copiar workspaces compilados para node_modules
COPY --from=build /app/packages/core/dist ./node_modules/@mag-system/core/dist
COPY --from=build /app/packages/core/package.json ./node_modules/@mag-system/core/

COPY --from=build /app/packages/database/dist ./node_modules/@mag-system/database/dist
COPY --from=build /app/packages/database/package.json ./node_modules/@mag-system/database/
COPY --from=build /app/packages/database/prisma ./node_modules/@mag-system/database/prisma

COPY --from=build /app/packages/shared-types/dist ./node_modules/@mag-system/shared-types/dist
COPY --from=build /app/packages/shared-types/package.json ./node_modules/@mag-system/shared-types/

# Criar usuário não-root
RUN groupadd -r nodejs && useradd -r -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

CMD ["node", "dist/main.js"]
