'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { fail, invalid, type FormState } from '@/lib/form-state'

const IMAGE_PATH = /^(\/produtos\/[\w.-]+|produtos\/[a-z0-9-]+\/[\w.-]+)$/

const productSchema = z.object({
  id: z.uuid().optional().or(z.literal('').transform(() => undefined)),
  name: z.string().trim().min(3, { error: 'Informe o nome.' }).max(100),
  slug: z
    .string()
    .trim()
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, { error: 'Use letras minúsculas, números e hífens (ex.: caixa-de-madeira).' })
    .max(80),
  category: z.enum(['memorias', 'lembrancas', 'acolhimento', 'presentes'], { error: 'Escolha a categoria.' }),
  summary: z.string().trim().min(10, { error: 'Escreva um resumo de uma frase.' }).max(200),
  description: z.string().trim().max(4000),
  price: z
    .string()
    .trim()
    .regex(/^\d{1,5}([.,]\d{1,2})?$/, { error: 'Use um valor como 129,90.' })
    .transform((v) => Math.round(Number(v.replace(',', '.')) * 100))
    .refine((c) => c > 0, { error: 'O preço precisa ser maior que zero.' }),
  production_days: z.coerce.number().int().min(0, { error: 'Use 0 ou mais dias.' }).max(60),
  sort_order: z.coerce.number().int().min(0).max(10000),
  needs_photo: z.literal('on').optional().transform(Boolean),
  needs_name: z.literal('on').optional().transform(Boolean),
  active: z.literal('on').optional().transform(Boolean),
  images: z
    .string()
    .transform((v, ctx) => {
      try {
        const arr = JSON.parse(v)
        if (Array.isArray(arr) && arr.length <= 12 && arr.every((p) => typeof p === 'string' && IMAGE_PATH.test(p))) return arr as string[]
      } catch {}
      ctx.addIssue({ code: 'custom', message: 'Lista de imagens inválida.' })
      return z.NEVER
    }),
})

export async function saveProduct(_prev: FormState, form: FormData): Promise<FormState> {
  await requireSession(['admin'], '/admin/produtos')
  const parsed = productSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) return invalid(parsed.error)

  const { id, price, ...rest } = parsed.data
  const row = { ...rest, price_cents: price, updated_at: new Date().toISOString() }
  const supabase = await createClient()
  const { data, error } = id
    ? await supabase.from('products').update(row).eq('id', id).select('id').single()
    : await supabase.from('products').insert(row).select('id').single()

  if (error) {
    if (error.code === '23505') return { status: 'error', message: 'Já existe um produto com este endereço.', fieldErrors: { slug: 'Escolha outro endereço.' } }
    console.error('save product failed', error.message)
    return fail('Não conseguimos salvar o produto. Tente de novo.')
  }
  revalidatePath('/loja', 'layout')
  revalidatePath('/admin/produtos')
  if (!id) redirect(`/admin/produtos/${data.id}?salvo=1`)
  return { status: 'success', message: 'Produto salvo.' }
}

export async function toggleProduct(form: FormData) {
  await requireSession(['admin'], '/admin/produtos')
  const id = z.uuid().parse(form.get('id'))
  const active = form.get('active') === 'true'
  const supabase = await createClient()
  await supabase.from('products').update({ active: !active, updated_at: new Date().toISOString() }).eq('id', id)
  revalidatePath('/admin/produtos')
  revalidatePath('/loja', 'layout')
}
