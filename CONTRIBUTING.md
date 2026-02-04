# 🤝 Guia de Contribuição - MAG System V2

Obrigado pelo interesse em contribuir! Este documento contém diretrizes para contribuir com o projeto.

## 📜 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Contribuir](#como-contribuir)
3. [Padrões de Commits](#padrões-de-commits)
4. [Workflow de Desenvolvimento](#workflow-de-desenvolvimento)
5. [Padrões de Código](#padrões-de-código)
6. [Testes](#testes)

---

## 🤝 Código de Conduta

Este projeto adota padrões profissionais de conduta:

- ✅ Seja respeitoso e construtivo
- ✅ Foque no problema, não na pessoa
- ✅ Aceite críticas construtivas
- ❌ Zero tolerância com assédio ou discriminação

---

## 👨‍💻 Como Contribuir

### 1. Fork e Clone

```bash
# Fork via GitHub UI, depois:
git clone https://github.com/seu-usuario/mag-system-v2.git
cd mag-system-v2
pnpm install
```

### 2. Crie uma Branch

```bash
git checkout -b tipo/descricao-curta
```

**Exemplos:**
- `feat/driver-module`
- `fix/cpf-validation`
- `refactor/auth-service`
- `docs/api-documentation`

### 3. Faça suas Mudanças

Siga os [Padrões de Código](#padrões-de-código) e adicione [Testes](#testes).

### 4. Commit

```bash
git add .
git commit -m "feat(api): add driver CRUD endpoints"
```

Veja [Padrões de Commits](#padrões-de-commits).

### 5. Push e Pull Request

```bash
git push origin sua-branch
```

Abra um PR no GitHub usando o [template de PR](.github/pull_request_template.md).

---

## 📝 Padrões de Commits

### Conventional Commits

Usamos [Conventional Commits](https://www.conventionalcommits.org/) com `commitlint`:

```
tipo(escopo): descrição curta

[corpo opcional]

[footer opcional]
```

### Tipos Permitidos

| Tipo | Descrição | Exemplo |
|------|------------|----------|
| `feat` | Nova funcionalidade | `feat(api): add rental endpoints` |
| `fix` | Correção de bug | `fix(core): validate CNPJ format` |
| `refactor` | Refatoração | `refactor(web): extract sidebar component` |
| `docs` | Documentação | `docs: update README with setup steps` |
| `test` | Testes | `test(api): add auth integration tests` |
| `chore` | Manutenção | `chore: update dependencies` |
| `ci` | CI/CD | `ci: add codecov integration` |
| `perf` | Performance | `perf(api): optimize query with index` |
| `style` | Formatação | `style: format with prettier` |

### Escopos Comuns

- `api` - Backend NestJS
- `web` - Frontend Next.js
- `core` - Package core
- `database` - Package database
- `ci` - GitHub Actions

### Exemplos

✅ **Bom:**
```bash
feat(api): implement driver CRUD operations
fix(core): correct CPF validation regex
refactor(web): extract rental form component
docs: add Docker setup instructions
```

❌ **Ruim:**
```bash
added stuff
fixed bug
update
WIP
```

---

## 🔄 Workflow de Desenvolvimento

### Setup Local

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar .env
cp .env.example .env
# Edite .env com suas credenciais

# 3. Subir database (Docker)
docker-compose up -d postgres

# 4. Migrations
pnpm db:migrate
pnpm db:seed

# 5. Desenvolvimento
pnpm dev
# API: http://localhost:3001
# Web: http://localhost:3000
```

### Branch Strategy

- **`main`**: Branch principal (protegida)
- **Feature branches**: `feat/*`, `fix/*`, etc.

```bash
main
  └─ feat/driver-module
  └─ fix/auth-bug
  └─ refactor/rental-service
```

### Pull Request Workflow

1. **Crie branch** a partir de `main`
2. **Desenvolva** e commite com convenção
3. **Push** para seu fork
4. **Abra PR** para `main`
5. **CI deve passar** (lint, tests, build)
6. **Aguarde review** (1+ aprovação)
7. **Merge** via squash

---

## 📐 Padrões de Código

### TypeScript

- ✅ **Strict mode** habilitado
- ✅ Sem `any` (use `unknown` se necessário)
- ✅ Prefer `interface` sobre `type` para objetos
- ✅ Use `const` ao invés de `let` quando possível

### Naming Conventions

```typescript
// Classes: PascalCase
class RentalService {}

// Interfaces: PascalCase com 'I' opcional
interface CreateRentalDto {}

// Functions: camelCase
function calculateRentalPrice() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RENTAL_DAYS = 30;

// Files: kebab-case
// rental-service.ts
// create-rental.dto.ts
```

### ESLint & Prettier

```bash
# Lint
pnpm lint

# Fix automático
pnpm lint --fix

# Format
pnpm format
```

### Validação com Zod

```typescript
// ✅ Sempre use Zod para validação
import { z } from 'zod';

export const CreateDriverSchema = z.object({
  name: z.string().min(3).max(100),
  cpf: z.string().refine(validateCPF),
  licenseNumber: z.string(),
});
```

---

## 🧪 Testes

### Tipos de Testes

1. **Unit Tests**: Lógica isolada (validators, utils)
2. **Integration Tests**: Módulos NestJS com database
3. **E2E Tests**: Fluxos completos (futuro)

### Comandos

```bash
# Unit tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:cov

# E2E (API)
pnpm test:e2e
```

### Estrutura de Testes

```typescript
// rental.service.spec.ts
describe('RentalService', () => {
  describe('create', () => {
    it('should create rental with valid data', async () => {
      // Arrange
      const dto = { /* ... */ };
      
      // Act
      const result = await service.create(dto);
      
      // Assert
      expect(result).toMatchObject(dto);
    });
    
    it('should throw error if vehicle unavailable', async () => {
      // ...
    });
  });
});
```

### Coverage Mínimo

- **Unit tests**: 80%+
- **Integration tests**: Core features

---

## ❓ Dúvidas

Abra uma [issue](https://github.com/AdairBento/mag-system-v2/issues) ou entre em contato.

---

## 🚀 Próximos Passos

Depois de contribuir:

1. ⭐ Dê uma star no repo
2. 👁️ Watch para atualizações
3. 📣 Compartilhe com outros devs

---

**Obrigado por contribuir! 🎉**
