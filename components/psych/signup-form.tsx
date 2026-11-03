'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { signUpPsychologist } from '@/app/seja-parceiro/actions'
import { initialFormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'
import { Field, FieldError, FormStatus, Honeypot, SubmitButton, submitWithoutReset } from '@/components/form-ui'

const MODALITIES = [
  ['online', 'Online'],
  ['presencial', 'Presencial'],
  ['ambos', 'Online e presencial'],
] as const

export function PsychologistSignupForm() {
  const [state, action, pending] = useActionState(signUpPsychologist, initialFormState)
  const [modality, setModality] = useState<string>('online')
  const err = state.fieldErrors ?? {}

  if (state.status === 'success') return <FormStatus state={state} />

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="relative space-y-8">
      <Honeypot />
      <FormStatus state={state} />

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Sua conta</legend>
        <Field name="full_name" label="Nome completo" autoComplete="name" required error={err.full_name} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="email" label="E-mail" type="email" autoComplete="email" required error={err.email} />
          <Field name="phone" label="Telefone com DDD" type="tel" autoComplete="tel" required error={err.phone} />
        </div>
        <Field
          name="password"
          label="Crie uma senha"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          error={err.password}
          hint="Pelo menos 8 caracteres."
        />
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Registro profissional</legend>
        <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
          <Field name="crp" label="Número do CRP" inputMode="numeric" placeholder="06/123456" required error={err.crp} />
          <Field name="crp_state" label="Estado do CRP" error={err.crp_state}>
            {(a11y) => (
              <select {...a11y} required defaultValue="" className="campo">
                <option value="" disabled>UF</option>
                {UFS.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <p className="dica !mt-2">Conferimos o registro no Cadastro Nacional de Psicólogos antes de publicar seu perfil.</p>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Como você atende</legend>
        <div>
          <span className="rotulo" id="modalidade-rotulo">Modalidade</span>
          <div role="radiogroup" aria-labelledby="modalidade-rotulo" className="flex flex-wrap gap-3">
            {MODALITIES.map(([value, label]) => (
              <label
                key={value}
                className="flex cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-areia-escura bg-white px-4 py-2 has-[:checked]:border-salvia-funda has-[:checked]:bg-salvia-clara"
              >
                <input
                  type="radio"
                  name="modality"
                  value={value}
                  checked={modality === value}
                  onChange={() => setModality(value)}
                  className="accent-salvia-funda"
                />
                {label}
              </label>
            ))}
          </div>
          <FieldError id="f-modality-erro" message={err.modality} />
        </div>
        {modality !== 'online' && (
          <div className="grid gap-5 sm:grid-cols-[1fr_9rem]">
            <Field name="city" label="Cidade do consultório" autoComplete="address-level2" error={err.city} />
            <Field name="state" label="Estado" error={err.state}>
              {(a11y) => (
                <select {...a11y} defaultValue="" className="campo">
                  <option value="" disabled>UF</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        )}
        <Field name="approach" label="Abordagem" optional placeholder="Ex.: TCC, psicanálise, humanista" error={err.approach} />
        <label className="flex items-start gap-3">
          <input type="checkbox" name="pet_grief_experience" className="mt-1 size-4 accent-salvia-funda" />
          <span>Já acompanhei pessoas em luto pela perda de um animal.</span>
        </label>
      </fieldset>

      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
          <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
          <span>
            Li e aceito os <Link href="/termos" className="link">termos de uso</Link> e a{' '}
            <Link href="/privacidade" className="link">política de privacidade</Link>, e declaro que meu registro no CRP
            está ativo.
          </span>
        </label>
        <FieldError id="f-consent-erro" message={err.consent} />
      </div>

      <SubmitButton pending={pending} pendingLabel="Criando sua conta…" className="w-full sm:w-auto">
        Criar minha conta profissional
      </SubmitButton>
    </form>
  )
}
