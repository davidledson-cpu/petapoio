import Link from 'next/link'
import { money } from '@/lib/format'
import { productImage } from '@/lib/loja/catalog'
import type { Product } from '@/types/db'

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const image = productImage(product.images[0])
  const personal = product.needs_photo ? 'Feito com a sua foto' : product.needs_name ? 'Com o nome gravado' : null
  return (
    <Link href={`/loja/${product.slug}`} className="group block">
      <div className="aspect-square overflow-hidden rounded-[1.25rem] bg-areia">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt=""
            width={600}
            height={600}
            loading={priority ? 'eager' : 'lazy'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <h3 className="font-serif text-[1.35rem] leading-snug group-hover:text-salvia-funda">{product.name}</h3>
        <p className="shrink-0 pt-1 font-semibold">{money(product.price_cents)}</p>
      </div>
      <p className="mt-1 text-[0.95rem] text-grafite-suave">{product.summary}</p>
      {personal && <p className="mt-2 text-sm text-salvia-funda">{personal}</p>}
    </Link>
  )
}
