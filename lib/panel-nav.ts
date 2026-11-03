import type { Role } from '@/types/db'

export type NavItem = { href: string; label: string }

export const PANEL_NAV: Record<Role, NavItem[]> = {
  paciente: [
    { href: '/painel', label: 'Início' },
    { href: '/painel/sessoes', label: 'Minhas sessões' },
    { href: '/painel/pedidos', label: 'Meus pedidos' },
    { href: '/painel/notificacoes', label: 'Notificações' },
    { href: '/painel/perfil', label: 'Meus dados' },
  ],
  psicologo: [
    { href: '/painel/psicologo', label: 'Visão geral' },
    { href: '/painel/psicologo/agenda', label: 'Agenda' },
    { href: '/painel/psicologo/horarios', label: 'Horários' },
    { href: '/painel/psicologo/perfil', label: 'Perfil público' },
    { href: '/painel/psicologo/pagamentos', label: 'Pagamentos' },
    { href: '/painel/notificacoes', label: 'Notificações' },
    { href: '/painel/perfil', label: 'Meus dados' },
  ],
  admin: [
    { href: '/admin', label: 'Visão geral' },
    { href: '/admin/psicologos', label: 'Psicólogos' },
    { href: '/admin/sessoes', label: 'Sessões' },
    { href: '/admin/pedidos', label: 'Pedidos' },
    { href: '/admin/produtos', label: 'Produtos' },
    { href: '/admin/usuarios', label: 'Usuários' },
    { href: '/admin/inscricoes', label: 'Inscrições' },
    { href: '/admin/configuracoes', label: 'Configurações' },
  ],
}
