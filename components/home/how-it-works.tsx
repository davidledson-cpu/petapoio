const steps = [
  { num: '1', title: 'Crie sua conta', desc: 'Cadastro rápido e gratuito. Responda algumas perguntas sobre sua situação para personalizarmos os profissionais para você.' },
  { num: '2', title: 'Escolha o profissional', desc: 'Navegue pelos perfis, leia avaliações, veja a agenda e encontre o psicólogo que mais se conecta com você.' },
  { num: '3', title: 'Agende e pague', desc: 'Escolha data e horário disponíveis. Pagamento seguro via cartão ou PIX. Confirmação instantânea por e-mail e WhatsApp.' },
  { num: '4', title: 'Participe da sessão', desc: 'Acesse a videochamada diretamente pelo browser, sem instalar nada. Sessão privada e segura, no conforto da sua casa.' },
]

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-petblue-50">
      <div className="container">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-petbeige-100 text-petblue-600 text-xs font-bold uppercase tracking-widest mb-4">
            Como Funciona
          </span>
          <h2 className="font-serif text-4xl font-bold text-gray-800 mb-4">
            Começar é simples
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Da criação da conta à sua primeira sessão em menos de 10 minutos.
          </p>
        </div>

        <div className="relative grid md:grid-cols-4 gap-6">
          {/* Connector line */}
          <div className="hidden md:block absolute top-9 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-petblue-200 via-petblue-400 to-petgreen-300" />

          {steps.map((step) => (
            <div key={step.num} className="text-center px-3">
              <div className="w-[72px] h-[72px] rounded-full bg-petblue-400 text-white font-serif text-3xl font-bold flex items-center justify-center mx-auto mb-6 relative z-10 shadow-md shadow-petblue-200">
                {step.num}
              </div>
              <h4 className="font-bold text-base text-gray-800 mb-2">{step.title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
