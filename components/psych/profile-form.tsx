'use client'

import { useActionState, useState } from 'react'
import { saveProfile } from '@/app/painel/psicologo/perfil/actions'
import { initialFormState } from '@/lib/form-state'
import { UFS } from '@/lib/ufs'
import { Field, FieldError, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'
import type { Psychologist } from '@/types/db'

export function ProfileForm({ psych, fullName }: { psych: Psychologist; fullName: string }) {
  const [state, action, pending] = useActionState(saveProfile, initialFormState)
  const [modality, setModality] = useState(psych.modality)
  const err = state.fieldErrors ?? {}

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="space-y-8">
      <FormStatus state={state} />

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Apresentação</legend>
        <Field name="full_name" label="Nome exibido" defaultValue={fullName} required error={err.full_name} />
        <Field
          name="headline"
          label="Frase de apresentação"
          defaultValue={psych.headline ?? ''}
          maxLength={140}
          placeholder="Ex.: Acolho pessoas em luto pela perda de um animal, com escuta sem pressa."
          error={err.headline}
          hint="Aparece no cartão do diretório. Até 140 caracteres."
        />
        <Field name="bio" label="Sobre você e seu trabalho" error={err.bio} hint="Pelo menos 80 caracteres. Não cite pacientes nem prometa resultados.">
          {(a11y) => <textarea {...a11y} rows={7} maxLength={3000} defaultValue={psych.bio ?? ''} className="campo" />}
        </Field>
        <Field name="education" label="Formação e cursos" optional error={err.education}>
          {(a11y) => <textarea {...a11y} rows={4} maxLength={1500} defaultValue={psych.education ?? ''} className="campo" />}
        </Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="approach" label="Abordagem" optional defaultValue={psych.approach ?? ''} placeholder="Ex.: TCC" error={err.approach} />
          <Field
            name="specialties"
            label="Temas que atende"
            optional
            defaultValue={psych.specialties.join(', ')}
            placeholder="Luto, ansiedade, luto antecipatório"
            error={err.specialties}
            hint="Separe por vírgula."
          />
        </div>
        <Field
          name="languages"
          label="Idiomas"
          defaultValue={psych.languages.join(', ')}
          error={err.languages}
          hint="Separe por vírgula."
        />
        <div className="space-y-2">
          {(
            [
              ['pet_grief_experience', 'Tenho experiência com luto pela perda de animais', psych.pet_grief_experience],
              ['serves_children', 'Atendo crianças', psych.serves_children],
              ['serves_families', 'Atendo famílias', psych.serves_families],
            ] as const
          ).map(([name, label, checked]) => (
            <label key={name} className="flex items-center gap-3">
              <input type="checkbox" name={name} defaultChecked={checked} className="size-4 accent-salvia-funda" />
              {label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-5" id="valor">
        <legend className="mb-4 font-serif text-2xl">Atendimento e valor</legend>
        <div>
          <span className="rotulo" id="modalidade-perfil">Modalidade</span>
          <div role="radiogroup" aria-labelledby="modalidade-perfil" className="flex flex-wrap gap-3">
            {(
              [
                ['online', 'Online'],
                ['presencial', 'Presencial'],
                ['ambos', 'Online e presencial'],
              ] as const
            ).map(([value, label]) => (
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
            <Field name="city" label="Cidade do consultório" defaultValue={psych.city ?? ''} error={err.city} />
            <Field name="state" label="Estado" error={err.state}>
              {(a11y) => (
                <select {...a11y} defaultValue={psych.state ?? ''} className="campo">
                  <option value="">UF</option>
                  {UFS.map((uf) => (
                    <option key={uf} value={uf}>{uf}</option>
                  ))}
                </select>
              )}
            </Field>
          </div>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            name="price"
            label="Valor da sessão (R$)"
            inputMode="decimal"
            defaultValue={psych.session_price_cents ? (psych.session_price_cents / 100).toFixed(2).replace('.', ',') : ''}
            placeholder="180,00"
            error={err.price}
          />
          <Field name="session_minutes" label="Duração (minutos)" error={err.session_minutes}>
            {(a11y) => (
              <select {...a11y} defaultValue={String(psych.session_minutes)} className="campo">
                {[30, 40, 45, 50, 60, 90].map((n) => (
                  <option key={n} value={n}>{n} minutos</option>
                ))}
              </select>
            )}
          </Field>
        </div>
        <Field
          name="meeting_url"
          label="Link da sua sala de videochamada"
          type="url"
          defaultValue={psych.meeting_url ?? ''}
          placeholder="https://meet.google.com/…"
          error={err.meeting_url}
          hint="Google Meet, Zoom ou outro. O paciente recebe este link só depois de pagar a sessão."
        />
      </fieldset>

      <SubmitButton pending={pending} pendingLabel="Salvando…">Salvar perfil</SubmitButton>
    </form>
  )
}
