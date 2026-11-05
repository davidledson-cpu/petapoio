import type { Metadata } from 'next'
import { PanelShell } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { PANEL_NAV } from '@/lib/panel-nav'

export const metadata: Metadata = { title: 'Minha conta', robots: { index: false } }

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireSession()
  const role = profile.role === 'admin' ? 'paciente' : profile.role
  return (
    <PanelShell title={role === 'psicologo' ? 'Área do psicólogo' : 'Minha conta'} name={profile.full_name} nav={PANEL_NAV[role]}>
      {children}
    </PanelShell>
  )
}
