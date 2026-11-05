'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useCart } from '@/lib/cart/store'

type Props = { id: string; slug: string; name: string; priceCents: number; image: string | null; personalized: boolean }

/** Botão do cartão: adiciona direto ou leva à personalização. */
export function QuickAdd({ id, slug, name, priceCents, image, personalized }: Props) {
  const cart = useCart()
  const [added, setAdded] = useState(false)

  if (personalized) {
    return (
      <Link href={`/loja/${slug}`} className="btn btn-secundario !min-h-10 !px-4 !py-2 text-sm">
        Personalizar<span className="sr-only"> {name}</span>
      </Link>
    )
  }
  if (added) {
    return (
      <Link href="/loja/carrinho" className="btn btn-primario !min-h-10 !px-4 !py-2 text-sm" aria-live="polite">
        Ver carrinho
      </Link>
    )
  }
  return (
    <button
      type="button"
      onClick={() => {
        cart.add({ productId: id, slug, name, priceCents, image, quantity: 1 })
        setAdded(true)
      }}
      className="btn btn-primario !min-h-10 !px-4 !py-2 text-sm"
    >
      Adicionar<span className="sr-only"> {name} ao carrinho</span>
    </button>
  )
}
