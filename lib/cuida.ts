import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import { isDemoMode, DEMO_PREFIX } from '@/lib/demo'
import type { CaregiverEntry } from '@/types/db'
import {
  distanceKm,
  LEVELS,
  NEIGHBORHOODS,
  priceFor,
  type CareLevel,
  type CareService,
  type PetSize,
  type Species,
} from '@/lib/cuida-shared'

export type CaregiverFilters = {
  bairro?: string
  raio?: string
  servico?: string
  porte?: string
  especie?: string
  ate?: string
  nivel?: string
  idosos?: string
  remedio?: string
}

export type CaregiverResult = CaregiverEntry & { distance: number | null; demo: boolean }

const base = {
  city: 'Belo Horizonte',
  radius_km: 5,
  species: ['cao'] as Species[],
  pet_sizes: ['pequeno', 'medio'] as PetSize[],
  qualifications: null,
  price_hosting_cents: null,
  price_visit_cents: null,
  price_walk_cents: null,
  price_daycare_cents: null,
  gives_medication: false,
  accepts_seniors: false,
  accepts_puppies: false,
  has_yard: false,
  approved_at: '2026-10-20T12:00:00Z',
}

/**
 * Perfis de EXEMPLO para mostrar a busca e a solicitação enquanto a rede-piloto é formada.
 * Só aparecem no modo demonstração e sempre identificados na tela.
 */
export const DEMO_CAREGIVERS: CaregiverEntry[] = [
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000c1',
    slug: `${DEMO_PREFIX}cuidadora-buritis`,
    full_name: 'Marina (exemplo)',
    level: 'qualificado',
    neighborhood: 'Buritis',
    services: ['hospedagem', 'visita', 'creche'],
    species: ['cao', 'gato'],
    pet_sizes: ['pequeno', 'medio', 'grande'],
    headline: 'Casa com quintal fechado, rotina tranquila e fotos todos os dias.',
    bio: 'Perfil de demonstração. Aqui o cuidador conta como é a casa, a rotina com os pets hospedados e o que o tutor pode esperar.',
    experience: 'Perfil de demonstração: anos de experiência, tipos de pet com quem já conviveu e situações que sabe conduzir.',
    qualifications: 'Curso de primeiros socorros pet (exemplo).',
    price_hosting_cents: 9500,
    price_visit_cents: 6000,
    price_daycare_cents: 7000,
    gives_medication: true,
    accepts_seniors: true,
    has_yard: true,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000c2',
    slug: `${DEMO_PREFIX}passeador-estoril`,
    full_name: 'Thiago (exemplo)',
    level: 'verificado',
    neighborhood: 'Estoril',
    services: ['passeio', 'visita'],
    pet_sizes: ['pequeno', 'medio', 'grande'],
    headline: 'Passeios de 45 minutos, individuais ou em dupla, com relatório do percurso.',
    bio: 'Perfil de demonstração. Os perfis reais mostram nível de verificação, serviços, preços e o bairro de atendimento.',
    experience: 'Perfil de demonstração.',
    price_walk_cents: 4000,
    price_visit_cents: 5500,
    accepts_puppies: true,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000c3',
    slug: `${DEMO_PREFIX}cuidadora-especializada-sion`,
    full_name: 'Lúcia (exemplo)',
    level: 'especializado',
    neighborhood: 'Sion',
    services: ['hospedagem', 'especiais', 'visita'],
    species: ['cao', 'gato'],
    pet_sizes: ['pequeno', 'medio'],
    headline: 'Experiência com pets idosos e com medicação prescrita pelo veterinário.',
    bio: 'Perfil de demonstração. Cuidados especiais respeitam os limites do cuidador: nada de diagnóstico, prescrição ou procedimento clínico.',
    experience: 'Perfil de demonstração.',
    qualifications: 'Formação técnica em cuidados com animais (exemplo).',
    price_hosting_cents: 12000,
    price_visit_cents: 7000,
    gives_medication: true,
    accepts_seniors: true,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000c4',
    slug: `${DEMO_PREFIX}creche-havai`,
    full_name: 'Bruno (exemplo)',
    level: 'cadastrado',
    neighborhood: 'Havaí',
    services: ['creche', 'passeio'],
    pet_sizes: ['medio', 'grande'],
    headline: 'Creche diurna para cães sociáveis, com área externa e descanso à tarde.',
    bio: 'Perfil de demonstração.',
    experience: 'Perfil de demonstração.',
    price_daycare_cents: 6500,
    price_walk_cents: 3500,
    has_yard: true,
    accepts_puppies: true,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000c5',
    slug: `${DEMO_PREFIX}cuidadora-gatos-santo-antonio`,
    full_name: 'Paula (exemplo)',
    level: 'verificado',
    neighborhood: 'Santo Antônio',
    services: ['visita', 'hospedagem'],
    species: ['gato'],
    pet_sizes: ['pequeno', 'medio'],
    headline: 'Só gatos: visitas calmas, caixa de areia limpa e respeito ao tempo de cada um.',
    bio: 'Perfil de demonstração.',
    experience: 'Perfil de demonstração.',
    price_visit_cents: 5000,
    price_hosting_cents: 8000,
    gives_medication: true,
  },
  {
    ...base,
    id: '00000000-0000-4000-8000-0000000000c6',
    slug: `${DEMO_PREFIX}cuidador-pampulha`,
    full_name: 'Rogério (exemplo)',
    level: 'qualificado',
    neighborhood: 'Pampulha',
    services: ['hospedagem', 'passeio', 'creche'],
    pet_sizes: ['medio', 'grande'],
    headline: 'Casa ampla perto da orla, ideal para cães grandes e cheios de energia.',
    bio: 'Perfil de demonstração.',
    experience: 'Perfil de demonstração.',
    price_hosting_cents: 10000,
    price_walk_cents: 4500,
    price_daycare_cents: 7500,
    has_yard: true,
  },
]

function isService(v: string | undefined): v is CareService {
  return !!v && ['hospedagem', 'visita', 'passeio', 'creche', 'especiais'].includes(v)
}

/** Aplica filtros e ordena por distância (sem ranking pago); nível de verificação desempata. */
function applyFilters(rows: CaregiverEntry[], f: CaregiverFilters, demo: boolean): CaregiverResult[] {
  const origin = f.bairro && NEIGHBORHOODS[f.bairro] ? f.bairro : null
  const radius = Number(f.raio) || 0
  const service = isService(f.servico) ? f.servico : null
  const max = /^\d+$/.test(f.ate ?? '') ? Number(f.ate) * 100 : null
  const minLevel = f.nivel && f.nivel in LEVELS ? LEVELS[f.nivel as CareLevel].order : 0

  return rows
    .map((c) => ({ ...c, distance: origin ? distanceKm(origin, c.neighborhood) : null, demo }))
    .filter((c) => {
      if (service && !c.services.includes(service)) return false
      if (f.porte && !c.pet_sizes.includes(f.porte as PetSize)) return false
      if (f.especie && !c.species.includes(f.especie as Species)) return false
      if (LEVELS[c.level].order < minLevel) return false
      if (f.idosos === '1' && !c.accepts_seniors) return false
      if (f.remedio === '1' && !c.gives_medication) return false
      if (max !== null) {
        const p = service ? priceFor(c, service) : Math.min(...['hospedagem', 'visita', 'passeio', 'creche'].map((s) => priceFor(c, s as CareService) ?? Infinity))
        if (p === null || p > max) return false
      }
      if (origin && radius > 0 && c.distance !== null && c.distance > radius) return false
      return true
    })
    .sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0) || LEVELS[b.level].order - LEVELS[a.level].order)
}

export async function listCaregivers(f: CaregiverFilters): Promise<CaregiverResult[] | null> {
  const real = await listReal()
  if ((real === null || real.length === 0) && isDemoMode()) return applyFilters(DEMO_CAREGIVERS, f, true)
  if (real === null) return null
  return applyFilters(real, f, false)
}

async function listReal(): Promise<CaregiverEntry[] | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data, error } = await supabase.from('caregiver_directory').select('*').limit(500)
  if (error) {
    console.error('caregiver directory failed', error.message)
    return []
  }
  return data as CaregiverEntry[]
}

export async function getCaregiver(slug: string): Promise<(CaregiverEntry & { demo: boolean }) | null> {
  if (slug.startsWith(DEMO_PREFIX)) {
    const d = isDemoMode() ? DEMO_CAREGIVERS.find((c) => c.slug === slug) : undefined
    return d ? { ...d, demo: true } : null
  }
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from('caregiver_directory').select('*').eq('slug', slug).maybeSingle<CaregiverEntry>()
  return data ? { ...data, demo: false } : null
}

/** Comissão atual do Cuida (configurável no painel). */
export async function careFeePercent(): Promise<number> {
  if (!isSupabaseConfigured()) return 18
  const supabase = await createClient()
  const { data } = await supabase.from('platform_settings').select('care_fee_percent').maybeSingle<{ care_fee_percent: number }>()
  return Number(data?.care_fee_percent ?? 18)
}
