import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User, FileText, Award, DollarSign } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

export default async function ProfessionalProfilePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  return (
    <DashboardLayout userRole="professional" userName={user.name || 'Profissional'} userAvatar={user.avatar}>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Meu Perfil Profissional</h1>
          <p className="text-gray-500 text-sm mt-1">Estas informações aparecem para os pacientes na busca de profissionais</p>
        </div>

        {/* Avatar + status */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-petblue-100 flex items-center justify-center text-4xl">
              {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-2xl object-cover" /> : '👨‍⚕️'}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">✅ Verificado</span>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-petblue-100 text-petblue-600">Psicólogo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Basic info */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-petblue-400" />
            Informações Básicas
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome completo</label>
                <input defaultValue={user.name} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">CRP</label>
                <input placeholder="CRP 06/00000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Especialidade principal</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors">
                <option>Luto animal e saúde emocional</option>
                <option>Psicologia clínica</option>
                <option>Terapia Cognitivo-Comportamental (TCC)</option>
                <option>Psicologia humanista</option>
                <option>Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Apresentação (aparece no perfil público)</label>
              <textarea
                rows={4}
                defaultValue="Especialista em luto por perda de animais de estimação. Mais de 10 anos de experiência em apoio emocional para tutores que atravessam este momento difícil."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors resize-none"
              />
            </div>
          </div>
        </div>

        {/* Credentials */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Award className="w-4 h-4 text-petblue-400" />
            Formação e Credenciais
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Formação</label>
              <input placeholder="Ex: Psicologia — USP (2010)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Pós-graduação / Especialização</label>
              <input placeholder="Ex: Especialização em Luto — Instituto de Psicologia" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tags de especialidade (até 5)</label>
              <input placeholder="Luto, Ansiedade, TCC, Trauma..." className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-petblue-400" />
            Valores e Sessão
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Valor por sessão (R$)</label>
              <input type="number" placeholder="180" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Duração padrão</label>
              <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors">
                <option>50 minutos</option>
                <option>60 minutos</option>
                <option>45 minutos</option>
              </select>
            </div>
          </div>
        </div>

        <button className="w-full py-3.5 rounded-xl bg-petblue-400 text-white font-bold hover:bg-petblue-500 transition-colors">
          Salvar perfil
        </button>
      </div>
    </DashboardLayout>
  )
}
