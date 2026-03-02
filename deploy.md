# Deploy no Netlify — Passo a Passo 🚀

## Visão Geral

Para o deploy funcionar em produção você precisa de 3 coisas:

| Serviço | Para que serve | Custo |
|---|---|---|
| **GitHub** | Hospedar o código | Grátis |
| **Turso** | Banco de dados SQLite na nuvem | Grátis (500MB, 1B rows/mês) |
| **Netlify** | Hospedar o site | Grátis |
| **Resend** *(opcional)* | Notificações por email | Grátis (3.000 emails/mês) |

---

## Etapa 1 — Subir o código no GitHub

### 1.1 Criar repositório no GitHub
1. Acesse [github.com](https://github.com) e faça login
2. Clique em **"New repository"** (botão verde no canto superior direito)
3. Nome sugerido: `seven-months` (pode deixar **Privado**)
4. Clique em **"Create repository"**

### 1.2 Enviar o código para o GitHub

Abra o terminal na pasta do projeto e execute:

```bash
git init
git add .
git commit -m "Primeiro commit - Isabella & Mateus 💕"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/seven-months.git
git push -u origin main
```

> Substitua `SEU_USUARIO` pelo seu usuário do GitHub

---

## Etapa 2 — Criar o banco de dados no Turso

O Turso é um SQLite hospedado na nuvem — funciona perfeito com Netlify.

### 2.1 Criar conta e instalar o CLI

```bash
# Instalar o Turso CLI (PowerShell como admin ou WSL)
winget install turso

# Fazer login
turso auth login
```

> Alternativa sem CLI: acesse [turso.tech](https://turso.tech) → **Sign up** → use o painel web

### 2.2 Criar o banco de dados

```bash
turso db create seven-months
```

### 2.3 Pegar as credenciais

```bash
# Pegar a URL do banco
turso db show seven-months --url

# Criar e pegar o token de autenticação
turso db tokens create seven-months
```

Anote os dois valores — você vai precisar deles no Netlify.

Exemplo do que você vai ver:
```
URL:   libsql://seven-months-seuuser.turso.io
Token: eyJhbGciOiJFZERTQS...
```

### 2.4 Inicializar as tabelas no Turso

Com as credenciais em mãos, execute localmente:

```bash
# Temporariamente adicione as credenciais reais ao .env.local
# TURSO_DATABASE_URL=libsql://seven-months-seuuser.turso.io
# TURSO_AUTH_TOKEN=eyJhbGci...

npm run db:push   # cria as tabelas
npm run db:seed   # insere os dados iniciais
```

> Depois de fazer isso, você pode voltar o `.env.local` para `file:./local.db` para desenvolvimento local

---

## Etapa 3 — Gerar o AUTH_SECRET

Execute no terminal:

```bash
# No PowerShell / Terminal
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Copie a string gerada — ela é o seu `AUTH_SECRET`.

---

## Etapa 4 — Configurar o Resend (Email) — Opcional

Se quiser que as notificações de mensagem funcionem:

1. Acesse [resend.com](https://resend.com) e crie uma conta grátis
2. Vá em **"API Keys"** → **"Create API Key"** → copie a chave
3. Em **"Domains"**, você pode:
   - Usar `onboarding@resend.dev` (para testes, sem precisar de domínio próprio)
   - Ou adicionar seu próprio domínio depois

---

## Etapa 5 — Deploy no Netlify

### 5.1 Criar conta no Netlify
1. Acesse [netlify.com](https://netlify.com) e clique em **"Sign up"**
2. Conecte com sua conta do **GitHub**

### 5.2 Criar novo site
1. No painel do Netlify, clique em **"Add new site"** → **"Import an existing project"**
2. Escolha **"GitHub"**
3. Selecione o repositório `seven-months`
4. Nas configurações de build, confirme:
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
5. Clique em **"Deploy site"** — vai falhar na primeira vez, mas tudo bem!

### 5.3 Adicionar as variáveis de ambiente

No Netlify, vá em:
**Site configuration → Environment variables → Add a variable**

Adicione **todas** as variáveis abaixo:

| Variável | Valor |
|---|---|
| `TURSO_DATABASE_URL` | `libsql://seven-months-seuuser.turso.io` |
| `TURSO_AUTH_TOKEN` | `eyJhbGci...` (token do Turso) |
| `AUTH_SECRET` | A string gerada no Etapa 3 |
| `NEXTAUTH_URL` | `https://SEU_SITE.netlify.app` |
| `RESEND_API_KEY` | `re_...` (se configurou o Resend) |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` (ou seu email) |

> Após adicionar todas, vá em **"Deploys"** → **"Trigger deploy"** → **"Deploy site"**

---

## Etapa 6 — Verificar o deploy

Após o deploy (leva ~2 minutos), acesse o link do Netlify e:

1. Faça login com `magtash68@gmail.com` / `05082025`
2. Verifique se a timeline aparece com os eventos
3. Teste enviar uma mensagem para a Isabella

---

## Domínio personalizado (opcional)

Se quiser um endereço bonito tipo `nosso-amor.netlify.app`:

1. No Netlify → **"Site configuration"** → **"Domain management"**
2. Clique em **"Options"** → **"Edit site name"**
3. Escolha o nome que quiser (ex: `isabella-e-mateus`)

---

## Atualizar o site no futuro

Toda vez que fizer um `git push` para o GitHub, o Netlify vai **automaticamente** fazer o novo deploy:

```bash
git add .
git commit -m "Adicionando foto dos 7 meses 🌷"
git push
```

Pronto! O site atualiza sozinho em ~2 minutos.

---

## Adicionar novos momentos na timeline

Faça login com a conta do Mateus (`magtash68@gmail.com`) — só ele pode adicionar e remover eventos da timeline. Clique no botão **"Adicionar momento"** na página inicial.

---

## Resumo rápido

```
1. GitHub    → subir o código
2. Turso     → criar banco + inicializar tabelas
3. Netlify   → conectar ao GitHub + adicionar env vars + deploy
```
