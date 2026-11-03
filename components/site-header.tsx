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
    : { href: '/entrar', label: 'Entrar' }

  return (
    <header className="sticky top-0 z-40 border-b border-areia bg-linho/95 backdrop-blur supports-[backdrop-filter]:bg-linho/80">
      <div className="container-page flex h-[4.25rem] items-center justify-between gap-6">
        <Logo />
        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-[0.97rem]">
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
          <Link href={account.href} className="hidden rounded-full px-3 py-2 text-[0.95rem] font-semibold hover:bg-areia sm:inline-block">
            {account.label}
          </Link>
          <Link href="/encontre-apoio" className="btn btn-primario hidden !min-h-10 !py-2 md:inline-flex">
            Preciso de apoio
          </Link>
          <MobileNav account={account} />
        </div>
      </div>
    </header>
  )
}
