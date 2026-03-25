import { Star } from 'lucide-react'

const testimonials = [
  {
    name: 'Patrícia M.',
    pet: 'Tutora do Bolinha 🐕',
    text: 'Perder o Bolinha depois de 14 anos foi devastador. A Dra. Ana me ajudou a entender que minha dor era legítima e a atravessar o luto com dignidade. Recomendo muito.',
    rating: 5,
    months: '3 meses de acompanhamento',
  },
  {
    name: 'Roberto S.',
    pet: 'Tutor da Mimi 🐈',
    text: 'Nunca imaginei que precisaria de psicólogo por um gato. Mas quando a Mimi foi embora, não conseguia funcionar. O Dr. Carlos foi incrível, sem julgamentos.',
    rating: 5,
    months: '2 meses de acompanhamento',
  },
  {
    name: 'Fernanda L.',
    pet: 'Tutora da Luna 🐩',
    text: 'A plataforma é linda e super fácil de usar. Agendei em 5 minutos e a sessão via vídeo funcionou perfeitamente. Me sinto muito mais leve depois de cada sessão.',
    rating: 5,
    months: '5 sessões realizadas',
  },
]

export function Testimonials() {
  return (
    <section className="py-24 bg-petblue-50">
      <div className="container">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-petbeige-100 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
            Depoimentos
          </span>
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Histórias reais de cura
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Tutores que encontraram o suporte que precisavam na PetApoio.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-7">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-8 border border-petblue-100 shadow-sm">
              <div className="flex gap-1 mb-5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-petblue-50">
                <div className="w-10 h-10 rounded-full bg-petblue-100 flex items-center justify-center text-lg">
                  {t.pet.split(' ')[2]}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-800">{t.name}</div>
                  <div className="text-xs text-petblue-400">{t.pet}</div>
                  <div className="text-xs text-gray-400">{t.months}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
