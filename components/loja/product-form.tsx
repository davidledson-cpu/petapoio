'use client'

import { useActionState, useState } from 'react'
import { saveProduct } from '@/app/admin/produtos/actions'
import { createClient } from '@/lib/supabase/browser'
import { publicFileUrl } from '@/lib/supabase/storage'
import { initialFormState } from '@/lib/form-state'
import { slugify } from '@/lib/format'
import { Field, FormStatus, SubmitButton, submitWithoutReset } from '@/components/form-ui'
import type { Product } from '@/types/db'

const CATEGORY_OPTIONS = [
  ['memorias', 'Memórias e homenagens'],
  ['lembrancas', 'Lembranças personalizadas'],
  ['acolhimento', 'Acolhimento e cuidado'],
  ['presentes', 'Para acolher alguém'],
] as const

const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }

export function ProductForm({ product }: { product?: Product }) {
  const [state, action, pending] = useActionState(saveProduct, initialFormState)
  const err = state.fieldErrors ?? {}
  const [name, setName] = useState(product?.name ?? '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [slugTouched, setSlugTouched] = useState(Boolean(product))
  const [images, setImages] = useState<string[]>(product?.images ?? [])
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  async function upload(files: FileList) {
    setUploadError(null)
    const folder = slug || slugify(name) || 'sem-nome'
    setUploading(true)
    const supabase = createClient()
    const added: string[] = []
    for (const file of Array.from(files)) {
      const ext = EXT[file.type]
      if (!ext) {
        setUploadError(`"${file.name}" não é JPG, PNG ou WEBP.`)
        continue
      }
      if (file.size > 8 * 1024 * 1024) {
        setUploadError(`"${file.name}" passa de 8 MB.`)
        continue
      }
      const path = `produtos/${folder}/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('products').upload(path, file, { contentType: file.type })
      if (error) setUploadError(`Não conseguimos enviar "${file.name}": ${error.message}`)
      else added.push(path)
    }
    setImages((current) => [...current, ...added].slice(0, 12))
    setUploading(false)
  }

  function move(index: number, delta: number) {
    setImages((current) => {
      const next = [...current]
      const [item] = next.splice(index, 1)
      next.splice(index + delta, 0, item!)
      return next
    })
  }

  return (
    <form action={action} onSubmit={submitWithoutReset(action)} className="max-w-3xl space-y-8">
      <FormStatus state={state} />
      <input type="hidden" name="id" value={product?.id ?? ''} />
      <input type="hidden" name="images" value={JSON.stringify(images)} />

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Produto</legend>
        <Field
          name="name"
          label="Nome"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            if (!slugTouched) setSlug(slugify(e.target.value))
          }}
          required
          error={err.name}
        />
        <Field
          name="slug"
          label="Endereço na loja"
          value={slug}
          onChange={(e) => {
            setSlugTouched(true)
            setSlug(e.target.value)
          }}
          required
          error={err.slug}
          hint={`petapoio.com.br/loja/${slug || '…'}`}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="category" label="Categoria" error={err.category}>
            {(a11y) => (
              <select {...a11y} defaultValue={product?.category ?? ''} required className="campo">
                <option value="" disabled>Escolha</option>
                {CATEGORY_OPTIONS.map(([v, l]) => (
                  <option key={v} value={v}>{l}</option>
                ))}
              </select>
            )}
          </Field>
          <Field
            name="price"
            label="Preço (R$)"
            inputMode="decimal"
            defaultValue={product ? (product.price_cents / 100).toFixed(2).replace('.', ',') : ''}
            placeholder="129,90"
            required
            error={err.price}
          />
        </div>
        <Field name="summary" label="Resumo" defaultValue={product?.summary ?? ''} maxLength={200} required error={err.summary} hint="Uma frase que aparece na vitrine." />
        <Field name="description" label="Descrição" error={err.description} hint="Separe parágrafos com uma linha em branco. Evite urgência ou pressão.">
          {(a11y) => <textarea {...a11y} rows={8} defaultValue={product?.description ?? ''} className="campo" />}
        </Field>
      </fieldset>

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-2xl">Produção e personalização</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="production_days" label="Prazo de produção (dias úteis)" type="number" min={0} max={60} defaultValue={product?.production_days ?? 7} required error={err.production_days} />
          <Field name="sort_order" label="Ordem na vitrine" type="number" min={0} defaultValue={product?.sort_order ?? 100} required error={err.sort_order} hint="Números menores aparecem antes." />
        </div>
        {[
          ['needs_name', 'Pede um nome para gravar', product?.needs_name],
          ['needs_photo', 'Pede uma foto do pet', product?.needs_photo],
          ['active', 'Visível na loja', product ? product.active : true],
        ].map(([n, l, checked]) => (
          <label key={String(n)} className="flex items-center gap-3">
            <input type="checkbox" name={String(n)} defaultChecked={Boolean(checked)} className="size-4 accent-salvia-funda" />
            {String(l)}
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend className="mb-2 font-serif text-2xl">Fotos</legend>
        <p className="mb-4 text-[0.95rem] text-grafite-suave">A primeira foto aparece na vitrine. Use imagens quadradas, de preferência 1200 × 1200 px.</p>
        {images.length > 0 && (
          <ul className="mb-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {images.map((path, i) => (
              <li key={path} className="rounded-xl bg-white p-2 shadow-[0_1px_0_var(--color-areia)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={publicFileUrl('products', path) ?? ''} alt={`Foto ${i + 1}`} className="aspect-square w-full rounded-lg object-cover" />
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-grafite-suave">{i === 0 ? 'Capa' : `${i + 1}ª`}</span>
                  <span className="flex gap-1">
                    <button type="button" disabled={i === 0} onClick={() => move(i, -1)} className="rounded px-2 py-1 hover:bg-areia disabled:opacity-30" aria-label={`Mover foto ${i + 1} para antes`}>←</button>
                    <button type="button" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="rounded px-2 py-1 hover:bg-areia disabled:opacity-30" aria-label={`Mover foto ${i + 1} para depois`}>→</button>
                    <button type="button" onClick={() => setImages((c) => c.filter((p) => p !== path))} className="rounded px-2 py-1 text-alerta hover:bg-[#f6e7e3]" aria-label={`Remover foto ${i + 1}`}>Remover</button>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <label className="btn btn-secundario cursor-pointer">
          {uploading ? 'Enviando fotos…' : 'Adicionar fotos'}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            className="sr-only"
            onChange={(e) => {
              if (e.target.files?.length) void upload(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
        {uploadError && <p role="alert" className="mt-3 text-sm font-medium text-alerta">{uploadError}</p>}
        {err.images && <p role="alert" className="mt-3 text-sm font-medium text-alerta">{err.images}</p>}
      </fieldset>

      <SubmitButton pending={pending || uploading} pendingLabel="Salvando…">Salvar produto</SubmitButton>
    </form>
  )
}
