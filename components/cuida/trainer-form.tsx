'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { applyTrainer } from '@/app/seja-parceiro/actions'
import { initialFormState } from '@/lib/form-state'
import { NEIGHBORHOOD_NAMES, SPECIES } from '@/lib/cuida-shared'
import {
  PRICE_KEYS,
  TRAINING_FOCUS,
  TRAINING_FORMATS,
  TRAINING_MODALITIES,
  TRAINING_YEARS,
  type TrainingFormat,
} from '@/lib/adestra-shared'
import { Field, FieldError, FormStatus, Honeypot, SubmitButton, submitWithoutReset } from '@/components/form-ui'

function Checks({ name, options, error, defaults = [], onChange }: {
  name: string
  options: [string, string][]
  error?: string
  defaults?: string[]
  onChange?: (values: string[]) => void
}) {
  return (
    <>
      <div className="flex flex-wrap gap-2" data-min={1}>
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

/** Cadastro de adestrador (sem criar conta). A equipe verifica antes de publicar. */
export function TrainerForm() {
  const [state, action, pending] = useActionState(applyTrainer, initialFormState)
  const [formats, setFormats] = useState<string[]>(['avaliacao'])
  const err = state.fieldErrors ?? {}

  if (state.status === 'success') return <FormStatus state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-10">
      <Honeypot />
      {state.status === 'error' && <FormStatus state={state} />}

      <fieldset className="space-y-5 scroll-mt-24" data-etapa="Seus dados">
        <legend className="font-serif text-2xl">1. Seus dados</legend>
        <Field name="full_name" label="Nome completo" autoComplete="name" required error={err.full_name} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="email" label="E-mail" type="email" autoComplete="email" required error={err.email} />
          <Field name="phone" label="Celular com DDD" type="tel" autoComplete="tel" required error={err.phone} hint="Usamos para a verificação e para avisar sobre pedidos." />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="neighborhood" label="Bairro de onde você parte" error={err.neighborhood} hint="Só o bairro aparece no perfil.">
            {(a) => (
              <select {...a} className="campo" defaultValue="" required>
                <option value="" disabled>Escolha</option>
                {NEIGHBORHOOD_NAMES.map((n) => <option key={n}>{n}</option>)}
              </select>
            )}
          </Field>
          <Field name="radius_km" label="Até quantos km você se desloca?" error={err.radius_km}>
            {(a) => (
              <select {...a} className="campo" defaultValue="10">
                {[5, 10, 15, 20, 30].map((k) => <option key={k} value={k}>{k} km</option>)}
              </select>
            )}
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-5 scroll-mt-24" data-etapa="Como você trabalha">
        <legend className="font-serif text-2xl">2. Como você trabalha</legend>
        <div>
          <p className="rotulo">Onde você atende</p>
          <Checks name="modalities" options={Object.entries(TRAINING_MODALITIES)} defaults={['domicilio']} error={err.modalities} />
        </div>
        <div>
          <p className="rotulo">Pets</p>
          <Checks name="species" options={Object.entries(SPECIES)} defaults={['cao']} error={err.species} />
        </div>
        <div>
          <p className="rotulo">Especialidades <span className="font-normal text-grafite-suave">(até 6)</span></p>
          <Checks name="focus" options={Object.entries(TRAINING_FOCUS)} error={err.focus} />
        </div>
      </fieldset>

      <fieldset className="space-y-5 scroll-mt-24" data-etapa="Formatos e preços">
        <legend className="font-serif text-2xl">3. Formatos e preços</legend>
        <div>
          <p className="rotulo">O que o tutor pode contratar</p>
          <Checks name="formats" options={(Object.keys(TRAINING_FORMATS) as TrainingFormat[]).map((f) => [f, TRAINING_FORMATS[f].label])} defaults={['avaliacao']} error={err.formats} onChange={setFormats} />
        </div>
        {formats.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {(Object.keys(TRAINING_FORMATS) as TrainingFormat[]).filter((f) => formats.includes(f)).map((f) => (
              <Field key={f} name={PRICE_KEYS[f]} label={`${TRAINING_FORMATS[f].priceLabel} (R$)`}
                inputMode="decimal" data-preco="" placeholder={f === 'pacote' ? 'Ex.: 900' : 'Ex.: 150'} error={err[PRICE_KEYS[f]]}
                hint="Valor que o tutor paga, com a comissão incluída." />
            ))}
            {formats.includes('pacote') && (
              <Field name="package_classes" label="Quantas aulas tem o pacote?" inputMode="numeric" placeholder="Ex.: 8" error={err.package_classes} />
            )}
          </div>
        )}
      </fieldset>

      <fieldset className="space-y-5 scroll-mt-24" data-etapa="Sua experiência">
        <legend className="font-serif text-2xl">4. Sua experiência</legend>
        <Field name="years_experience" label="Há quanto tempo você trabalha com adestramento?" error={err.years_experience}>
          {(a) => (
            <select {...a} className="campo" defaultValue="1">
              {TRAINING_YEARS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          )}
        </Field>
        <Field name="headline" label="Uma frase de apresentação" optional maxLength={160} error={err.headline} placeholder="Ex.: Ajudo famílias a passear sem puxões, com reforço positivo e paciência." />
        <Field name="experience" label="Conte como você trabalha" error={err.experience} hint="Casos que já conduziu, como é sua primeira aula, como envolve a família no treino.">
          {(a) => <textarea {...a} rows={5} minLength={40} maxLength={2000} className="campo" required />}
        </Field>
        <Field name="qualifications" label="Cursos e formação" optional error={err.qualifications} hint="Cursos de adestramento, comportamento animal, etologia, medicina veterinária... Pediremos os comprovantes na conversa de verificação.">
          {(a) => <textarea {...a} rows={3} maxLength={1000} className="campo" />}
        </Field>
        <Field name="reference_contacts" label="Quem pode falar sobre o seu trabalho?" optional error={err.reference_contacts}
          hint="Nome e telefone de 1 ou 2 pessoas (tutores, clínicas, ex-clientes). Só falamos com elas na verificação, com seu aviso.">
          {(a) => <textarea {...a} rows={2} maxLength={500} className="campo" placeholder="Ex.: Ana Souza, (31) 99999-0000, tutora da Mel" />}
        </Field>
        <Field name="portfolio_url" label="Instagram ou site com seu trabalho" optional placeholder="@seuperfil ou https://..." error={err.portfolio_url} />
      </fieldset>

      <div className="space-y-4">
        <div>
          <label className="flex items-start gap-3 text-[0.95rem]">
            <input type="checkbox" name="positive_methods" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
            <span>
              Trabalho com reforço positivo e <strong>não uso</strong> coleira de choque, enforcador, punição física ou
              intimidação.
            </span>
          </label>
          <FieldError id="f-positive_methods-erro" message={err.positive_methods} />
        </div>
        <div>
          <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
            <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
            <span>
              Li e aceito os <Link href="/termos#adestramento" className="link">termos</Link> e a <Link href="/privacidade" className="link">política de privacidade</Link>,
              e concordo com a verificação de identidade e referências.
            </span>
          </label>
          <FieldError id="f-consent-erro" message={err.consent} />
        </div>
      </div>
      <SubmitButton pending={pending}>Enviar cadastro</SubmitButton>
    </form>
  )
}
