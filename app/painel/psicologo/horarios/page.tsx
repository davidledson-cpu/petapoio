import { PanelHeader } from '@/components/panel-shell'
import { AddSlotForm, AddTimeOffForm } from '@/components/psych/schedule-forms'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { ensurePsychologistRow, WEEKDAYS } from '@/lib/psychologist'
import { dateTime } from '@/lib/format'
import { removeSlot, removeTimeOff } from './actions'
import type { Availability, TimeOff } from '@/types/db'

export default async function HorariosPage() {
  const session = await requireSession(['psicologo'], '/painel/psicologo/horarios')
  const psych = await ensurePsychologistRow(session)
  const supabase = await createClient()

  const [{ data: slots }, { data: offs }] = await Promise.all([
    supabase
      .from('availability')
      .select('*')
      .eq('psychologist_id', session.userId)
      .order('weekday')
      .order('start_time')
      .returns<Availability[]>(),
    supabase
      .from('time_off')
      .select('*')
      .eq('psychologist_id', session.userId)
      .gte('ends_at', new Date().toISOString())
      .order('starts_at')
      .returns<TimeOff[]>(),
  ])

  const byDay = WEEKDAYS.map((label, i) => ({ label, slots: (slots ?? []).filter((s) => s.weekday === i) }))

  return (
    <>
      <PanelHeader
        title="Horários"
        intro={`Defina as faixas em que você atende (horário de Brasília). Os pacientes veem horários livres de ${psych?.session_minutes ?? 50} minutos dentro dessas faixas.`}
      />

      <section className="rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
        <h2 className="mb-5 text-2xl">Semana de atendimento</h2>
        <ul className="divide-y divide-areia border-y border-areia">
          {byDay.map((day) => (
            <li key={day.label} className="grid gap-2 py-4 sm:grid-cols-[8rem_1fr] sm:items-center">
              <span className="font-semibold">{day.label}</span>
              {day.slots.length ? (
                <ul className="flex flex-wrap gap-2">
                  {day.slots.map((s) => (
                    <li key={s.id} className="flex items-center gap-1 rounded-full bg-salvia-clara py-1 pl-4 pr-1 text-salvia-noite">
                      {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                      <form action={removeSlot}>
                        <input type="hidden" name="id" value={s.id} />
                        <button
                          type="submit"
                          className="flex size-7 items-center justify-center rounded-full hover:bg-white/70"
                          aria-label={`Remover ${day.label} ${s.start_time.slice(0, 5)} a ${s.end_time.slice(0, 5)}`}
                        >
                          ×
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              ) : (
                <span className="text-grafite-suave">Sem atendimento</span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          <h3 className="mb-3 font-sans text-lg font-semibold">Adicionar faixa de horário</h3>
          <AddSlotForm />
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-[0_1px_0_var(--color-areia)] md:p-8">
        <h2 className="text-2xl">Folgas e bloqueios</h2>
        <p className="mb-5 mt-2 text-grafite-suave">Férias, feriados ou compromissos: nesses períodos ninguém consegue agendar.</p>
        {offs && offs.length > 0 && (
          <ul className="mb-6 divide-y divide-areia border-y border-areia">
            {offs.map((o) => (
              <li key={o.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <span>
                  {dateTime(o.starts_at)} até {dateTime(o.ends_at)}
                  {o.reason && <span className="text-grafite-suave"> · {o.reason}</span>}
                </span>
                <form action={removeTimeOff}>
                  <input type="hidden" name="id" value={o.id} />
                  <button type="submit" className="link text-[0.95rem]">Remover</button>
                </form>
              </li>
            ))}
          </ul>
        )}
        <AddTimeOffForm />
      </section>
    </>
  )
}
