import { env } from '@/lib/env'

/** URL pública de um arquivo em bucket público. Caminhos começando com "/" são arquivos do próprio site. */
export function publicFileUrl(bucket: 'avatars' | 'products', path: string | null | undefined) {
  if (!path) return null
  if (path.startsWith('/') || path.startsWith('http')) return path
  return `${env.supabaseUrl}/storage/v1/object/public/${bucket}/${path}`
}
