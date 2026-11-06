import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PanelHeader, StatusBadge, EmptyState } from '@/components/panel-shell'
import { HealthEventForm } from '@/components/saude/pet-forms'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ageLabel, dueLabel, EVENT_KINDS, shortDate, SPECIES_LABEL } from '@/lib/saude'
import { deleteHealthEvent, deletePet } from '../actions'
import type { Pet, PetHealthEvent } from '@/types/db'

export const metadata = { title: 'Carteira de saúde' }

export default async function PetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound()
  await requireSession(undefined, `/painel/pets/${id}`)
  const supabase = await createClient()
  const { data: pet } = await supabase.from('pets').select('*').eq('id', id).maybeSingle<Pet>()
  if (!pet) notFound()
  const { data: events } = await supabase
    .from('pet_health_events')
    .select('*')
    .eq('pet_id', id)
    .order('occurred_on', { ascending: false })
    .returns<PetHealthEvent[]>()

  const info = [SPECIES_LABEL[pet.species], pet.breed, ageLabel(pet.birth_date), pet.weight_kg ? `${String(pet.weight_kg).replace('.', ',')} kg` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <>
      <p className="mb-2 text-[0.95rem]"><Link href="/painel/pets" className="link">Meus pets</Link></p>
      <PanelHeader title={pet.name} intro={info} />
      {pet.notes && <p className="-mt-4 mb-8 max-w-[62ch] text-grafite-suave">{pet.notes}</p>}

      <div className="grid gap-10 xl:grid-cols-[1.3fr_1fr]">
        <section aria-labelledby="historico">
          <h2 id="historico" className="text-2xl">Histórico</h2>
          {events && events.length > 0 ? (
            <ol className="mt-4 divide-y divide-areia rounded-2xl bg-white shadow-[0_1px_0_var(--color-areia)]">
              {events.map((e) => {
                const due = e.next_due_on ? dueLabel(e.next_due_on) : null
                return (
                  <li key={e.id} className="grid gap-1 p-5 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-4">
                    <div>
                      <p className="text-sm text-grafite-suave">{EVENT_KINDS[e.kind]} · {shortDate(e.occurred_on)}</p>
                      <p className="font-semibold">{e.title}</p>
                      {e.notes && <p className="mt-1 text-[0.95rem] text-grafite-suave">{e.notes}</p>}
                    </div>
                    <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                      {due && <StatusBadge tone={due.tone}>Lembrete: {due.text}</StatusBadge>}
                      <form action={deleteHealthEvent}>
                        <input type="hidden" name="id" value={e.id} />
                        <input type="hidden" name="pet_id" value={pet.id} />
                        <button type="submit" className="text-sm text-grafite-suave underline underline-offset-4 hover:text-alerta">Remover</button>
                      </form>
                    </div>
                  </li>
                )
              })}
            </ol>
          ) : (
            <div className="mt-4">
              <EmptyState title="Nenhum registro ainda">
                Comece pela última vacina ou consulta. Se souber a data da próxima dose, o painel avisa quando estiver chegando.
              </EmptyState>
            </div>
          )}
          <p className="mt-6 text-sm text-grafite-suave">
            A carteira é um registro seu e não substitui a orientação do veterinário sobre vacinas, doses e tratamentos.
          </p>
        </section>

        <section aria-labelledby="novo-registro">
          <h2 id="novo-registro" className="text-2xl">Novo registro</h2>
          <div className="mt-4 rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)]"><HealthEventForm petId={pet.id} /></div>
          <form action={deletePet} className="mt-8">
            <input type="hidden" name="id" value={pet.id} />
            <button type="submit" className="text-sm text-grafite-suave underline underline-offset-4 hover:text-alerta">
              Apagar {pet.name} e todos os registros
            </button>
          </form>
        </section>
      </div>
    </>
  )
}
