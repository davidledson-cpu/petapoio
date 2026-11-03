import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { categories, formatDate, getPost, getPosts } from '@/lib/blog'
import { JsonLd } from '@/components/json-ld'
import { absoluteUrl, site } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.seoTitle ?? post.title,
    description: post.description,
    keywords: [post.keyword],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.description,
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: (post.updatedAt ?? post.publishedAt).toISOString(),
    },
    // Rascunho sem revisão clínica nunca é indexado, mesmo em pré-visualização.
    robots: post.reviewed ? undefined : { index: false, follow: false },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()

  const related = getPosts()
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => Number(b.category === post.category) - Number(a.category === post.category))
    .slice(0, 3)

  return (
    <article className="container-page pt-12 md:pt-16">
      <header className="mx-auto max-w-[44rem]">
        <Link href={`/blog/categoria/${post.category}`} className="link text-[0.95rem]">
          {categories[post.category]}
        </Link>
        <h1 className="mt-4 text-[2.3rem] leading-[1.12] md:text-[3.2rem]">{post.title}</h1>
        <p className="mt-5 text-lg text-grafite-suave">{post.description}</p>
        <dl className="mt-7 grid gap-x-8 gap-y-2 border-y border-areia py-4 text-[0.95rem] sm:grid-cols-2">
          <div>
            <dt className="text-grafite-suave">Escrito por</dt>
            <dd>{post.author}</dd>
          </div>
          <div>
            <dt className="text-grafite-suave">Revisão clínica</dt>
            <dd>{post.reviewer ? `${post.reviewer.name} · CRP ${post.reviewer.crp}` : 'Pendente'}</dd>
          </div>
          <div>
            <dt className="text-grafite-suave">Publicado em</dt>
            <dd>
              <time dateTime={post.publishedAt.toISOString()}>{formatDate(post.publishedAt)}</time>
            </dd>
          </div>
          {post.updatedAt && (
            <div>
              <dt className="text-grafite-suave">Atualizado em</dt>
              <dd>
                <time dateTime={post.updatedAt.toISOString()}>{formatDate(post.updatedAt)}</time>
              </dd>
            </div>
          )}
        </dl>
        {!post.reviewed && (
          <p role="note" className="mt-6 rounded-lg bg-[#f6e7e3] px-4 py-3 text-[0.95rem] text-alerta">
            Pré-visualização: este texto ainda não passou por revisão clínica e não aparece no site publicado.
          </p>
        )}
      </header>

      <div className="texto prose mx-auto mt-10 max-w-[44rem]">
        <MDXRemote source={post.body} />
      </div>

      <aside className="mx-auto mt-14 max-w-[44rem] rounded-2xl bg-salvia-clara p-7 md:p-9">
        <h2 className="text-2xl md:text-[1.75rem]">Se sentir que precisa conversar</h2>
        <p className="mt-3 text-grafite-suave">
          Falar com uma psicóloga ou um psicólogo pode ajudar a atravessar esse momento com mais apoio. Estamos
          reunindo profissionais com experiência em luto e registro conferido no CRP.
        </p>
        <Link href="/psicologos" className="btn btn-primario mt-6">Conhecer o apoio psicológico</Link>
      </aside>

      {post.faq.length > 0 && (
        <section className="mx-auto mt-14 max-w-[44rem]" aria-labelledby="perguntas">
          <h2 id="perguntas" className="text-3xl">Perguntas frequentes</h2>
          <div className="mt-6 divide-y divide-areia border-y border-areia">
            {post.faq.map((item) => (
              <details key={item.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 font-serif text-xl">
                  {item.q}
                  <span aria-hidden="true" className="mt-1 text-salvia-funda transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[62ch] text-grafite-suave">{item.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {post.sources.length > 0 && (
        <section className="mx-auto mt-12 max-w-[44rem]" aria-labelledby="referencias">
          <h2 id="referencias" className="text-2xl">Referências</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem] text-grafite-suave">
            {post.sources.map((s) => (
              <li key={s.title}>
                {s.url ? (
                  <a href={s.url} className="link" target="_blank" rel="noopener noreferrer">{s.title}</a>
                ) : (
                  s.title
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {related.length > 0 && (
        <nav className="mx-auto mt-16 max-w-[44rem]" aria-labelledby="continuar">
          <h2 id="continuar" className="text-2xl">Para continuar lendo</h2>
          <ul className="mt-4 space-y-3">
            {related.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="link font-serif text-xl">{p.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: post.title,
          description: post.description,
          datePublished: post.publishedAt.toISOString(),
          dateModified: (post.updatedAt ?? post.publishedAt).toISOString(),
          author: { '@type': 'Person', name: post.author },
          publisher: { '@type': 'Organization', name: site.name, url: site.url },
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          inLanguage: 'pt-BR',
        }}
      />
      {post.faq.length > 0 && (
        <JsonLd
          data={{
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: post.faq.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }}
        />
      )}
    </article>
  )
}
