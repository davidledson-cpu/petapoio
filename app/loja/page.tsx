import type { Metadata } from 'next'
import Link from 'next/link'
import { CATEGORIES, getProducts, getShippingSettings, isCategory } from '@/lib/loja/catalog'
import { ProductCard } from '@/components/loja/product-card'
import { SignupForm } from '@/components/forms'
import { money } from '@/lib/format'

export const metadata: Metadata = {
  title: 'Loja de lembranças e homenagens',
  description:
    'Retratos ilustrados, caixas de recordação, pingentes e presentes de acolhimento feitos sob encomenda para guardar a memória do seu pet.',
  alternates: { canonical: '/loja' },
}

export default async function LojaPage({ searchParams }: { searchParams: Promise<{ categoria?: string }> }) {
  const { categoria } = await searchParams
  const active = isCategory(categoria) ? categoria : undefined
  const [products, shipping] = await Promise.all([getProducts(active), getShippingSettings()])

  return (
    <>
      <header className="container-page grid gap-8 pb-10 pt-14 md:pt-20 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
        <div>
          <h1 className="text-[2.6rem] leading-[1.06] md:text-6xl">Para guardar a história de vocês</h1>
          <p className="mt-6 max-w-[56ch] text-lg text-grafite-suave md:text-xl md:leading-relaxed">
            Lembranças e homenagens feitas sob encomenda, com a foto e o nome do seu companheiro. Sem pressa: cada
            peça só entra em produção depois que você aprova os detalhes.
          </p>
        </div>
        <ul className="grid gap-3 text-[0.97rem] text-grafite-suave sm:grid-cols-3 lg:grid-cols-1">
          <li><strong className="text-grafite">Prévia antes de produzir</strong> nos itens com foto</li>
          <li><strong className="text-grafite">Pix ou cartão em até 6x</strong> pelo Mercado Pago</li>
          <li><strong className="text-grafite">Frete grátis</strong> a partir de {money(shipping.free_shipping_from_cents)}</li>
        </ul>
      </header>

      <nav aria-label="Categorias" className="container-page">
        <ul className="flex gap-2 overflow-x-auto border-y border-areia py-4">
          <li className="shrink-0">
            <Link
              href="/loja"
              aria-current={!active ? 'page' : undefined}
              className={`inline-block rounded-full px-4 py-2 text-[0.95rem] ${!active ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}
            >
              Tudo
            </Link>
          </li>
          {Object.entries(CATEGORIES).map(([slug, c]) => (
            <li key={slug} className="shrink-0">
              <Link
                href={`/loja?categoria=${slug}`}
                aria-current={active === slug ? 'page' : undefined}
                className={`inline-block rounded-full px-4 py-2 text-[0.95rem] ${active === slug ? 'bg-salvia-funda text-linho' : 'bg-areia hover:bg-areia-escura'}`}
              >
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <section className="container-page pt-10" aria-labelledby="produtos">
        <h2 id="produtos" className="sr-only">Produtos</h2>
        {active && <p className="mb-8 max-w-[60ch] text-lg text-grafite-suave">{CATEGORIES[active].intro}</p>}

        {products === null ? (
          <div className="max-w-2xl rounded-[1.75rem] bg-areia/70 p-8">
            <h2 className="text-2xl">A loja está sendo preparada</h2>
            <p className="mt-3 text-grafite-suave">
              Ainda não conseguimos mostrar os produtos neste ambiente. Deixe seu e-mail para saber quando a loja abrir.
            </p>
            <div className="mt-6">
              <SignupForm list="loja" submitLabel="Avise-me" />
            </div>
          </div>
        ) : products.length === 0 ? (
          <p className="text-grafite-suave">
            Ainda não há produtos nesta categoria. <Link href="/loja" className="link">Ver todos os produtos</Link>.
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p, i) => (
              <li key={p.id}>
                <ProductCard product={p} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="container-page mt-20">
        <div className="grid gap-6 border-t border-areia pt-12 md:grid-cols-3">
          <div>
            <h2 className="text-2xl">Como funciona</h2>
          </div>
          <p className="text-grafite-suave">
            Nos itens personalizados, você informa o nome e envia a foto ao fazer o pedido. Quando houver ilustração ou
            montagem, mandamos uma prévia por e-mail antes de produzir.
          </p>
          <p className="text-grafite-suave">
            Trocas e devoluções: produtos personalizados não podem ser revendidos, mas se chegar com defeito ou
            diferente da prévia aprovada, refazemos sem custo. Itens sem personalização podem ser devolvidos em até 7
            dias após o recebimento.
          </p>
        </div>
      </section>
    </>
  )
}
