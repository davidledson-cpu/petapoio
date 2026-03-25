'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, Heart } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  const navLinks = [
    { label: 'Como Funciona', href: '/#como-funciona' },
    { label: 'Profissionais', href: '/profissionais' },
    { label: 'Loja', href: '/loja' },
    { label: 'Para Psicólogos', href: '/auth/cadastro-profissional' },
  ]

  return (
    <nav className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      'bg-white/95 backdrop-blur-md border-b border-petblue-100',
      scrolled && 'shadow-sm shadow-petblue-100'
    )}>
      <div className="container flex items-center justify-between h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-full bg-petblue-400 flex items-center justify-center text-xl shadow-sm group-hover:bg-petblue-500 transition-colors">
            🐾
          </div>
          <span className="font-serif font-bold text-xl text-petblue-600">PetApoio</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-semibold text-gray-500 hover:text-petblue-500 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link
                href="/dashboard/paciente"
                className="text-sm font-semibold text-petblue-600 hover:text-petblue-700 transition-colors"
              >
                Meu Dashboard
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-semibold text-gray-500 hover:text-gray-700"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-sm font-semibold text-gray-600 hover:text-petblue-600 transition-colors"
              >
                Entrar
              </Link>
              <Link
                href="/auth/cadastro"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-petblue-400 hover:bg-petblue-500 text-white text-sm font-bold transition-all hover:-translate-y-0.5 shadow-sm hover:shadow-md"
              >
                <Heart className="w-4 h-4" />
                Buscar Apoio
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-600"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-petblue-100 py-4 px-6 space-y-3">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm font-semibold text-gray-600 hover:text-petblue-500"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t border-petblue-100 space-y-2">
            {user ? (
              <Link href="/dashboard/paciente" className="block py-2 text-sm font-bold text-petblue-600">
                Meu Dashboard
              </Link>
            ) : (
              <>
                <Link href="/auth/login" className="block py-2 text-sm font-semibold text-gray-600">Entrar</Link>
                <Link
                  href="/auth/cadastro"
                  className="block text-center px-5 py-3 rounded-full bg-petblue-400 text-white text-sm font-bold"
                  onClick={() => setMobileOpen(false)}
                >
                  Buscar Apoio
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
