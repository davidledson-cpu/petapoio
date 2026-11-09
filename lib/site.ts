/**
 * Endereço público do site. Ordem: NEXT_PUBLIC_SITE_URL (domínio próprio) → na pré-visualização
 * da Vercel, o endereço da branch (para links de e-mail e retorno do pagamento caírem nela) →
 * domínio de produção da Vercel → petapoio.vercel.app.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL
  if (explicit) return explicit.replace(/\/$/, '')
  const vercelHost =
    process.env.VERCEL_ENV === 'preview'
      ? process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL
      : process.env.VERCEL_PROJECT_PRODUCTION_URL
  return `https://${vercelHost ?? 'petapoio.vercel.app'}`
}

export const site = {
  name: 'PetApoio',
  tagline: 'Cuidado, apoio e acolhimento para você e seu pet, em cada fase da vida dele.',
  description:
    'Apoio no luto com psicólogos, cuidadores e adestradores verificados perto de casa e planos de saúde com parceiros. Cuidado para você e seu pet em cada fase da vida.',
  url: resolveSiteUrl(),
  email: 'contato@petapoio.com.br',
  instagram: 'https://instagram.com/petapoio_',
  instagramHandle: '@petapoio_',
} as const

export type NavLink = { href: string; label: string; children?: readonly { href: string; label: string }[] }

export const nav = [
  {
    href: '/saude',
    label: 'Cuidado e Saúde',
    children: [
      { href: '/saude#planos', label: 'Planos de saúde pet' },
      { href: '/saude#planos', label: 'Seguros e proteção' },
      { href: '/cuida', label: 'Cuidadores e adestradores' },
      { href: '/painel/pets', label: 'Carteira de saúde do pet' },
    ],
  },
  {
    href: '/produtos',
    label: 'Produtos',
    children: [
      { href: '/produtos#conforto', label: 'Conforto e bem-estar' },
      { href: '/produtos#higiene', label: 'Higiene e cuidados' },
      { href: '/produtos#brincadeiras', label: 'Brincadeiras e estímulos' },
      { href: '/produtos#passeios', label: 'Passeios e acessórios' },
      { href: '/produtos#alimentacao', label: 'Alimentação e petiscos' },
    ],
  },
  {
    href: '/psicologos',
    label: 'Apoio Emocional',
    children: [
      { href: '/psicologos', label: 'Psicólogos' },
      { href: '/encontre-apoio', label: 'Luto pet' },
      { href: '/blog', label: 'Conteúdos de acolhimento' },
      { href: '/ajuda-imediata', label: 'Ajuda imediata' },
    ],
  },
  {
    href: '/loja',
    label: 'Memórias',
    children: [
      { href: '/loja', label: 'Caixas e quadros' },
      { href: '/loja', label: 'Pegadas e pingentes' },
      { href: '/loja', label: 'Homenagens' },
    ],
  },
  { href: '/blog', label: 'Conteúdos' },
  {
    href: '/seja-parceiro',
    label: 'Seja Parceiro',
    children: [
      { href: '/seja-parceiro/psicologos', label: 'Sou psicólogo' },
      { href: '/seja-parceiro/cuidadores', label: 'Sou cuidador' },
      { href: '/seja-parceiro/adestradores', label: 'Sou adestrador' },
      { href: '/seja-parceiro#empresas', label: 'Sou fornecedor ou empresa' },
    ],
  },
] as const satisfies readonly NavLink[]

/** As três frentes do ecossistema, na ordem em que aparecem para o público. */
export const verticals = [
  { key: 'acolhe', name: 'PetApoio Acolhe', href: '/psicologos', short: 'Apoio no luto' },
  { key: 'cuida', name: 'PetApoio Cuida', href: '/cuida', short: 'Cuidadores e adestradores' },
  { key: 'saude', name: 'PetApoio Saúde', href: '/saude', short: 'Saúde e proteção' },
] as const

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
