import type { Metadata } from 'next'
import { CartView } from '@/components/loja/cart-view'
import { getShippingSettings } from '@/lib/loja/catalog'

export const metadata: Metadata = { title: 'Carrinho', robots: { index: false } }

export default async function CarrinhoPage() {
  const shipping = await getShippingSettings()
  return (
    <div className="container-page pt-12 md:pt-16">
      <h1 className="mb-10 text-[2.4rem] leading-tight md:text-5xl">Seu carrinho</h1>
      <CartView shipping={shipping} />
    </div>
  )
}
