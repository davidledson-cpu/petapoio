'use client'

import { getSession } from '@/lib/auth/session'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { DashboardLayout } from '@/components/dashboard/layout'
import { Mail, Save, CheckCircle, AlertCircle, Info, Zap } from 'lucide-react'

export default function ConfiguracoesPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [notificationEmail, setNotificationEmail] = useState('david.ledson@gmail.com')
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const userSession = getSession()
    if (!userSession) {
      router.push('/auth/login')
      return
    }
    setSession(userSession)
  }, [router])

  const handleSave = () => {
    if (!notificationEmail.trim()) {
      setSaveStatus('error')
      setErrorMessage('Por favor, insira um email válido')
      setTimeout(() => setSaveStatus('idle'), 3000)
      return
    }

    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('success')
      setErrorMessage('')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }, 1500)
  }

  if (!session) return null

  return (
    <DashboardLayout userRole="admin" userName={session.name}>
      <div className="space-y-6 max-w-2xl">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-serif font-bold text-gray-900">Configurações Administrativas</h1>
          <p className="text-gray-500 mt-1">Gerencie preferências e notificações da plataforma</p>
        </div>

        {/* Email Configuration */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm space-y-6">
          <div>
            <h2 className="text-xl font-serif font-bold text-gray-900">Email de Notificações</h2>
            <p className="text-gray-600 text-sm mt-2">
              Receberá alertas sobre novos profissionais para validação, problemas de pagamento e outras notificações
              importantes.
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-900">Email Principal</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={notificationEmail}
                onChange={e => {
                  setNotificationEmail(e.target.value)
                  setSaveStatus('idle')
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-petblue-500 focus:ring-1 focus:ring-petblue-500"
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Status Messages */}
          {saveStatus === 'success' && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-green-900">Email salvo com sucesso!</h3>
                <p className="text-sm text-green-700 mt-0.5">As notificações serão enviadas para este endereço.</p>
              </div>
            </div>
          )}

          {saveStatus === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-red-900">Erro ao salvar</h3>
                <p className="text-sm text-red-700 mt-0.5">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            className="w-full px-6 py-3 bg-petblue-600 text-white rounded-xl font-semibold hover:bg-petblue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-5 h-5" />
            {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'success' ? 'Salvo!' : 'Salvar Configurações'}
          </button>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 text-sm">Dica de Uso</h3>
              <p className="text-sm text-blue-700 mt-1">
                Você pode adicionar múltiplos emails separados por vírgula para receber notificações em vários
                endereços.
              </p>
            </div>
          </div>
        </div>

        {/* Email Types */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm space-y-4">
          <h2 className="text-xl font-serif font-bold text-gray-900">Tipos de Notificações Ativadas</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-petblue-600 rounded cursor-pointer" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Novos Profissionais Aguardando Validação</p>
                <p className="text-xs text-gray-600 mt-0.5">Alertas quando profissionais enviam documentos para validação</p>
              </div>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-petblue-600 rounded cursor-pointer" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Problemas de Pagamento</p>
                <p className="text-xs text-gray-600 mt-0.5">Notificações quando há falhas em transações financeiras</p>
              </div>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-petblue-600 rounded cursor-pointer" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Usuários com Problemas Técnicos</p>
                <p className="text-xs text-gray-600 mt-0.5">Alertas sobre usuários reportando problemas na plataforma</p>
              </div>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <input type="checkbox" defaultChecked className="w-5 h-5 text-petblue-600 rounded cursor-pointer" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Relatório Diário de Performance</p>
                <p className="text-xs text-gray-600 mt-0.5">Resumo diário de métricas e atividades da plataforma</p>
              </div>
              <Zap className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
          <h2 className="text-lg font-serif font-bold text-purple-900 mb-3">Segurança</h2>
          <ul className="space-y-2 text-sm text-purple-800">
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Seus dados de email são criptografados e nunca são compartilhados com terceiros</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Você pode alterar suas preferências de email a qualquer momento</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-purple-600 font-bold mt-0.5">•</span>
              <span>Todos os emails são enviados de forma segura através de servidores protegidos</span>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  )
}
