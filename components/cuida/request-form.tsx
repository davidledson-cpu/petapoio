'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { requestCare } from '@/app/cuida/actions'
import { initialFormState } from '@/lib/form-state'
import { money } from '@/lib/format'
import { priceFor, SERVICES, SIZES, SPECIES_ONE, unitsFor, type CareService, type CaregiverPrices, type PetSize, type Species } from '@/lib/cuida-shared'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'

type Props = {
  caregiver: CaregiverPrices & { id: string; slug: string; services: CareService[]; species: Species[]; pet_sizes: PetSize[] }
  feePercent: number
}

function today() {
  return new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10)
}

/** Solicitação de reserva com o valor total calculado na hora, antes de enviar. */
export function RequestForm({ caregiver, feePercent }: Props) {
  const [state, action, pending] = useActionState(requestCare, initialFormState)
  const offered = caregiver.services.filter((s) => priceFor(caregiver, s) != null)
  const [service, setService] = useState<CareService>(offered[0] ?? caregiver.services[0] ?? 'visita')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const err = state.fieldErrors ?? {}

  const unit = priceFor(caregiver, service)
  const units = start && end ? unitsFor(service, start, end) : 0
  const total = unit != null && units > 0 ? unit * units : null
  const unitLabel = SERVICES[service].unit
  const summary = units > 0 ? `${units} ${unitLabel}${units > 1 ? 's' : ''}` : null

  if (state.status === 'success') return <FormStatus state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-4">
      <input type="hidden" name="caregiver_id" value={caregiver.id} />
      <input type="hidden" name="slug" value={caregiver.slug} />
      {state.status === 'error' && !state.fieldErrors && <FormStatus state={state} />}

      <Field name="service" label="Serviço" error={err.service}>
        {(a) => (
          <select {...a} className="campo" value={service} onChange={(e) => setService(e.target.value as CareService)}>
            {offered.map((s) => (
              <option key={s} value={s}>{SERVICES[s].short} · {money(priceFor(caregiver, s))}/{SERVICES[s].unit}</option>
            ))}
          </select>
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="start_date" label={service === 'hospedagem' ? 'Entrada' : 'Início'} type="date" min={today()} required value={start} onChange={(e) => { setStart(e.target.value); if (!end || e.target.value > end) setEnd(e.target.value) }} error={err.start_date} />
        <Field name="end_date" label={service === 'hospedagem' ? 'Saída' : 'Fim'} type="date" min={start || today()} required value={end} onChange={(e) => setEnd(e.target.value)} error={err.end_date} />
      </div>
      <Field name="pet_name" label="Nome do pet" required maxLength={60} error={err.pet_name} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field name="species" label="Espécie" error={err.species}>
          {(a) => (
            <select {...a} className="campo" defaultValue={caregiver.species[0]}>
              {caregiver.species.map((s) => <option key={s} value={s}>{SPECIES_ONE[s]}</option>)}
            </select>
          )}
        </Field>
        <Field name="pet_size" label="Porte" error={err.pet_size}>
          {(a) => (
            <select {...a} className="campo" defaultValue={caregiver.pet_sizes[0]}>
              {caregiver.pet_sizes.map((s) => <option key={s} value={s}>{SIZES[s]}</option>)}
            </select>
          )}
        </Field>
      </div>
      <Field name="pet_notes" label="Rotina e cuidados" optional error={err.pet_notes} hint="Alimentação, medicação prescrita, medos, como se dá com outros animais.">
        {(a) => <textarea {...a} rows={3} maxLength={1000} className="campo" />}
      </Field>
      <Field name="message" label="Mensagem para o cuidador" optional error={err.message} hint="Quer conhecer o espaço antes? Diga aqui.">
        {(a) => <textarea {...a} rows={2} maxLength={1000} className="campo" />}
      </Field>

      <div className="rounded-xl bg-linho-escuro p-4" aria-live="polite">
        {total != null ? (
          <>
            <p className="flex items-baseline justify-between gap-3">
              <span>{money(unit)} × {summary}</span>
              <span className="font-serif text-2xl">{money(total)}</span>
            </p>
            <p className="mt-1 text-sm text-grafite-suave">
              Valor total estimado. Inclui a comissão da PetApoio ({feePercent.toLocaleString('pt-BR')}%): o cuidador recebe {money(Math.round(total * (1 - feePercent / 100)))}.
              Nada é cobrado agora.
            </p>
          </>
        ) : (
          <p className="text-grafite-suave">Escolha as datas para ver o valor total.</p>
        )}
      </div>

      <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
        <input type="checkbox" name="terms" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
        <span>
          Li as <Link href="/termos#cuida" className="link">regras da reserva</Link>: cancelamento, contato de emergência e autorização para
          atendimento veterinário se houver urgência.
        </span>
      </label>
      {err.terms && <p className="text-sm font-medium text-alerta">{err.terms}</p>}
      <SubmitButton pending={pending} className="w-full">Enviar solicitação</SubmitButton>
      <p className="text-center text-sm text-grafite-suave">A equipe confirma a disponibilidade em até 1 dia útil.</p>
    </form>
  )
}
