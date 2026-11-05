import Link from 'next/link'
import { money } from '@/lib/format'
import { productImage } from '@/lib/loja/catalog'
import { QuickAdd } from './quick-add'
import type { Product } from '@/types/db'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = productImage(product.images[0])
  const personalized = product.needs_photo || product.needs_name
  const personal = product.needs_photo ? 'Feito com a sua foto' : product.needs_name ? 'Com o nome gravado' : null
  const href = `/loja/${product.slug}`
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-areia bg-white shadow-[0_18px_40px_-34px_rgba(46,42,39,.5)]">
      <Link href={href} className="block aspect-square overflow-hidden bg-areia" tabIndex={-1} aria-hidden="true">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            width={600}
            height={600}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          />
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        {personal && <p className="text-xs font-bold uppercase tracking-wide text-salvia-funda">{personal}</p>}
        <h3 className="mt-1 font-sans text-lg font-bold leading-snug">
          <Link href={href} className="hover:text-salvia-funda">{product.name}</Link>
        </h3>
        <p className="mt-1 flex-1 text-[0.95rem] text-grafite-suave">{product.summary}</p>
        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="font-sans text-lg font-bold">{money(product.price_cents)}</p>
          <QuickAdd
            id={product.id}
            slug={product.slug}
            name={product.name}
            priceCents={product.price_cents}
            image={image}
            personalized={personalized}
          />
        </div>
        <p className="mt-2 text-xs text-grafite-suave">Produção em até {product.production_days} dias úteis · Pix ou cartão em até 6x</p>
      </div>
    </article>
  )
}
