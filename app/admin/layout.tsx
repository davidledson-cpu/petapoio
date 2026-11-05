import type { Metadata } from 'next'
import { PanelShell } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { PANEL_NAV } from '@/lib/panel-nav'

export const metadata: Metadata = { title: 'Administração', robots: { index: false } }

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireSession(['admin'], '/admin')
  return (
    <PanelShell title="Administração" name={profile.full_name} nav={PANEL_NAV.admin}>
      {children}
    </PanelShell>
  )
}
