'use client'

import Link from 'next/link'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import {
  CheckCircle,
  ArrowRight,
  Calendar,
  DollarSign,
  Video,
  BarChart3,
  Shield,
  Users,
  Clock,
  Star,
  Heart,
  Stethoscope,
  FileText,
  CreditCard,
  MapPin,
  Briefcase,
  ChevronRight,
  MessageCircle,
} from 'lucide-react'

/* ───────── DATA ───────── */
const benefits = [
  {
    icon: Users,
    title: 'Pacientes qualificados',
    desc: 'Receba tutores enlutados que buscam ajuda profissional diretamente na plataforma.',
    color: 'text-petblue-500',
    bg: 'bg-petblue-50',
  },
  {
    icon: Calendar,
    title: 'Agenda inteligente',
    desc: 'Sistema integrado com Google Calendar. Seus horários sempre atualizados.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
  {
    icon: DollarSign,
    title: 'Pagamentos automáticos',
    desc: 'Receba via PIX ou Stripe após cada sessão. Sem burocracia.',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Video,
    title: 'Videochamada integrada',
    desc: 'Atenda online sem precisar de apps externos. Tudo dentro da PetApoio.',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
  {
    icon: BarChart3,
    title: 'Dashboard completo',
    desc: 'Acompanhe sessões, receita, avaliações e evolução dos pacientes.',
    color: 'text-petblue-500',
    bg: 'bg-petblue-50',
  },
  {
    icon: Shield,
    title: 'Privacidade e LGPD',
    desc: 'Dados protegidos com criptografia. Conformidade total com a LGPD.',
    color: 'text-green-500',
    bg: 'bg-green-50',
  },
]

const steps = [
  {
    number: '01',
    icon: FileText,
    title: 'Dados pessoais',
    desc: 'Nome, e-mail, CPF, telefone e senha. Rápido e seguro.',
  },
  {
    number: '02',
    icon: MapPin,
    title: 'Endereço profissional',
    desc: 'Informe seu endereço de atendimento. Auto-preenchimento por CEP.',
  },
  {
    number: '03',
    icon: Briefcase,
    title: 'Dados profissionais',
    desc: 'CRP/CRM, formação, abordagens terapêuticas, especialidades e biografia.',
  },
  {
    number: '04',
    icon: Clock,
    title: 'Disponibilidade e valores',
    desc: 'Modalidade (online/presencial), duração, preço e opções sociais.',
  },
  {
    number: '05',
    icon: CreditCard,
    title: 'Dados bancários e PIX',
    desc: 'Conta bancária e chave PIX para recebimentos automáticos.',
  },
]

const approaches = [
  { icon: '🧠', name: 'Psicanálise', desc: 'Inconsciente e processos internos do luto' },
  { icon: '🔬', name: 'Behaviorismo', desc: 'Análise do comportamento e técnicas práticas' },
  { icon: '💚', name: 'Humanismo', desc: 'Potencial humano e crescimento pessoal' },
  { icon: '💡', name: 'TCC', desc: 'Pensamentos, emoções e comportamentos' },
  { icon: '🌀', name: 'Gestalt', desc: 'Consciência e experiência do aqui e agora' },
  { icon: '👁️', name: 'EMDR', desc: 'Dessensibilização e reprocessamento do trauma' },
  { icon: '🧘', name: 'Mindfulness', desc: 'Atenção plena e regulação emocional' },
  { icon: '🔗', name: 'Sistêmica', desc: 'Relações familiares e contexto social' },
]

const testimonials = [
  {
    name: 'Dra. Camila Reis',
    crp: 'CRP 06/145678',
    text: 'Desde que me cadastrei na PetApoio, minha agenda ficou completa. Os tutores chegam já sabendo o que precisam.',
    rating: 5,
  },
  {
    name: 'Dr. André Oliveira',
    crp: 'CRP 05/098765',
    text: 'A plataforma é intuitiva e o pagamento automático é um diferencial enorme. Recomendo a todos os colegas.',
    rating: 5,
  },
  {
    name: 'Dra. Fernanda Lima',
    crp: 'CRP 08/112233',
    text: 'Encontrei minha vocação atendendo tutores enlutados. A PetApoio conecta quem precisa com quem pode ajudar.',
    rating: 5,
  },
]

const stats = [
  { value: '500+', label: 'Tutores atendidos' },
  { value: '80+', label: 'Profissionais cadastrados' },
  { value: '4.9', label: 'Avaliação média' },
  { value: '98%', label: 'Satisfação' },
]

function renderStars(n: number) {
  return '⭐'.repeat(Math.round(n))
}

/* ───────── COMPONENT ───────── */
export default function ParaPsicologosPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* ═══ HERO ═══ */}
        <section className="gradient-hero pt-28 pb-20 md:pt-36 md:pb-28">
          <div className="container">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="text-white">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/15 backdrop-blur text-xs font-bold uppercase tracking-widest mb-5">
                  Para Psicólogos e Profissionais de Saúde
                </span>
                <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Faça parte da rede<br />
                  de cuidado PetApoio
                </h1>
                <p className="text-white/85 text-lg leading-relaxed mb-8 max-w-lg">
                  Cadastre-se como profissional e conecte-se a tutores enlutados que precisam
                  de apoio qualificado. Comece a atender em minutos.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/auth/cadastro"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-petblue-600 font-bold text-base hover:bg-petbeige-100 transition-all hover:-translate-y-0.5 shadow-xl"
                  >
                    <Stethoscope className="w-5 h-5" />
                    Cadastrar agora — é grátis
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/auth/login"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all"
                  >
                    Já tenho cadastro → Entrar
                  </Link>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-6 text-center">
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1">{s.value}</div>
                    <div className="text-white/70 text-sm">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ BENEFITS ═══ */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Por que atender na PetApoio?
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Tudo que você precisa para construir uma prática online sólida, focada em apoio a tutores de animais enlutados.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-xl p-6 transition-all duration-300"
                >
                  <div className={`w-12 h-12 rounded-xl ${b.bg} flex items-center justify-center mb-4`}>
                    <b.icon className={`w-6 h-6 ${b.color}`} />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg mb-2">{b.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ REGISTRATION PROCESS ═══ */}
        <section className="py-20 bg-petbeige-50">
          <div className="container">
            <div className="text-center mb-14">
              <span className="inline-block px-4 py-1.5 rounded-full bg-petblue-100 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
                Processo de cadastro
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                5 passos simples para começar
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                Seu cadastro é analisado em até 48 horas. Após aprovação, você já pode começar a atender.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {steps.map((s, i) => (
                <div
                  key={s.number}
                  className="flex items-start gap-5 bg-white rounded-2xl border border-gray-200 shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-petblue-500 flex items-center justify-center">
                    <s.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-petblue-400 uppercase tracking-wider">
                        Passo {s.number}
                      </span>
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg mb-1">{s.title}</h3>
                    <p className="text-gray-500 text-sm">{s.desc}</p>
                  </div>
                  <div className="hidden sm:flex items-center">
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/auth/cadastro"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-petblue-500 text-white font-bold text-base hover:bg-petblue-600 transition-colors shadow-lg"
              >
                <Stethoscope className="w-5 h-5" />
                Iniciar meu cadastro
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══ APPROACHES ═══ */}
        <section className="py-20 bg-white">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                Abordagens aceitas na plataforma
              </h2>
              <p className="text-gray-500 max-w-2xl mx-auto">
                A PetApoio aceita profissionais de diversas abordagens terapêuticas. Selecione a sua durante o cadastro.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {approaches.map((a) => (
                <div
                  key={a.name}
                  className="bg-petbeige-50 rounded-2xl border border-gray-100 p-5 text-center hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{a.icon}</div>
                  <h4 className="font-bold text-gray-800 text-sm mb-1">{a.name}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{a.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ TESTIMONIALS ═══ */}
        <section className="py-20 bg-petbeige-50">
          <div className="container">
            <div className="text-center mb-14">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                O que nossos profissionais dizem
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-2xl border border-gray-100 shadow-md p-6"
                >
                  <div className="text-yellow-400 text-sm mb-3">{renderStars(t.rating)}</div>
                  <p className="text-gray-700 text-sm italic mb-4">"{t.text}"</p>
                  <div>
                    <p className="font-bold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.crp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FAQ ═══ */}
        <section className="py-20 bg-white">
          <div className="container max-w-3xl">
            <h2 className="font-serif text-3xl font-bold text-gray-800 mb-10 text-center">
              Perguntas frequentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  q: 'Quem pode se cadastrar como profissional?',
                  a: 'Psicólogos(as) com CRP ativo, psiquiatras com CRM, terapeutas ocupacionais e assistentes sociais com registro profissional válido.',
                },
                {
                  q: 'Quanto custa para me cadastrar?',
                  a: 'O cadastro é 100% gratuito. A PetApoio cobra apenas uma pequena taxa sobre cada sessão realizada.',
                },
                {
                  q: 'Como recebo os pagamentos?',
                  a: 'Você configura sua conta bancária e chave PIX no cadastro. Os pagamentos são processados automaticamente após cada sessão.',
                },
                {
                  q: 'Quanto tempo leva para meu cadastro ser aprovado?',
                  a: 'Nossa equipe analisa os dados em até 48 horas. Você recebe um e-mail quando seu perfil for aprovado e ativado.',
                },
                {
                  q: 'Posso atender apenas online?',
                  a: 'Sim! Você escolhe a modalidade: online (vídeo ou áudio), presencial ou híbrido. A maioria dos profissionais atende online.',
                },
                {
                  q: 'Preciso ter experiência com luto animal?',
                  a: 'Não é obrigatório, mas é um diferencial. A PetApoio oferece materiais de capacitação para profissionais que desejam se especializar nessa área.',
                },
              ].map((faq) => (
                <div key={faq.q} className="bg-petbeige-50 rounded-xl border border-gray-200 p-5">
                  <h4 className="font-bold text-gray-800 text-sm mb-2">{faq.q}</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ FINAL CTA ═══ */}
        <section className="py-20 gradient-hero">
          <div className="container text-center text-white">
            <div className="text-5xl mb-6">🩺</div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
              Pronto para fazer a diferença?
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
              Cadastre-se agora e comece a ajudar tutores que precisam de apoio profissional
              para lidar com o luto pela perda de um animal de estimação.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/cadastro"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-white text-petblue-600 font-bold text-base hover:bg-petbeige-100 transition-all shadow-xl"
              >
                <Stethoscope className="w-5 h-5" />
                Cadastrar como Profissional
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/5511999999999?text=Olá!%20Sou%20psicólogo(a)%20e%20gostaria%20de%20saber%20mais%20sobre%20a%20PetApoio."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-white/40 text-white font-bold hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Falar com nossa equipe
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
