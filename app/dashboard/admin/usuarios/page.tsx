'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Search, ChevronLeft, ChevronRight, ToggleLeft, ToggleRight } from 'lucide-react'

interface User {
  id: number
  name: string
  email: string
  role: 'patient' | 'professional' | 'admin'
  plan: string
  isActive: boolean
  createdAt: string
}

export default function UsersPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('Todos')
  const [currentPage, setCurrentPage] = useState(1)
  const [toggleStates, setToggleStates] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const userSession = getSession()
    if (!userSession) {
      router.push('/auth/login')
      return
    }
    setSession(userSession)
  }, [router])

  // Mock users data
  const mockUsers: User[] = [
    {
      id: 1,
      name: 'Ana Carolina Silva',
      email: 'ana.silva@example.com',
      role: 'patient',
      plan: 'Premium',
      isActive: true,
      createdAt: '2024-01-15',
    },
    {
      id: 2,
      name: 'Dr. Marcos Oliveira',
      email: 'marcos.oliveira@example.com',
      role: 'professional',
      plan: 'Professional',
      isActive: true,
      createdAt: '2023-12-10',
    },
    {
      id: 3,
      name: 'Maria Santos',
      email: 'maria.santos@example.com',
      role: 'patient',
      plan: 'Basic',
      isActive: true,
      createdAt: '2024-02-01',
    },
    {
      id: 4,
      name: 'Dra. Paula Costa',
      email: 'paula.costa@example.com',
      role: 'professional',
      plan: 'Professional',
      isActive: false,
      createdAt: '2023-11-20',
    },
    {
      id: 5,
      name: 'João Ferreira',
      email: 'joao.ferreira@example.com',
      role: 'patient',
      plan: 'Free',
      isActive: true,
      createdAt: '2024-01-28',
    },
    {
      id: 6,
      name: 'Admin PetApoio',
      email: 'admin@petapoio.com.br',
      role: 'admin',
      plan: 'Admin',
      isActive: true,
      createdAt: '2023-01-01',
    },
    {
      id: 7,
      name: 'Fernanda Gomes',
      email: 'fernanda.gomes@example.com',
      role: 'patient',
      plan: 'Premium',
      isActive: true,
      createdAt: '2024-03-05',
    },
    {
      id: 8,
      name: 'Dr. Carlos Mendes',
      email: 'carlos.mendes@example.com',
      role: 'professional',
      plan: 'Professional',
      isActive: true,
      createdAt: '2024-02-15',
    },
  ]

  // Initialize toggle states
  useEffect(() => {
    const states: { [key: number]: boolean } = {}
    mockUsers.forEach(user => {
      states[user.id] = user.isActive
    })
    setToggleStates(states)
  }, [])

  // Filter users
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole =
      roleFilter === 'Todos' ||
      (roleFilter === 'Paciente' && user.role === 'patient') ||
      (roleFilter === 'Profissional' && user.role === 'professional') ||
      (roleFilter === 'Admin' && user.role === 'admin')

    return matchesSearch && matchesRole
  })

  // Pagination
  const itemsPerPage = 10
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const displayedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleToggle = (userId: number) => {
    setToggleStates(prev => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const getRoleLabel = (role: string) => {
    if (role === 'patient') return 'Paciente'
    if (role === 'professional') return 'Profissional'
    return 'Admin'
  }

  const getRoleColor = (role: string) => {
    if (role === 'admin') return 'bg-purple-100 text-purple-700'
    if (role === 'professional') return 'bg-petblue-100 text-petblue-700'
    return 'bg-petgreen-100 text-petgreen-700'
  }

  if (!session) return null

  return (
    <DashboardLayout userRole="admin" userName={session.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gerenciamento de Usuários</h1>
          <p className="text-gray-500 mt-1">Administre todos os usuários da plataforma</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nome ou email..."
                value={searchTerm}
                onChange={e => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-500 focus:ring-1 focus:ring-petblue-500"
              />
            </div>

            {/* Role Filter */}
            <select
              value={roleFilter}
              onChange={e => {
                setRoleFilter(e.target.value)
                setCurrentPage(1)
              }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-500 focus:ring-1 focus:ring-petblue-500 font-medium"
            >
              <option value="Todos">Todos</option>
              <option value="Paciente">Paciente</option>
              <option value="Profissional">Profissional</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Results info */}
          <div className="text-sm text-gray-600">
            Mostrando <span className="font-semibold">{displayedUsers.length}</span> de{' '}
            <span className="font-semibold">{filteredUsers.length}</span> usuários
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-petblue-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-petblue-100 bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Nome</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Plano</th>
                  <th className="px-6 py-3 text-center text-xs font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700">Data Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {displayedUsers.map(user => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getRoleColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">{user.plan}</td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(user.id)}
                        className="inline-flex items-center justify-center transition-transform hover:scale-110"
                        title={toggleStates[user.id] ? 'Ativo' : 'Inativo'}
                      >
                        {toggleStates[user.id] ? (
                          <ToggleRight className="w-6 h-6 text-petgreen-600" />
                        ) : (
                          <ToggleLeft className="w-6 h-6 text-gray-400" />
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{user.createdAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500 font-medium">Nenhum usuário encontrado</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredUsers.length > 0 && (
          <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-petblue-100 shadow-sm">
            <div className="text-sm text-gray-600">
              Página <span className="font-semibold">{currentPage}</span> de{' '}
              <span className="font-semibold">{totalPages}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
