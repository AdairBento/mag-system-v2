# 🛡️ Security Policy

## 🔒 Supported Versions

Atualmente, suportamos as seguintes versões:

| Version | Supported          |
| ------- | ------------------ |
| 2.x     | ✅ Yes            |
| < 2.0   | ❌ No              |

---

## 🚨 Reporting a Vulnerability

**NÃO reporte vulnerabilidades de segurança via issues públicas.**

Se você descobriu uma vulnerabilidade de segurança, por favor reporte de forma privada:

### 📧 Contato Privado

1. **Email:** adair.bento@hotmail.com
2. **Assunto:** `[SECURITY] MAG System V2 - <descrição curta>`

### 📝 Informações Necessárias

Incluir na sua mensagem:

- **Descrição** da vulnerabilidade
- **Passos para reproduzir** o problema
- **Versão afetada** do sistema
- **Impacto potencial** (severidade)
- **Possivel solução** (se você tiver)

### ⏱️ Tempo de Resposta

- **Confirmação inicial:** Até 48 horas
- **Avaliação completa:** Até 7 dias
- **Correção e release:** Dependendo da severidade

---

## 🛡️ Security Measures

O MAG System V2 implementa:

### ✅ Backend (API)

- **JWT Authentication** com tokens seguros
- **Helmet.js** para headers de segurança HTTP
- **Rate limiting** contra ataques de força bruta
- **Input validation** com Zod em todas as entradas
- **SQL Injection protection** via Prisma ORM
- **CORS** configurado adequadamente
- **Secrets** via variáveis de ambiente

### ✅ Frontend (Web)

- **XSS protection** via React
- **CSRF protection** em requisições
- **Content Security Policy**
- **Input sanitization**

### ✅ Database

- **Encrypted connections** (SSL/TLS)
- **Least privilege principle** para usuários DB
- **Migrations versionadas** com Prisma
- **Backups regulares**

### ✅ DevOps

- **Dependency scanning** via Renovate
- **Vulnerability alerts** do GitHub
- **Secrets scanning** habilitado
- **Branch protection** no `main`
- **Code review** obrigatório

---

## 🔍 Security Checklist

### Para Desenvolvedores

- [ ] Nunca commitar secrets (.env, tokens, senhas)
- [ ] Sempre validar inputs com Zod
- [ ] Usar prepared statements (Prisma)
- [ ] Implementar autenticação/autorização adequada
- [ ] Sanitizar outputs HTML
- [ ] Atualizar dependências regularmente

### Para Deploy

- [ ] HTTPS obrigatório em produção
- [ ] Variáveis de ambiente seguras
- [ ] Database em rede privada
- [ ] Firewall configurado
- [ ] Logs de segurança habilitados
- [ ] Backup automático configurado

---

## 📚 Referências

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [NestJS Security](https://docs.nestjs.com/security/authentication)
- [Next.js Security](https://nextjs.org/docs/pages/building-your-application/configuring/content-security-policy)
- [Prisma Security](https://www.prisma.io/docs/guides/security)

---

## 👏 Agradecimentos

Agradecemos a todos que reportarem vulnerabilidades de forma responsável.

Contribuintes de segurança serão creditados (com permissão) após correção.

---

**Última atualização:** Fevereiro 2026
