import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

const TRANSACTIONS = [
  { id: 't1', patient: 'Ana Carolina Silva', date: '2026-03-24', amount: 144, type: 'credit', sessions: 1 },
  { id: 't2', patient: 'Bruno Martins', date: '2026-03-22', amount: 144, type: 'credit', sessions: 1 },
  { id: 't3', patient: 'Carla Ferreira', date: '2026-03-20', amount: 144, type: 'credit', sessions: 1 },
  { id: 't4', patient: 'Elaine Santos', date: '2026-03-18', amount: 144, type: 'credit', sessions: 1 },
  { id: 't5', patient: 'Diego Alves', date: '2026-03-15', amount: 144, type: 'credit', sessions: 1 },
  { id: 't6', description: 'Saque para conta bancária', date: '2026-03-10', amount: 500, type: 'debit' },
  { id: 't7', patient: 'Ana Carolina Silva', date: '2026-03-08', amount: 144, type: 'credit', sessions: 1 },
  { id: 't8', patient: 'Carla Ferreira', date: '2026-03-05', amount: 144, type: 'credit', sessions: 1 },
]

const MONTHLY = [
  { month: 'Out', value: 1200 }, { month: 'Nov', value: 1800 }, { month: 'Dez', value: 1440 },
  { month: 'Jan', value: 2160 }, { month: 'Fev', value: 1800 }, { month: 'Mar', value: 2304 },
]

const maxVal = Math.max(...MONTHLY.map(m => m.value))

function formatBRL(value: number) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default async function ProfessionalFinancialPage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  const monthTotal = TRANSACTIONS.filter(t => t.type === 'credit' && t.date.startsWith('2026-03')).reduce((s, t) => s + t.amount, 0)
  const balance = TRANSACTIONS.reduce((s, t) => t.type === 'credit' ? s + t.amount : s - t.amount, 0)

  return (
    <DashboardLayout userRole="professional" userName={user.name || 'Profissional'} userAvatar={user.avatar}>
      <div className="space-y-8">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Financeiro</h1>
          <p className="text-gray-500 text-sm mt-1">Acompanhe sua receita e extrato de sessões</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Saldo disponível', value: formatBRL(balance), icon: DollarSign, color: 'text-petgreen-500', bg: 'bg-petgreen-50' },
            { label: 'Receita em março', value: formatBRL(monthTotal), icon: TrendingUp, color: 'text-petblue-500', bg: 'bg-petblue-50' },
            { label: 'Sessões no mês', value: '16', icon: Calendar, color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'Ticket médio', value: 'R$ 144', icon: ArrowUpRight, color: 'text-orange-500', bg: 'bg-orange-50' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-2xl p-5 border border-petblue-100 shadow-sm">
              <div className={`w-9 h-9 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="font-serif text-xl font-bold text-gray-800">{stat.value}</div>
              <div className="text-xs text-gray-400 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-6">Receita mensal (últimos 6 meses)</h3>
          <div className="flex items-end justify-between gap-3 h-40">
            {MONTHLY.map(m => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="text-xs font-semibold text-gray-600">{formatBRL(m.value).replace('R$\u00a0', 'R$ ')}</div>
                <div className="w-full rounded-t-lg bg-petblue-400 transition-all" style={{ height: `${(m.value / maxVal) * 100}px` }} />
                <div className="text-xs text-gray-400">{m.month}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-petblue-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-petblue-50 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Extrato</h3>
            <button className="text-xs text-petblue-500 font-semibold hover:underline">Exportar CSV</button>
          </div>
          <div className="divide-y divide-gray-50">
            {TRANSACTIONS.map(t => (
              <div key={t.id} className="p-4 flex items-center gap-4">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${t.type === 'credit' ? 'bg-petgreen-50' : 'bg-red-50'}`}>
                  {t.type === 'credit' ? <ArrowUpRight className="w-4 h-4 text-petgreen-500" /> : <ArrowDownLeft className="w-4 h-4 text-red-400" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">
                    {t.type === 'credit' ? `Sessão — ${(t as any).patient}` : (t as any).description}
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5">
                    {new Date(t.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: 'short' })}
                  </div>
                </div>
                <div className={`font-bold text-sm ${t.type === 'credit' ? 'text-petgreen-600' : 'text-red-500'}`}>
                  {t.type === 'credit' ? '+' : '-'}{formatBRL(t.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-petblue-50 rounded-2xl p-6 border border-petblue-100">
          <h3 className="font-bold text-petblue-700 mb-1">Solicitar saque</h3>
          <p className="text-xs text-petblue-600 mb-4">Transferência em até 1 dia útil para sua conta cadastrada</p>
          <div className="flex gap-3">
            <input type="number" placeholder="Valor (R$)" className="flex-1 px-3 py-2.5 rounded-xl border border-petblue-200 bg-white text-sm focus:outline-none focus:border-petblue-400" />
            <button className="px-5 py-2.5 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors">Solicitar</button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}