'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const faqs = [
  {
    q: 'Como funciona a consulta online?',
    a: 'Após agendar e pagar, você recebe um link de videochamada por e-mail e WhatsApp. No horário marcado, basta clicar no link — sem instalar nenhum aplicativo. A sessão acontece direto no seu browser.',
  },
  {
    q: 'Os psicólogos são realmente especializados em luto animal?',
    a: 'Sim. Todos os profissionais cadastrados passam por Verificação do CRP e declaram especialização em luto animal. Muitos têm formação específica em perdas e transições.',
  },
  {
    q: 'Quais abordagens terapêuticas estão disponíveis?',
    a: 'Oferecemos profissionais com diversas abordagens: Psicanálise (foco no inconsciente), Behaviorismo/Análise do Comportamento (foco no comportamento observável), Humanismo (foco no potencial humano) e Terapia Cognitivo-Comportamental - TCC (foco na relação entre pensamentos, emoções e comportamentos). Você pode filtrar por abordagem ao buscar profissionais.',
  },
  {
    q: 'Como funciona o pagamento?',
    a: 'O pagamento é feito com segurança via cartão de crédito ou PIX antes da consulta. A plataforma repassa automaticamente o valor ao profissional após a sessão ser concluída.',
  },
  {
    q: 'Posso cancelar ou reagendar uma consulta?',
    a: 'Sim. Você pode cancelar ou reagendar até 24 horas antes da consulta sem custo. Cancelamentos com menos de 24h podem ter cobrança de taxa, conforme política do profissional.',
  },
  {
    q: 'O luto por pet é tratado de forma diferente?',
    a: 'Sim. O luto animal tem características específicas — muitas vezes minimizado socialmente, o que agrava o sofrimento. Nossos profissionais entendem essa dimensão e oferecem suporte sem julgamentos.',
  },
  {
    q: 'Posso usar a plataforma se meu pet desapareceu?',
    a: 'Com certeza. A perda por desaparecimento é igualmente dolorosa e nossos profissionais são preparados para trabalhar com esse tipo de luto também.',
  },
  {
    q: 'Como me cadastro como psicólogo na plataforma?',
    a: 'Basta clicar em "Cadastrar como Profissional" na página inicial ou acessar a seção "Para Psicólogos" no menu. O cadastro inclui dados pessoais, endereço, informações profissionais (CRP, abordagem), valores e dados bancários para recebimento.',
  },
]

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section className="py-24 bg-petbeige-50">
      <div className="container max-w-3xl">
        <div className="text-center mb-14">
          <span className="inline-block px-4 py-1.5 rounded-full bg-petblue-100 text-petblue-700 text-xs font-bold uppercase tracking-widest mb-4">
            Perguntas Frequentes
          </span>
          <h2 className="font-serif text-4xl font-bold text-gray-800">
            Tire suas dúvidas
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-6 text-left hover:bg-petblue-50/50 transition-colors"
                onClick={() => setOpen(open === i ? null : i)}
              >
                <span className="font-semibold text-gray-800 text-sm pr-4">
                  {faq.q}
                </span>
                <ChevronDown
                  className={cn(
                    'w-5 h-5 text-petblue-500 flex-shrink-0 transition-transform',
                    open === i && 'rotate-180'
                  )}
                />
              </button>
              {open === i && (
                <div className="px-6 pb-6 text-sm text-gray-600 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
