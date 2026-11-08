import { PanelHeader } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateOnly } from '@/lib/format'
import { setRole } from '../actions'
import type { Profile } from '@/types/db'

const ROLES = { paciente: 'Paciente', psicologo: 'Psicólogo', admin: 'Admin' } as const

export default async function UsuariosPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const { userId } = await requireSession(['admin'], '/admin/usuarios')
  const supabase = await createClient()
  let query = supabase.from('profiles').select('*').order('created_at', { ascending: false }).limit(200)
  if (q) query = query.ilike('full_name', `%${q.replace(/[%_,()]/g, '').slice(0, 60)}%`)
  const { data } = await query
  const rows = (data ?? []) as Profile[]

  return (
    <>
      <PanelHeader title="Usuários" intro="Para tornar alguém administrador, a pessoa precisa ter criado a conta antes." />
      <form className="mb-6 flex max-w-md gap-3">
        <label htmlFor="q" className="sr-only">Buscar por nome</label>
        <input id="q" name="q" defaultValue={q} placeholder="Buscar por nome" className="campo" />
        <button className="btn btn-secundario">Buscar</button>
      </form>
      <ul className="divide-y divide-areia border-y border-areia">
        {rows.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
            <span>
              <span className="font-semibold">{u.full_name || 'Sem nome'}</span>
              <span className="text-sm text-grafite-suave"> · desde {dateOnly(u.created_at)}</span>
            </span>
            {u.id === userId ? (
              <span className="text-sm text-grafite-suave">{ROLES[u.role]} (você)</span>
            ) : (
              <form action={setRole} className="flex items-center gap-2">
                <input type="hidden" name="id" value={u.id} />
                <label className="sr-only" htmlFor={`role-${u.id}`}>Papel de {u.full_name}</label>
                <select id={`role-${u.id}`} name="role" defaultValue={u.role} className="campo !w-auto !py-1.5">
                  {Object.entries(ROLES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <button className="btn btn-secundario !min-h-9 !py-1.5">Salvar</button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}
