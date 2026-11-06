'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { applyCaregiver } from '@/app/cuida/actions'
import { initialFormState } from '@/lib/form-state'
import { NEIGHBORHOOD_NAMES, SERVICES, SIZES, SPECIES, type CareService } from '@/lib/cuida-shared'
import { Field, FieldError, FormStatus, Honeypot, SubmitButton, submitWithoutReset } from '@/components/form-ui'

const PRICE_FIELD: Partial<Record<CareService, string>> = {
  hospedagem: 'price_hosting_cents',
  visita: 'price_visit_cents',
  passeio: 'price_walk_cents',
  creche: 'price_daycare_cents',
}

function Checks({ name, options, error, defaults = [], onChange }: {
  name: string
  options: [string, string][]
  error?: string
  defaults?: string[]
  onChange?: (values: string[]) => void
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        {options.map(([v, l]) => (
          <label key={v} className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-areia-escura bg-white px-4 py-2 has-[:checked]:border-salvia-funda has-[:checked]:bg-salvia-clara">
            <input
              type="checkbox" name={name} value={v} defaultChecked={defaults.includes(v)} className="size-4 accent-salvia-funda"
              onChange={onChange ? (e) => onChange(Array.from(e.currentTarget.form?.querySelectorAll<HTMLInputElement>(`input[name="${name}"]:checked`) ?? []).map((i) => i.value)) : undefined}
            />
            {l}
          </label>
        ))}
      </div>
      <FieldError id={`f-${name}-erro`} message={error} />
    </>
  )
}

/** Candidatura de cuidador (sem criar conta). A equipe verifica antes de publicar. */
export function CaregiverForm() {
  const [state, action, pending] = useActionState(applyCaregiver, initialFormState)
  const [services, setServices] = useState<string[]>([])
  const err = state.fieldErrors ?? {}

  if (state.status === 'success') return <FormStatus state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-10">
      <Honeypot />
      {state.status === 'error' && <FormStatus state={state} />}

      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl">1. Seus dados</legend>
        <Field name="full_name" label="Nome completo" autoComplete="name" required error={err.full_name} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="email" label="E-mail" type="email" autoComplete="email" required error={err.email} />
          <Field name="phone" label="Celular com DDD" type="tel" autoComplete="tel" required error={err.phone} hint="Usamos para a verificação e para avisar sobre pedidos." />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="neighborhood" label="Bairro onde você atende" error={err.neighborhood} hint="Só o bairro aparece no perfil. O endereço nunca é público.">
            {(a) => (
              <select {...a} className="campo" defaultValue="">
                <option value="" disabled>Escolha</option>
                {NEIGHBORHOOD_NAMES.map((n) => <option key={n}>{n}</option>)}
              </select>
            )}
          </Field>
          <Field name="radius_km" label="Até quantos km você se desloca?" error={err.radius_km}>
            {(a) => (
              <select {...a} className="campo" defaultValue="5">
                {[2, 5, 10, 15].map((k) => <option key={k} value={k}>{k} km</option>)}
              </select>
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl">2. O que você oferece</legend>
        <div>
          <p className="rotulo">Serviços</p>
          <Checks name="services" options={(Object.keys(SERVICES) as CareService[]).map((s) => [s, SERVICES[s].short])} error={err.services} onChange={setServices} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="rotulo">Pets</p>
            <Checks name="species" options={Object.entries(SPECIES)} defaults={['cao']} error={err.species} />
          </div>
          <div>
            <p className="rotulo">Porte</p>
            <Checks name="pet_sizes" options={Object.entries(SIZES)} defaults={['pequeno', 'medio']} error={err.pet_sizes} />
          </div>
        </div>
        {services.some((s) => PRICE_FIELD[s as CareService]) && (
          <div className="grid gap-5 sm:grid-cols-2">
            {(Object.keys(PRICE_FIELD) as CareService[]).filter((s) => services.includes(s)).map((s) => (
              <Field key={s} name={PRICE_FIELD[s]!} label={`Preço por ${SERVICES[s].unit} (${SERVICES[s].short.toLowerCase()})`}
                inputMode="decimal" placeholder="Ex.: 90" error={err[PRICE_FIELD[s]!]} hint="Valor que o tutor paga, com a comissão incluída." />
            ))}
          </div>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            ['has_yard', 'Minha casa tem área externa segura'],
            ['gives_medication', 'Dou medicação prescrita pelo veterinário'],
            ['accepts_seniors', 'Aceito pets idosos'],
            ['accepts_puppies', 'Aceito filhotes'],
          ].map(([n, l]) => (
            <label key={n} className="flex items-center gap-2"><input type="checkbox" name={n} className="size-4 accent-salvia-funda" />{l}</label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="font-serif text-2xl">3. Sua experiência</legend>
        <Field name="headline" label="Uma frase de apresentação" optional maxLength={160} error={err.headline} placeholder="Ex.: Casa tranquila, rotina com passeios e fotos todos os dias." />
        <Field name="experience" label="Conte sua experiência com animais" error={err.experience} hint="Com quais pets você já conviveu, por quanto tempo, situações que sabe conduzir.">
          {(a) => <textarea {...a} rows={5} maxLength={2000} className="campo" required />}
        </Field>
        <Field name="qualifications" label="Cursos e formação" optional error={err.qualifications} hint="Primeiros socorros pet, adestramento, técnico em veterinária... Pediremos os comprovantes na entrevista.">
          {(a) => <textarea {...a} rows={3} maxLength={1000} className="campo" />}
        </Field>
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
          <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
          <span>
            Li e aceito os <Link href="/termos#cuida" className="link">termos</Link> e a <Link href="/privacidade" className="link">política de privacidade</Link>,
            e concordo com a verificação de identidade e referências.
          </span>
        </label>
        <FieldError id="f-consent-erro" message={err.consent} />
      </div>
      <SubmitButton pending={pending}>Enviar candidatura</SubmitButton>
    </form>
  )
}
