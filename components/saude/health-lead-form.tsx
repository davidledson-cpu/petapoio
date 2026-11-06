'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { joinHealthList } from '@/app/saude/actions'
import { initialFormState } from '@/lib/form-state'
import { BUDGETS, INTERESTS } from '@/lib/saude'
import { Field, FieldError, FormStatus, Honeypot, SubmitButton, submitWithoutReset } from '@/components/form-ui'

/** Lista do PetApoio Saúde: três perguntas para entender o que o tutor procura. */
export function HealthLeadForm() {
  const [state, action, pending] = useActionState(joinHealthList, initialFormState)
  const err = state.fieldErrors ?? {}
  if (state.status === 'success') return <FormStatus state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-5">
      <Honeypot />
      {state.status === 'error' && !state.fieldErrors && <FormStatus state={state} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="species" label="Seu pet" error={err.species}>
          {(a) => (
            <select {...a} className="campo" defaultValue="cao">
              <option value="cao">Cão</option><option value="gato">Gato</option><option value="outros">Outro</option>
            </select>
          )}
        </Field>
        <Field name="pet_age" label="Fase de vida" error={err.pet_age}>
          {(a) => (
            <select {...a} className="campo" defaultValue="adulto">
              <option value="filhote">Filhote</option><option value="adulto">Adulto</option><option value="idoso">Idoso</option>
            </select>
          )}
        </Field>
      </div>
      <div>
        <p className="rotulo">O que é mais importante para você?</p>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map(([v, l]) => (
            <label key={v} className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-areia-escura bg-white px-3.5 py-1.5 text-[0.95rem] has-[:checked]:border-salvia-funda has-[:checked]:bg-salvia-clara">
              <input type="checkbox" name="interests" value={v} className="size-4 accent-salvia-funda" />{l}
            </label>
          ))}
        </div>
        <FieldError id="f-interests-erro" message={err.interests} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="budget" label="Quanto faria sentido pagar?" optional error={err.budget}>
          {(a) => (
            <select {...a} className="campo" defaultValue="nao_sei">
              {BUDGETS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
        </Field>
        <Field name="city" label="Cidade" optional maxLength={80} error={err.city} />
      </div>
      <Field name="email" label="Seu e-mail" type="email" autoComplete="email" required error={err.email} />
      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
          <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
          <span>Li e aceito a <Link href="/privacidade" className="link">política de privacidade</Link>. Posso cancelar quando quiser.</span>
        </label>
        <FieldError id="f-consent-erro" message={err.consent} />
      </div>
      <SubmitButton pending={pending} className="w-full sm:w-auto">Quero ser avisado</SubmitButton>
    </form>
  )
}
