'use client'

import { useState, useEffect } from 'react'
import { Mail, Shield, ExternalLink } from 'lucide-react'

export default function AdminConfiguracoesPage() {
  const [password, setPassword] = useState('')
  const [authenticated, setAuthenticated] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/settings', {
        headers: { 'Authorization': `Bearer ${password}` }
      })
      if (res.ok) {
        const data = await res.json()
        setNotificationEmail(data.settings?.notification_email_appointments || '')
        setAuthenticated(true)
      } else {
        setError('Senha incorreta')
      }
    } catch {
      setError('Erro ao conectar')
    }
    setLoading(false)
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin PetApoio</h1>
            <p className="text-slate-500 mt-1">Digite a senha de administrador</p>
          </div>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Senha do admin"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? 'Verificando...' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Configuracoes do Admin</h1>
          <p className="text-slate-500 mt-1">Gerencie as configuracoes da plataforma PetApoio</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-800">Email de Notificacao</h2>
              <p className="text-sm text-slate-500">Email que recebe avisos de novas consultas</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <label className="text-sm font-medium text-slate-600 block mb-1">Email atual:</label>
            <p className="text-lg font-mono text-slate-800">
              {notificationEmail || <span className="text-slate-400 italic">Nenhum email configurado</span>}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-800">
              <strong>Como alterar:</strong> Para atualizar o email de notificacao, acesse o painel do Vercel
              e altere a variavel <code className="bg-amber-100 px-1 rounded">ADMIN_NOTIFICATION_EMAIL</code>.
            </p>
            <a
              href="https://vercel.com/davidledson-1921s-projects/petapoio/settings/environment-variables"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-sm text-amber-700 hover:text-amber-900 font-medium"
            >
              Abrir Vercel <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

