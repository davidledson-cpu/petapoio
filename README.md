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

- **Home** com o seletor "Como você está agora?", que leva cada pessoa ao conteúdo certo
- **Encontre apoio**: primeiros dias, saudade com o tempo, como apoiar alguém
- **Ajuda imediata**: CVV (188), SAMU (192), UPA, UBS e CAPS
- **Psicólogos**: como vai funcionar e lista de espera (sem perfis falsos)
- **Seja parceiro**: pré-cadastro real de psicólogos, gravado no Supabase
- **Blog** com categorias, FAQ, referências, dados estruturados (Article + FAQPage)
- **Loja**: página de "em preparação" com lista de aviso
- **Sobre, Privacidade (LGPD), Termos**
- SEO técnico: sitemap, robots (pré-visualizações não indexam), metadados, Open Graph, URLs canônicas
- Redirecionamentos das URLs antigas (`/profissionais`, `/para-psicologos`, `/auth/*`, `/dashboard/*`)

## Como rodar

```bash
npm install
cp .env.example .env.local   # preencha as variáveis
npm run dev                  # http://localhost:3000
```

Para ver os artigos ainda sem revisão clínica localmente: `PUBLISH_UNREVIEWED=true npm run dev`.

## Configurar o Supabase

1. Crie um projeto (região São Paulo).
2. No **SQL Editor**, rode `supabase/migrations/20261103000000_onda_1.sql`.
3. Em **Settings → API**, copie a URL e a chave `anon` para `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (localmente e na Vercel).
4. As inscrições aparecem em **Table Editor → interest_signups** e as candidaturas em **professional_applications**.

A chave `service_role` não é usada. O público só consegue inserir dados nas tabelas, nunca ler.

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
