import 'server-only'
import fs from 'node:fs'
import path from 'node:path'
import { cache } from 'react'
import matter from 'gray-matter'
import { z } from 'zod'

const DIR = path.join(process.cwd(), 'content', 'blog')

export const categories = {
  'entendendo-o-luto': 'Entendendo o luto pet',
  sentimentos: 'Saudade, culpa e sentimentos',
  'lidar-com-a-perda': 'Como lidar com a perda',
  'criancas-e-familia': 'Crianças e família',
  'luto-antecipatorio': 'Luto antecipatório',
  'memorias-e-homenagens': 'Homenagens e memórias',
  'apoiar-alguem': 'Como apoiar alguém',
  psicologia: 'Psicologia e saúde emocional',
} as const

export type CategorySlug = keyof typeof categories

const frontmatter = z.object({
  title: z.string().min(10),
  seoTitle: z.string().max(70).optional(),
  description: z.string().min(50).max(170),
  keyword: z.string(),
  category: z.enum(Object.keys(categories) as [CategorySlug, ...CategorySlug[]]),
  publishedAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  author: z.string(),
  /** Psicóloga(o) que revisou. Sem revisor, o artigo não é publicado em produção. */
  reviewer: z.object({ name: z.string(), crp: z.string() }).optional(),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  sources: z.array(z.object({ title: z.string(), url: z.string().url().optional() })).default([]),
})

export type Post = z.infer<typeof frontmatter> & {
  slug: string
  body: string
  readingMinutes: number
  reviewed: boolean
}

const showUnreviewed = process.env.PUBLISH_UNREVIEWED === 'true'

const loadAll = cache((): Post[] => {
  if (!fs.existsSync(DIR)) return []
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(DIR, file), 'utf8')
      const { data, content } = matter(raw)
      const parsed = frontmatter.safeParse(data)
      if (!parsed.success) {
        throw new Error(`Frontmatter inválido em content/blog/${file}:\n${z.prettifyError(parsed.error)}`)
      }
      const words = content.split(/\s+/).filter(Boolean).length
      return {
        ...parsed.data,
        slug: file.replace(/\.mdx$/, ''),
        body: content,
        readingMinutes: Math.max(1, Math.round(words / 200)),
        reviewed: Boolean(parsed.data.reviewer),
      }
    })
    .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
})

/** Artigos visíveis: só os revisados, a não ser que a pré-visualização esteja ligada. */
export function getPosts(): Post[] {
  return loadAll().filter((p) => p.reviewed || showUnreviewed)
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug)
}

export function getPostsByCategory(category: CategorySlug): Post[] {
  return getPosts().filter((p) => p.category === category)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    date,
  )
}
