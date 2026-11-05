import type { ReactNode } from 'react'
import { signOut } from '@/app/auth/actions'
import { PanelNavLinks } from './panel-nav-links'
import type { NavItem } from '@/lib/panel-nav'

/** Moldura das áreas logadas: menu lateral (horizontal no celular) e conteúdo. */
export function PanelShell({ title, name, nav, children }: { title: string; name: string; nav: NavItem[]; children: ReactNode }) {
  return (
    <div className="container-page grid gap-8 pt-8 md:pt-12 lg:grid-cols-[15rem_1fr] lg:gap-12">
      <aside className="lg:sticky lg:top-24 lg:h-fit">
        <p className="text-sm text-grafite-suave">{title}</p>
        <p className="font-serif text-2xl leading-tight">{name || 'Sua conta'}</p>
        <PanelNavLinks items={nav} />
        <form action={signOut} className="mt-4 hidden lg:block">
          <button type="submit" className="text-[0.95rem] text-grafite-suave underline underline-offset-4 hover:text-grafite">
            Sair da conta
          </button>
        </form>
      </aside>
      <div className="min-w-0">{children}</div>
      <form action={signOut} className="lg:hidden">
        <button type="submit" className="text-[0.95rem] text-grafite-suave underline underline-offset-4">Sair da conta</button>
      </form>
    </div>
  )
}

/** Cabeçalho de página dentro do painel. */
export function PanelHeader({ title, intro, action }: { title: string; intro?: ReactNode; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[2.1rem] leading-tight md:text-[2.6rem]">{title}</h1>
        {intro && <div className="mt-2 max-w-[62ch] text-grafite-suave">{intro}</div>}
      </div>
      {action}
    </header>
  )
}

/** Estado vazio: diz o que fazer em seguida. */
export function EmptyState({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-2xl border-[1.5px] border-dashed border-areia-escura p-8">
      <h2 className="text-2xl">{title}</h2>
      {children && <div className="mt-2 max-w-[60ch] text-grafite-suave">{children}</div>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

/** Selo de status (sessão, pedido, aprovação). */
export function StatusBadge({ tone = 'neutro', children }: { tone?: 'neutro' | 'ok' | 'atencao' | 'erro'; children: ReactNode }) {
  const tones = {
    neutro: 'bg-areia text-grafite',
    ok: 'bg-salvia-clara text-salvia-noite',
    atencao: 'bg-[#f3e8cf] text-[#6b4f12]',
    erro: 'bg-[#f6e7e3] text-alerta',
  }
  return <span className={`inline-block rounded-full px-2.5 py-0.5 text-sm font-semibold ${tones[tone]}`}>{children}</span>
}

/** Número de resumo do painel. */
export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-[0_1px_0_var(--color-areia)]">
      <p className="text-sm text-grafite-suave">{label}</p>
      <p className="mt-1 font-serif text-3xl">{value}</p>
      {hint && <p className="mt-1 text-sm text-grafite-suave">{hint}</p>}
    </div>
  )
}
