'use client'

import { useActionState } from 'react'
import { updateOrder } from '@/app/admin/pedidos/actions'
import { initialFormState } from '@/lib/form-state'
import { ORDER_STATUS } from '@/lib/format'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'
import type { OrderStatus } from '@/types/db'

export function OrderAdminForm({ id, status, tracking }: { id: string; status: OrderStatus; tracking: string | null }) {
  const [state, action, pending] = useActionState(updateOrder, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-5">
      <FormStatus state={state} />
      <input type="hidden" name="id" value={id} />
      <Field name="status" label="Status" error={err.status} hint={status === 'aguardando_pagamento' ? 'Use "Pagamento aprovado" só se o pagamento foi combinado fora do Mercado Pago.' : undefined}>
        {(a11y) => (
          <select {...a11y} defaultValue={status} className="campo">
            {Object.entries(ORDER_STATUS).map(([v, l]) => (
              <option key={v} value={v}>{l}</option>
            ))}
          </select>
        )}
      </Field>
      <Field name="tracking_code" label="Código de rastreio" defaultValue={tracking ?? ''} optional error={err.tracking_code} />
      <SubmitButton pending={pending} pendingLabel="Salvando…">Salvar alterações</SubmitButton>
    </form>
  )
}
