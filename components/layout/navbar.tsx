'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Heart, Menu, X, ChevronDown, Shield, User, Stethoscope, LogIn, UserPlus } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

const navLinks = [
  { label: 'Como Funciona', href: '#como-funciona' },
  { label: 'Peça ajuda a um profissional', href: '/profissionais' },
  { label: 'Loja', href: '/loja' },
  { label: 'Para Psicólogos', href: '/para-psicologos' },
]

const accessLinks = [
  {
    label: 'Paciente',
    description: 'Acompanhe suas consultas e conquistas',
    href: '/dashboard/paciente',
    icon: User,
    color: 'text-petblue-600',
    bg: 'bg-petblue-50',
  },
  {
    label: 'Profissional',
    description: 'Gerencie sua agenda e pacientes',
    href: '/dashboard/profissional',
    icon: Stethoscope,
    color: 'text-petgreen-600',
    bg: 'bg-petgreen-50',
  },
  {
    label: 'Administrador',
    description: 'Configurações da plataforma',
    href: '/dashboard/admin/configuracoes',
    icon: Shield,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
  },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [accessOpen, setAccessOpen] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.access-dropdown')) {
        setAccessOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-petblue-500 rounded-xl flex items-center justify-center group-hover:bg-petblue-600 transition-colors">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className={`text-xl font-bold font-serif ${scrolled ? 'text-gray-900' : 'text-white'}`}>
              PetApoio
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-petblue-500 ${
                  scrolled ? 'text-gray-600' : 'text-white/90'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth/Access */}
          <div className="hidden md:flex items-center gap-3">
            {/* Access Dropdown */}
            <div className="relative access-dropdown">
              <button
                onClick={() => setAccessOpen(!accessOpen)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  scrolled
                    ? 'text-gray-700 hover:bg-gray-100'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <LogIn className="w-4 h-4" />
                Acessar
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${accessOpen ? 'rotate-180' : ''}`} />
              </button>

              {accessOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Acessar como</p>
                  </div>

                  {accessLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setAccessOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                        <item.icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  ))}

                  {/* Cadastro profissional CTA inside dropdown */}
                  <div className="border-t border-gray-100 mt-1 pt-2 px-4 pb-2">
                    <Link
                      href="/para-psicologos"
                      onClick={() => setAccessOpen(false)}
                      className="flex items-center gap-3 p-3 rounded-lg bg-petgreen-50 border border-petgreen-200 hover:bg-petgreen-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-petgreen-100 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-petgreen-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-petgreen-700">Cadastre-se como Psicólogo</p>
                        <p className="text-xs text-petgreen-600">Comece a atender tutores enlutados</p>
                      </div>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 mt-1 pt-1 px-4 py-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setAccessOpen(false)}
                      className="text-xs text-petblue-600 hover:text-petblue-700 font-medium"
                    >
                      Entrar com email e senha →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* CTA Button */}
            <Link
              href="/profissionais"
              className="flex items-center gap-2 px-5 py-2.5 bg-petblue-500 text-white rounded-full text-sm font-semibold hover:bg-petblue-600 transition-colors shadow-lg shadow-petblue-500/25"
            >
              <Heart className="w-4 h-4" />
              Buscar Apoio
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2 rounded-lg ${scrolled ? 'text-gray-700' : 'text-white'}`}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white rounded-2xl shadow-xl mt-2 mb-4 p-4 border border-gray-100">
            {/* Nav Links */}
            <div className="space-y-1 mb-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-lg text-sm font-medium"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Access Section */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="px-4 text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Acessar como</p>
              {accessLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-lg"
                >
                  <div className={`w-9 h-9 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </Link>
              ))}

              {/* Mobile: Cadastro profissional CTA */}
              <Link
                href="/para-psicologos"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 mx-4 mt-3 p-3 rounded-lg bg-petgreen-50 border border-petgreen-200"
              >
                <div className="w-9 h-9 rounded-lg bg-petgreen-100 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-petgreen-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-petgreen-700">Cadastre-se como Psicólogo</p>
                  <p className="text-xs text-petgreen-600">Comece a atender</p>
                </div>
              </Link>
            </div>

            {/* CTA */}
            <Link
              href="/profissionais"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 bg-petblue-500 text-white rounded-xl text-sm font-semibold hover:bg-petblue-600"
            >
              <Heart className="w-4 h-4" />
              Buscar Apoio
            </Link>
          </div>
        )}
      </nav>
    </header>
  )
}
