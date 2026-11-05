import 'server-only'
import { createClient } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/env'
import type { DirectoryEntry } from '@/types/db'
import { demoBySlug, filterDemo, isDemoMode, isDemoSlug } from '@/lib/demo'

export type DirectoryFilters = {
  modalidade?: string
  uf?: string
  ate?: string
  pet?: string
  criancas?: string
  familias?: string
  abordagem?: string
}

/** Psicólogos aprovados e com pagamento ativo, com filtros vindos da URL. */
export async function listDirectory(f: DirectoryFilters): Promise<DirectoryEntry[] | null> {
  const real = await listReal(f)
  // Sem profissionais reais ainda: na pré-visualização, mostra os perfis de exemplo.
  if ((real === null || real.length === 0) && isDemoMode()) return filterDemo(f)
  return real
}

async function listReal(f: DirectoryFilters): Promise<DirectoryEntry[] | null> {
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  let q = supabase.from('psychologist_directory').select('*').eq('mp_connected', true)
  if (f.modalidade === 'online') q = q.in('modality', ['online', 'ambos'])
  if (f.modalidade === 'presencial') q = q.in('modality', ['presencial', 'ambos'])
  if (f.uf && /^[A-Z]{2}$/.test(f.uf)) q = q.eq('state', f.uf)
  if (f.ate && /^\d+$/.test(f.ate)) q = q.lte('session_price_cents', Number(f.ate) * 100)
  if (f.pet === '1') q = q.eq('pet_grief_experience', true)
  if (f.criancas === '1') q = q.eq('serves_children', true)
  if (f.familias === '1') q = q.eq('serves_families', true)
  if (f.abordagem) q = q.ilike('approach', `%${f.abordagem.replace(/[%_,()]/g, '').slice(0, 40)}%`)
  // Ordem estável e não comprável: experiência com luto pet primeiro, depois mais antigos na plataforma.
  const { data, error } = await q.order('pet_grief_experience', { ascending: false }).order('approved_at', { ascending: true })
  if (error) {
    console.error('directory failed', error.message)
    return []
  }
  return data as DirectoryEntry[]
}

export async function getDirectoryEntry(slug: string): Promise<DirectoryEntry | null> {
  if (isDemoSlug(slug)) return isDemoMode() ? demoBySlug(slug) : null
  if (!isSupabaseConfigured()) return null
  const supabase = await createClient()
  const { data } = await supabase.from('psychologist_directory').select('*').eq('slug', slug).maybeSingle<DirectoryEntry>()
  return data
}
