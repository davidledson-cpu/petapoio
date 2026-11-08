// PetApoio Saúde: os três produtos (white label) e os combos, na ordem da jornada do tutor.
// Preços são PREÇOS-ALVO de pré-lançamento, ainda sem contrato com parceiros. Nada é vendido no site.
// Para tirar os valores da página pública, mude MOSTRAR_PRECOS para false.

export const MOSTRAR_PRECOS = true

export type ProdutoSaude = 'saude' | 'protege' | 'despedida'

export type Faixa = { nome: string; preco: number; para: string; destaque?: boolean }

export const PRODUTOS: {
  id: ProdutoSaude
  nome: string
  momento: string
  resumo: string
  inclui: string[]
  faixas: Faixa[]
  nota: string
}[] = [
  {
    id: 'saude',
    nome: 'PetApoio Saúde',
    momento: 'No dia a dia',
    resumo: 'Plano de saúde e assistência veterinária para cães e gatos.',
    inclui: ['Consultas veterinárias', 'Telemedicina 24h', 'Vacinas e exames', 'Urgência e emergência', 'Cirurgias e internações, conforme a faixa'],
    faixas: [
      { nome: 'Essencial', preco: 29.9, para: 'Assistência básica e telemedicina' },
      { nome: 'Completo', preco: 69.9, para: 'Para quem usa consultas e exames', destaque: true },
      { nome: 'Premium', preco: 129.9, para: 'Cobertura mais ampla' },
    ],
    nota: 'Operado por empresa especializada em saúde pet, com rede credenciada própria.',
  },
  {
    id: 'protege',
    nome: 'PetApoio Protege',
    momento: 'Nos imprevistos',
    resumo: 'Proteção financeira para acidentes, doenças e eventos inesperados.',
    inclui: ['Despesas veterinárias emergenciais', 'Cirurgias e hospitalização', 'Assistência funeral', 'Apoio em caso de desaparecimento, conforme cobertura', 'Indenização por morte, quando contratada'],
    faixas: [
      { nome: 'Essencial', preco: 19.9, para: 'Proteção básica' },
      { nome: 'Completo', preco: 39.9, para: 'Mais coberturas e assistências', destaque: true },
      { nome: 'Premium', preco: 59.9, para: 'Proteção ampliada' },
    ],
    nota: 'Coberturas securitárias só com seguradora autorizada pela SUSEP, com apólice própria.',
  },
  {
    id: 'despedida',
    nome: 'PetApoio Despedida',
    momento: 'Na hora da despedida',
    resumo: 'Plano funerário pet com assistência humanizada e acolhimento.',
    inclui: ['Retirada e transporte do animal', 'Cremação individual ou coletiva', 'Urna e entrega das cinzas (individual)', 'Certificado de cremação', 'Memorial digital e homenagem', 'Acolhimento ao tutor no luto'],
    faixas: [
      { nome: 'Essencial', preco: 19.9, para: 'Assistência funerária básica' },
      { nome: 'Individual', preco: 29.9, para: 'Cremação individual, com urna', destaque: true },
      { nome: 'Família', preco: 39.9, para: 'Para mais de um pet' },
    ],
    nota: 'Operado por crematório parceiro. O acolhimento no luto é da PetApoio.',
  },
]

export const COMBOS: { nome: string; selo: string; preco: number; inclui: string; destaque?: boolean }[] = [
  { nome: 'Essencial', selo: 'Para começar', preco: 49.9, inclui: 'Saúde Essencial + Despedida Essencial' },
  { nome: 'Proteção Total', selo: 'Mais recomendado', preco: 99.9, inclui: 'Saúde Completo + Protege Completo + assistência funeral', destaque: true },
  { nome: 'Família', selo: 'Mais completo', preco: 179.9, inclui: 'Saúde Premium + Protege Premium + cremação individual + benefícios e acolhimento' },
]

/** Interesse declarado na lista de espera (vai para health_leads.products). */
export const PRODUCT_INTERESTS: [string, string][] = [
  ['saude', 'Saúde (consultas e exames)'],
  ['protege', 'Protege (imprevistos)'],
  ['despedida', 'Despedida (plano funerário)'],
  ['combo', 'Um combo com tudo'],
]

export const brlMes = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`
