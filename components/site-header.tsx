import Link from 'next/link'
import { Logo } from './logo'
import { MobileNav } from './mobile-nav'
import { nav } from '@/lib/site'

export function SiteHeader() {
  return (
    <header className="border-b border-areia bg-linho/95 backdrop-blur supports-[backdrop-filter]:bg-linho/80 sticky top-0 z-40">
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
        <div className="flex items-center gap-2">
          <Link href="/encontre-apoio" className="btn btn-primario hidden sm:inline-flex !min-h-10 !py-2">
            Preciso de apoio
          </Link>
          <MobileNav />
        </div>
      </div>
    </header>
  )
}
