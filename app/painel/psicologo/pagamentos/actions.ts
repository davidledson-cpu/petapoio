'use server'

import { randomBytes } from 'node:crypto'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { requireSession } from '@/lib/auth'
import { isSplitConfigured } from '@/lib/env'
import { disconnectSellerAccount, oauthAuthorizeUrl } from '@/lib/mercadopago'

export async function connectMercadoPago() {
  await requireSession(['psicologo'], '/painel/psicologo/pagamentos')
  if (!isSplitConfigured()) redirect('/painel/psicologo/pagamentos?erro=Os pagamentos ainda estão sendo ativados.')
  const state = randomBytes(24).toString('base64url')
  const jar = await cookies()
  jar.set('mp_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 600,
    path: '/',
  })
  redirect(oauthAuthorizeUrl(state))
}

export async function disconnectMercadoPago() {
  const session = await requireSession(['psicologo'], '/painel/psicologo/pagamentos')
  await disconnectSellerAccount(session.userId)
  revalidatePath('/painel/psicologo', 'layout')
  redirect('/painel/psicologo/pagamentos?desconectado=1')
}
