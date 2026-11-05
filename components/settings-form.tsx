'use client'

import { useActionState } from 'react'
import { saveSettings } from '@/app/admin/actions'
import { initialFormState } from '@/lib/form-state'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from './form-ui'
import type { PlatformSettings } from '@/types/db'

export function SettingsForm({ s }: { s: PlatformSettings }) {
  const [state, action, pending] = useActionState(saveSettings, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="max-w-2xl space-y-8">
      <FormStatus state={state} />
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 font-serif text-2xl">Sessões</legend>
        <Field name="platform_fee_percent" label="Comissão da PetApoio (%)" type="number" step="0.5" min={0} max={50} defaultValue={s.platform_fee_percent} error={err.platform_fee_percent} hint="Retida automaticamente pelo split." />
        <Field name="booking_hold_minutes" label="Tempo para pagar (min)" type="number" min={5} max={120} defaultValue={s.booking_hold_minutes} error={err.booking_hold_minutes} />
        <Field name="min_notice_hours" label="Antecedência mínima (h)" type="number" min={0} max={168} defaultValue={s.min_notice_hours} error={err.min_notice_hours} />
        <Field name="cancel_refund_hours" label="Reembolso se cancelar com (h)" type="number" min={0} max={168} defaultValue={s.cancel_refund_hours} error={err.cancel_refund_hours} />
      </fieldset>
      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 font-serif text-2xl">Loja</legend>
        <Field name="shipping_flat_cents" label="Frete fixo (R$)" type="number" step="0.01" min={0} defaultValue={(s.shipping_flat_cents / 100).toFixed(2)} error={err.shipping_flat_cents} />
        <Field name="free_shipping_from_cents" label="Frete grátis a partir de (R$)" type="number" step="0.01" min={0} defaultValue={(s.free_shipping_from_cents / 100).toFixed(2)} error={err.free_shipping_from_cents} />
      </fieldset>
      <SubmitButton pending={pending} pendingLabel="Salvando…">Salvar configurações</SubmitButton>
    </form>
  )
}
