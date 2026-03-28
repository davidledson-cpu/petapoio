import Link from 'next/link'
import { ArrowRight, Video, Users, BookOpen } from 'lucide-react'

const services = [
  {
    icon: Video,
    color: 'bg-petblue-50',
    iconColor: 'text-petblue-600',
    title: 'Consulta Online Individual',
    description:
      'Sessões de vídeo ao vivo com psicólogos especializados em luto animal. Agendamento flexível, sem sair de casa.',
    link: '/profissionais',
    linkLabel: 'Agendar consulta',
    badge: 'Mais popular',
  },
  {
    icon: Users,
    color: 'bg-petgreen-50',
    iconColor: 'text-petgreen-600',
    title: 'Grupos de Apoio',
    description:
      'Participe de sessões em grupo moderadas por profissionais. Compartilhe sua dor com quem realmente entende.',
    link: '/profissionais?tipo=grupo',
    linkLabel: 'Ver grupos',
  },
  {
    icon: BookOpen,
    color: 'bg-petbeige-100',
    iconColor: 'text-amber-700',
    title: 'Conteúdo e Recursos',
    description:
      'Artigos, guias e exercícios escritos por especialistas para ajudar você a atravessar o processo de luto.',
    link: '/recursos',
    linkLabel: 'Explorar recursos',
  },
]

export function ServicesSection() {
  return (
    <section id="servicos" className="py-24 bg-petbeige-50">
      <div className="container">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-petblue-100 text-petblue-700 text-xs font-bold uppercase tracking-widest mb-4">
            Nossos Serviços
          </span>
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Apoio completo na sua jornada
          </h2>
          <p className="text-gray-600 text-lg max-w-xl mx-auto">
            Desde a primeira consulta até a reconstrução, estamos com você em
            cada etapa do processo.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {services.map((svc) => (
            <div
              key={svc.title}
              className="relative bg-white rounded-2xl p-10 border border-gray-200 shadow-md hover:shadow-xl card-hover group overflow-hidden transition-shadow duration-300"
            >
              {svc.badge && (
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-petblue-500 text-white text-xs font-bold shadow-sm">
                  {svc.badge}
                </div>
              )}

              {/* Top accent bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-petblue-400 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div
                className={`w-16 h-16 rounded-2xl ${svc.color} flex items-center justify-center mb-6 shadow-sm`}
              >
                <svc.icon className={`w-8 h-8 ${svc.iconColor}`} />
              </div>

              <h3 className="font-serif text-xl font-bold text-gray-800 mb-3">
                {svc.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                {svc.description}
              </p>

              <Link
                href={svc.link}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-petblue-600 hover:gap-3 transition-all"
              >
                {svc.linkLabel} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
