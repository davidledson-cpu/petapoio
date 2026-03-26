'use client'

import { useState } from 'react'
import { Star, Clock, DollarSign, Award, X, Calendar, MessageSquare, CheckCircle } from 'lucide-react'

const PROFESSIONALS = [
  {
    id: 'p1',
    name: 'Dra. Camila Torres',
    email: 'camila.torres@petapoio.com.br',
    specialty: 'Luto animal e saúde emocional',
    crp: 'CRP 06/12345',
    rating: 4.9,
    reviews: 87,
    price: 180,
    available: true,
    bio: 'Especialista em luto animal com 8 anos de experiência. Atendo tutores que passaram pela perda de seus companheiros pets, oferecendo suporte emocional humanizado.',
    sessionDuration: 50,
    avatar: '👩‍⚕️',
  },
  {
    id: 'p2',
    name: 'Dr. Rafael Mendes',
    email: 'rafael.mendes@petapoio.com.br',
    specialty: 'Psicologia do luto e terapia cognitiva',
    crp: 'CRP 08/67890',
    rating: 4.8,
    reviews: 63,
    price: 160,
    available: true,
    bio: 'Psicólogo com foco em terapia cognitivo-comportamental aplicada ao luto. Ajudo tutores a elaborar a perda de seus pets de forma saudável e ressignificada.',
    sessionDuration: 50,
    avatar: '👨‍⚕️',
  },
  {
    id: 'p3',
    name: 'Dra. Fernanda Lima',
    email: 'fernanda.lima@petapoio.com.br',
    specialty: 'Luto complicado e suporte familiar',
    crp: 'CRP 04/54321',
    rating: 4.7,
    reviews: 45,
    price: 200,
    available: false,
    bio: 'Especialista em luto complicado e dinâmicas familiares após a perda de um pet. Ofereço atendimento individual e em grupo.',
    sessionDuration: 60,
    avatar: '👩‍⚕️',
  },
  {
    id: 'p4',
    name: 'Dr. Marcos Oliveira',
    email: 'marcos.oliveira@petapoio.com.br',
    specialty: 'Trauma, luto e psicoterapia breve',
    crp: 'CRP 07/98765',
    rating: 4.6,
    reviews: 34,
    price: 150,
    available: true,
    bio: 'Trabalho com abordagem integrativa para processar o trauma e o luto pela perda de animais de estimação. Sessões objetivas e acolhedoras.',
    sessionDuration: 45,
    avatar: '👨‍⚕️',
  },
]

function getNextDays(n: number) {
  const days = []
  const today = new Date()
  for (let i = 1; i <= n; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    // Skip Sundays
    if (d.getDay() === 0) continue
    days.push(d)
  }
  return days.slice(0, n)
}

const TIME_SLOTS = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']

type Professional = typeof PROFESSIONALS[0]

export default function ProfissionaisPage() {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const days = getNextDays(10)

  function openModal(professional: Professional) {
    setSelectedProfessional(professional)
    setSelectedDate(null)
    setSelectedTime(null)
    setNotes('')
    setSuccess(false)
    setError('')
  }

  function closeModal() {
    setSelectedProfessional(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setNotes('')
    setSuccess(false)
    setError('')
    setLoading(false)
  }

  async function handleSubmit() {
    if (!selectedProfessional || !selectedDate || !selectedTime) return

    setLoading(true)
    setError('')

    try {
      // Get patient info from cookie/session
      const patientName = 'Tutor(a) PetApoio'
      const patientEmail = 'paciente@petapoio.com.br'

      const dateStr = selectedDate.toISOString().split('T')[0]

      const res = await fetch('/api/book-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          professionalId: selectedProfessional.id,
          professionalName: selectedProfessional.name,
          professionalEmail: selectedProfessional.email,
          patientName,
          patientEmail,
          date: dateStr,
          time: selectedTime,
          notes,
        }),
      })

      if (!res.ok) throw new Error('Erro ao enviar solicitação')

      setSuccess(true)
    } catch {
      setError('Não foi possível enviar a solicitação. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function formatDay(d: Date) {
    return d.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Encontre um Profissional</h1>
        <p className="text-gray-500 mt-1">
          Psicólogos especializados em luto pet prontos para te apoiar
        </p>
      </div>

      <div className="grid gap-4">
        {PROFESSIONALS.map((pro) => (
          <div
            key={pro.id}
            className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-indigo-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {pro.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="font-semibold text-gray-900 text-lg">{pro.name}</h2>
                    <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-medium">
                      {pro.crp}
                    </span>
                    {!pro.available && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Indisponível
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-indigo-600 font-medium mt-0.5">{pro.specialty}</p>
                  <p className="text-sm text-gray-500 mt-2 leading-relaxed">{pro.bio}</p>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <span className="flex items-center gap-1 text-sm text-yellow-600">
                      <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
                      <strong>{pro.rating}</strong>
                      <span className="text-gray-400">({pro.reviews} avaliações)</span>
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {pro.sessionDuration} min
                    </span>
                    <span className="flex items-center gap-1 text-sm text-green-600 font-medium">
                      <DollarSign className="w-4 h-4" />
                      R$ {pro.price}/sessão
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0">
                <button
                  onClick={() => pro.available && openModal(pro)}
                  disabled={!pro.available}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    pro.available
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {pro.available ? 'Agendar sessão' : 'Indisponível'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedProfessional && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-xl">
                  {selectedProfessional.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedProfessional.name}</h3>
                  <p className="text-xs text-indigo-600">{selectedProfessional.specialty}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {success ? (
              /* Success State */
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Solicitação Enviada!</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Sua solicitação foi enviada para <strong>{selectedProfessional.name}</strong>.
                  Você receberá uma confirmação por e-mail em breve.
                </p>
                <div className="bg-indigo-50 rounded-lg p-4 text-left mb-6">
                  <div className="flex items-center gap-2 text-sm text-indigo-700 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {selectedDate?.toLocaleDateString('pt-BR', {
                        weekday: 'long',
                        day: '2-digit',
                        month: 'long',
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-indigo-700">
                    <Clock className="w-4 h-4" />
                    <span>{selectedTime}h</span>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
                >
                  Fechar
                </button>
              </div>
            ) : (
              /* Booking Form */
              <div className="p-5">
                {/* Step 1: Choose Date */}
                <div className="mb-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <h4 className="font-medium text-gray-800 text-sm">Escolha uma data</h4>
                  </div>
                  <div className="flex gap-2 overflow-x-auto pb-1">
                    {days.map((day, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedDate(day)}
                        className={`flex-shrink-0 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedDate?.toDateString() === day.toDateString()
                            ? 'bg-indigo-600 text-white border-indigo-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        {formatDay(day)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Step 2: Choose Time */}
                {selectedDate && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-medium text-gray-800 text-sm">Escolha um horário</h4>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2.5 rounded-lg text-sm font-medium border transition-all ${
                            selectedTime === slot
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Optional Notes */}
                {selectedDate && selectedTime && (
                  <div className="mb-5">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <h4 className="font-medium text-gray-800 text-sm">
                        Mensagem para o profissional{' '}
                        <span className="text-gray-400 font-normal">(opcional)</span>
                      </h4>
                    </div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ex: Perdi meu cachorro há 2 semanas e estou precisando de apoio..."
                      rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent resize-none"
                    />
                  </div>
                )}

                {/* Summary */}
                {selectedDate && selectedTime && (
                  <div className="bg-indigo-50 rounded-xl p-4 mb-5">
                    <p className="text-xs text-indigo-600 font-semibold uppercase tracking-wide mb-2">
                      Resumo da solicitação
                    </p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-indigo-800">
                        <Award className="w-4 h-4 flex-shrink-0" />
                        <span>{selectedProfessional.name}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-indigo-800">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
  2                     <span>
                          {selectedDate.toLocaleDateString('pt-BR', {
                            weekday: 'long',
                            day: '2-digit',
                            month: 'long',
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-indigo-800">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>{selectedTime}h · {selectedProfessional.sessionDuration} min</span>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedDate || !selectedTime || loading}
                    className={`flex-1 py-3 rounded-xl font-medium text-sm transition-all ${
                      selectedDate && selectedTime && !loading
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {loading ? 'Enviando...' : 'Enviar solicitação'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
