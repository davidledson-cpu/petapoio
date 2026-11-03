export const site = {
  name: 'PetApoio',
  tagline: 'Um espaço de acolhimento para quem sente a falta de quem sempre esteve ao seu lado.',
  description:
    'Acolhimento, informação confiável e caminhos de apoio psicológico para quem perdeu um animal de estimação.',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://petapoio.com.br').replace(/\/$/, ''),
  email: 'contato@petapoio.com.br',
  instagram: 'https://instagram.com/petapoio_',
  instagramHandle: '@petapoio_',
} as const

export const nav = [
  { href: '/encontre-apoio', label: 'Encontre apoio' },
  { href: '/psicologos', label: 'Psicólogos' },
  { href: '/loja', label: 'Loja' },
  { href: '/blog', label: 'Blog' },
  { href: '/sobre', label: 'Sobre' },
] as const

export function absoluteUrl(path = '/') {
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
