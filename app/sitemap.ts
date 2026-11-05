import type { MetadataRoute } from 'next'
import { categories, getPosts } from '@/lib/blog'
import { absoluteUrl } from '@/lib/site'

const pages = [
  '/',
  '/encontre-apoio',
  '/ajuda-imediata',
  '/psicologos',
  '/seja-parceiro',
  '/blog',
  '/loja',
  '/sobre',
  '/privacidade',
  '/termos',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts().filter((p) => p.reviewed)
  const usedCategories = new Set(posts.map((p) => p.category))

  return [
    ...pages.map((path) => ({ url: absoluteUrl(path) })),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.updatedAt ?? p.publishedAt,
    })),
    ...Object.keys(categories)
      .filter((c) => usedCategories.has(c as keyof typeof categories))
      .map((c) => ({ url: absoluteUrl(`/blog/categoria/${c}`) })),
  ]
}
