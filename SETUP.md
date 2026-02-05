# Setup do Ambiente - MAG System v2

## 📋 Requisitos

- **Node.js**: v22.14.0 ou superior
- **pnpm**: v10.28.2 ou superior (gerenciado via Corepack)
- **Git**: Última versão

## 🔧 Instalação

\\\ash

# 1. Clonar repositório

git clone https://github.com/AdairBento/mag-system-v2.git
cd mag-system-v2

# 2. Instalar dependências

pnpm install

# 3. Verificar ambiente

node -v # deve mostrar v22.14.0+
pnpm -v # deve mostrar 10.28.2+
\\\

## 🎯 Semantic Release

### Prefixos de Commit

| Prefixo             | Versão        | Descrição            |
| ------------------- | ------------- | -------------------- |
| \eat:\              | Minor (1.X.0) | Nova funcionalidade  |
| \ix:\               | Patch (1.0.X) | Correção de bug      |
| \BREAKING CHANGE:\  | Major (X.0.0) | Mudança incompatível |
| \docs:\             | -             | Documentação         |
| \chore:\            | -             | Manutenção           |

| \
efactor:\ | - | Refatoração |
| \ est:\ | - | Testes |

### Workflow de Release

1. Commit com mensagem semântica
2. Push para branch \main\
3. GitHub Actions executa automaticamente:
   - Roda testes
   - Calcula próxima versão
   - Atualiza CHANGELOG.md
   - Cria tag Git
   - Publica GitHub Release

## 📝 Exemplo de Commit

\\\ash

# Feature

git commit -m \"feat: add user authentication module\"

# Bug fix

git commit -m \"fix: resolve memory leak in data processing\"

# Breaking change

git commit -m \"feat!: redesign API endpoints

BREAKING CHANGE: API endpoints now use /api/v2 prefix\"
\\\

## 🔍 Troubleshooting

### Erro de versão do Node

\\\powershell

# Verificar versão

node -v

# Se incorreta, instalar Node 22

# Download: https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi

\\\

### Erro de versão do pnpm

\\\powershell

# Ativar Corepack

corepack enable

# Instalar pnpm correto

corepack prepare pnpm@latest --activate

# Verificar

pnpm -v
\\\

## 📚 Referências

- [Semantic Release](https://semantic-release.gitbook.io/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Commitlint](https://commitlint.js.org/)
