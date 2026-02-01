# ================================
# Build Stage - Compilação
# ================================
FROM node:20-alpine AS builder

# Instalar pnpm
RUN npm install -g pnpm@8.15.9

WORKDIR /app

# Copiar arquivos de configuração do workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copiar pacotes compartilhados
COPY packages ./packages

# Copiar aplicação API
COPY apps/api ./apps/api

# Instalar TODAS as dependências (incluindo devDependencies)
# Isso permite que o Prisma Client seja gerado corretamente
RUN pnpm install --frozen-lockfile

# Build dos pacotes compartilhados
RUN pnpm --filter @mag-system/database build
RUN pnpm --filter @mag-system/shared-types build

# Build da API
RUN pnpm --filter @mag-system/api build

# ================================
# Production Stage - Otimizado
# ================================
FROM node:20-alpine AS production

# Instalar dependências do sistema necessárias
# - openssl: biblioteca SSL (versão 3)
# - openssl1.1-compat: compatibilidade com OpenSSL 1.1.x para Prisma
# - wget: para healthcheck
RUN apk add --no-cache openssl openssl1.1-compat wget

# Instalar pnpm
RUN npm install -g pnpm@8.15.9

WORKDIR /app

# Copiar configurações do workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copiar pacotes compilados (dist + package.json)
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/package.json ./packages/database/
COPY --from=builder /app/packages/shared-types/dist ./packages/shared-types/dist
COPY --from=builder /app/packages/shared-types/package.json ./packages/shared-types/

# Copiar API compilada
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/

# Copiar schema do Prisma (necessário para migrations em runtime)
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma

# Instalar APENAS dependências de produção (SEM scripts prepare/husky)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# CRÍTICO: Limpar binaries antigos e forçar regeneração com OpenSSL 1.1
RUN rm -rf ./node_modules/.prisma ./node_modules/@prisma/engines

# Gerar Prisma Client FORÇANDO binary nativo do Alpine com OpenSSL 1.1
ENV PRISMA_CLI_BINARY_TARGETS="linux-musl-openssl-1.1.x"
RUN pnpm --filter @mag-system/database exec prisma generate

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Mudar ownership dos arquivos
RUN chown -R nodejs:nodejs /app

# Usar usuário não-root
USER nodejs

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main.js"]
