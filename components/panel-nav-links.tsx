'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from '@/lib/panel-nav'

export function PanelNavLinks({ items }: { items: NavItem[] }) {
  const pathname = usePathname()
  // O item ativo é o de caminho mais longo que corresponde à página atual.
  const active = items
    .filter((i) => pathname === i.href || pathname.startsWith(`${i.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href

  return (
    <nav aria-label="Área logada" className="-mx-1 mt-5 overflow-x-auto lg:mx-0 lg:overflow-visible">
      <ul className="flex gap-1 px-1 lg:flex-col lg:px-0">
        {items.map((item) => {
          const current = item.href === active
          return (
            <li key={item.href} className="shrink-0">
              <Link
                href={item.href}
                aria-current={current ? 'page' : undefined}
                className={`block rounded-full px-4 py-2 text-[0.97rem] lg:rounded-xl ${
                  current ? 'bg-salvia-funda font-semibold text-linho' : 'text-grafite-suave hover:bg-areia hover:text-grafite'
                }`}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
