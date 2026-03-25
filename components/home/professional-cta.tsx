import Link from 'next/link'
import { CheckCircle } from 'lucide-react'

const benefits = [
  'Receba pacientes qualificados diretamente',
  'Agenda integrada ao Google Calendar',
  'Pagamentos automáticos via Stripe',
  'Videochamada profissional sem apps',
  'Dashboard com analytics da sua prática',
  'Suporte e treinamento da plataforma',
]

export function ProfessionalCTA() {
  return (
    <section className="py-24 gradient-hero">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest mb-5">
              Para Psicólogos
            </span>
            <h2 className="font-serif text-4xl font-bold mb-5">
              Expanda sua prática.<br />Ajude quem precisa.
            </h2>
            <p className="text-white/85 text-base leading-relaxed mb-8">
              Junte-se a mais de 80 profissionais que já usam a PetApoio para conectar-se
              a tutores enlutados e construir uma prática online sólida.
            </p>
            <div className="space-y-3 mb-8">
              {benefits.map(b => (
                <div key={b} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle className="w-5 h-5 text-petgreen-300 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>
            <Link
              href="/auth/cadastro-profissional"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-petblue-600 font-bold hover:bg-petbeige-100 transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Cadastrar como Profissional
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { emoji: '💰', title: 'Receita previsível', desc: 'Receba automaticamente após cada sessão via Stripe.' },
              { emoji: '📅', title: 'Agenda inteligente', desc: 'Sincronização total com Google Calendar.' },
              { emoji: '🔒', title: 'Privacidade total', desc: 'Dados de pacientes protegidos com criptografia.' },
              { emoji: '📊', title: 'Relatórios', desc: 'Acompanhe sessões, receita e avaliações.' },
            ].map(item => (
              <div key={item.title} className="glass rounded-2xl p-5">
                <div className="text-3xl mb-3">{item.emoji}</div>
                <h4 className="font-bold text-white text-sm mb-1">{item.title}</h4>
                <p className="text-white/70 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
