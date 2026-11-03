'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { requestPasswordReset, signIn, signUpPatient, updatePassword } from '@/app/auth/actions'
import { initialFormState } from '@/lib/form-state'
import { Field, FieldError, FormStatus, SubmitButton, submitWithoutReset } from './form-ui'

export function SignInForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signIn, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-5">
      <FormStatus state={state} />
      <input type="hidden" name="next" value={next ?? ''} />
      <Field name="email" label="E-mail" type="email" autoComplete="email" required error={err.email} />
      <Field name="password" label="Senha" type="password" autoComplete="current-password" required error={err.password} />
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SubmitButton pending={pending} pendingLabel="Entrando…">Entrar</SubmitButton>
        <Link href="/recuperar-senha" className="link text-[0.95rem]">Esqueci minha senha</Link>
      </div>
    </form>
  )
}

export function SignUpForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(signUpPatient, initialFormState)
  const err = state.fieldErrors ?? {}
  if (state.status === 'success') return <FormStatus state={state} />
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-5">
      <FormStatus state={state} />
      <input type="hidden" name="next" value={next ?? ''} />
      <Field name="full_name" label="Como você quer ser chamado" autoComplete="name" required error={err.full_name} />
      <Field name="email" label="E-mail" type="email" autoComplete="email" required error={err.email} />
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
      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-grafite-suave">
          <input type="checkbox" name="consent" required className="mt-1 size-4 shrink-0 accent-salvia-funda" />
          <span>
            Li e aceito os <Link href="/termos" className="link">termos de uso</Link> e a{' '}
            <Link href="/privacidade" className="link">política de privacidade</Link>.
          </span>
        </label>
        <FieldError id="f-consent-erro" message={err.consent} />
      </div>
      <SubmitButton pending={pending} pendingLabel="Criando conta…" className="w-full sm:w-auto">
        Criar minha conta
      </SubmitButton>
    </form>
  )
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestPasswordReset, initialFormState)
  if (state.status === 'success') return <FormStatus state={state} />
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-5">
      <FormStatus state={state} />
      <Field name="email" label="E-mail da sua conta" type="email" autoComplete="email" required error={state.fieldErrors?.email} />
      <SubmitButton pending={pending}>Enviar link</SubmitButton>
    </form>
  )
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(updatePassword, initialFormState)
  const err = state.fieldErrors ?? {}
  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-5">
      <FormStatus state={state} />
      <Field name="password" label="Nova senha" type="password" autoComplete="new-password" required error={err.password} hint="Pelo menos 8 caracteres." />
      <Field name="confirm" label="Repita a nova senha" type="password" autoComplete="new-password" required error={err.confirm} />
      <SubmitButton pending={pending} pendingLabel="Salvando…">Salvar nova senha</SubmitButton>
    </form>
  )
}
