# Build stage
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

# Instalar dependências (COM scripts para gerar Prisma Client)
RUN pnpm install --frozen-lockfile

# Build dos pacotes compartilhados
RUN pnpm --filter @mag-system/database build
RUN pnpm --filter @mag-system/shared-types build

# Build da API
RUN pnpm --filter @mag-system/api build

# Production stage
FROM node:20-alpine AS production

# Instalar wget para healthcheck
RUN apk add --no-cache wget

WORKDIR /app

# Copiar TUDO do builder (node_modules completo com Prisma Client gerado)
COPY --from=builder /app ./

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Mudar ownership dos arquivos
RUN chown -R nodejs:nodejs /app

USER nodejs

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main.js"]
