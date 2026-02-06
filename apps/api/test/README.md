# E2E Testing Guide

## 🎯 Objetivo

Testes End-to-End (E2E) validam a aplicação completa, incluindo banco de dados, autenticação e integrações.

---

## 🚀 Setup Inicial

### 1. **Criar Banco de Testes**

```bash
# Criar banco separado para testes
psql -U postgres
CREATE DATABASE mag_test;
\q
```

### 2. **Configurar Variáveis de Ambiente**

```bash
# Copiar exemplo
cp apps/api/.env.test.example apps/api/.env.test

# Editar com suas credenciais
nano apps/api/.env.test
```

**Conteúdo do `.env.test`:**
```env
DATABASE_URL="postgresql://postgres:senha@localhost:5432/mag_test"
JWT_SECRET="test-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3001
NODE_ENV="test"
```

### 3. **Aplicar Migrations**

```bash
# Usar DATABASE_URL do .env.test
export DATABASE_URL="postgresql://postgres:senha@localhost:5432/mag_test"

# Aplicar schema
pnpm --filter @mag-system/database prisma migrate deploy

# (Opcional) Popular dados iniciais
pnpm --filter @mag-system/database prisma db seed
```

### 4. **Instalar Dependências**

```bash
# Se ainda não instalou
pnpm install
```

---

## ▶️ Rodar Testes

### **Todos os E2E**
```bash
pnpm --filter @mag-system/api test:e2e
```

### **Suite Específica**
```bash
# Apenas Clients
pnpm --filter @mag-system/api test:e2e -- clients.e2e-spec.ts

# Apenas Rentals
pnpm --filter @mag-system/api test:e2e -- rentals.e2e-spec.ts
```

### **Com Coverage**
```bash
pnpm --filter @mag-system/api test:e2e -- --coverage
```

### **Watch Mode**
```bash
pnpm --filter @mag-system/api test:e2e -- --watch
```

### **Verbose (debugging)**
```bash
pnpm --filter @mag-system/api test:e2e -- --verbose
```

---

## 📝 Estrutura de Arquivos

```
apps/api/test/
├── jest-e2e.json          # Configuração Jest
├── README.md              # Este arquivo
├── clients.e2e-spec.ts    # Testes Clients
├── drivers.e2e-spec.ts    # Testes Drivers
├── vehicles.e2e-spec.ts   # Testes Vehicles
└── rentals.e2e-spec.ts    # Testes Rentals
```

---

## 🧰 Anatomia de um Teste E2E

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/database/prisma.service';

describe('Feature (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    // 1. Criar app de teste
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // 2. Obter instâncias
    prisma = app.get<PrismaService>(PrismaService);

    // 3. Limpar banco
    await prisma.entity.deleteMany();

    // 4. Autenticar
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'test@test.com', password: 'password' });
    
    authToken = response.body.access_token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /endpoint', () => {
    it('should do something', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/endpoint')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ data: 'value' })
        .expect(201);

      expect(response.body).toHaveProperty('id');
    });
  });
});
```

---

## 🐛 Debugging

### **Erro: Can't connect to database**
```bash
# Verificar se Postgres está rodando
pg_isready

# Verificar DATABASE_URL
echo $DATABASE_URL

# Testar conexão
psql $DATABASE_URL
```

### **Erro: Timeout**
```typescript
// Aumentar timeout no teste específico
it('slow test', async () => {
  // ...
}, 60000); // 60s
```

### **Erro: Port already in use**
```bash
# Matar processo na porta
lsof -ti:3001 | xargs kill -9

# Ou mudar porta no .env.test
PORT=3002
```

---

## ✅ Boas Práticas

1. **Isolar dados** - Cada teste deve limpar/criar seus próprios dados
2. **Usar transações** - Rollback após cada teste (opcional)
3. **Testar casos de erro** - Não apenas happy path
4. **Nomear descritivamente** - `should return 404 when client not found`
5. **Evitar dependências** - Testes não devem depender de ordem
6. **Usar factories** - Criar dados de teste reutilizáveis

---

## 📊 Coverage Esperado

- **Endpoints:** 100% (todos testados)
- **Status Codes:** 100% (200, 201, 400, 404, 409, 500)
- **Business Rules:** 100% (validações, cálculos)
- **Edge Cases:** 80%+ (limites, null, undefined)

---

## 🚀 CI/CD

**GitHub Actions** (futuro):
```yaml
name: E2E Tests
on: [pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
    steps:
      - uses: actions/checkout@v3
      - run: pnpm install
      - run: pnpm prisma migrate deploy
      - run: pnpm test:e2e
```

---

## 📚 Referências

- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest](https://github.com/ladjs/supertest)
- [Prisma Testing](https://www.prisma.io/docs/guides/testing/unit-testing)
