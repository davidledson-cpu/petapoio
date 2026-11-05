import type { Availability, DirectoryEntry } from '@/types/db'

/**
 * Modo demonstração: perfis de EXEMPLO para mostrar o fluxo completo (vitrine, perfil, agenda)
 * enquanto não há profissionais aprovados. Liga só na pré-visualização da Vercel ou com
 * NEXT_PUBLIC_DEMO_MODE=true. Em produção fica desligado, a não ser que seja ligado de propósito.
 * Todo perfil de demonstração é identificado na tela; nada é cobrado.
 */
export function isDemoMode() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'false') return false
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.VERCEL_ENV === 'preview'
}

export const DEMO_PREFIX = 'demo-'

export function isDemoSlug(slug: string) {
  return slug.startsWith(DEMO_PREFIX)
}

const base: Pick<
  DirectoryEntry,
  'crp_state' | 'education' | 'languages' | 'photo_path' | 'mp_connected' | 'approved_at' | 'serves_children' | 'serves_families' | 'city' | 'state'
> = {
  crp_state: 'SP',
  education: null,
  languages: ['Português'],
  photo_path: null,
  mp_connected: true,
  approved_at: '2026-10-01T12:00:00Z',
  serves_children: false,
  serves_families: false,
  city: null,
  state: null,
}

export const DEMO_PSYCHOLOGISTS: DirectoryEntry[] = [
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000d1',
    slug: 'demo-psicologa-tcc',
    full_name: 'Helena (exemplo)',
    crp: '00/000001',
    headline: 'Acompanho tutores nos primeiros meses depois da perda, com foco em culpa e rotina.',
    bio: 'Perfil de demonstração. Aqui o profissional apresenta sua experiência com luto, como conduz as sessões e o que a pessoa pode esperar da primeira conversa.',
    approach: 'TCC',
    specialties: ['Luto pet', 'Culpa', 'Ansiedade'],
    pet_grief_experience: true,
    modality: 'online',
    session_price_cents: 15000,
    session_minutes: 50,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000d2',
    slug: 'demo-psicologo-psicanalise',
    full_name: 'Rafael (exemplo)',
    crp: '00/000002',
    headline: 'Escuta para quem sente que a saudade continua, mesmo depois de muito tempo.',
    bio: 'Perfil de demonstração. Os perfis reais mostram formação, abordagem, valor e agenda, sempre com o registro no CRP conferido.',
    approach: 'Psicanálise',
    specialties: ['Luto prolongado', 'Vínculo'],
    pet_grief_experience: true,
    modality: 'ambos',
    city: 'Belo Horizonte',
    state: 'MG',
    session_price_cents: 18000,
    session_minutes: 50,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000d3',
    slug: 'demo-psicologa-familias',
    full_name: 'Clara (exemplo)',
    crp: '00/000003',
    headline: 'Ajudo famílias a conversar com as crianças sobre a perda do animal.',
    bio: 'Perfil de demonstração. Profissionais que atendem crianças e famílias aparecem com essa informação no filtro e no perfil.',
    approach: 'Humanista',
    specialties: ['Crianças', 'Famílias', 'Luto pet'],
    pet_grief_experience: true,
    serves_children: true,
    serves_families: true,
    modality: 'online',
    session_price_cents: 16000,
    session_minutes: 60,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000d4',
    slug: 'demo-psicologo-antecipatorio',
    full_name: 'Marcos (exemplo)',
    crp: '00/000004',
    headline: 'Apoio para quem está vivendo a doença ou a despedida próxima do seu animal.',
    bio: 'Perfil de demonstração. O luto antecipatório também dói, e é um dos temas mais procurados.',
    approach: 'Análise do comportamento',
    specialties: ['Luto antecipatório', 'Eutanásia'],
    pet_grief_experience: true,
    modality: 'online',
    session_price_cents: 14000,
    session_minutes: 50,
  },
]

/** Agenda de exemplo: segunda a sexta, manhã e fim de tarde; sábado de manhã. */
export const DEMO_AVAILABILITY: Pick<Availability, 'weekday' | 'start_time' | 'end_time'>[] = [
  ...[1, 2, 3, 4, 5].flatMap((d) => [
    { weekday: d, start_time: '09:00:00', end_time: '12:00:00' },
    { weekday: d, start_time: '17:00:00', end_time: '20:00:00' },
  ]),
  { weekday: 6, start_time: '09:00:00', end_time: '12:00:00' },
]

export function demoBySlug(slug: string) {
  return DEMO_PSYCHOLOGISTS.find((p) => p.slug === slug) ?? null
}

/** Aplica os filtros da vitrine aos perfis de exemplo. */
export function filterDemo(f: Record<string, string | undefined>) {
  return DEMO_PSYCHOLOGISTS.filter((p) => {
    if (f.modalidade === 'online' && p.modality === 'presencial') return false
    if (f.modalidade === 'presencial' && p.modality === 'online') return false
    if (f.uf && p.state !== f.uf) return false
    if (f.ate && (p.session_price_cents ?? 0) > Number(f.ate) * 100) return false
    if (f.pet === '1' && !p.pet_grief_experience) return false
    if (f.criancas === '1' && !p.serves_children) return false
    if (f.familias === '1' && !p.serves_families) return false
    if (f.abordagem && !(p.approach ?? '').toLowerCase().includes(f.abordagem.toLowerCase())) return false
    return true
  })
}
