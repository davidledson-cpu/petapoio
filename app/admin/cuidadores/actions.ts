'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth'
import { slugify } from '@/lib/format'

const reviewSchema = z.object({
  id: z.guid(),
  decision: z.enum(['aprovado', 'recusado', 'suspenso', 'pendente']),
  level: z.enum(['cadastrado', 'verificado', 'qualificado', 'especializado']),
  note: z.string().trim().max(1000).optional(),
})

export async function reviewCaregiver(form: FormData) {
  await requireSession(['admin'], '/admin/cuidadores')
  const parsed = reviewSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) redirect('/admin/cuidadores?erro=Dados inválidos.')
  const { id, decision, level, note } = parsed.data
  if ((decision === 'recusado' || decision === 'suspenso') && !note) {
    redirect(`/admin/cuidadores/${id}?erro=${encodeURIComponent('Escreva uma observação explicando o motivo.')}`)
  }

  const supabase = await createClient()
  const { data: current } = await supabase.from('caregivers').select('slug, full_name, neighborhood, approved_at').eq('id', id).single()
  if (!current) redirect('/admin/cuidadores?erro=Cuidador não encontrado.')

  // Slug estável: primeiro nome + bairro + trecho do id (não muda depois de aprovado).
  const slug = current.slug ?? slugify(`${current.full_name.split(' ')[0]}-${current.neighborhood}-${id.slice(0, 4)}`)
  const { error } = await supabase
    .from('caregivers')
    .update({
      status: decision,
      level,
      review_note: note || null,
      slug,
      approved_at: decision === 'aprovado' ? current.approved_at ?? new Date().toISOString() : current.approved_at,
    })
    .eq('id', id)
  if (error) redirect(`/admin/cuidadores/${id}?erro=${encodeURIComponent(error.message)}`)

  revalidatePath('/admin', 'layout')
  revalidatePath('/cuida', 'layout')
  redirect(`/admin/cuidadores/${id}?ok=1`)
}

const requestSchema = z.object({
  id: z.guid(),
  status: z.enum(['nova', 'em_contato', 'confirmada', 'concluida', 'cancelada']),
  note: z.string().trim().max(1000).optional(),
})

export async function updateCareRequest(form: FormData) {
  await requireSession(['admin'], '/admin/reservas')
  const parsed = requestSchema.safeParse(Object.fromEntries(form))
  if (!parsed.success) redirect('/admin/reservas?erro=Dados inválidos.')
  const { id, status, note } = parsed.data
  const supabase = await createClient()
  const { error } = await supabase.from('care_requests').update({ status, admin_note: note || null }).eq('id', id)
  if (error) redirect(`/admin/reservas?erro=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin', 'layout')
  redirect(`/admin/reservas?ok=1#r-${id}`)
}
