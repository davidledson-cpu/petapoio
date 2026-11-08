'use client'

import { useSyncExternalStore } from 'react'

/** Carrinho guardado no navegador. Preços são sempre recalculados no servidor ao criar o pedido. */
export type CartItem = {
  key: string
  productId: string
  slug: string
  name: string
  priceCents: number
  image: string | null
  quantity: number
  personalizationName?: string
  /** Caminho no bucket privado após o envio da foto. */
  personalizationPhoto?: string
  personalizationPhotoName?: string
}

const KEY = 'petapoio:carrinho'
const listeners = new Set<() => void>()
let cache: CartItem[] | null = null

function read(): CartItem[] {
  if (cache) return cache
  try {
    cache = JSON.parse(localStorage.getItem(KEY) ?? '[]') as CartItem[]
  } catch {
    cache = []
  }
  return cache
}

function write(items: CartItem[]) {
  cache = items
  try {
    localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    // Modo privado: o carrinho vive só nesta aba.
  }
  listeners.forEach((l) => l())
}

const EMPTY: CartItem[] = []

export function useCart() {
  const items = useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      const onStorage = (e: StorageEvent) => {
        if (e.key === KEY) {
          cache = null
          cb()
        }
      }
      window.addEventListener('storage', onStorage)
      return () => {
        listeners.delete(cb)
        window.removeEventListener('storage', onStorage)
      }
    },
    read,
    () => EMPTY,
  )
  return {
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    subtotalCents: items.reduce((n, i) => n + i.priceCents * i.quantity, 0),
    add(item: Omit<CartItem, 'key'>) {
      const key = `${item.productId}:${item.personalizationName ?? ''}:${item.personalizationPhoto ?? ''}`
      const current = read()
      const existing = current.find((i) => i.key === key)
      write(
        existing
          ? current.map((i) => (i.key === key ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) } : i))
          : [...current, { ...item, key }],
      )
    },
    setQuantity(key: string, quantity: number) {
      write(read().map((i) => (i.key === key ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i)))
    },
    remove(key: string) {
      write(read().filter((i) => i.key !== key))
    },
    clear() {
      write([])
    },
  }
}
