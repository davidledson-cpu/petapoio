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
  tagline: 'Um espaço de acolhimento para quem sente a falta de quem sempre esteve ao seu lado.',
  description:
    'Acolhimento, informação confiável e caminhos de apoio psicológico para quem perdeu um animal de estimação.',
  url: resolveSiteUrl(),
  email: 'contato@petapoio.com.br',
  instagram: 'https://instagram.com/petapoio_',
  instagramHandle: '@petapoio_',
} as const

export const nav = [
  { href: '/psicologos', label: 'Psicólogos' },
  { href: '/encontre-apoio', label: 'Apoio no luto' },
  { href: '/cuida', label: 'Cuidadores' },
  { href: '/saude', label: 'Saúde' },
  { href: '/loja', label: 'Loja' },
  { href: '/seja-parceiro', label: 'Para profissionais' },
] as const

/** As três frentes do ecossistema, na ordem em que aparecem para o público. */
export const verticals = [
  { key: 'acolhe', name: 'PetApoio Acolhe', href: '/psicologos', short: 'Acolhimento no luto' },
  { key: 'cuida', name: 'PetApoio Cuida', href: '/cuida', short: 'Cuidadores perto de casa' },
  { key: 'saude', name: 'PetApoio Saúde', href: '/saude', short: 'Saúde organizada' },
] as const

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
