import { randomUUID } from 'node:crypto'
import { NextResponse, type NextRequest } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { isSupabaseConfigured } from '@/lib/env'

/**
 * Recebe a foto usada para personalizar um produto e guarda no bucket privado "order-uploads".
 * Devolve só o caminho; a imagem nunca fica pública (a administração a vê por URL assinada).
 */

const MAX_BYTES = 10 * 1024 * 1024
const TYPES: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/heic': 'heic',
  'image/heif': 'heic',
}

// Limite simples por IP (por instância): 12 envios a cada 10 minutos.
const WINDOW_MS = 10 * 60 * 1000
const LIMIT = 12
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  if (hits.size > 5000) hits.clear()
  return recent.length > LIMIT
}

/** Confere a assinatura do arquivo, para não aceitar algo que só diz ser imagem. */
function looksLikeImage(buf: Uint8Array, type: string) {
  const hex = (n: number) => Array.from(buf.slice(0, n), (b) => b.toString(16).padStart(2, '0')).join('')
  if (type === 'image/jpeg') return hex(3) === 'ffd8ff'
  if (type === 'image/png') return hex(8) === '89504e470d0a1a0a'
  if (type === 'image/webp') return hex(4) === '52494646' && new TextDecoder().decode(buf.slice(8, 12)) === 'WEBP'
  return new TextDecoder().decode(buf.slice(4, 8)) === 'ftyp'
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local'
  if (rateLimited(ip)) {
    return NextResponse.json({ error: 'Muitos envios em pouco tempo. Aguarde alguns minutos e tente de novo.' }, { status: 429 })
  }
  if (!isSupabaseConfigured() || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'O envio de fotos ainda não está ativo neste ambiente.' }, { status: 503 })
  }

  const form = await req.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'Escolha uma foto para enviar.' }, { status: 400 })

  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Envie a foto em JPG, PNG, WEBP ou HEIC.' }, { status: 415 })
  if (file.size > MAX_BYTES) return NextResponse.json({ error: 'A foto passa de 10 MB. Envie uma versão menor.' }, { status: 413 })

  const bytes = new Uint8Array(await file.arrayBuffer())
  if (!looksLikeImage(bytes, file.type)) {
    return NextResponse.json({ error: 'Este arquivo não parece ser uma foto. Tente outro.' }, { status: 415 })
  }

  const path = `pendentes/${randomUUID()}.${ext}`
  const { error } = await createAdminClient()
    .storage.from('order-uploads')
    .upload(path, bytes, { contentType: file.type, upsert: false })
  if (error) {
    console.error('order upload failed', error.message)
    return NextResponse.json({ error: 'Não conseguimos guardar a foto. Tente de novo.' }, { status: 500 })
  }
  return NextResponse.json({ path })
}
