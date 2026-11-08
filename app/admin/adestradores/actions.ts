'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { requireSession } from '@/lib/auth'
import { slugify } from '@/lib/format'

const schema = z.object({
  id: z.guid(),
  decision: z.enum(['aprovado', 'recusado', 'suspenso', 'pendente']),
  note: z.string().trim().max(1000).optional(),
})

export async function reviewTrainer(form: FormData) {
  await requireSession(['admin'], '/admin/adestradores')
  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) redirect('/admin/adestradores?erro=Dados inválidos.')
  const { id, decision, note } = parsed.data
  if ((decision === 'recusado' || decision === 'suspenso') && !note) {
    redirect(`/admin/adestradores?erro=${encodeURIComponent('Escreva uma observação explicando o motivo.')}#t-${id}`)
  }
  const supabase = await createClient()
  const { data: current } = await supabase.from('trainers').select('slug, full_name, neighborhood, approved_at').eq('id', id).single()
  if (!current) redirect('/admin/adestradores?erro=Adestrador não encontrado.')
  const slug = current.slug ?? slugify(`${current.full_name.split(' ')[0]}-${current.neighborhood}-${id.slice(0, 4)}`)
  const { error } = await supabase
    .from('trainers')
    .update({
      status: decision,
      review_note: note || null,
      slug,
      approved_at: decision === 'aprovado' ? current.approved_at ?? new Date().toISOString() : current.approved_at,
    })
    .eq('id', id)
  if (error) redirect(`/admin/adestradores?erro=${encodeURIComponent(error.message)}`)
  revalidatePath('/admin', 'layout')
  redirect(`/admin/adestradores?status=${decision}&ok=1#t-${id}`)
}
