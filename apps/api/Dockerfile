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

# 🔥 FORÇAR development mode (garante devDependencies)
ENV NODE_ENV=development

# Copiar arquivos de configuração (melhor cache)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# 🐞 FIX: Usar .npmrc específico para Docker (evita symlinks quebrados do Windows)
COPY .npmrc.docker .npmrc

# Copiar package.json dos workspaces (TODOS os packages usados)
COPY apps/api/package.json ./apps/api/
COPY packages/core/package.json ./packages/core/
COPY packages/database/package.json ./packages/database/
COPY packages/shared-types/package.json ./packages/shared-types/

# Instalar TODAS dependências (NODE_ENV=development já garante devDeps)
RUN pnpm install --frozen-lockfile

# 🔍 DEBUG: Verificar se Prisma foi instalado
RUN echo "\n=== DEBUG: NODE_ENV ==="
RUN node -p "process.env.NODE_ENV"
RUN echo "\n=== DEBUG: Prisma binary location ==="
RUN ls -la /app/packages/database/node_modules/prisma/build/ 2>&1 || echo "❌ packages/database/node_modules/prisma NOT found"
RUN ls -la /app/node_modules/.pnpm/prisma*/node_modules/prisma/build/ 2>&1 | head -5 || echo "❌ .pnpm prisma NOT found"
RUN echo "\n=== END PRISMA DEBUG ===\n"

# Copiar código fonte completo
COPY . .

# Gerar Prisma Client usando npx (resolve binários automaticamente)
RUN npx prisma generate --schema=packages/database/prisma/schema.prisma

# 🔍 DEBUG: Verificar dependências do core ANTES do build
RUN echo "\n=== DEBUG: Core dependencies check ==="
RUN echo "Checking packages/core/node_modules:"
RUN ls -la /app/packages/core/node_modules/ 2>&1 | head -10 || echo "❌ packages/core/node_modules NOT found"
RUN echo "\nChecking if class-validator is installed:"
RUN test -d /app/packages/core/node_modules/class-validator && echo "✅ class-validator found" || echo "❌ class-validator NOT found"
RUN test -d /app/node_modules/.pnpm/node_modules/class-validator && echo "✅ class-validator in .pnpm" || echo "❌ class-validator NOT in .pnpm"
RUN echo "\nChecking if zod is installed:"
RUN test -d /app/packages/core/node_modules/zod && echo "✅ zod found" || echo "❌ zod NOT found"
RUN test -d /app/node_modules/.pnpm/node_modules/zod && echo "✅ zod in .pnpm" || echo "❌ zod NOT in .pnpm"
RUN echo "\nChecking if date-fns is installed:"
RUN test -d /app/packages/core/node_modules/date-fns && echo "✅ date-fns found" || echo "❌ date-fns NOT found"
RUN test -d /app/node_modules/.pnpm/node_modules/date-fns && echo "✅ date-fns in .pnpm" || echo "❌ date-fns NOT in .pnpm"
RUN echo "\n=== END CORE DEPS DEBUG ===\n"

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
