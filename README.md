# PetApoio

Acolhimento, informação e apoio psicológico para quem perdeu um animal de estimação.
**petapoio.com.br** · [@petapoio_](https://instagram.com/petapoio_)

Esta é a reconstrução do site (Onda 1 do plano de 90 dias). Ela substitui a versão anterior,
que usava login de demonstração inseguro, perfis e depoimentos fictícios e escondia erros de build.

## Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | Next.js 16 (App Router) + React 19 + TypeScript estrito | Páginas estáticas rápidas e boas para SEO; build falha se houver erro de tipo |
| Estilo | Tailwind CSS 4 + @tailwindcss/typography | Tokens de cor e tipografia em `app/globals.css` |
| Fontes | Newsreader + Hanken Grotesk (via @fontsource, sem chamada ao Google) | Leitura confortável e nenhum dado enviado a terceiros |
| Blog | MDX em `content/blog/` | Versionado no Git, sem custo de CMS; revisão clínica obrigatória |
| Formulários | Server Actions + Zod + Supabase (só inserção, com RLS) | Funcionam de verdade; sem credenciais, avisam em vez de fingir sucesso |
| Estatísticas | Vercel Analytics | Sem cookies, simplifica a LGPD |
| Hospedagem | Vercel | |

## O que existe nesta versão

**Público**
- Home com "Como você está agora?", caminhos de cuidado, como funciona, profissionais, loja e FAQ
- Encontre apoio (dores, como ajudamos, passos e CTAs por momento) e Ajuda imediata (CVV 188, SAMU 192)
- Psicólogos: diretório com filtros, perfil público e agenda com horários livres
- Loja: catálogo, produto com personalização (nome e foto), carrinho, checkout com CEP, acompanhamento do pedido
- Blog em MDX com revisão clínica obrigatória

**Contas** (Supabase Auth): cadastro, login, recuperação de senha; papéis paciente, psicólogo e admin
- Paciente: sessões (pagar, entrar na sala, cancelar com reembolso), pedidos, notificações, dados
- Psicólogo: cadastro com CRP, perfil, foto e documento, horários e folgas, agenda, conexão Mercado Pago, extrato
- Admin: visão geral, aprovação de psicólogos, sessões, pedidos, produtos com fotos, usuários, inscrições, configurações

**Pagamentos** (Mercado Pago Checkout Pro, Pix e cartão)
- Sessões com split: o valor cai na conta do psicólogo e a comissão (padrão 20%) na da PetApoio
- Loja: recebida pela conta da PetApoio
- Webhook confirma pagamentos; reembolso automático ao cancelar com 24 h de antecedência

**Banco**: `supabase/migrations` (RLS em todas as tabelas, reserva sem conflito de horário, preços sempre calculados no banco) e 31 testes em `supabase/tests`

## Ativar o que falta

1. **Sua conta de admin:** crie uma conta em `/cadastro` e rode no SQL Editor do Supabase:
   `update profiles set role = 'admin' where id = (select id from auth.users where email = 'SEU_EMAIL');`
2. **Mercado Pago:** em mercadopago.com.br/developers, crie uma aplicação do tipo marketplace (Checkout Pro) e cadastre o redirect `https://SEU_SITE/api/mercadopago/oauth/callback` e o webhook `https://SEU_SITE/api/webhooks/mercadopago`. Na Vercel, adicione `MP_ACCESS_TOKEN`, `MP_CLIENT_ID`, `MP_CLIENT_SECRET`, `MP_WEBHOOK_SECRET` e `PAYMENTS_ENCRYPTION_KEY` (`openssl rand -base64 32`).
3. **Domínio próprio:** ao apontar petapoio.com.br, defina `NEXT_PUBLIC_SITE_URL` e atualize Site URL e Redirect URLs em Supabase → Authentication → URL Configuration.

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev                  # http://localhost:3000
```

Para ver os artigos ainda sem revisão clínica localmente: `PUBLISH_UNREVIEWED=true npm run dev`.

## Configurar o Supabase

1. Crie um projeto (região São Paulo).
2. No **SQL Editor**, rode `supabase/setup.sql` (todas as migrações em um arquivo).
3. Em **Settings → API**, copie a URL e a chave `anon` para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (localmente e na Vercel).
4. Copie também a `service_role` para `SUPABASE_SERVICE_ROLE_KEY` (só no servidor). Na Vercel, a integração Supabase já cria essas variáveis.
5. Em **Authentication → URL Configuration**, defina o Site URL e as Redirect URLs do site.

## Publicar um artigo

1. Crie `content/blog/<slug>.mdx` seguindo um dos artigos existentes. As pautas estão em `content/PAUTAS.md`.
2. Depois da revisão clínica, preencha no topo do arquivo:
   ```yaml
   reviewer:
     name: 'Nome da psicóloga'
     crp: '06/123456'
   ```
3. Faça o commit. Artigo sem `reviewer` não aparece em produção.

## Antes de lançar (checklist)

- [ ] Trocar a senha antiga `petapoio@admin2024` onde quer que ela ainda seja usada (estava pública no repositório)
- [ ] Configurar o Supabase e as variáveis na Vercel
- [ ] Revisão clínica dos 3 artigos iniciais e preenchimento do `reviewer`
- [ ] Completar a razão social e o CNPJ na política de privacidade e revisar privacidade e termos com assessoria jurídica
- [ ] Apontar o domínio petapoio.com.br para a Vercel

## Próximas ondas

- **Onda 2 (psicólogos):** login com Supabase Auth, painel admin para aprovar candidaturas, perfis públicos, busca e filtros, contato direto
- **Onda 3 (loja):** catálogo sob demanda em Shopify ou Nuvemshop (checkout hospedado com Pix), gestão de pedidos

O código da versão anterior continua no histórico do Git (branch `main`).
