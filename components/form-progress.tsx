'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

/**
 * Cadastro em etapas com checklist (padrão Rover): cada <fieldset data-etapa="Nome"> vira um item
 * que ganha ✓ quando os campos obrigatórios e os grupos com data-min estão preenchidos.
 * Também guarda um rascunho no navegador para a pessoa parar e continuar depois.
 */
export function FormProgress({ draftKey, children }: { draftKey: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const [steps, setSteps] = useState<{ label: string; done: boolean; id: string }[]>([])
  const [restored, setRestored] = useState(false)

  useEffect(() => {
    const root = ref.current
    const form = root?.querySelector('form')
    if (!root || !form) return

    const evaluate = () => {
      const fieldsets = Array.from(form.querySelectorAll<HTMLFieldSetElement>('fieldset[data-etapa]'))
      setSteps(
        fieldsets.map((fs, i) => {
          if (!fs.id) fs.id = `etapa-${draftKey}-${i + 1}`
          const requiredOk = Array.from(fs.querySelectorAll<HTMLInputElement>('[required]')).every((el) => el.checkValidity())
          const groupsOk = Array.from(fs.querySelectorAll<HTMLElement>('[data-min]')).every(
            (g) => g.querySelectorAll('input:checked').length >= Number(g.dataset.min),
          )
          const pricesOk = Array.from(fs.querySelectorAll<HTMLInputElement>('input[data-preco]')).every((el) => el.value.trim() !== '')
          return { label: fs.dataset.etapa ?? `Etapa ${i + 1}`, done: requiredOk && groupsOk && pricesOk, id: fs.id }
        }),
      )
    }

    // Restaura o rascunho (sem senha) salvo neste aparelho. Primeiro as caixas (com clique, para o React
    // mostrar os campos que dependem delas, como preços); depois, os textos.
    try {
      const raw = window.localStorage.getItem(`rascunho:${draftKey}`)
      if (raw) {
        const saved = JSON.parse(raw) as Record<string, string[]>
        const fields = (name: string) =>
          form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(`[name="${CSS.escape(name)}"]`)
        for (const [name, values] of Object.entries(saved)) {
          fields(name).forEach((el) => {
            if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio') && el.checked !== values.includes(el.value)) {
              el.click()
            }
          })
        }
        setTimeout(() => {
          for (const [name, values] of Object.entries(saved)) {
            fields(name).forEach((el) => {
              const isBox = el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')
              if (!isBox && !name.startsWith('$') && el.type !== 'hidden' && el.type !== 'password' && values[0] !== undefined) el.value = values[0]
            })
          }
          evaluate()
          setRestored(Object.keys(saved).length > 0)
        }, 60)
      }
    } catch {
      // Sem armazenamento disponível: segue sem rascunho.
    }

    let timer: ReturnType<typeof setTimeout> | undefined
    const save = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        try {
          const data: Record<string, string[]> = {}
          for (const el of Array.from(form.elements) as HTMLInputElement[]) {
            if (!el.name || el.name.startsWith('$') || el.type === 'hidden' || el.type === 'password' || el.name === 'website_confirm' || el.name === 'consent') continue
            if (el.type === 'checkbox' || el.type === 'radio') {
              const list = (data[el.name] ??= [])
              if (el.checked) list.push(el.value)
            } else {
              data[el.name] = [el.value]
            }
          }
          window.localStorage.setItem(`rascunho:${draftKey}`, JSON.stringify(data))
        } catch {
          // Ignora: o rascunho é só uma conveniência.
        }
      }, 400)
    }

    const onChange = () => {
      evaluate()
      save()
    }
    // Campos de preço aparecem depois de marcar um serviço: reavalia quando o formulário muda.
    const observer = new MutationObserver(evaluate)
    observer.observe(form, { childList: true, subtree: true })
    form.addEventListener('input', onChange)
    form.addEventListener('change', onChange)
    requestAnimationFrame(evaluate)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      form.removeEventListener('input', onChange)
      form.removeEventListener('change', onChange)
    }
  }, [draftKey])

  // Ao concluir com sucesso o formulário some: limpa o rascunho.
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const observer = new MutationObserver(() => {
      if (!root.querySelector('form')) {
        try {
          window.localStorage.removeItem(`rascunho:${draftKey}`)
        } catch {}
        setSteps([])
      }
    })
    observer.observe(root, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [draftKey])

  const done = steps.filter((s) => s.done).length

  return (
    <div ref={ref}>
      {steps.length > 0 && (
        <div className="mb-8 rounded-2xl bg-linho p-5">
          <div className="flex items-baseline justify-between gap-4">
            <p className="font-semibold">
              {done === steps.length ? 'Tudo pronto para enviar' : `${done} de ${steps.length} etapas completas`}
            </p>
            <p className="text-sm text-grafite-suave">Cerca de 10 minutos</p>
          </div>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-areia" aria-hidden="true">
            <div className="h-full rounded-full bg-salvia-funda transition-[width] duration-300" style={{ width: `${(done / steps.length) * 100}%` }} />
          </div>
          <ol className="mt-4 grid gap-2 sm:grid-cols-2">
            {steps.map((s) => (
              <li key={s.id}>
                <a href={`#${s.id}`} className="flex items-center gap-2 text-[0.95rem] hover:underline">
                  <span
                    aria-hidden="true"
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full text-xs ${s.done ? 'bg-salvia-funda text-linho' : 'border-[1.5px] border-areia-escura'}`}
                  >
                    {s.done ? '✓' : ''}
                  </span>
                  <span className={s.done ? 'text-grafite-suave' : ''}>{s.label}</span>
                  <span className="sr-only">{s.done ? '(completa)' : '(pendente)'}</span>
                </a>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-grafite-suave">
            {restored ? 'Recuperamos o que você já tinha preenchido neste aparelho.' : 'Pode parar quando quiser: guardamos o rascunho neste aparelho.'}
          </p>
        </div>
      )}
      {children}
    </div>
  )
}
