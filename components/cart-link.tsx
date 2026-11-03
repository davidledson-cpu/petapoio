'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart/store'

export function CartLink() {
  const { count } = useCart()
  if (count === 0) return null
  return (
    <Link
      href="/loja/carrinho"
      className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-[0.95rem] font-semibold hover:bg-areia"
      aria-label={`Carrinho com ${count} ${count === 1 ? 'item' : 'itens'}`}
    >
      <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
        <path d="M3 4h2l1.6 9.2a1 1 0 0 0 1 .8h7.3a1 1 0 0 0 1-.8L17 7H6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="17" r="1.2" fill="currentColor" />
        <circle cx="15" cy="17" r="1.2" fill="currentColor" />
      </svg>
      {count}
    </Link>
  )
}
