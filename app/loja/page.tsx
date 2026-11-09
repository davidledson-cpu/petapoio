import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { CATEGORIES, getProducts, getShippingSettings, isCategory } from '@/lib/loja/catalog'
import { ProductCard } from '@/components/loja/product-card'
import { SignupForm } from '@/components/forms'
import { money } from '@/lib/format'

export const metadata: Metadata = {
  title: { absolute: 'Homenagens e Lembranças Personalizadas para Pets | PetApoio' },
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
      <header className="relative overflow-hidden bg-[linear-gradient(110deg,#fff8f1_0%,#fbeee2_60%,#f6dcc4_100%)]">
        <div className="container-page grid items-center gap-10 pb-12 pt-10 md:pt-14 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="font-semibold text-nevoa">Memórias pet</p>
            <h1 className="mt-2 text-[2.6rem] leading-[1.05] text-salvia-funda md:text-[3.6rem]">Memórias que permanecem para sempre.</h1>
            <p className="mt-5 max-w-[52ch] text-lg text-grafite md:text-xl md:leading-relaxed">
              Produtos especiais para homenagear quem sempre esteve ao seu lado, feitos sob encomenda com a foto e o nome
              do seu companheiro. Cada peça só entra em produção depois que você aprova os detalhes.
            </p>
            <a href="#produtos" className="btn btn-primario mt-8">Conheça nossa linha</a>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-grafite">
              <li><strong>Prévia antes de produzir</strong></li>
              <li><strong>Pix ou cartão em até 6x</strong></li>
              <li><strong>Frete grátis</strong> a partir de {money(shipping.free_shipping_from_cents)}</li>
            </ul>
          </div>
          <div className="relative aspect-[3/2] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgba(120,60,10,.5)]">
            <Image src="/fotos/pata-maos.webp" alt="Mão segurando com carinho a pata de um cachorro" fill priority sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
          </div>
        </div>
      </header>

      <nav aria-label="Categorias" className="container-page">
        <ul className="mt-8 flex gap-2 overflow-x-auto border-y border-areia py-4">
          <li className="shrink-0">
            <Link
              href="/loja"
              aria-current={!active ? 'page' : undefined}
              className={`inline-block rounded-full px-4 py-2 text-[0.95rem] ${!active ? 'bg-salvia-funda text-white' : 'bg-areia hover:bg-areia-escura'}`}
            >
              Tudo
            </Link>
          </li>
          {Object.entries(CATEGORIES).map(([slug, c]) => (
            <li key={slug} className="shrink-0">
              <Link
                href={`/loja?categoria=${slug}`}
                aria-current={active === slug ? 'page' : undefined}
                className={`inline-block rounded-full px-4 py-2 text-[0.95rem] ${active === slug ? 'bg-salvia-funda text-white' : 'bg-areia hover:bg-areia-escura'}`}
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
