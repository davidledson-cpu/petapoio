'use client'

import { useActionState } from 'react'
import { updateMyProfile } from '@/app/painel/actions'
import { initialFormState } from '@/lib/form-state'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from './form-ui'

export function MyProfileForm({ fullName, phone }: { fullName: string; phone: string | null }) {
  const [state, action, pending] = useActionState(updateMyProfile, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="max-w-lg space-y-5">
      <FormStatus state={state} />
      <Field name="full_name" label="Nome" defaultValue={fullName} autoComplete="name" required error={err.full_name} />
      <Field name="phone" label="Telefone" optional defaultValue={phone ?? ''} type="tel" autoComplete="tel" error={err.phone} />
      <SubmitButton pending={pending} pendingLabel="Salvando…">Salvar dados</SubmitButton>
    </form>
  )
}
