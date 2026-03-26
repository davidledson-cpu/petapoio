# ð¾ PetApoio â Plataforma de Apoio Emocional para Tutores de Pets

**petapoio.com.br** | @petapoio_

Plataforma que conecta tutores de animais de estimaÃ§Ã£o enlutados a psicÃ³logos especializados,
com agendamento online, videochamada integrada, loja memorial e gamificaÃ§Ã£o terapÃªutica.

---

## ð Deploy em 15 Minutos

### Passo 1 â Supabase (Banco de Dados + Auth)

1. Acesse [supabase.com](https://supabase.com) â **New Project**
2. Nome: `petapoio` | RegiÃ£o: South America (SÃ£o Paulo)
3. ApÃ³s criar, vÃ¡ em **Settings â API** e copie:
   - `Project URL` â `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` â `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` â `SUPABASE_SERVICE_ROLE_KEY`
4. VÃ¡ em **SQL Editor** â cole o conteÃºdo de `supabase/migrations/001_initial_schema.sql` â **Run**
5. Ative **Google Provider**: Authentication â Providers â Google â habilite

### Passo 2 â Stripe (Pagamentos)

1. Acesse [stripe.com](https://stripe.com) â crie conta BR
2. **Developers â API keys**: copie `Publishable key` e `Secret key`
3. **Connect â Settings**: habilite Stripe Connect para splits
4. **Webhooks â Add endpoint**: `https://petapoio.com.br/api/payments/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copie o **Signing secret** â `STRIPE_WEBHOOK_SECRET`

### Passo 3 â Daily.co (Videochamada)

1. Acesse [daily.co](https://daily.co) â crie conta
2. **Developers â API Keys** â copie a key â `DAILY_API_KEY`

### Passo 4 â Resend (E-mail)

1. Acesse [resend.com](https://resend.com) â crie conta
2. **API Keys â Create** â copie â `RESEND_API_KEY`
3. Adicione e verifique o domÃ­nio: `petapoio.com.br`

### Passo 5 â Deploy no Vercel

1. FaÃ§a **fork** ou **upload** deste repositÃ³rio no GitHub
2. Acesse [vercel.com](https://vercel.com) â **New Project** â selecione o repositÃ³rio
3. Em **Environment Variables**, adicione todas as variÃ¡veis do `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://petapoio.com.br
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
STRIPE_PLATFORM_FEE_PERCENT=20
DAILY_API_KEY=...
RESEND_API_KEY=...
RESEND_FROM_EMAIL=no-reply@petapoio.com.br
```

4. Clique **Deploy** â pronto! ð

---

## ðï¸ Estrutura do Projeto

```
petapoio/
âââ app/
â   âââ page.tsx                    # Landing page
â   âââ layout.tsx                  # Root layout (fonts, metadata)
â   âââ auth/
â   â   âââ login/page.tsx          # Login
â   â   âââ cadastro/page.tsx       # Cadastro (wizard 2 etapas)
â   â   âââ cadastro-profissional/  # Cadastro profissional
â   âââ dashboard/
â   â   âââ paciente/               # Dashboard do paciente
â   â   âââ profissional/           # Dashboard do profissional
â   âââ profissionais/              # Busca e perfil de profissionais
â   âââ loja/                       # Loja Shopify integrada
â   âââ api/                        # API Routes
â       âââ appointments/           # CRUD de agendamentos
â       âââ payments/webhook/       # Stripe webhook
âââ components/
â   âââ layout/                     # Navbar, Footer
â   âââ home/                       # SeÃ§Ãµes da landing page
â   âââ auth/                       # Forms de auth
â   âââ booking/                    # Busca e cards de profissionais
â   âââ dashboard/                  # Componentes dos dashboards
âââ lib/
â   âââ supabase/                   # Client + Server Supabase
â   âââ utils.ts                    # Helpers (formataÃ§Ã£o, gamificaÃ§Ã£o)
âââ supabase/
â   âââ migrations/
â       âââ 001_initial_schema.sql  # Schema completo do banco
âââ types/
â   âââ database.ts                 # TypeScript types do Supabase
âââ middleware.ts                   # Auth middleware (proteÃ§Ã£o de rotas)
âââ .env.example                    # Template de variÃ¡veis de ambiente
âââ README.md
```

---

## ð» Desenvolvimento Local

```bash
# 1. Clone o repositÃ³rio
git clone https://github.com/davidledson-cpu/petapoio.git
cd petapoio

# 2. Instale as dependÃªncias
npm install

# 3. Configure as variÃ¡veis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Inicie o servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

---

## ð§ Stack TecnolÃ³gica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| EstilizaÃ§Ã£o | TailwindCSS + Radix UI |
| Banco de Dados | Supabase (PostgreSQL) |
| AutenticaÃ§Ã£o | Supabase Auth (email + Google OAuth) |
| Pagamentos | Stripe Connect (split automÃ¡tico) |
| Videochamada | Daily.co (sem instalaÃ§Ã£o de app) |
| E-mail | Resend (templates HTML) |
| Loja | Shopify Storefront API (Headless) |
| Agendamento | Cal.com API |
| Deploy | Vercel (Edge Functions) |

---

## ð° Modelo de NegÃ³cio

- **ComissÃ£o por consulta**: 20% de cada sessÃ£o agendada
- **Assinatura profissional**: R$49â149/mÃªs (planos Basic/Pro/Premium)
- **Plano premium (paciente)**: R$89/mÃªs (sessÃµes com desconto)
- **Loja**: margem de 30â60% sobre produtos memoriais
- **Publicidade**: banners para clÃ­nicas vet e parceiros

---

## ð Suporte

- Email: contato@petapoio.com.br
- Instagram: [@petapoio_](https://instagram.com/petapoio_)

---

*Feito com ð para quem perdeu um amor de quatro patas.*

<!-- deploy: 2026-03-26T00:26:13.625Z -->
