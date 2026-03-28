'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, CheckCircle, Mail, Gift, Calendar, Clock, Trash2 } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export default function NotificacoesPage() {
  const router = useRouter()
  const session = getSession()
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
      return
    }

    setNotifications([
      {
        id: '1',
        type: 'appointment_confirmed',
        title: 'Sessão Confirmada',
        message: 'Sua sessão com Dr. Marcos Oliveira foi confirmada para 28/03 às 14:00.',
        is_read: false,
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'badge_earned',
        title: 'Nova Conquista!',
        message: 'Você desbloqueou o badge "Primeiro Passo" por completar sua primeira sessão.',
        is_read: false,
        created_at: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '3',
        type: 'appointment_reminder',
        title: 'Lembrete de Sessão',
        message: 'Sua sessão com Dra. Sofia Costa é amanhã às 10:00.',
        is_read: true,
        created_at: new Date(Date.now() - 86400000).toISOString(),
      },
      {
        id: '4',
        type: 'message',
        title: 'Nova Mensagem',
        message: 'Dr. Marcos Oliveira enviou uma mensagem para você.',
        is_read: true,
        created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: '5',
        type: 'achievement',
        title: 'Sequência de 7 dias!',
        message: 'Parabéns! Você registrou seu diário emocional por 7 dias consecutivos.',
        is_read: true,
        created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
      },
      {
        id: '6',
        type: 'appointment_confirmed',
        title: 'Sessão Reagendada',
        message: 'Sua sessão foi reagendada para 01/04 às 16:00.',
        is_read: true,
        created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ])
  }, [session, router])

  if (!session) return null

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, is_read: true } : n))
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'appointment_confirmed':
        return <Calendar className="w-5 h-5 text-petblue-500" />
      case 'appointment_reminder':
        return <Clock className="w-5 h-5 text-orange-500" />
      case 'badge_earned':
        return <Gift className="w-5 h-5 text-yellow-500" />
      case 'achievement':
        return <CheckCircle className="w-5 h-5 text-petgreen-500" />
      case 'message':
        return <Mail className="w-5 h-5 text-petblue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins}min atrás`
    if (diffHours < 24) return `${diffHours}h atrás`
    if (diffDays === 1) return 'Ontem'
    if (diffDays < 7) return `${diffDays} dias atrás`
    return date.toLocaleDateString('pt-BR')
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  const grouped = (() => {
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const weekAgo = new Date(Date.now() - 7 * 86400000)

    const groups: { [key: string]: Notification[] } = {
      Hoje: [],
      Ontem: [],
      'Esta semana': [],
      Anteriores: [],
    }

    notifications.forEach(n => {
      const d = new Date(n.created_at).toDateString()
      if (d === today) groups['Hoje'].push(n)
      else if (d === yesterday) groups['Ontem'].push(n)
      else if (new Date(n.created_at) > weekAgo) groups['Esta semana'].push(n)
      else groups['Anteriores'].push(n)
    })

    return groups
  })()

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-2">
              <Bell className="w-8 h-8 text-petblue-400" />
              Notificações
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Fique atualizado sobre suas sessões e conquistas
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2.5 rounded-xl bg-petblue-50 text-petblue-600 font-bold text-sm hover:bg-petblue-100 transition-colors"
            >
              Marcar todos como lidos ({unreadCount})
            </button>
          )}
        </div>

        {/* Empty state */}
        {notifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-petblue-100 shadow-sm">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Sem notificações</h3>
            <p className="text-gray-500">Você está em dia! Nenhuma notificação pendente.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(grouped).map(
              ([dateGroup, notifs]) =>
                notifs.length > 0 && (
                  <div key={dateGroup}>
                    <h2 className="font-semibold text-gray-600 text-xs uppercase mb-3">{dateGroup}</h2>
                    <div className="space-y-2">
                      {notifs.map(notification => (
                        <div
                          key={notification.id}
                          onClick={() => markAsRead(notification.id)}
                          className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                            notification.is_read
                              ? 'bg-white border-gray-200 hover:border-petblue-200'
                              : 'bg-petblue-50 border-petblue-200 hover:border-petblue-300'
                          }`}
                        >
                          <div className="flex-shrink-0 mt-1">{getIcon(notification.type)}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="font-semibold text-gray-800 text-sm">
                                  {notification.title}
                                  {!notification.is_read && (
                                    <span className="ml-2 inline-block w-2 h-2 rounded-full bg-petblue-400" />
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-xs text-gray-400">{formatTime(notification.created_at)}</span>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  className="p-1 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
