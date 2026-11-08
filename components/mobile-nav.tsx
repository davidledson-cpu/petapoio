'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { nav } from '@/lib/site'

export function MobileNav({ account }: { account: { href: string; label: string } }) {
  const pathname = usePathname()
  // Guarda a página em que o menu foi aberto: ao navegar, ele fecha sozinho.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const setOpen = (value: boolean | ((v: boolean) => boolean)) =>
    setOpenOn((typeof value === 'function' ? value(open) : value) ? pathname : null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenOn(null)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <div className="xl:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-movel"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-[0.95rem] font-semibold text-grafite hover:bg-areia"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
          {open ? (
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          ) : (
            <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          )}
        </svg>
        Menu
      </button>
      {open && (
        <div id="menu-movel" className="absolute inset-x-0 top-[4.25rem] border-b border-areia bg-linho shadow-[0_12px_24px_-16px_rgba(46,42,39,.35)]">
          <nav aria-label="Principal" className="container-page py-4">
            <ul className="divide-y divide-areia">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="block py-3.5 font-serif text-xl">
                    {item.label}
                  </Link>
                  {'children' in item && (
                    <ul className="-mt-1 mb-3 space-y-1 border-l-2 border-areia pl-4">
                      {item.children.map((sub) => (
                        <li key={sub.href}>
                          <Link href={sub.href} className="block py-1.5 text-[1.02rem] text-grafite-suave hover:text-grafite">
                            {sub.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <Link href="/psicologos" className="btn btn-primario w-full">
                Encontrar psicólogo
              </Link>
              <Link href={account.href} className="btn btn-secundario w-full">
                {account.label}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  )
}
