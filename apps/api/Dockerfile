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

# Desabilitar scripts prepare/postinstall (husky)
RUN pnpm install --frozen-lockfile --ignore-scripts

# Build dos pacotes compartilhados
RUN pnpm --filter @mag-system/database build
RUN pnpm --filter @mag-system/shared-types build

# Build da API
RUN pnpm --filter @mag-system/api build

# Production stage
FROM node:20-alpine AS production

# Instalar pnpm e wget (para healthcheck)
RUN npm install -g pnpm@8.15.9 && apk add --no-cache wget

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copiar pacotes compilados (incluindo Prisma Client gerado)
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/node_modules/.pnpm ./node_modules/.pnpm
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copiar API compilada
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Instalar apenas dependências de produção (sem scripts)
RUN pnpm install --prod --frozen-lockfile --ignore-scripts

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

# Mudar ownership dos arquivos
RUN chown -R nodejs:nodejs /app

USER nodejs

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main.js"]
