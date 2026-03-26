// Demo authentication system - works without Supabase
// Replace with real Supabase auth when credentials are configured

export interface DemoUser {
  id: string
  email: string
  name: string
  role: 'patient' | 'professional' | 'admin'
  avatar?: string
  createdAt: string
}

export const DEMO_USERS: Record<string, { password: string; user: DemoUser }> = {
  'paciente@petapoio.com.br': {
    password: 'demo123',
    user: {
      id: 'demo-patient-001',
      email: 'paciente@petapoio.com.br',
      name: 'Ana Carolina Silva',
      role: 'patient',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
      createdAt: '2024-01-15',
    },
  },
  'psicologo@petapoio.com.br': {
    password: 'demo123',
    user: {
      id: 'demo-professional-001',
      email: 'psicologo@petapoio.com.br',
      name: 'Dr. Marcos Oliveira',
      role: 'professional',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos',
      createdAt: '2023-08-10',
    },
  },
  'admin@petapoio.com.br': {
    password: 'demo123',
    user: {
      id: 'demo-admin-001',
      email: 'admin@petapoio.com.br',
      name: 'Admin PetApoio',
      role: 'admin',
      createdAt: '2023-01-01',
    },
  },
}

export const SESSION_COOKIE = 'petapoio_session'

export function validateDemoLogin(email: string, password: string): DemoUser | null {
  const entry = DEMO_USERS[email.toLowerCase()]
  if (!entry) return null
  if (entry.password !== password) return null
  return entry.user
}

export function getDashboardRoute(role: DemoUser['role']): string {
  if (role === 'professional') return '/dashboard/profissional'
  if (role === 'admin') return '/dashboard/admin'
  return '/dashboard/paciente'
}
