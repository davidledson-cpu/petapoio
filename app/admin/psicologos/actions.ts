'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { requireSession } from '@/lib/auth'

const schema = z.object({
  id: z.guid(),
  decision: z.enum(['aprovado', 'recusado', 'suspenso', 'pendente']),
  note: z.string().trim().max(1000).optional(),
})

const MESSAGES = {
  aprovado: {
    title: 'Seu perfil foi aprovado',
    body: 'Seu registro foi conferido. Conecte o Mercado Pago e mantenha seus horários atualizados para receber agendamentos.',
  },
  recusado: { title: 'Seu cadastro não foi aprovado', body: 'Veja a observação da equipe no seu painel.' },
  suspenso: { title: 'Seu perfil foi suspenso', body: 'Seu perfil não aparece para pacientes. Veja a observação da equipe no painel.' },
  pendente: { title: 'Seu perfil voltou para análise', body: 'Nossa equipe vai conferir novamente seus dados.' },
} as const

export async function reviewPsychologist(form: FormData) {
  await requireSession(['admin'], '/admin/psicologos')
  const parsed = schema.safeParse(Object.fromEntries(form))
  if (!parsed.success) redirect('/admin/psicologos?erro=Dados inválidos.')
  const { id, decision, note } = parsed.data

  if ((decision === 'recusado' || decision === 'suspenso') && !note) {
    redirect(`/admin/psicologos/${id}?erro=${encodeURIComponent('Escreva uma observação explicando o motivo.')}`)
  }

  const supabase = await createClient()
  const { error } = await supabase
    .from('psychologists')
    .update({ status: decision, review_note: note || null })
    .eq('id', id)
  if (error) redirect(`/admin/psicologos/${id}?erro=${encodeURIComponent(error.message)}`)

  await createAdminClient()
    .from('notifications')
    .insert({ user_id: id, ...MESSAGES[decision], link: '/painel/psicologo' })

  revalidatePath('/admin/psicologos', 'layout')
  revalidatePath('/psicologos', 'layout')
  redirect(`/admin/psicologos/${id}?ok=1`)
}
