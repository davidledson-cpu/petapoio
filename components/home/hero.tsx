import Link from 'next/link'
import { ArrowRight, Star } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden gradient-hero pt-[72px]">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
      />

      {/* Decorative shapes */}
      <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] rounded-full bg-white/5" />
      <div className="absolute bottom-[100px] left-[-60px] w-[250px] h-[250px] rounded-full bg-white/5" />
      <div className="absolute top-[40%] right-[20%] w-[150px] h-[150px] rounded-full bg-white/5" />

      <div className="container relative z-10">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text content */}
          <div className="text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/25 text-sm text-white/90">
              💚 Você não precisa passar por isso sozinho
            </div>

            <h1 className="font-serif text-5xl lg:text-6xl font-bold leading-tight">
              Apoio para quem perdeu um{' '}
              <em className="not-italic text-petbeige-100">amor de quatro patas</em>
            </h1>

            <p className="text-lg text-white/85 leading-relaxed max-w-[480px]">
              Conectamos tutores enlutados a psicólogos especializados em luto animal.
              Sessões online, no conforto da sua casa, quando vocà mais precisar.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/auth/cadastro"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-white text-petblue-600 font-bold hover:bg-petbeige-100 transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Encontrar um Psicólogo
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/#como-funciona"
                className="flex items-center gap-2 px-7 py-3.5 rounded-full border border-white/60 text-white font-bold hover:bg-white/10 transition-all hover:-translate-y-0.5"
              >
                Como Funciona
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-4 border-t border-white/20">
              {[
                { num: '500+', label: 'Tutores atendidos' },
                { num: '80+', label: 'Psicólogos cadastrados' },
                { num: '4.9★', label: 'Avaliação média' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="font-serif text-3xl font-bold text-petbeige-100">{stat.num}</div>
                  <div className="text-xs text-white/70 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Visual card */}
          <div className="relative flex justify-center items-center">
            {/* Main card */}
            <div className="glass rounded-3xl p-10 text-center text-white max-w-[340px] w-full">
              <div className="text-8xl mb-5 animate-float">🐾</div>
              <h3 className="font-serif text-2xl font-bold mb-3">Sua dor é real</h3>
              <p className="text-white/80 text-sm mb-6">
                Perder um pet é perder um membro da família. Nossos psicólogos entendem e estão aqui para você.
              </p>
              <Link
                href="/profissionais"
                className="w-full flex justify-center items-center gap-2 px-5 py-3 rounded-full bg-petbeige-100 text-petblue-700 text-sm font-bold hover:bg-white transition-colors"
              >
                Ver Profissionais Disponíveis
              </Link>
            </div>

            {/* Mini cards */}
            <div className="absolute -top-5 -left-10 bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-xl max-w-[200px] animate-[float2_5s_ease-in-out_infinite]">
              <span className="text-3xl">🗓️</span>
              <div>
                <div className="text-xs font-bold text-gray-800 leading-tight">Consulta hoje</div>
                <div className="text-[11px] text-gray-500">Disponível em 2h</div>
              </div>
            </div>

            <div className="absolute -bottom-2 -right-8 bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-xl max-w-[200px] animate-[float2_6s_ease-in-out_1.5s_infinite]">
              <span className="text-3xl">💙</span>
              <div>
                <div className="text-xs font-bold text-gray-800 leading-tight">Sessão concluída</div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
