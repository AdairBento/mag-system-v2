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

# Instalar todas as dependências
RUN pnpm install --frozen-lockfile

# Build dos pacotes compartilhados
RUN pnpm --filter @mag-system/database build
RUN pnpm --filter @mag-system/shared-types build

# Build da API
RUN pnpm --filter @mag-system/api build

# Production stage
FROM node:20-alpine AS production

# Instalar pnpm
RUN npm install -g pnpm@8.15.9

WORKDIR /app

# Copiar arquivos de configuração
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copiar pacotes necessários
COPY --from=builder /app/packages ./packages
COPY --from=builder /app/apps/api/package.json ./apps/api/
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

# Instalar apenas dependências de produção
RUN pnpm install --prod --frozen-lockfile

# Criar usuário não-root
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

WORKDIR /app/apps/api

EXPOSE 3001

CMD ["node", "dist/main.js"]
