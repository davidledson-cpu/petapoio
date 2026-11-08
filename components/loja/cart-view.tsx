'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/store'
import { money } from '@/lib/format'

type Shipping = { shipping_flat_cents: number; free_shipping_from_cents: number }

export function shippingCents(subtotal: number, s: Shipping) {
  return subtotal === 0 || subtotal >= s.free_shipping_from_cents ? 0 : s.shipping_flat_cents
}

export function CartView({ shipping }: { shipping: Shipping }) {
  const cart = useCart()
  const ship = shippingCents(cart.subtotalCents, shipping)

  if (cart.items.length === 0) {
    return (
      <div className="max-w-xl rounded-2xl border-[1.5px] border-dashed border-areia-escura p-8">
        <h2 className="text-2xl">Seu carrinho está vazio</h2>
        <p className="mt-2 text-grafite-suave">Veja as lembranças e homenagens que preparamos com cuidado.</p>
        <Link href="/loja" className="btn btn-primario mt-6">Ver a loja</Link>
      </div>
    )
  }

  const missing = shipping.free_shipping_from_cents - cart.subtotalCents

  return (
    <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:gap-14">
      <ul className="divide-y divide-areia border-y border-areia">
        {cart.items.map((item) => (
          <li key={item.key} className="grid grid-cols-[5.5rem_1fr] gap-4 py-6 sm:grid-cols-[7rem_1fr_auto] sm:gap-6">
            <Link href={`/loja/${item.slug}`} className="block aspect-square overflow-hidden rounded-xl bg-areia">
              {item.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" width={224} height={224} className="h-full w-full object-cover" />
              )}
            </Link>
            <div>
              <Link href={`/loja/${item.slug}`} className="font-serif text-xl hover:text-salvia-funda">{item.name}</Link>
              {item.personalizationName && <p className="mt-1 text-[0.95rem] text-grafite-suave">Nome: {item.personalizationName}</p>}
              {item.personalizationPhoto && (
                <p className="mt-1 text-[0.95rem] text-grafite-suave">Foto enviada: {item.personalizationPhotoName ?? 'sim'}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-4">
                <label className="flex items-center gap-2 text-[0.95rem]">
                  Quantidade
                  <select
                    value={item.quantity}
                    onChange={(e) => cart.setQuantity(item.key, Number(e.target.value))}
                    className="campo !w-20 !py-1.5"
                  >
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </label>
                <button type="button" onClick={() => cart.remove(item.key)} className="text-[0.95rem] text-grafite-suave underline underline-offset-4 hover:text-alerta">
                  Remover
                </button>
              </div>
            </div>
            <p className="col-start-2 font-semibold sm:col-start-3 sm:text-right">{money(item.priceCents * item.quantity)}</p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-[1.5rem] bg-linho-escuro p-6 md:p-8" aria-labelledby="resumo">
        <h2 id="resumo" className="text-2xl">Resumo</h2>
        <dl className="mt-5 space-y-2">
          <div className="flex justify-between"><dt>Subtotal</dt><dd>{money(cart.subtotalCents)}</dd></div>
          <div className="flex justify-between"><dt>Frete</dt><dd>{ship === 0 ? 'Grátis' : money(ship)}</dd></div>
          <div className="flex justify-between border-t border-areia-escura pt-3 text-lg font-semibold"><dt>Total</dt><dd>{money(cart.subtotalCents + ship)}</dd></div>
        </dl>
        {missing > 0 && (
          <p className="mt-4 text-[0.95rem] text-grafite-suave">Faltam {money(missing)} para o frete grátis.</p>
        )}
        <Link href="/loja/checkout" className="btn btn-primario mt-6 w-full">Continuar para entrega e pagamento</Link>
        <Link href="/loja" className="mt-3 block text-center text-[0.95rem] link">Continuar vendo a loja</Link>
      </aside>
    </div>
  )
}
