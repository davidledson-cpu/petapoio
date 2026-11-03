import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CATEGORIES, deliveryEstimate, getProduct, getProducts, getShippingSettings, productImage } from '@/lib/loja/catalog'
import { AddToCart } from '@/components/loja/add-to-cart'
import { Gallery } from '@/components/loja/gallery'
import { ProductCard } from '@/components/loja/product-card'
import { JsonLd } from '@/components/json-ld'
import { money } from '@/lib/format'
import { absoluteUrl } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: 'Produto não encontrado' }
  const image = productImage(product.images[0])
  return {
    title: product.name,
    description: product.summary,
    alternates: { canonical: `/loja/${product.slug}` },
    openGraph: { title: product.name, description: product.summary, images: image ? [absoluteUrl(image)] : undefined },
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const [shipping, related] = await Promise.all([getShippingSettings(), getProducts(product.category)])
  const images = product.images.map((p) => productImage(p)).filter((p): p is string => Boolean(p))
  const others = (related ?? []).filter((p) => p.id !== product.id).slice(0, 3)

  return (
    <div className="container-page pt-8 md:pt-12">
      <nav aria-label="Você está em" className="text-[0.95rem] text-grafite-suave">
        <Link href="/loja" className="link">Loja</Link>
        <span aria-hidden="true"> / </span>
        <Link href={`/loja?categoria=${product.category}`} className="link">{CATEGORIES[product.category].label}</Link>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <Gallery images={images} name={product.name} />

        <div>
          <h1 className="text-[2.3rem] leading-[1.1] md:text-5xl">{product.name}</h1>
          <p className="mt-4 text-2xl">{money(product.price_cents)}</p>
          <p className="mt-1 text-[0.95rem] text-grafite-suave">Pix ou cartão em até 6x pelo Mercado Pago</p>
          <p className="mt-6 text-lg text-grafite-suave">{product.summary}</p>

          <div className="mt-8 border-y border-areia py-8">
            <AddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price_cents: product.price_cents,
                needs_name: product.needs_name,
                needs_photo: product.needs_photo,
                image: images[0] ?? null,
              }}
            />
          </div>

          <dl className="mt-8 grid gap-5 text-[0.97rem]">
            <div>
              <dt className="font-semibold">Prazo</dt>
              <dd className="text-grafite-suave">{deliveryEstimate(product.production_days)}.</dd>
            </div>
            <div>
              <dt className="font-semibold">Frete</dt>
              <dd className="text-grafite-suave">
                {money(shipping.shipping_flat_cents)} para todo o Brasil. Grátis em pedidos a partir de{' '}
                {money(shipping.free_shipping_from_cents)}.
              </dd>
            </div>
            <div>
              <dt className="font-semibold">Trocas</dt>
              <dd className="text-grafite-suave">
                {product.needs_name || product.needs_photo
                  ? 'Por ser personalizado, não aceitamos devolução por arrependimento. Se chegar com defeito ou diferente do combinado, refazemos sem custo.'
                  : 'Você pode devolver em até 7 dias após o recebimento, sem precisar explicar o motivo.'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="mt-16 grid gap-8 border-t border-areia pt-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16" aria-labelledby="detalhes">
        <h2 id="detalhes" className="text-3xl">Sobre esta peça</h2>
        <div className="texto prose max-w-none">
          {product.description.split(/\n{2,}/).map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>

      {others.length > 0 && (
        <section className="mt-20" aria-labelledby="relacionados">
          <h2 id="relacionados" className="text-3xl">Na mesma categoria</h2>
          <ul className="mt-8 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}

      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.summary,
          image: images.map((i) => (i.startsWith('http') ? i : absoluteUrl(i))),
          sku: product.slug,
          brand: { '@type': 'Brand', name: 'PetApoio' },
          offers: {
            '@type': 'Offer',
            priceCurrency: 'BRL',
            price: (product.price_cents / 100).toFixed(2),
            availability: 'https://schema.org/MadeToOrder',
            url: absoluteUrl(`/loja/${product.slug}`),
          },
        }}
      />
    </div>
  )
}
