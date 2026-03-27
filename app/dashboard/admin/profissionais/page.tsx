'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Star, Clock, DollarSign, Check, X } from 'lucide-react'

interface Professional {
  id: number
  name: string
  crp: string
  specialties: string[]
  rating: number
  sessionsCompleted: number
  pricePerSession: number
  isVerified: boolean
}

export default function ProfessionalsPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [pendingApproval, setPendingApproval] = useState<Professional[]>([])
  const [verifiedProfessionals, setVerifiedProfessionals] = useState<Professional[]>([])

  useEffect(() => {
    const userSession = getSession()
    if (!userSession) {
      router.push('/auth/login')
      return
    }
    setSession(userSession)

    // Initialize mock data
    const pending = [
      {
        id: 1,
        name: 'Dra. Juliana Rocha',
        crp: 'CRP/SP 06/80000',
        specialties: ['Psicologia Clínica', 'Terapia Familiar'],
        rating: 0,
        sessionsCompleted: 0,
        pricePerSession: 150,
        isVerified: false,
      },
      {
        id: 2,
        name: 'Psic. Rafael Santos',
        crp: 'CRP/RJ 05/85000',
        specialties: ['Psicoterapia', 'Terapia Cognitivo-Comportamental'],
        rating: 0,
        sessionsCompleted: 0,
        pricePerSession: 180,
        isVerified: false,
      },
    ]

    const verified = [
      {
        id: 3,
        name: 'Dr. Marcos Oliveira',
        crp: 'CRP/SP 06/75000',
        specialties: ['Psicologia do Bem-estar', 'Coaching'],
        rating: 4.8,
        sessionsCompleted: 156,
        pricePerSession: 200,
        isVerified: true,
      },
      {
        id: 4,
        name: 'Dra. Ana Costa',
        crp: 'CRP/MG 04/82000',
        specialties: ['Psicoterapia', 'Saúde Mental'],
        rating: 4.9,
        sessionsCompleted: 203,
        pricePerSession: 180,
        isVerified: true,
      },
      {
        id: 5,
        name: 'Psic. Roberto Lima',
        crp: 'CRP/SP 06/78000',
        specialties: ['Terapia Familiar', 'Atendimento a Crianças'],
        rating: 4.7,
        sessionsCompleted: 98,
        pricePerSession: 160,
        isVerified: true,
      },
    ]

    setPendingApproval(pending)
    setVerifiedProfessionals(verified)
  }, [router])

  const handleApprove = (id: number) => {
    const professional = pendingApproval.find(p => p.id === id)
    if (professional) {
      setPendingApproval(pendingApproval.filter(p => p.id !== id))
      setVerifiedProfessionals([...verifiedProfessionals, { ...professional, isVerified: true }])
    }
  }

  const handleReject = (id: number) => {
    setPendingApproval(pendingApproval.filter(p => p.id !== id))
  }

  const totalProfessionals = pendingApproval.length + verifiedProfessionals.length
  const verifiedCount = verifiedProfessionals.length
  const pendingCount = pendingApproval.length
  const avgRating =
    verifiedProfessionals.length > 0
      ? (
          verifiedProfessionals.reduce((sum, p) => sum + p.rating, 0) /
          verifiedProfessionals.length
        ).toFixed(1)
      : '0.0'

  if (!session) return null

  return (
    <DashboardLayout userRole="admin" userName={session.name}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Gerenciamento de Profissionais</h1>
          <p className="text-gray-500 mt-1">Administre profissionais e verifique documentações</p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-4 border border-petblue-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Total</p>
            <p className="text-2xl font-bold text-petblue-600 mt-1">{totalProfessionals}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-petgreen-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Verificados</p>
            <p className="text-2xl font-bold text-petgreen-600 mt-1">{verifiedCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-orange-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Pendentes</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">{pendingCount}</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-yellow-100 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">Avaliação Média</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">⭐ {avgRating}</p>
          </div>
        </div>

        {/* Pending Verifications */}
        {pendingApproval.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-serif font-bold text-gray-900">Aguardando Verificação ({pendingCount})</h2>
            <div className="grid gap-4">
              {pendingApproval.map(prof => (
                <div key={prof.id} className="bg-orange-50 border border-orange-200 rounded-2xl p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{prof.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{prof.crp}</p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {prof.specialties.map((specialty, idx) => (
                          <span key={idx} className="text-xs bg-orange-100 text-orange-800 px-2.5 py-1 rounded-lg font-medium">
                            {specialty}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-orange-700 font-semibold mt-3">
                        R$ {prof.pricePerSession} por sessão
                      </p>
                    </div>
                    <div className="flex gap-3 md:flex-col">
                      <button
                        onClick={() => handleApprove(prof.id)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        Aprovar
                      </button>
                      <button
                        onClick={() => handleReject(prof.id)}
                        className="flex-1 md:flex-none px-6 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Rejeitar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verified Professionals */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-bold text-gray-900">Profissionais Verificados ({verifiedCount})</h2>
          <div className="grid gap-4">
            {verifiedProfessionals.map(prof => (
              <div key={prof.id} className="bg-white border border-petblue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{prof.name}</h3>
                      <Check className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{prof.crp}</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      {prof.specialties.map((specialty, idx) => (
                        <span key={idx} className="text-xs bg-petblue-50 text-petblue-700 px-2.5 py-1 rounded-lg font-medium">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 md:grid-cols-1">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-bold text-gray-900">{prof.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600">Avaliação</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-petblue-600" />
                        <span className="font-bold text-gray-900">{prof.sessionsCompleted}</span>
                      </div>
                      <p className="text-xs text-gray-600">Sessões</p>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <DollarSign className="w-4 h-4 text-petgreen-600" />
                        <span className="font-bold text-gray-900">R$ {prof.pricePerSession}</span>
                      </div>
                      <p className="text-xs text-gray-600">Sessão</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
