'use client'

import Link from 'next/link'
import { startTransition, useActionState, useId, type FormEvent } from 'react'
import { applyAsProfessional, subscribe } from '@/app/actions'
import { initialFormState, type FormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'


/**
 * Envia sem o reset automático do React 19, para que um erro de validação
 * não apague o que a pessoa já digitou. Sem JavaScript, o `action` do form continua funcionando.
 */
function submitWithoutReset(action: (data: FormData) => void) {
  return (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    startTransition(() => action(data))
  }
}

function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <label>
        Não preencha este campo
        <input type="text" name="website_confirm" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  )
}

function Status({ state }: { state: FormState }) {
  if (state.status === 'idle' || !state.message) return null
  return (
    <p
      role={state.status === 'error' ? 'alert' : 'status'}
      className={
        state.status === 'success'
          ? 'rounded-lg bg-salvia-clara px-4 py-3 text-salvia-noite'
          : 'rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta'
      }
    >
      {state.message}
    </p>
  )
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-alerta">
      {message}
    </p>
  )
}

function Consent({ error, id }: { error?: string; id: string }) {
  return (
    <div>
      <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
        <input
          type="checkbox"
          name="consent"
          required
          aria-describedby={error ? `${id}-erro` : undefined}
          className="mt-1 size-4 shrink-0 accent-salvia-funda"
        />
        <span>
          Li e aceito a{' '}
          <Link href="/privacidade" className="link">
            política de privacidade
          </Link>
          . Posso cancelar quando quiser.
        </span>
      </label>
      <FieldError id={`${id}-erro`} message={error} />
    </div>
  )
}

type SignupProps = {
  list: 'newsletter' | 'psicologos' | 'loja'
  submitLabel: string
  tone?: 'claro' | 'escuro'
}

/** Inscrição por e-mail em uma das listas. */
export function SignupForm({ list, submitLabel, tone = 'claro' }: SignupProps) {
  const [state, action, pending] = useActionState(subscribe, initialFormState)
  const id = useId()

  if (state.status === 'success') return <Status state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-4">
      <Honeypot />
      <input type="hidden" name="list" value={list} />
      <div>
        <label htmlFor={`${id}-email`} className={`rotulo ${tone === 'escuro' ? 'text-linho' : ''}`}>
          Seu e-mail
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id={`${id}-email`}
            type="email"
            name="email"
            autoComplete="email"
            required
            className="campo sm:flex-1"
            aria-invalid={Boolean(state.fieldErrors?.email)}
            aria-describedby={state.fieldErrors?.email ? `${id}-email-erro` : undefined}
          />
          <button
            type="submit"
            disabled={pending}
            className={`btn shrink-0 disabled:opacity-70 ${tone === 'escuro' ? 'bg-linho text-salvia-noite hover:bg-white' : 'btn-primario'}`}
          >
            {pending ? 'Enviando…' : submitLabel}
          </button>
        </div>
        <FieldError id={`${id}-email-erro`} message={state.fieldErrors?.email} />
      </div>
      <div className={tone === 'escuro' ? '[&_span]:text-linho/80 [&_a]:text-linho' : ''}>
        <Consent id={`${id}-consent`} error={state.fieldErrors?.consent} />
      </div>
      {state.status === 'error' && !state.fieldErrors && <Status state={state} />}
    </form>
  )
}

/** Pré-cadastro de psicólogos parceiros. */
export function ProfessionalForm() {
  const [state, action, pending] = useActionState(applyAsProfessional, initialFormState)
  const id = useId()
  const err = state.fieldErrors ?? {}

  if (state.status === 'success') return <Status state={state} />

  const field = (name: string) => ({
    id: `${id}-${name}`,
    name,
    'aria-invalid': Boolean(err[name]),
    'aria-describedby': err[name] ? `${id}-${name}-erro` : undefined,
  })

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-6">
      <Honeypot />
      {state.status === 'error' && <Status state={state} />}

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Quem é você</legend>
        <div>
          <label htmlFor={`${id}-full_name`} className="rotulo">Nome completo</label>
          <input {...field('full_name')} autoComplete="name" required className="campo" />
          <FieldError id={`${id}-full_name-erro`} message={err.full_name} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-email`} className="rotulo">E-mail</label>
            <input {...field('email')} type="email" autoComplete="email" required className="campo" />
            <FieldError id={`${id}-email-erro`} message={err.email} />
          </div>
          <div>
            <label htmlFor={`${id}-phone`} className="rotulo">
              Telefone <span className="font-normal text-grafite-suave">(opcional)</span>
            </label>
            <input {...field('phone')} type="tel" autoComplete="tel" className="campo" />
            <FieldError id={`${id}-phone-erro`} message={err.phone} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
          <div>
            <label htmlFor={`${id}-crp`} className="rotulo">Número do CRP</label>
            <input {...field('crp')} inputMode="numeric" placeholder="06/123456" required className="campo" />
            <FieldError id={`${id}-crp-erro`} message={err.crp} />
          </div>
          <div>
            <label htmlFor={`${id}-crp_state`} className="rotulo">Estado</label>
            <select {...field('crp_state')} required defaultValue="" className="campo">
              <option value="" disabled>UF</option>
              {UFS.map((uf) => (
                <option key={uf} value={uf}>{uf}</option>
              ))}
            </select>
            <FieldError id={`${id}-crp_state-erro`} message={err.crp_state} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Como você atende</legend>
        <div>
          <span className="rotulo" id={`${id}-modality-rotulo`}>Modalidade</span>
          <div role="radiogroup" aria-labelledby={`${id}-modality-rotulo`} className="flex flex-wrap gap-3">
            {[
              ['online', 'Online'],
              ['presencial', 'Presencial'],
              ['ambos', 'Online e presencial'],
            ].map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-areia-escura bg-white px-4 py-2 has-[:checked]:border-salvia-funda has-[:checked]:bg-salvia-clara"
              >
                <input type="radio" name="modality" value={value} required className="accent-salvia-funda" />
                {label}
              </label>
            ))}
          </div>
          <FieldError id={`${id}-modality-erro`} message={err.modality} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor={`${id}-city`} className="rotulo">
              Cidade <span className="font-normal text-grafite-suave">(se atende presencialmente)</span>
            </label>
            <input {...field('city')} autoComplete="address-level2" className="campo" />
            <FieldError id={`${id}-city-erro`} message={err.city} />
          </div>
          <div>
            <label htmlFor={`${id}-approach`} className="rotulo">
              Abordagem <span className="font-normal text-grafite-suave">(opcional)</span>
            </label>
            <input {...field('approach')} placeholder="Ex.: TCC, psicanálise, humanista" className="campo" />
            <FieldError id={`${id}-approach-erro`} message={err.approach} />
          </div>
        </div>
        <div>
          <label htmlFor={`${id}-grief_experience`} className="rotulo">
            Sua experiência com luto e perdas <span className="font-normal text-grafite-suave">(opcional)</span>
          </label>
          <textarea {...field('grief_experience')} rows={4} className="campo" />
          <p className="dica">Formação, cursos e tempo de prática. Não inclua informações de pacientes.</p>
          <FieldError id={`${id}-grief_experience-erro`} message={err.grief_experience} />
        </div>
        <label className="flex items-start gap-3">
          <input type="checkbox" name="pet_grief_experience" className="mt-1 size-4 accent-salvia-funda" />
          <span>Já acompanhei pessoas em luto pela perda de um animal.</span>
        </label>
        <div>
          <label htmlFor={`${id}-website`} className="rotulo">
            Site ou perfil profissional <span className="font-normal text-grafite-suave">(opcional)</span>
          </label>
          <input {...field('website')} type="url" placeholder="https://" className="campo" />
          <FieldError id={`${id}-website-erro`} message={err.website} />
        </div>
      </fieldset>

      <Consent id={`${id}-consent`} error={err.consent} />

      <button type="submit" disabled={pending} className="btn btn-primario w-full sm:w-auto disabled:opacity-70">
        {pending ? 'Enviando…' : 'Enviar pré-cadastro'}
      </button>
    </form>
  )
}
