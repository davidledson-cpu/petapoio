import Link from 'next/link'
import { categories, type Post } from '@/lib/blog'

/** Lista de artigos em linhas (não em cards): título grande, resumo e tempo de leitura. */
export function PostList({ posts }: { posts: Post[] }) {
  return (
    <ul className="divide-y divide-areia border-y border-areia">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="group grid gap-2 py-7 md:grid-cols-[12rem_1fr] md:gap-10"
          >
            <span className="text-sm text-grafite-suave md:pt-2">
              {categories[post.category]}
              <span className="block">{post.readingMinutes} min de leitura</span>
            </span>
            <span>
              <span className="block font-serif text-[1.6rem] leading-snug group-hover:text-salvia-funda">
                {post.title}
              </span>
              <span className="mt-2 block max-w-[62ch] text-grafite-suave">{post.description}</span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
