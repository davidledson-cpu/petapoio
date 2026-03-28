'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { getSession } from '@/lib/auth/session'

export default function PerfilPage() {
  const router = useRouter()
  const session = getSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [petName, setPetName] = useState('')
  const [petType, setPetType] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!session) {
      router.push('/auth/login')
    } else {
      setName(session.name)
      setEmail(session.email)
      setPhone('(11) 98765-4321')
      setCity('São Paulo')
      setState('SP')
      setPetName('Luna')
      setPetType('Gato')
    }
  }, [session, router])

  if (!session) return null

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <DashboardLayout userRole="patient" userName={session.name}>
      <div className="space-y-8 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="font-serif text-3xl font-bold text-gray-800 flex items-center gap-2">
            <User className="w-8 h-8 text-petblue-400" />
            Meu Perfil
          </h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas informações pessoais</p>
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-xl bg-petblue-100 flex items-center justify-center text-4xl border border-petblue-200">
            {session.avatar ? <img src={session.avatar} alt="Avatar" className="w-full h-full rounded-xl object-cover" /> : '👤'}
          </div>
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-800">{name}</h2>
            <p className="text-gray-600">Paciente PetApoio</p>
            <button className="mt-2 text-xs text-petblue-500 hover:underline font-semibold">Alterar foto</button>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-8 border border-petblue-100 shadow-sm space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-petblue-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled
              className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 text-gray-500"
            />
            <p className="text-xs text-gray-400 mt-1">E-mail não pode ser alterado</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Telefone
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="(XX) XXXXX-XXXX"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-petblue-400"
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Cidade
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-petblue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Estado</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-petblue-400"
              />
            </div>
          </div>

          {/* Pet Info */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Informações do Pet</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nome do Pet</label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Ex: Luna, Max, etc"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-petblue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Tipo</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-petblue-400"
                >
                  <option>Gato</option>
                  <option>Cachorro</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors"
          >
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
          {saved && <span className="text-sm text-green-600 font-semibold">✓ Salvo com sucesso!</span>}
        </div>
      </div>
    </DashboardLayout>
  )
}
