import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { User, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard/layout'

export default async function PatientProfilePage() {
  const cookieStore = cookies()
  const sessionCookie = cookieStore.get('petapoio_session')?.value
  let user: any = null
  if (sessionCookie) { try { user = JSON.parse(sessionCookie) } catch {} }
  if (!user) redirect('/auth/login')

  return (
    <DashboardLayout userRole="patient" userName={user.name || 'Tutor'} userAvatar={user.avatar}>
      <div className="space-y-8 max-w-2xl">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-800">Meu Perfil</h1>
          <p className="text-gray-500 text-sm mt-1">Gerencie suas informações pessoais</p>
        </div>

        {/* Avatar */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-petblue-100 flex items-center justify-center text-4xl">
              {user.avatar ? <img src={user.avatar} alt="avatar" className="w-full h-full rounded-2xl object-cover" /> : '🐾'}
            </div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{user.name}</h2>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="text-xs text-petblue-500 font-semibold mt-1">Paciente • PetApoio</p>
            </div>
          </div>
        </div>

        {/* Personal info form */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <User className="w-4 h-4 text-petblue-400" />
            Informações Pessoais
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome completo</label>
                <input defaultValue={user.name} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Data de nascimento</label>
                <input type="date" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Mail className="w-3 h-3" /> E-mail
              </label>
              <input defaultValue={user.email} type="email" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors bg-gray-50" readOnly />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <Phone className="w-3 h-3" /> Telefone
              </label>
              <input type="tel" placeholder="(11) 99999-9999" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Cidade / Estado
              </label>
              <input type="text" placeholder="São Paulo, SP" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
            </div>
          </div>
          <button className="mt-5 w-full py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors">
            Salvar alterações
          </button>
        </div>

        {/* Pet info */}
        <div className="bg-white rounded-2xl p-6 border border-petblue-100 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-5 flex items-center gap-2">
            <Heart className="w-4 h-4 text-red-400" />
            Sobre seu Pet
          </h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nome do pet</label>
                <input placeholder="Nome do seu pet" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Espécie</label>
                <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors">
                  <option>Cachorro</option>
                  <option>Gato</option>
                  <option>Pássaro</option>
                  <option>Coelho</option>
                  <option>Outro</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Como está sendo o processo de luto?</label>
              <textarea
                rows={3}
                placeholder="Descreva brevemente o que está sentindo..."
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-petblue-400 transition-colors resize-none"
              />
            </div>
          </div>
          <button className="mt-4 w-full py-3 rounded-xl bg-petblue-400 text-white font-bold text-sm hover:bg-petblue-500 transition-colors">
            Salvar
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
