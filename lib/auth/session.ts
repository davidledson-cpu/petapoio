'use client'

import type { DemoUser } from './demo-auth'

export function getSession(): DemoUser | null {
  if (typeof document === 'undefined') return null
  const cookies = document.cookie.split(';').map(c => c.trim())
  const sessionCookie = cookies.find(c => c.startsWith('petapoio_session='))
  if (!sessionCookie) return null
  try {
    return JSON.parse(decodeURIComponent(sessionCookie.split('=').slice(1).join('=')))
  } catch {
    return null
  }
}

export function clearSession(): void {
  document.cookie = 'petapoio_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}
