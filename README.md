# 🐾 PetApoio — Plataforma de Apoio Emocional para Tutores de Pets

**petapoio.com.br** | @petapoio_

Plataforma que conecta tutores de animais de estimação enlutados a psicólogos especializados,
com agendamento online, videochamada integrada, loja memorial e gamificação terapêutica.

---

## 🚀 Deploy em 15 Minutos

### Passo 1 — Supabase (Banco de Dados + Auth)

1. Acesse [supabase.com](https://supabase.com) → **New Project**
2. Nome: `petapoio` | Região: South America (São Paulo)
3. Após criar, vá em **Settings → API** e copie:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY`
4. Vá em **SQL Editor** → cole o conteúdo de `supabase/migrations/001_initial_schema.sql` → **Run**
5. Ative **Google Provider**: Authentication → Providers → Google → habilite

### Passo 2 — Stripe (Pagamentos)

1. Acesse [stripe.com](https://stripe.com) → crie conta BR
2. **Developers → API keys**: copie `Publishable key` e `Secret key`
3. **Connect → Settings**: habilite Stripe Connect para splits
4. **Webhooks → Add endpoint**: `https://petapoio.com.br/api/payments/webhook`
   - Eventos: `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copie o **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Passo 3 — Daily.co (Videochamada)

1. Acesse [daily.co](https://daily.co) → crie conta
2. **Developers → API Keys** → copie a key → `DAILY_API_KEY`

### Passo 4 — Resend (E-mail)

1. Acesse [resend.com](https://resend.com) → crie conta
2. **API Keys → Create** → copie → `RESEND_API_KEY`
3. Adicione e verifique o domínio: `petapoio.com.br`

### Passo 5 — Deploy no Vercel

1. Faça **fork** ou **upload** deste repositório no GitHub
2. Acesse [vercel.com](https://vercel.com) → **New Project** → selecione o repositório
3. Em **Environment Variables**, adicione todas as variáveis do `.env.example`:

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

4. Clique **Deploy** — pronto! 🎉

---

## 🗂️ Estrutura do Projeto

```
petapoio/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout (fonts, metadata)
│   ├── auth/
│   │   ├── login/page.tsx          # Login
│   │   ├── cadastro/page.tsx       # Cadastro (wizard 2 etapas)
│   │   └── cadastro-profissional/  # Cadastro profissional
│   ├── dashboard/
│   │   ├── paciente/               # Dashboard do paciente
│   │   └── profissional/           # Dashboard do profissional
│   ├── profissionais/              # Busca e perfil de profissionais
│   ├── loja/                       # Loja Shopify integrada
│   └── api/                        # API Routes
│       ├── appointments/           # CRUD de agendamentos
│       └── payments/webhook/       # Stripe webhook
├── components/
│   ├── layout/                     # Navbar, Footer
│   ├── home/                       # Seções da landing page
│   ├── auth/                       # Forms de auth
│   ├── booking/                    # Busca e cards de profissionais
│   └── dashboard/                  # Componentes dos dashboards
├── lib/
│   ├── supabase/                   # Client + Server Supabase
│   └── utils.ts                    # Helpers (formatação, gamificação)
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Schema completo do banco
├── types/
│   └── database.ts                 # TypeScript types do Supabase
├── middleware.ts                   # Auth middleware (proteção de rotas)
├── .env.example                    # Template de variáveis de ambiente
└── README.md
```

---

## 💻 Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone https://github.com/davidledson-cpu/petapoio.git
cd petapoio

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 4. Inicie o servidor de desenvolvimento
npm run dev
# Acesse: http://localhost:3000
```

---

## 🔧 Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Estilização | TailwindCSS + Radix UI |
| Banco de Dados | Supabase (PostgreSQL) |
| Autenticação | Supabase Auth (email + Google OAuth) |
| Pagamentos | Stripe Connect (split automático) |
| Videochamada | Daily.co (sem instalação de app) |
| E-mail | Resend (templates HTML) |
| Loja | Shopify Storefront API (Headless) |
| Agendamento | Cal.com API |
| Deploy | Vercel (Edge Functions) |

---

## 💰 Modelo de Negócio

- **Comissão por consulta**: 20% de cada sessão agendada
- **Assinatura profissional**: R$49–149/mês (planos Basic/Pro/Premium)
- **Plano premium (paciente)**: R$89/mês (sessões com desconto)
- **Loja**: margem de 30–60% sobre produtos memoriais
- **Publicidade**: banners para clínicas vet e parceiros

---

## 📞 Suporte

- Email: contato@petapoio.com.br
- Instagram: [@petapoio_](https://instagram.com/petapoio_)

---

*Feito com 💙 para quem perdeu um amor de quatro patas.*
