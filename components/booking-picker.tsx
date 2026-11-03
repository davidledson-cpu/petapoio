'use client'

import { useActionState, useState } from 'react'
import { bookSession } from '@/app/psicologos/actions'
import { initialFormState } from '@/lib/form-state'
import type { DaySlots } from '@/lib/slots'
import { FormStatus, submitWithoutReset } from './form-ui'

/** Escolha de dia e horário; o envio reserva no banco e abre o pagamento. */
export function BookingPicker({
  days,
  psychologistId,
  slug,
  priceLabel,
  preselected,
  loggedIn,
}: {
  days: DaySlots[]
  psychologistId: string
  slug: string
  priceLabel: string
  preselected?: string
  loggedIn: boolean
}) {
  const [state, action, pending] = useActionState(bookSession, initialFormState)
  const initialDay = days.findIndex((d) => d.slots.some((s) => s.startsAt === preselected))
  const [dayIndex, setDayIndex] = useState(initialDay >= 0 ? initialDay : 0)
  const [selected, setSelected] = useState(preselected && initialDay >= 0 ? preselected : '')
  const day = days[dayIndex]

  if (days.length === 0) {
    return (
      <p className="text-grafite-suave">
        Não há horários livres nas próximas três semanas. Volte em alguns dias: a agenda é atualizada pelo profissional.
      </p>
    )
  }

  const chosen = days.flatMap((d) => d.slots.map((s) => ({ ...s, day: d }))).find((s) => s.startsAt === selected)

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-5">
      <input type="hidden" name="psychologist_id" value={psychologistId} />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="starts_at" value={selected} />

      <fieldset>
        <legend className="rotulo">Dia</legend>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="radiogroup">
          {days.map((d, i) => (
            <button
              key={d.date}
              type="button"
              role="radio"
              aria-checked={i === dayIndex}
              onClick={() => {
                setDayIndex(i)
                setSelected('')
              }}
              className={`shrink-0 rounded-xl border-[1.5px] px-3 py-2 text-center ${
                i === dayIndex ? 'border-salvia-funda bg-salvia-clara' : 'border-areia-escura bg-white hover:border-salvia'
              }`}
            >
              <span className="block text-sm capitalize text-grafite-suave">{d.weekday.split('-')[0]}</span>
              <span className="block font-semibold">{d.dayLabel}</span>
            </button>
          ))}
        </div>
      </fieldset>

      {day && (
        <fieldset>
          <legend className="rotulo">Horário (Brasília)</legend>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4" role="radiogroup">
            {day.slots.map((s) => (
              <button
                key={s.startsAt}
                type="button"
                role="radio"
                aria-checked={selected === s.startsAt}
                onClick={() => setSelected(s.startsAt)}
                className={`rounded-full border-[1.5px] py-2 font-semibold ${
                  selected === s.startsAt ? 'border-salvia-funda bg-salvia-funda text-linho' : 'border-areia-escura bg-white hover:border-salvia'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      <FormStatus state={state} />

      <div className="rounded-xl bg-linho-escuro p-4 text-[0.97rem]">
        {chosen ? (
          <p>
            <span className="capitalize">{chosen.day.weekday}</span>, {chosen.day.dayLabel}, às {chosen.label} · <strong>{priceLabel}</strong>
          </p>
        ) : (
          <p className="text-grafite-suave">Escolha um horário para continuar.</p>
        )}
      </div>

      <button type="submit" disabled={!selected || pending} className="btn btn-primario w-full disabled:opacity-60">
        {pending ? 'Reservando…' : loggedIn ? 'Reservar e ir para o pagamento' : 'Entrar para reservar'}
      </button>
      <p className="dica">
        O horário fica reservado por 30 minutos enquanto você paga. Pix ou cartão pelo Mercado Pago. Cancelamento com reembolso
        até 24 horas antes.
      </p>
    </form>
  )
}
