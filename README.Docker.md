# 🐳 Docker Setup - MAG System

## 🚀 Quick Start

### 1️⃣ Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+

### 2️⃣ Build e Inicialização

```bash
# Clone o repositório
git clone https://github.com/AdairBento/mag-system-v2.git
cd mag-system-v2

# Criar arquivo .env (copie do .env.example)
cp .env.example .env

# Build e iniciar todos os serviços
docker-compose up --build
```

### 3️⃣ Acessar os Serviços

- **API**: http://localhost:3001
- **Swagger Docs**: http://localhost:3001/api/docs
- **Health Check**: http://localhost:3001/api/health
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

## 🛠️ Comandos Úteis

### Iniciar serviços

```bash
# Iniciar todos os serviços
docker-compose up

# Iniciar em background (detached)
docker-compose up -d

# Rebuild e iniciar
docker-compose up --build

# Iniciar apenas alguns serviços
docker-compose up postgres redis
```

### Parar serviços

```bash
# Parar todos os serviços
docker-compose down

# Parar e remover volumes (limpa dados)
docker-compose down -v

# Parar mas manter containers
docker-compose stop
```

### Logs e Debugging

```bash
# Ver logs de todos os serviços
docker-compose logs

# Ver logs da API
docker-compose logs api

# Seguir logs em tempo real
docker-compose logs -f api

# Ver logs das últimas 100 linhas
docker-compose logs --tail=100 api
```

### Execução de Comandos

```bash
# Entrar no container da API
docker-compose exec api sh

# Executar migrations
docker-compose exec api pnpm db:migrate

# Gerar Prisma Client
docker-compose exec api pnpm db:generate

# Rodar seeds
docker-compose exec api pnpm db:seed
```

### Limpeza e Manutenção

```bash
# Remover containers, networks, volumes e imagens
docker-compose down -v --rmi all

# Limpar cache do Docker
docker system prune -a

# Ver uso de espaço
docker system df
```

## 📊 Monitoramento

### Verificar Status dos Serviços

```bash
# Status de todos os containers
docker-compose ps

# Estatísticas de uso (CPU, Memória, etc)
docker stats

# Health check da API
curl http://localhost:3001/api/health
```

### Verificar Saúde dos Serviços

```bash
# PostgreSQL
docker-compose exec postgres pg_isready -U mag_user

# Redis
docker-compose exec redis redis-cli ping
```

## 🐛 Troubleshooting

### API não inicia

1. Verificar logs: `docker-compose logs api`
2. Verificar se PostgreSQL está pronto: `docker-compose ps postgres`
3. Rebuild: `docker-compose up --build api`

### Erro de conexão com banco

```bash
# Verificar se o banco está rodando
docker-compose ps postgres

# Verificar logs do banco
docker-compose logs postgres

# Reiniciar banco
docker-compose restart postgres
```

### Porta já em uso

```bash
# Verificar processos usando a porta
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Parar o processo ou mudar a porta no docker-compose.yml
```

### Limpar tudo e começar do zero

```bash
# ATENÇÃO: Isso remove TODOS os dados!
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## 📝 Estrutura dos Containers

### PostgreSQL (mag-system-db)
- **Image**: postgres:16-alpine
- **Port**: 5432
- **Volume**: postgres_data
- **User**: mag_user
- **Database**: mag_system

### Redis (mag-system-redis)
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volume**: redis_data

### API (mag-system-api)
- **Build**: apps/api/Dockerfile
- **Port**: 3001
- **Healthcheck**: /api/health
- **Depends on**: postgres, redis

## 🔐 Variáveis de Ambiente

Crie um arquivo `.env` na raiz com:

```env
# Database
DATABASE_URL=postgresql://mag_user:mag_password@postgres:5432/mag_system

# Redis
REDIS_URL=redis://redis:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Node
NODE_ENV=production
PORT=3001
```

## 🚀 Deploy em Produção

### Recomendações

1. **Alterar credenciais padrão**
2. **Usar secrets do Docker** para senhas
3. **Configurar backup** dos volumes
4. **Usar reverse proxy** (Nginx/Traefik)
5. **Configurar SSL/TLS**
6. **Monitoramento** com Prometheus/Grafana

### Exemplo de Produção

```bash
# Build para produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Verificar saúde
docker-compose ps
docker-compose logs -f api
```

## ✅ Checklist de Deploy

- [ ] Alterar senha do PostgreSQL
- [ ] Alterar JWT_SECRET
- [ ] Configurar backups automáticos
- [ ] Configurar monitoramento
- [ ] Configurar logs externos
- [ ] Testar health checks
- [ ] Documentar URLs de produção
- [ ] Configurar CI/CD

## 📚 Recursos Adicionais

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Redis Docker Hub](https://hub.docker.com/_/redis)
