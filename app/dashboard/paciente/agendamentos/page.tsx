'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, X, MapPin, Clock, Star } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}

function formatDateTime(isoString: string) {
  const date = new Date(isoString)
  return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

interface Appointment {
  id: string
  scheduled_at: string
  duration_min: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show'
  video_room_url?: string
  rating?: number
  review_text?: string
  notes_patient?: string
  professional: {
    id: string
    full_name: string
    avatar_url?: string
    specialty: string
  }
}

export default function AppointmentsPage() {
  const router = useRouter()
  const session = getSession()
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming')
  const [ratingId, setRatingId] = useState<string | null>(null)
  const [ratingStars, setRatingStars] = useState(0)
  const [ratingText, setRatingText] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    }
  }, [session, router])

  if (!session) return null

  // Mock data
  const upcomingAppointments: Appointment[] = [
    {
      id: '1',
      professional: { id: '1', full_name: 'Dr. Marcos Oliveira', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos', specialty: 'Psicologia Clínica' },
      scheduled_at: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'confirmed',
      video_room_url: 'https://meet.google.com/abc-defg-hij',
    },
    {
      id: '2',
      professional: { id: '2', full_name: 'Dra. Sofia Costa', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', specialty: 'Terapia Cognitiva' },
      scheduled_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'pending',
      video_room_url: null,
    },
  ]

  const completedAppointments: Appointment[] = [
    {
      id: '3',
      professional: { id: '1', full_name: 'Dr. Marcos Oliveira', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos', specialty: 'Psicologia Clínica' },
      scheduled_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'completed',
      rating: 5,
      review_text: 'Ótima sessão, muito útil e produtiva!',
    },
    {
      id: '4',
      professional: { id: '2', full_name: 'Dra. Sofia Costa', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', specialty: 'Terapia Cognitiva' },
      scheduled_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'completed',
      rating: 4,
      review_text: 'Muito bom, profissional experiente.',
    },
    {
      id: '5',
      professional: { id: '3', full_name: 'Dr. Carlos Mendes', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos', specialty: 'Psicanálise' },
      scheduled_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'completed',
    },
  ]

  const cancelledAppointments: Appointment[] = [
    {
      id: '6',
      professional: { id: '4', full_name: 'Dra. Ana Silva', avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana', specialty: 'Psicologia Infantil' },
      scheduled_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      duration_min: 50,
      status: 'cancelled',
    },
  ]

  const appointments = activeTab === 'upcoming' ? upcomingAppointments : activeTab === 'completed' ? completedAppointments : cancelledAppointments

  const submitRating = () => {
    if (!ratingId || ratingStars === 0) return
    setRatingId(null)
    setRatingStars(0)
    setRatingText('')
  }

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="w-8 h-8 text-petblue-400" />
            Meus Agendamentos
          </h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe todas as suas sessões e consultas</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-petblue-100">
          {[
            { id: 'upcoming', label: 'Próximas', icon: '📅' },
            { id: 'completed', label: 'Realizadas', icon: '✅' },
            { id: 'cancelled', label: 'Canceladas', icon: '❌' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'px-5 py-3 font-semibold text-sm border-b-2 transition-colors',
                activeTab === tab.id
                  ? 'border-petblue-400 text-petblue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {appointments.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-petblue-100 shadow-sm text-center">
            <div className="text-5xl mb-4">
              {activeTab === 'upcoming' ? '🗓️' : activeTab === 'completed' ? '✨' : '📋'}
            </div>
            <p className="text-gray-600 font-semibold mb-2">
              {activeTab === 'upcoming'
                ? 'Nenhuma sessão agendada'
                : activeTab === 'completed'
                ? 'Você ainda não completou nenhuma sessão'
                : 'Nenhuma sessão cancelada'}
            </p>
            <p className="text-gray-500 text-sm mb-5">
              {activeTab === 'upcoming'
                ? 'Navegue para encontrar um profissional e agende sua primeira consulta.'
                : 'Após completar sessões, elas aparecerão aqui.'}
            </p>
            {activeTab === 'upcoming' && (
              <Link
                href="/profissionais"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors"
              >
                Encontrar profissionais →
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.map((apt: Appointment) => (
              <div key={apt.id} className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Professional info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-petblue-100 flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden">
                        {apt.professional?.avatar_url ? (
                          <img
                            src={apt.professional.avatar_url}
                            alt={apt.professional.full_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          '👩‍⚕️'
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-serif font-bold text-lg text-gray-800">
                          {apt.professional?.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {apt.professional?.specialty || 'Psicólogo'}
                        </div>
                        <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-petblue-400" />
                            {formatDateTime(apt.scheduled_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-petgreen-400" />
                            {apt.duration_min} min
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Status and actions */}
                  <div className="flex flex-col items-end gap-3">
                    <span
                      className={cn(
                        'px-3 py-1 rounded-full text-xs font-bold',
                        {
                          'bg-yellow-100 text-yellow-600': apt.status === 'pending',
                          'bg-green-100 text-green-600': apt.status === 'confirmed',
                          'bg-blue-100 text-blue-600': apt.status === 'completed',
                          'bg-red-100 text-red-600': apt.status === 'cancelled' || apt.status === 'no_show',
                        }
                      )}
                    >
                      {apt.status === 'pending'
                        ? 'Pendente'
                        : apt.status === 'confirmed'
                        ? 'Confirmada'
                        : apt.status === 'completed'
                        ? 'Realizada'
                        : apt.status === 'no_show'
                        ? 'Não compareceu'
                        : 'Cancelada'}
                    </span>

                    {activeTab === 'upcoming' && apt.video_room_url && (
                      <a
                        href={apt.video_room_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-lg bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors flex items-center gap-2"
                      >
                        <MapPin className="w-4 h-4" />
                        Entrar na sala
                      </a>
                    )}

                    {activeTab === 'upcoming' && (
                      <button className="px-4 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 transition-colors flex items-center gap-2">
                        <X className="w-4 h-4" />
                        Cancelar
                      </button>
                    )}

                    {activeTab === 'completed' && (
                      <div className="text-right">
                        {apt.rating ? (
                          <div className="flex items-center gap-1 justify-end">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className="text-lg">
                                {i < apt.rating! ? '⭐' : '☆'}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <button
                            onClick={() => setRatingId(apt.id)}
                            className="px-4 py-2 rounded-lg border border-petblue-200 text-petblue-600 text-sm font-bold hover:bg-petblue-50 transition-colors flex items-center gap-2"
                          >
                            <Star className="w-4 h-4" />
                            Avaliar
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Rating modal inline */}
                {ratingId === apt.id && (
                  <div className="mt-4 pt-4 border-t border-petblue-100 space-y-3">
                    <p className="font-semibold text-gray-800">Como foi sua sessão?</p>
                    <div className="flex gap-2 justify-center">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setRatingStars(i + 1)}
                          className="text-3xl transition-transform hover:scale-110"
                        >
                          {i < ratingStars ? '⭐' : '☆'}
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={ratingText}
                      onChange={(e) => setRatingText(e.target.value)}
                      placeholder="Deixe um comentário... (opcional)"
                      className="w-full p-3 rounded-lg border border-petblue-200 text-sm focus:outline-none focus:border-petblue-400"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={submitRating}
                        className="flex-1 px-4 py-2 rounded-lg bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors"
                      >
                        Enviar avaliação
                      </button>
                      <button
                        onClick={() => setRatingId(null)}
                        className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
