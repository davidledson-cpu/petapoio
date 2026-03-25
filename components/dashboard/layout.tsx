import Link from 'next/link'
import { LayoutDashboard, Calendar, User, Trophy, ShoppingBag, LogOut, Users, DollarSign, BarChart2, Settings } from 'lucide-react'

const patientNav = [
  { label: 'Dashboard', href: '/dashboard/paciente', icon: LayoutDashboard },
  { label: 'Agendamentos', href: '/dashboard/paciente/agendamentos', icon: Calendar },
  { label: 'Conquistas', href: '/dashboard/paciente/conquistas', icon: Trophy },
  { label: 'Meu Perfil', href: '/dashboard/paciente/perfil', icon: User },
  { label: 'Loja', href: '/loja', icon: ShoppingBag },
]

export function DashboardLayout({ children, userRole, userName }: { children: React.ReactNode, userRole: string, userName: string }) {
  const nav = userRole === 'patient' ? patientNav : []
  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-petblue-100 fixed h-full">
        <Link href="/" className="flex items-center gap-2.5 p-6 border-b border-petblue-50">
          <div className="w-8 h-8 rounded-full bg-petblue-400 flex items-center justify-center text-lg">🐾</div>
          <span className="font-serif font-bold text-lg text-petblue-600">PetApoio</span>
        </Link>
        <nav className="flex-1 p-4">
          {nav.map(item => (
            <Link href={item.href} key={item.href} className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-petblue-50">
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 md:ml-64 p-6">{children}</main>
    </div>
  )
}
