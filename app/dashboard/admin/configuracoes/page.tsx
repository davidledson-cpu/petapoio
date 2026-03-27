'use client'

import { useState } from 'react'
import { Shield, Mail, ExternalLink, CheckCircle, AlertCircle, Settings, Users, Calendar, ArrowLeft, Eye, EyeOff, LogOut } from 'lucide-react'
import Link from 'next/link'

export default function AdminConfigPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [currentEmail, setCurrentEmail] = useState('')
  const [activeTab, setActiveTab] = useState<'email' | 'stats' | 'settings'>('email')

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { Authorization: `Bearer ${password}` },
      })
      if (res.ok) {
        const data = await res.json()
        setCurrentEmail(data.settings?.notification_email_appointments || '')
        setIsAuthenticated(true)
      } else {
        setError('Senha incorreta. Tente novamente.')
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar ao início
          </Link>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Admin PetApoio</h1>
              <p className="text-gray-500 mt-1">Digite a senha de administrador</p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="Senha do admin"
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={handleLogin}
                disabled={isLoading || !password}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? 'Verificando...' : 'Entrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">Painel Admin</h1>
                <p className="text-xs text-gray-500">PetApoio</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">Ver site</Link>
              <button
                onClick={() => { setIsAuthenticated(false); setPassword('') }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-white rounded-xl p-1 shadow-sm border border-gray-100 mb-8 max-w-md">
          {[
            { key: 'email' as const, label: 'Notificações', icon: Mail },
            { key: 'stats' as const, label: 'Estatísticas', icon: Users },
            { key: 'settings' as const, label: 'Configurações', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium flex-1 justify-center transition-all ${
                activeTab === tab.key
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Email Tab */}
        {activeTab === 'email' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Email de Notificação</h2>
              <p className="text-gray-500 mt-1">Configure o email que recebe notificações de novos agendamentos</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">Email atual configurado</h3>
                  <p className="text-lg text-indigo-600 font-medium mt-1">
                    {currentEmail || 'Nenhum email configurado'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Este email recebe notificações quando um paciente agenda uma nova consulta.
                  </p>
                </div>
                {currentEmail && (
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                )}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">Como alterar o email?</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Para alterar o email de notificação, acesse as variáveis de ambiente no Vercel e atualize o valor de <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs font-mono">ADMIN_NOTIFICATION_EMAIL</code>.
                  </p>
                  <a
                    href="https://vercel.com/davidledson-1921s-projects/petapoio/settings/environment-variables"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-amber-800 hover:text-amber-900"
                  >
                    Abrir Vercel Settings
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Estatísticas da Plataforma</h2>
              <p className="text-gray-500 mt-1">Visão geral dos números da PetApoio</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Usuários', value: '—', icon: Users, color: 'bg-blue-100 text-blue-600' },
                { label: 'Profissionais', value: '—', icon: Users, color: 'bg-green-100 text-green-600' },
                { label: 'Agendamentos', value: '—', icon: Calendar, color: 'bg-purple-100 text-purple-600' },
                { label: 'Verificações Pendentes', value: '—', icon: Shield, color: 'bg-amber-100 text-amber-600' },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <div className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <p className="text-sm text-gray-400 text-center">
              Estatísticas em tempo real estarão disponíveis quando o banco de dados Supabase estiver totalmente configurado.
            </p>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Configurações Gerais</h2>
              <p className="text-gray-500 mt-1">Gerenciar configurações da plataforma</p>
            </div>

            <div className="grid gap-4">
              {[
                {
                  title: 'Variáveis de Ambiente',
                  description: 'Gerencie chaves de API, URLs e configurações no Vercel',
                  href: 'https://vercel.com/davidledson-1921s-projects/petapoio/settings/environment-variables',
                  icon: Settings,
                },
                {
                  title: 'Repositório GitHub',
                  description: 'Código-fonte da plataforma PetApoio',
                  href: 'https://github.com/davidledson-cpu/petapoio',
                  icon: ExternalLink,
                },
                {
                  title: 'Deployments',
                  description: 'Histórico de deploys e status do site',
                  href: 'https://vercel.com/davidledson-1921s-projects/petapoio/deployments',
                  icon: CheckCircle,
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200 hover:shadow-md transition-all group"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                    <item.icon className="w-5 h-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

