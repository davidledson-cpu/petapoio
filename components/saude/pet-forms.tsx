'use client'

import { useActionState, useRef, useEffect } from 'react'
import { addHealthEvent, addPet } from '@/app/painel/pets/actions'
import { initialFormState } from '@/lib/form-state'
import { EVENT_KINDS } from '@/lib/saude'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'

const today = () => new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10)

export function PetForm() {
  const [state, action, pending] = useActionState(addPet, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-4">
      {state.status === 'error' && !state.fieldErrors && <FormStatus state={state} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="name" label="Nome" required maxLength={60} error={err.name} />
        <Field name="species" label="Espécie" error={err.species}>
          {(a) => (
            <select {...a} className="campo" defaultValue="cao">
              <option value="cao">Cão</option><option value="gato">Gato</option><option value="outros">Outro</option>
            </select>
          )}
        </Field>
        <Field name="breed" label="Raça" optional maxLength={60} error={err.breed} />
        <Field name="birth_date" label="Nascimento (aproximado)" optional type="date" max={today()} error={err.birth_date} />
        <Field name="weight_kg" label="Peso em kg" optional inputMode="decimal" placeholder="Ex.: 12,5" error={err.weight_kg} />
      </div>
      <Field name="notes" label="Observações" optional error={err.notes} hint="Alergias informadas pelo veterinário, ração, temperamento.">
        {(a) => <textarea {...a} rows={2} maxLength={1000} className="campo" />}
      </Field>
      <SubmitButton pending={pending}>Cadastrar pet</SubmitButton>
    </form>
  )
}

export function HealthEventForm({ petId }: { petId: string }) {
  const [state, action, pending] = useActionState(addHealthEvent, initialFormState)
  const ref = useRef<HTMLFormElement>(null)
  const err = state.fieldErrors ?? {}
  useEffect(() => {
    if (state.status === 'success') ref.current?.reset()
  }, [state])
  return (
    <form ref={ref} action={action} onSubmit={submitWithoutReset(action)} className="space-y-4">
      <input type="hidden" name="pet_id" value={petId} />
      <FormStatus state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="kind" label="Tipo" error={err.kind}>
          {(a) => (
            <select {...a} className="campo" defaultValue="vacina">
              {Object.entries(EVENT_KINDS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
        </Field>
        <Field name="title" label="O quê" required maxLength={120} placeholder="Ex.: V10, check-up, hemograma" error={err.title} />
        <Field name="occurred_on" label="Data" type="date" required max={today()} defaultValue={today()} error={err.occurred_on} />
        <Field name="next_due_on" label="Lembrar em" optional type="date" error={err.next_due_on} hint="Próxima dose, retorno ou fim do tratamento." />
      </div>
      <Field name="notes" label="Anotações" optional error={err.notes}>
        {(a) => <textarea {...a} rows={2} maxLength={1000} className="campo" />}
      </Field>
      <SubmitButton pending={pending} pendingLabel="Salvando…">Salvar registro</SubmitButton>
    </form>
  )
}
