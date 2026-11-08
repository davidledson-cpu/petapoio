import Link from 'next/link'
import { Logo } from './logo'
import { MobileNav } from './mobile-nav'
import { CartLink } from './cart-link'
import { nav } from '@/lib/site'
import { getSession, homeFor } from '@/lib/auth'

export async function SiteHeader() {
  const session = await getSession()
  const account = session
    ? { href: homeFor(session.profile.role), label: 'Minha conta' }
    : { href: '/entrar', label: 'Acessar' }

  return (
    <header className="sticky top-0 z-40 border-b border-areia bg-linho/95 backdrop-blur supports-[backdrop-filter]:bg-linho/85">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-5 whitespace-nowrap text-[0.97rem] font-medium 2xl:gap-7">
            {nav.map((item) =>
              'children' in item ? (
                <li key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-haspopup="true"
                    className="inline-flex items-center gap-1 text-grafite-suave hover:text-grafite group-focus-within:text-grafite"
                  >
                    {item.label}
                    <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true" className="transition-transform group-hover:rotate-180 group-focus-within:rotate-180">
                      <path d="M2 3.5l3 3 3-3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                  {/* Abre no hover e no foco do teclado; pt-3 mantém a área contínua entre o link e o painel. */}
                  <div className="invisible absolute right-0 top-full z-50 pt-3 opacity-0 transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="min-w-56 rounded-2xl border border-areia bg-white p-2 shadow-[0_20px_40px_-24px_rgba(46,42,39,.45)]">
                      {item.children.map((sub) => (
                        <li key={sub.href}>
                          <Link href={sub.href} className="block rounded-xl px-4 py-2.5 text-grafite hover:bg-linho-escuro focus-visible:bg-linho-escuro">
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ) : (
                <li key={item.href}>
                  <Link href={item.href} className="text-grafite-suave hover:text-grafite">
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <CartLink />
          <Link
            href={account.href}
            className="hidden items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-[0.95rem] font-semibold hover:bg-areia sm:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 17c1.2-3 3.6-4.5 6.5-4.5s5.3 1.5 6.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {account.label}
          </Link>
          <Link href="/psicologos" className="btn btn-primario hidden !min-h-10 whitespace-nowrap !py-2 md:inline-flex xl:hidden 2xl:inline-flex">
            Encontrar psicólogo
          </Link>
          <MobileNav account={account} />
        </div>
      </div>
    </header>
  )
}
