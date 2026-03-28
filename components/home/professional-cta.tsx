import Link from 'next/link'
import { CheckCircle, Brain, Eye, Heart, Lightbulb } from 'lucide-react'

const benefits = [
  'Receba pacientes qualificados diretamente',
  'Agenda integrada ao Google Calendar',
  'Pagamentos automáticos via Stripe',
  'Videochamada profissional sem apps',
  'Dashboard com analytics da sua prática',
  'Suporte e treinamento da plataforma',
]

const approaches = [
  {
    icon: '🧠',
    title: 'Psicanálise',
    desc: 'Foco no inconsciente e nos processos internos do luto.',
    color: 'from-purple-400/20 to-purple-600/20',
    border: 'border-purple-300/30',
  },
  {
    icon: '🔬',
    title: 'Behaviorismo',
    desc: 'Análise do comportamento observável e técnicas práticas.',
    color: 'from-blue-400/20 to-blue-600/20',
    border: 'border-blue-300/30',
  },
  {
    icon: '💚',
    title: 'Humanismo',
    desc: 'Foco no potencial humano e crescimento pessoal.',
    color: 'from-green-400/20 to-green-600/20',
    border: 'border-green-300/30',
  },
  {
    icon: '💡',
    title: 'TCC',
    desc: 'Relação entre pensamentos, emoções e comportamentos.',
    color: 'from-amber-400/20 to-amber-600/20',
    border: 'border-amber-300/30',
  },
]

export function ProfessionalCTA() {
  return (
    <section className="py-24 gradient-hero">
      <div className="container">
        {/* Therapy Approaches Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest text-white mb-4">
              Abordagens Terapêuticas
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mb-4">
              Escolha a abordagem ideal para você
            </h2>
            <p className="text-white/80 text-base max-w-2xl mx-auto leading-relaxed">
              Nossos profissionais utilizam diferentes abordagens terapêuticas.
              Conheça cada uma e encontre o profissional que mais se alinha às suas necessidades.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {approaches.map((item) => (
              <Link
                key={item.title}
                href={`/profissionais?abordagem=${encodeURIComponent(item.title)}`}
                className={`group relative rounded-2xl p-6 bg-gradient-to-br ${item.color} border ${item.border} backdrop-blur-sm hover:scale-[1.03] transition-all duration-300 cursor-pointer`}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h4 className="font-bold text-white text-lg mb-2">{item.title}</h4>
                <p className="text-white/75 text-sm leading-relaxed">{item.desc}</p>
                <div className="mt-4 text-xs font-bold text-white/60 group-hover:text-white/90 transition-colors">
                  Ver profissionais →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Professional Registration CTA */}
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-white">
            <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest mb-5">
              Para Psicólogos e Profissionais de Saúde
            </span>
            <h2 className="font-serif text-4xl font-bold mb-5">
              Quer ser psicólogo na PetApoio?<br />Faça aqui seu cadastro.
            </h2>
            <p className="text-white/85 text-base leading-relaxed mb-8">
              Junte-se a mais de 80 profissionais que já usam a PetApoio para
              conectar-se a tutores enlutados e construir uma prática online sólida.
              Cadastre-se e comece a atender em minutos.
            </p>

            <div className="space-y-3 mb-8">
              {benefits.map(b => (
                <div key={b} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle className="w-5 h-5 text-petgreen-300 flex-shrink-0" />
                  {b}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/auth/cadastro"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-white text-petblue-600 font-bold hover:bg-petbeige-100 transition-all hover:-translate-y-0.5 shadow-lg text-center"
              >
                Cadastrar como Profissional
              </Link>
              <Link
                href="/auth/cadastro"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all text-center"
              >
                Já tenho cadastro → Entrar
              </Link>
            </div>
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
