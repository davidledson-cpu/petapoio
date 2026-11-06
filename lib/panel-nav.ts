import type { Role } from '@/types/db'

export type NavItem = { href: string; label: string }

export const PANEL_NAV: Record<Role, NavItem[]> = {
  paciente: [
    { href: '/painel', label: 'Início' },
    { href: '/painel/sessoes', label: 'Minhas sessões' },
    { href: '/painel/pedidos', label: 'Meus pedidos' },
    { href: '/painel/reservas', label: 'Reservas (Cuida)' },
    { href: '/painel/pets', label: 'Meus pets (Saúde)' },
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
    { href: '/admin/psicologos', label: 'Acolhe · Psicólogos' },
    { href: '/admin/sessoes', label: 'Acolhe · Sessões' },
    { href: '/admin/pedidos', label: 'Loja · Pedidos' },
    { href: '/admin/produtos', label: 'Loja · Produtos' },
    { href: '/admin/cuidadores', label: 'Cuida · Cuidadores' },
    { href: '/admin/reservas', label: 'Cuida · Reservas' },
    { href: '/admin/saude', label: 'Saúde · Demanda' },
    { href: '/admin/usuarios', label: 'Usuários' },
    { href: '/admin/inscricoes', label: 'Inscrições' },
    { href: '/admin/configuracoes', label: 'Configurações' },
  ],
}
