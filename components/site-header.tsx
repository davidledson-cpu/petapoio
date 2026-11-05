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
          <ul className="flex items-center gap-7 text-[0.97rem] font-medium">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-grafite-suave hover:text-grafite">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-1 sm:gap-2">
          <CartLink />
          <Link
            href={account.href}
            className="hidden items-center gap-2 rounded-full px-3 py-2 text-[0.95rem] font-semibold hover:bg-areia sm:inline-flex"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
              <circle cx="10" cy="7" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M3.5 17c1.2-3 3.6-4.5 6.5-4.5s5.3 1.5 6.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            {account.label}
          </Link>
          <Link href="/psicologos" className="btn btn-primario hidden !min-h-10 !py-2 md:inline-flex">
            Encontrar psicólogo
          </Link>
          <MobileNav account={account} />
        </div>
      </div>
    </header>
  )
}
