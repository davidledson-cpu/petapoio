'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Calendar, User, Trophy, ShoppingBag, LogOut, Users, DollarSign, BarChart2, Settings, Menu, X } from 'lucide-react'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'patient' | 'professional'
  userName: string
  userAvatar?: string
}

const patientNav = [
  { label: 'Início', href: '/dashboard/paciente', icon: LayoutDashboard },
  { label: 'Minhas Sessões', href: '/dashboard/paciente/sessoes', icon: Calendar },
  { label: 'Profissionais', href: '/dashboard/paciente/profissionais', icon: Users },
  { label: 'Conquistas', href: '/dashboard/paciente/conquistas', icon: Trophy },
  { label: 'Meu Perfil', href: '/dashboard/paciente/perfil', icon: User },
  { label: 'Loja Pet', href: '/loja', icon: ShoppingBag },
]

const professionalNav = [
  { label: 'Início', href: '/dashboard/profissional', icon: LayoutDashboard },
  { label: 'Agenda', href: '/dashboard/profissional/agenda', icon: Calendar },
  { label: 'Pacientes', href: '/dashboard/profissional/pacientes', icon: Users },
  { label: 'Financeiro', href: '/dashboard/profissional/financeiro', icon: DollarSign },
  { label: 'Analytics', href: '/dashboard/profissional/analytics', icon: BarChart2 },
  { label: 'Meu Perfil', href: '/dashboard/profissional/perfil', icon: User },
  { label: 'Configurações', href: '/dashboard/profissional/configuracoes', icon: Settings },
]

export function DashboardLayout({ children, userRole, userName, userAvatar }: DashboardLayoutProps) {
  const nav = userRole === 'patient' ? patientNav : professionalNav
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
    router.refresh()
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 p-6 border-b border-petblue-50">
        <div className="w-8 h-8 rounded-full bg-petblue-400 flex items-center justify-center text-lg">🐾</div>
        <span className="font-serif font-bold text-lg text-petblue-600">PetApoio</span>
      </Link>

      {/* User info */}
      <div className="px-5 py-4 border-b border-petblue-50">
        <div className="flex items-center gap-3">
          {userAvatar ? (
            <img src={userAvatar} alt={userName} className="w-9 h-9 rounded-full object-cover" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-petblue-100 flex items-center justify-center font-bold text-petblue-600 text-sm flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-sm font-semibold text-gray-800 leading-tight truncate max-w-[140px]">{userName}</div>
            <div className="text-xs text-gray-400">{userRole === 'patient' ? 'Paciente' : 'Profissional'}</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {nav.map(item => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-petblue-50 text-petblue-600'
                  : 'text-gray-600 hover:bg-petblue-50 hover:text-petblue-600'
              }`}
            >
              <item.icon className={`w-4 h-4 ${isActive ? 'text-petblue-500' : ''}`} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-petblue-50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-petblue-100 fixed h-full z-30">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-64 flex flex-col bg-white shadow-xl z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 md:ml-64 min-h-screen">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-petblue-50 sticky top-0 z-20">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-petblue-400 flex items-center justify-center text-base">🐾</div>
            <span className="font-serif font-bold text-petblue-600">PetApoio</span>
          </Link>
        </div>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
