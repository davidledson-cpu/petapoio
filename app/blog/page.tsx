import type { Metadata } from 'next'
import Link from 'next/link'
import { categories, getPosts } from '@/lib/blog'
import { PostList } from '@/components/post-list'
import { SignupForm } from '@/components/forms'

export const metadata: Metadata = {
  title: 'Blog sobre luto pet',
  description:
    'Textos para entender o luto pela perda de um animal: saudade, culpa, crianças, luto antecipatório e quando buscar ajuda.',
  alternates: { canonical: '/blog' },
}

export default function BlogPage() {
  const posts = getPosts()
  const used = new Set(posts.map((p) => p.category))

  return (
    <div className="container-page pt-14 md:pt-20">
      <header className="max-w-3xl">
        <h1 className="text-[2.6rem] leading-[1.1] md:text-6xl">Para entender o que você está sentindo</h1>
        <p className="mt-5 max-w-[60ch] text-lg text-grafite-suave">
          Cada texto é revisado por uma psicóloga ou psicólogo antes de ser publicado. Leia no seu ritmo, na ordem que
          fizer sentido.
        </p>
      </header>

      {used.size > 1 && (
        <nav aria-label="Categorias" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {Object.entries(categories)
              .filter(([slug]) => used.has(slug as keyof typeof categories))
              .map(([slug, label]) => (
                <li key={slug}>
                  <Link
                    href={`/blog/categoria/${slug}`}
                    className="inline-block rounded-full bg-areia px-4 py-1.5 text-[0.95rem] hover:bg-areia-escura"
                  >
                    {label}
                  </Link>
                </li>
              ))}
          </ul>
        </nav>
      )}

      <div className="mt-10">
        {posts.length > 0 ? (
          <PostList posts={posts} />
        ) : (
          <div className="max-w-2xl rounded-2xl bg-areia/60 p-8">
            <h2 className="text-2xl">Os primeiros textos estão em revisão clínica</h2>
            <p className="mt-3 text-grafite-suave">
              Deixe seu e-mail para receber cada um assim que for publicado. Enquanto isso, a página{' '}
              <Link href="/encontre-apoio" className="link">Encontre apoio</Link> reúne orientações para agora.
            </p>
            <div className="mt-6">
              <SignupForm list="newsletter" submitLabel="Quero receber" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
