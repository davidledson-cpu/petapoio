'use client'

import Link from 'next/link'
import { useId, useState } from 'react'
import { useCart } from '@/lib/cart/store'
import { money } from '@/lib/format'

type Props = {
  product: {
    id: string
    slug: string
    name: string
    price_cents: number
    needs_name: boolean
    needs_photo: boolean
    image: string | null
  }
}

export function AddToCart({ product }: Props) {
  const cart = useCart()
  const id = useId()
  const [name, setName] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [photo, setPhoto] = useState<{ path: string; fileName: string } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [added, setAdded] = useState(false)

  async function upload(file: File) {
    setError(null)
    setUploading(true)
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/loja/upload', { method: 'POST', body })
      const data = (await res.json()) as { path?: string; error?: string }
      if (!res.ok || !data.path) throw new Error(data.error ?? 'Não conseguimos enviar a foto.')
      setPhoto({ path: data.path, fileName: file.name })
    } catch (e) {
      setPhoto(null)
      setError(e instanceof Error ? e.message : 'Não conseguimos enviar a foto.')
    } finally {
      setUploading(false)
    }
  }

  function add() {
    setError(null)
    if (product.needs_name && !name.trim()) return setError('Informe o nome que vamos gravar.')
    if (product.needs_photo && !photo) return setError('Envie a foto que vamos usar.')
    cart.add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceCents: product.price_cents,
      image: product.image,
      quantity,
      personalizationName: product.needs_name ? name.trim() : undefined,
      personalizationPhoto: photo?.path,
      personalizationPhotoName: photo?.fileName,
    })
    setAdded(true)
  }

  if (added) {
    return (
      <div role="status" className="rounded-2xl bg-salvia-clara p-6 text-salvia-noite">
        <p className="font-semibold">Adicionado ao carrinho.</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/loja/carrinho" className="btn btn-primario">Ver carrinho e finalizar</Link>
          <button
            type="button"
            className="btn btn-secundario"
            onClick={() => {
              setAdded(false)
              setName('')
              setPhoto(null)
              setQuantity(1)
            }}
          >
            Adicionar outro
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {product.needs_name && (
        <div>
          <label htmlFor={`${id}-nome`} className="rotulo">Nome para gravar</label>
          <input
            id={`${id}-nome`}
            value={name}
            maxLength={40}
            onChange={(e) => setName(e.target.value)}
            className="campo"
            placeholder="Ex.: Thor"
            aria-describedby={`${id}-nome-dica`}
          />
          <p id={`${id}-nome-dica`} className="dica">Até 40 caracteres. Se quiser incluir datas ou uma frase, escreva aqui também.</p>
        </div>
      )}

      {product.needs_photo && (
        <div>
          <label htmlFor={`${id}-foto`} className="rotulo">Foto para a personalização</label>
          <input
            id={`${id}-foto`}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            disabled={uploading}
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) void upload(file)
            }}
            className="block w-full text-[0.95rem] file:mr-4 file:rounded-full file:border-0 file:bg-areia file:px-4 file:py-2 file:font-semibold hover:file:bg-areia-escura"
            aria-describedby={`${id}-foto-dica`}
          />
          <p id={`${id}-foto-dica`} className="dica" aria-live="polite">
            {uploading
              ? 'Enviando a foto…'
              : photo
                ? `Foto recebida: ${photo.fileName}`
                : 'Escolha uma foto nítida, de preferência com luz natural. JPG, PNG ou HEIC até 10 MB.'}
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor={`${id}-qtd`} className="rotulo">Quantidade</label>
          <select id={`${id}-qtd`} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="campo w-24">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
        <button type="button" onClick={add} disabled={uploading} className="btn btn-primario flex-1 sm:flex-none disabled:opacity-70">
          Adicionar ao carrinho · {money(product.price_cents * quantity)}
        </button>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-[#f6e7e3] px-4 py-3 text-alerta">{error}</p>
      )}
    </div>
  )
}
