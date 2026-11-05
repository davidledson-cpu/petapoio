import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { slugify } from '@/lib/format'
import { UFS } from '@/lib/ufs'
import type { Session } from '@/lib/auth'
import type { Modality, Psychologist } from '@/types/db'

export const DEFAULT_FEE_PERCENT = 20

/** Comissão atual da plataforma (lida do banco; 20% se indisponível). */
export async function getPlatformFeePercent(): Promise<number> {
  if (!isSupabaseConfigured()) return DEFAULT_FEE_PERCENT
  try {
    const supabase = await createClient()
    const { data } = await supabase.from('platform_settings').select('platform_fee_percent').single()
    return data ? Number(data.platform_fee_percent) : DEFAULT_FEE_PERCENT
  } catch {
    return DEFAULT_FEE_PERCENT
  }
}

function asText(v: unknown, max: number) {
  return typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : null
}

/**
 * Garante que o psicólogo logado tenha sua linha em `psychologists`.
 * No cadastro, os dados profissionais ficam no user_metadata (a conta ainda não está confirmada);
 * no primeiro acesso ao painel, criamos o perfil profissional a partir deles.
 */
export async function ensurePsychologistRow(session: Session): Promise<Psychologist | null> {
  if (session.profile.role !== 'psicologo') return null
  const supabase = await createClient()

  const { data: existing } = await supabase.from('psychologists').select('*').eq('id', session.userId).maybeSingle<Psychologist>()
  if (existing) return existing

  const {
    data: { user },
  } = await supabase.auth.getUser()
  const meta = (user?.user_metadata ?? {}) as Record<string, unknown>

  const crp = asText(meta.crp, 20) ?? 'pendente'
  const crpState = (UFS as readonly string[]).includes(String(meta.crp_state)) ? String(meta.crp_state) : 'SP'
  const modality: Modality = ['online', 'presencial', 'ambos'].includes(String(meta.modality))
    ? (meta.modality as Modality)
    : 'online'
  const state = (UFS as readonly string[]).includes(String(meta.state)) ? String(meta.state) : null

  const base = slugify(session.profile.full_name || 'psicologo') || 'psicologo'
  for (let attempt = 0; attempt < 5; attempt++) {
    const slug = attempt === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 6)}`
    const { data, error } = await supabase
      .from('psychologists')
      .insert({
        id: session.userId,
        slug,
        crp,
        crp_state: crpState,
        modality,
        city: asText(meta.city, 80),
        state,
        approach: asText(meta.approach, 120),
        pet_grief_experience: meta.pet_grief_experience === true,
        accepted_terms_at: typeof meta.accepted_terms_at === 'string' ? meta.accepted_terms_at : new Date().toISOString(),
      })
      .select('*')
      .single<Psychologist>()
    if (!error) return data
    if (error.code !== '23505') {
      console.error('ensurePsychologistRow failed', error.code, error.message)
      return null
    }
    // 23505 no id: outra aba criou ao mesmo tempo. No slug: tentamos outro sufixo.
    const { data: raced } = await supabase.from('psychologists').select('*').eq('id', session.userId).maybeSingle<Psychologist>()
    if (raced) return raced
  }
  return null
}

/** O que falta para o perfil ser publicado e receber agendamentos. */
export function profileChecklist(p: Psychologist, hasAvailability: boolean) {
  return [
    { done: Boolean(p.photo_path), label: 'Foto profissional', href: '/painel/psicologo/perfil#foto' },
    { done: Boolean(p.bio && p.bio.length >= 80 && p.headline), label: 'Apresentação e bio', href: '/painel/psicologo/perfil' },
    { done: Boolean(p.session_price_cents), label: 'Valor da sessão', href: '/painel/psicologo/perfil#valor' },
    { done: hasAvailability, label: 'Horários de atendimento', href: '/painel/psicologo/horarios' },
    { done: Boolean(p.document_path), label: 'Documento de verificação', href: '/painel/psicologo/perfil#documento' },
    { done: p.mp_connected, label: 'Conta Mercado Pago conectada', href: '/painel/psicologo/pagamentos' },
  ]
}

export const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'] as const
export const MODALITY_LABEL: Record<Modality, string> = {
  online: 'Online',
  presencial: 'Presencial',
  ambos: 'Online e presencial',
}
export const WEEKDAY_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] as const
