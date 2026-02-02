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

# Copiar package.json dos workspaces (TODOS os packages usados)
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/

# Instalar TODAS dependências (incluindo devDependencies)
RUN pnpm install --frozen-lockfile

# Copiar código fonte completo
COPY . .

# Gerar Prisma Client usando pnpm exec (PATH correto no workspace)
RUN pnpm --filter @mag-system/database exec prisma generate --schema=./prisma/schema.prisma

# Build EXPLÍCITO das dependências (ordem correta)
RUN pnpm --filter @mag-system/shared-types build
RUN pnpm --filter @mag-system/database build
RUN pnpm --filter @mag-system/core build

# ================================
# 🔍 DEBUG: Verificar workspace links ANTES do nest build
# ================================
RUN echo "\n=== DEBUG: Checking @mag-system/core resolution ==="
RUN node -p "require.resolve('@mag-system/core/package.json')" || echo "❌ FAIL: core NOT resolvable"
RUN echo "\n=== DEBUG: Core package.json ==="
RUN node -p "JSON.stringify(require('@mag-system/core/package.json'), null, 2)" || echo "❌ FAIL: can't read core package.json"
RUN echo "\n=== DEBUG: node_modules/@mag-system structure ==="
RUN ls -la node_modules/@mag-system/ || echo "❌ FAIL: @mag-system not found"
RUN echo "\n=== DEBUG: node_modules/@mag-system/core ==="
RUN ls -la node_modules/@mag-system/core/ || echo "❌ FAIL: core not found"
RUN echo "\n=== DEBUG: packages/core/dist ==="
RUN ls -la packages/core/dist/ || echo "❌ FAIL: packages/core/dist not found"
RUN echo "\n=== DEBUG: Check if dist/index.d.ts exists ==="
RUN test -f packages/core/dist/index.d.ts && echo "✅ OK: index.d.ts exists" || echo "❌ FAIL: index.d.ts NOT found"
RUN echo "\n=== END DEBUG ===\n"

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
