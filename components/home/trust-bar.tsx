import { Shield, Users, Clock, Award } from 'lucide-react'

const items = [
  { icon: Shield,  text: 'Psicólogos verificados com CRP' },
  { icon: Users,   text: '+500 tutores já apoiados' },
  { icon: Clock,   text: 'Sessões disponíveis hoje' },
  { icon: Award,   text: 'Especialistas em luto animal' },
]

export function TrustBar() {
  return (
    <div className="bg-white border-b border-petblue-100 py-5">
      <div className="container">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {items.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2.5 text-sm font-semibold text-gray-500">
              <Icon className="w-5 h-5 text-petblue-400" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
