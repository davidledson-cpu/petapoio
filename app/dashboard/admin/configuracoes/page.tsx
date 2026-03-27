'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Mail, Save, CheckCircle, AlertCircle, ArrowLeft, Info } from 'lucide-react'
import Link from 'next/link'

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

export default function AdminConfiguracoesPage() {
  const [notificationEmail, setNotificationEmail] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }

      const { data: profile } = await supabase
        .from('users').select('role').eq('id', user.id).single()

      if (!profile || profile.role !== 'admin') { window.location.href = '/dashboard/paciente'; return }
      setIsAdmin(true)

      const res = await fetch('/api/admin/settings?key=notification_email_appointments')
      const data = await res.json()
      if (data.settings && data.settings.length > 0) {
        setNotificationEmail(data.settings[0].value || '')
      }
    } catch (err) { console.error('Error loading settings:', err) }
    finally { setLoading(false) }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setSaved(false); setSaving(true)
    try {
      if (notificationEmail.trim()) {
        const emails = notificationEmail.split(',').map(e => e.trim())
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        for (const email of emails) {
          if (email && !emailRegex.test(email)) { setError('Email invalido: ' + email); setSaving(false); return }
        }
      }
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'notification_email_appointments', value: notificationEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Erro ao salvar'); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) { setError('Erro de conexao. Tente novamente.') }
    finally { setSaving(false) }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-pulse text-gray-400">Carregando...</div>
    </div>
  )
  if (!isAdmin) return null

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:flex w-64 flex-col bg-white border-r border-petblue-100 fixed h-full">
        <Link href="/" className="flex items-center gap-2.5 p-6 border-b border-petblue-50">
          <div className="w-8 h-8 rounded-full bg-petblue-400 flex items-center justify-center text-lg">&#x1F43E;</div>
          <span className="font-serif font-bold text-lg text-petblue-600">PetApoio</span>
        </Link>
        <div className="px-5 py-4 border-b border-petblue-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600 text-sm">A</div>
            <div>
              <div className="text-sm font-semibold text-gray-800 leading-tight">Admin</div>
              <div className="text-xs text-gray-400">Administrador</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/dashboard/admin" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-petblue-50 hover:text-petblue-600 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar ao Dashboard
          </Link>
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold bg-petblue-50 text-petblue-600">
            <Mail className="w-4 h-4" /> Notificacoes
          </div>
        </nav>
      </aside>

      <main className="flex-1 md:ml-64 p-6 lg:p-8">
        <div className="max-w-2xl">
          <div className="mb-8">
            <Link href="/dashboard/admin" className="text-sm text-petblue-500 hover:underline font-semibold flex items-center gap-1 mb-4">
              <ArrowLeft className="w-4 h-4" /> Voltar ao painel
            </Link>
            <h1 className="font-serif text-2xl font-bold text-gray-800">Configuracoes de Notificacao</h1>
            <p className="text-gray-500 text-sm mt-1">Configure os emails que receberao notificacoes de agendamentos e consultas</p>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-petblue-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-petblue-500" />
                </div>
                <div>
                  <h2 className="font-bold text-gray-800">Email para Notificacoes de Agendamentos</h2>
                  <p className="text-sm text-gray-500 mt-0.5">Este email recebera uma notificacao toda vez que um paciente agendar uma nova consulta.</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label htmlFor="notification-email" className="block text-sm font-semibold text-gray-700 mb-2">Email de notificacao</label>
                  <input id="notification-email" type="text" value={notificationEmail} onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="admin@petapoio.com.br"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-petblue-300 focus:border-petblue-300 transition-colors" />
                </div>
                <div className="flex items-start gap-2.5 p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-700 leading-relaxed">
                    <p className="font-semibold mb-1">Dicas:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Para multiplos emails, separe por virgula: email1@ex.com, email2@ex.com</li>
                      <li>O email recebera dados como: nome do paciente, profissional, data/hora e valor</li>
                      <li>Deixe em branco para desativar as notificacoes por email</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
              </div>
            )}
            {saved && (
              <div className="flex items-center gap-2 p-4 rounded-xl bg-green-50 border border-green-100 text-sm text-green-600">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />Configuracoes salvas com sucesso!
              </div>
            )}

            <button type="submit" disabled={saving}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-petblue-400 text-white text-sm font-bold hover:bg-petblue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
              <Save className="w-4 h-4" />{saving ? 'Salvando...' : 'Salvar Configuracoes'}
            </button>
          </form>
        </div>
      </main>
    </div>
  )
}
