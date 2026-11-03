import Link from 'next/link'
import { getProducts } from '@/lib/loja/catalog'
import { ProductCard } from '@/components/loja/product-card'

/** Faixa da loja para a página inicial. Não aparece sem catálogo. */
export async function StorePreview() {
  const products = await getProducts()
  if (!products || products.length === 0) return null
  return (
    <section className="container-page py-16" aria-labelledby="loja-previa">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 id="loja-previa" className="text-4xl">Para guardar uma lembrança</h2>
          <p className="mt-3 text-lg text-grafite-suave">
            Retratos, caixas de recordação e pequenas homenagens feitas sob encomenda, quando você sentir que é hora.
          </p>
        </div>
        <Link href="/loja" className="link font-semibold">Ver a loja</Link>
      </div>
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 4).map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}
