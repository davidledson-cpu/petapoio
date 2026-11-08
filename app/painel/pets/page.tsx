import Link from 'next/link'
import { PanelHeader, StatusBadge } from '@/components/panel-shell'
import { PetForm } from '@/components/saude/pet-forms'
import { Icon } from '@/components/icon'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ageLabel, dueLabel, isoInDays, SPECIES_LABEL } from '@/lib/saude'
import type { Pet, PetHealthEvent } from '@/types/db'

export const metadata = { title: 'Meus pets' }

export default async function PetsPage() {
  const { userId } = await requireSession(undefined, '/painel/pets')
  const supabase = await createClient()
  const { data: pets } = await supabase.from('pets').select('*').eq('owner_id', userId).order('created_at').returns<Pet[]>()
  const ids = (pets ?? []).map((p) => p.id)
  const { data: due } = ids.length
    ? await supabase
        .from('pet_health_events')
        .select('*')
        .in('pet_id', ids)
        .not('next_due_on', 'is', null)
        .lte('next_due_on', isoInDays(30))
        .order('next_due_on')
        .returns<PetHealthEvent[]>()
    : { data: [] as PetHealthEvent[] }
  const byPet = new Map((pets ?? []).map((p) => [p.id, p]))

  return (
    <>
      <PanelHeader
        title="Meus pets"
        intro="Carteira digital de saúde: vacinas, consultas, exames e lembretes. Só você vê esses registros."
      />

      {due && due.length > 0 && (
        <section className="mb-10 rounded-2xl bg-[#faf3ec] p-6" aria-labelledby="lembretes">
          <h2 id="lembretes" className="flex items-center gap-2 font-sans text-lg font-bold"><Icon name="bell" className="size-5" /> Lembretes dos próximos 30 dias</h2>
          <ul className="mt-4 divide-y divide-areia">
            {due.map((e) => {
              const l = dueLabel(e.next_due_on!)
              return (
                <li key={e.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                  <Link href={`/painel/pets/${e.pet_id}`} className="hover:underline"><strong>{byPet.get(e.pet_id)?.name}</strong> · {e.title}</Link>
                  <StatusBadge tone={l.tone}>{l.text}</StatusBadge>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {pets && pets.length > 0 && (
        <ul className="mb-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {pets.map((p) => (
            <li key={p.id}>
              <Link href={`/painel/pets/${p.id}`} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)] hover:shadow-[0_10px_30px_-20px_rgba(46,42,39,.5)]">
                <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-salvia-clara text-salvia-noite"><Icon name="paw" className="size-7" /></span>
                <span>
                  <span className="block font-serif text-2xl">{p.name}</span>
                  <span className="text-sm text-grafite-suave">
                    {[SPECIES_LABEL[p.species], p.breed, ageLabel(p.birth_date), p.weight_kg ? `${String(p.weight_kg).replace('.', ',')} kg` : null].filter(Boolean).join(' · ')}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <section aria-labelledby="novo-pet" className="max-w-2xl">
        <h2 id="novo-pet" className="text-2xl">{pets && pets.length > 0 ? 'Cadastrar outro pet' : 'Cadastre seu primeiro pet'}</h2>
        <p className="mt-1 text-grafite-suave">Só o nome e a espécie são obrigatórios.</p>
        <div className="mt-5 rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]"><PetForm /></div>
      </section>
    </>
  )
}
