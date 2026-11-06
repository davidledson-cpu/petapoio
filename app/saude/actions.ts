'use server'

import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { fail, invalid, NOT_CONFIGURED, type FormState } from '@/lib/form-state'

const schema = z.object({
  email: z.email({ error: 'Confira o e-mail.' }).max(254).trim().toLowerCase(),
  city: z.string().trim().max(80).optional().transform((v) => v || null),
  species: z.enum(['cao', 'gato', 'outros'], { error: 'Escolha a espécie.' }),
  pet_age: z.enum(['filhote', 'adulto', 'idoso'], { error: 'Escolha a fase de vida.' }),
  interests: z
    .array(z.enum(['prevencao', 'consultas', 'ampla', 'emergencia', 'descontos']))
    .min(1, { error: 'Escolha pelo menos uma opção.' }),
  budget: z.enum(['ate30', '30a90', '90a180', 'acima180', 'nao_sei']).optional(),
  consent: z.literal('on', { error: 'Para continuar, aceite a política de privacidade.' }),
})

export async function joinHealthList(_prev: FormState, form: FormData): Promise<FormState> {
  const parsed = schema.safeParse({ ...Object.fromEntries(form), interests: form.getAll('interests') })
  if (!parsed.success) return invalid(parsed.error)
  const ok: FormState = {
    status: 'success',
    message: 'Obrigado. Suas respostas ajudam a escolher os parceiros certos. Avisaremos por e-mail quando houver opções para o seu pet.',
  }
  if (form.get('website_confirm')) return ok
  if (!isSupabaseConfigured()) return NOT_CONFIGURED
  const { consent: _c, ...data } = parsed.data
  void _c
  const supabase = await createClient()
  const { error } = await supabase.from('health_leads').insert(data)
  if (error && error.code !== '23505') {
    console.error('health lead failed', error.code, error.message)
    return fail('Não conseguimos salvar agora. Tente de novo em alguns minutos.')
  }
  return ok
}
