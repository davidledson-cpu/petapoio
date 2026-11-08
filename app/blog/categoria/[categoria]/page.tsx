import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { categories, getPostsByCategory, type CategorySlug } from '@/lib/blog'
import { PostList } from '@/components/post-list'

type Props = { params: Promise<{ categoria: string }> }

function isCategory(slug: string): slug is CategorySlug {
  return slug in categories
}

export function generateStaticParams() {
  return Object.keys(categories).map((categoria) => ({ categoria }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { categoria } = await params
  if (!isCategory(categoria)) return {}
  return {
    title: categories[categoria],
    alternates: { canonical: `/blog/categoria/${categoria}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { categoria } = await params
  if (!isCategory(categoria)) notFound()
  const posts = getPostsByCategory(categoria)

  return (
    <div className="container-page pt-14 md:pt-20">
      <Link href="/blog" className="link text-[0.95rem]">Todos os textos</Link>
      <h1 className="mt-4 text-[2.4rem] leading-tight md:text-5xl">{categories[categoria]}</h1>
      <div className="mt-10">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <p className="text-grafite-suave">
            Ainda não há textos publicados nesta categoria.{' '}
            <Link href="/blog" className="link">Veja os outros textos</Link>.
          </p>
        )}
      </div>
    </div>
  )
}
