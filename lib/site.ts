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
  { href: '/psicologos', label: 'Psicólogos' },
  { href: '/encontre-apoio', label: 'Apoio no luto' },
  { href: '/cuida', label: 'Cuidadores' },
  { href: '/saude', label: 'Saúde' },
  { href: '/loja', label: 'Loja' },
  {
    href: '/seja-parceiro',
    label: 'Para profissionais',
    children: [
      { href: '/seja-parceiro/psicologos', label: 'Para psicólogos' },
      { href: '/seja-parceiro/cuidadores', label: 'Para cuidadores' },
      { href: '/seja-parceiro/adestradores', label: 'Para adestradores' },
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
