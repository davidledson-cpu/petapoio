import 'server-only'
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { publicFileUrl } from '@/lib/supabase/storage'
import type { PlatformSettings, Product, ProductCategory } from '@/types/db'

export const CATEGORIES: Record<ProductCategory, { label: string; intro: string }> = {
  memorias: { label: 'Memórias e homenagens', intro: 'Retratos, quadros, caixas e livros para guardar a história de vocês.' },
  lembrancas: { label: 'Lembranças personalizadas', intro: 'Pequenos objetos com o nome dele, para levar por perto.' },
  acolhimento: { label: 'Acolhimento e cuidado', intro: 'Para escrever, lembrar e cuidar de si no seu ritmo.' },
  presentes: { label: 'Para acolher alguém', intro: 'Presentes delicados para quem está passando por uma perda.' },
}

export function isCategory(value: unknown): value is ProductCategory {
  return typeof value === 'string' && value in CATEGORIES
}

/** URL utilizável de uma imagem do produto (arquivo do site ou do bucket "products"). */
export function productImage(path: string | null | undefined) {
  return publicFileUrl('products', path)
}

export const getProducts = cache(async (category?: ProductCategory): Promise<Product[] | null> => {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  let query = supabase.from('products').select('*').eq('active', true).order('sort_order').order('name')
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  if (error) {
    console.error('products query failed', error.message)
    return null
  }
  return data as Product[]
})

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from('products').select('*').eq('slug', slug).eq('active', true).maybeSingle()
  return (data as Product | null) ?? null
})

const DEFAULT_SETTINGS: Pick<PlatformSettings, 'shipping_flat_cents' | 'free_shipping_from_cents'> = {
  shipping_flat_cents: 2490,
  free_shipping_from_cents: 25000,
}

export const getShippingSettings = cache(async () => {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS
  const supabase = await createClient()
  const { data } = await supabase
    .from('platform_settings')
    .select('shipping_flat_cents, free_shipping_from_cents')
    .maybeSingle()
  return (data as typeof DEFAULT_SETTINGS | null) ?? DEFAULT_SETTINGS
})

export function shippingFor(subtotalCents: number, s: typeof DEFAULT_SETTINGS) {
  return subtotalCents === 0 || subtotalCents >= s.free_shipping_from_cents ? 0 : s.shipping_flat_cents
}

/** Prazo estimado: produção + até 7 dias úteis de entrega. */
export function deliveryEstimate(productionDays: number) {
  if (productionDays === 0) return 'Enviado em até 2 dias úteis'
  return `Produção em até ${productionDays} dias úteis, mais o prazo de entrega`
}
