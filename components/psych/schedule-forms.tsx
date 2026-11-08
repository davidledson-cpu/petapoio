'use client'

import { useActionState } from 'react'
import { addSlot, addTimeOff } from '@/app/painel/psicologo/horarios/actions'
import { initialFormState } from '@/lib/form-state'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'

const WEEKDAYS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

export function AddSlotForm() {
  const [state, action, pending] = useActionState(addSlot, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[1.3fr_1fr_1fr_auto] sm:items-end">
        <Field name="weekday" label="Dia" error={err.weekday}>
          {(a11y) => (
            <select {...a11y} defaultValue="1" className="campo">
              {WEEKDAYS.map((d, i) => (
                <option key={d} value={i}>{d}</option>
              ))}
            </select>
          )}
        </Field>
        <Field name="start_time" label="Das" type="time" step={900} defaultValue="09:00" required error={err.start_time} />
        <Field name="end_time" label="Até" type="time" step={900} defaultValue="12:00" required error={err.end_time} />
        <SubmitButton pending={pending} pendingLabel="Salvando…">Adicionar</SubmitButton>
      </div>
      <FormStatus state={state} />
    </form>
  )
}

export function AddTimeOffForm() {
  const [state, action, pending] = useActionState(addTimeOff, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="starts_at" label="Início" type="datetime-local" required error={err.starts_at} />
        <Field name="ends_at" label="Fim" type="datetime-local" required error={err.ends_at} />
      </div>
      <Field name="reason" label="Motivo" optional maxLength={120} placeholder="Ex.: férias" error={err.reason} hint="Só você vê." />
      <SubmitButton pending={pending} pendingLabel="Salvando…">Bloquear período</SubmitButton>
      <FormStatus state={state} />
    </form>
  )
}
