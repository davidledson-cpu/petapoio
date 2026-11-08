import Link from 'next/link'
import { PanelHeader, EmptyState } from '@/components/panel-shell'
import { requireSession } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { dateTime } from '@/lib/format'
import { markNotificationsRead } from '../actions'
import type { Notification } from '@/types/db'

export default async function NotificacoesPage() {
  await requireSession(undefined, '/painel/notificacoes')
  const supabase = await createClient()
  const { data } = await supabase.from('notifications').select('*').order('created_at', { ascending: false }).limit(50)
  const items = (data ?? []) as Notification[]
  const unread = items.some((n) => !n.read_at)

  return (
    <>
      <PanelHeader
        title="Notificações"
        action={
          unread ? (
            <form action={markNotificationsRead}>
              <button type="submit" className="btn btn-secundario">Marcar todas como lidas</button>
            </form>
          ) : undefined
        }
      />
      {items.length === 0 ? (
        <EmptyState title="Nenhuma notificação">Avisos sobre sessões, pedidos e seu cadastro aparecem aqui.</EmptyState>
      ) : (
        <ul className="divide-y divide-areia border-y border-areia">
          {items.map((n) => (
            <li key={n.id} className="flex gap-4 py-4">
              <span aria-hidden="true" className={`mt-2 size-2 shrink-0 rounded-full ${n.read_at ? 'bg-transparent' : 'bg-salvia-funda'}`} />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">
                  {n.title}
                  {!n.read_at && <span className="sr-only"> (não lida)</span>}
                </p>
                {n.body && <p className="text-grafite-suave">{n.body}</p>}
                <p className="mt-1 text-sm text-grafite-suave">
                  <span className="capitalize">{dateTime(n.created_at)}</span>
                  {n.link && (
                    <>
                      {' · '}
                      <Link href={n.link} className="link">Ver</Link>
                    </>
                  )}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  )
}
