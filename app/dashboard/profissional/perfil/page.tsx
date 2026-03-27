'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { User, FileText, Award, DollarSign, Save, Camera, Shield, Bell } from 'lucide-react'

interface Session {
  id: string
  email: string
  name: string
  role: string
}

export default function ProfessionalProfilePage() {
  const router = useRouter()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('personal')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [formData, setFormData] = useState({
    name: 'Dr. Marcos Oliveira',
    email: 'psicologo@petapoio.com.br',
    phone: '(11) 99999-8888',
    crp: 'CRP 06/123456',
    specialization: 'Luto e Perda de Animais de Estima\u00e7\u00e3o',
    bio: 'Psic\u00f3logo cl\u00ednico com 10 anos de experi\u00eancia em luto e perdas, especializado em apoio a tutores de animais de estima\u00e7\u00e3o. Abordagem human\u00edstica e centrada na pessoa.',
    sessionDuration: '50',
    sessionPrice: '150',
    acceptsInsurance: true,
    onlineAvailable: true,
    inPersonAvailable: false,
  })

  useEffect(() => {
    const checkSession = () => {
      const currentSession = getSession()
      if (!currentSession) { router.push('/auth/login'); return }
      setSession(currentSession)
      setLoading(false)
    }
    checkSession()
  }, [router])

  if (loading) {
    return (<DashboardLayout userRole="professional" userName="Carregando..."><div className="flex items-center justify-center h-screen"><div className="text-gray-500">Carregando...</div></div></DashboardLayout>)
  }

  const handleSave = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const tabs = [
    { id: 'personal', label: 'Dados Pessoais', icon: User },
    { id: 'professional', label: 'Profissional', icon: FileText },
    { id: 'pricing', label: 'Pre\u00e7os', icon: DollarSign },
    { id: 'notifications', label: 'Notifica\u00e7\u00f5es', icon: Bell },
  ]

  return (
    <DashboardLayout userRole="professional" userName={session?.name || ''}>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900 flex items-center gap-3 mb-2"><User className="w-8 h-8 text-petblue-500" />Meu Perfil</h1>
          <p className="text-gray-600">Gerencie suas informa\u00e7\u00f5es profissionais</p>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center gap-6 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-petblue-400 to-petblue-600 rounded-full flex items-center justify-center text-white text-3xl font-serif font-bold">MO</div>
              <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50"><Camera className="w-4 h-4 text-gray-600" /></button>
            </div>
            <div>
              <h2 className="text-2xl font-serif font-bold text-gray-900">{formData.name}</h2>
              <p className="text-gray-600">{formData.crp}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Verificado</span>
                <span className="px-2.5 py-1 bg-petblue-100 text-petblue-700 rounded-full text-xs font-bold">Online</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 border-b border-gray-200 mb-6">
            {tabs.map(tab => { const Icon = tab.icon; return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === tab.id ? 'border-petblue-500 text-petblue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}><Icon className="w-4 h-4" />{tab.label}</button>
            )})}
          </div>

          {activeTab === 'personal' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label><input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Telefone</label><input type="tel" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">CRP</label><input type="text" value={formData.crp} onChange={(e) => setFormData({...formData, crp: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
            </div>
          )}

          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Especializa\u00e7\u00e3o</label><input type="text" value={formData.specialization} onChange={(e) => setFormData({...formData, specialization: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Biografia</label><textarea value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows={4} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <div className="flex gap-6">
                <label className="flex items-center gap-3"><input type="checkbox" checked={formData.onlineAvailable} onChange={(e) => setFormData({...formData, onlineAvailable: e.target.checked})} className="w-5 h-5 rounded" /><span className="text-sm font-medium">Atendimento Online</span></label>
                <label className="flex items-center gap-3"><input type="checkbox" checked={formData.inPersonAvailable} onChange={(e) => setFormData({...formData, inPersonAvailable: e.target.checked})} className="w-5 h-5 rounded" /><span className="text-sm font-medium">Atendimento Presencial</span></label>
              </div>
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="grid md:grid-cols-2 gap-6">
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Dura\u00e7\u00e3o da Sess\u00e3o (min)</label><input type="number" value={formData.sessionDuration} onChange={(e) => setFormData({...formData, sessionDuration: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <div><label className="block text-sm font-semibold text-gray-700 mb-2">Valor da Sess\u00e3o (R$)</label><input type="number" value={formData.sessionPrice} onChange={(e) => setFormData({...formData, sessionPrice: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm" /></div>
              <label className="flex items-center gap-3 col-span-2"><input type="checkbox" checked={formData.acceptsInsurance} onChange={(e) => setFormData({...formData, acceptsInsurance: e.target.checked})} className="w-5 h-5 rounded" /><span className="text-sm font-medium">Aceita conv\u00eanio</span></label>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">Configure suas prefer\u00eancias de notifica\u00e7\u00e3o</p>
              {['Novos agendamentos', 'Cancelamentos', 'Mensagens de pacientes', 'Relat\u00f3rios semanais'].map((item, i) => (
                <label key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-sm font-medium text-gray-700">{item}</span>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3">
          {saveSuccess && (<div className="px-4 py-2 bg-petgreen-50 text-petgreen-700 rounded-lg text-sm font-semibold flex items-center gap-2 border border-petgreen-200">\u2713 Salvo com sucesso</div>)}
          <button onClick={handleSave} className="px-6 py-3 bg-petblue-500 text-white rounded-xl font-bold hover:bg-petblue-600 flex items-center gap-2"><Save className="w-5 h-5" />Salvar Altera\u00e7\u00f5es</button>
        </div>
      </div>
    </DashboardLayout>
  )
}
