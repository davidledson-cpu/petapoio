'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/store'

/** Carrinho sempre visível no cabeçalho, com o número de itens quando houver. */
export function CartLink() {
  const { count } = useCart()
  return (
    <Link
      href="/loja/carrinho"
      className="relative inline-flex size-10 items-center justify-center rounded-full text-grafite hover:bg-areia"
      aria-label={count ? `Carrinho com ${count} ${count === 1 ? 'item' : 'itens'}` : 'Carrinho vazio'}
    >
      <svg width="22" height="22" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8h7.3a1 1 0 0 0 1-.8L17 7H6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="17" r="1.2" fill="currentColor" />
        <circle cx="15" cy="17" r="1.2" fill="currentColor" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-salvia-funda px-1 text-xs font-bold text-linho">
          {count}
        </span>
      )}
    </Link>
  )
}
