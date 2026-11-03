'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

type Props = {
  kind: 'foto' | 'documento'
  userId: string
  currentLabel?: string | null
  previewUrl?: string | null
}

const CONFIG = {
  foto: {
    bucket: 'avatars',
    column: 'photo_path',
    accept: 'image/jpeg,image/png,image/webp',
    maxMb: 5,
    button: 'Enviar foto',
    replace: 'Trocar foto',
    hint: 'JPG, PNG ou WebP até 5 MB. Uma foto de rosto, com boa luz e fundo neutro.',
  },
  documento: {
    bucket: 'documents',
    column: 'document_path',
    accept: 'application/pdf,image/jpeg,image/png',
    maxMb: 10,
    button: 'Enviar documento',
    replace: 'Enviar outro documento',
    hint: 'Carteira do CRP (frente e verso) em PDF, JPG ou PNG, até 10 MB. Só a equipe de verificação tem acesso.',
  },
} as const

/** Envia o arquivo direto do navegador para o Storage (RLS: só na pasta do próprio usuário). */
export function FileUpload({ kind, userId, currentLabel, previewUrl }: Props) {
  const cfg = CONFIG[kind]
  const router = useRouter()
  const input = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)
  const [preview, setPreview] = useState(previewUrl ?? null)

  async function upload(file: File) {
    setMessage(null)
    if (!cfg.accept.split(',').includes(file.type)) {
      setMessage({ ok: false, text: 'Formato não aceito. ' + cfg.hint })
      return
    }
    if (file.size > cfg.maxMb * 1024 * 1024) {
      setMessage({ ok: false, text: `O arquivo passa de ${cfg.maxMb} MB. Escolha um menor.` })
      return
    }
    setBusy(true)
    try {
      const supabase = createClient()
      const ext = (file.name.split('.').pop() ?? 'bin').toLowerCase().replace(/[^a-z0-9]/g, '')
      const path = `${userId}/${kind}-${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from(cfg.bucket).upload(path, file, { contentType: file.type })
      if (upErr) throw upErr
      const { error: dbErr } = await supabase.from('psychologists').update({ [cfg.column]: path }).eq('id', userId)
      if (dbErr) throw dbErr
      if (kind === 'foto') setPreview(URL.createObjectURL(file))
      setMessage({ ok: true, text: kind === 'foto' ? 'Foto atualizada.' : 'Documento enviado. Vamos conferir em até 3 dias úteis.' })
      router.refresh()
    } catch (e) {
      console.error(e)
      setMessage({ ok: false, text: 'Não conseguimos enviar o arquivo. Tente de novo.' })
    } finally {
      setBusy(false)
      if (input.current) input.current.value = ''
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-5">
      {kind === 'foto' && (
        <div className="size-24 shrink-0 overflow-hidden rounded-full bg-areia">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Sua foto de perfil" className="size-full object-cover" />
          ) : (
            <span className="flex size-full items-center justify-center text-sm text-grafite-suave">Sem foto</span>
          )}
        </div>
      )}
      <div className="min-w-0 flex-1">
        {kind === 'documento' && currentLabel && (
          <p className="mb-2 text-[0.97rem]">
            <span className="font-semibold">Documento enviado</span> <span className="text-grafite-suave">({currentLabel})</span>
          </p>
        )}
        <input
          ref={input}
          type="file"
          accept={cfg.accept}
          className="sr-only"
          id={`upload-${kind}`}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
          }}
        />
        <label htmlFor={`upload-${kind}`} className={`btn btn-secundario cursor-pointer ${busy ? 'pointer-events-none opacity-60' : ''}`}>
          {busy ? 'Enviando…' : (kind === 'foto' ? preview : currentLabel) ? cfg.replace : cfg.button}
        </label>
        <p className="dica">{cfg.hint}</p>
        {message && (
          <p role={message.ok ? 'status' : 'alert'} className={`mt-2 text-[0.95rem] ${message.ok ? 'text-salvia-noite' : 'text-alerta'}`}>
            {message.text}
          </p>
        )}
      </div>
    </div>
  )
}
