// Constantes do cadastro de adestradores (PetApoio Cuida) que valem no servidor e no navegador.

export type TrainingModality = 'domicilio' | 'online' | 'grupo' | 'espaco_proprio'
export type TrainingFormat = 'avaliacao' | 'aula_avulsa' | 'pacote' | 'consultoria'
export type TrainingFocus =
  | 'filhotes'
  | 'obediencia'
  | 'passeio'
  | 'comportamento'
  | 'socializacao'
  | 'ansiedade_separacao'
  | 'gatos'
  | 'idosos'
  | 'adaptacao_novo_pet'

export const TRAINING_MODALITIES: Record<TrainingModality, string> = {
  domicilio: 'Na casa do tutor',
  online: 'Online (orientação por vídeo)',
  grupo: 'Turmas em grupo',
  espaco_proprio: 'No meu espaço',
}

export const TRAINING_FORMATS: Record<TrainingFormat, { label: string; priceLabel: string }> = {
  avaliacao: { label: 'Avaliação inicial', priceLabel: 'Preço da avaliação inicial' },
  aula_avulsa: { label: 'Aula avulsa', priceLabel: 'Preço da aula avulsa' },
  pacote: { label: 'Pacote de aulas', priceLabel: 'Preço do pacote' },
  consultoria: { label: 'Consultoria de comportamento', priceLabel: 'Preço da consultoria' },
}

export const TRAINING_FOCUS: Record<TrainingFocus, string> = {
  filhotes: 'Filhotes e primeiros meses',
  obediencia: 'Obediência básica',
  passeio: 'Passeio com guia',
  comportamento: 'Latidos, puxões, destruição',
  socializacao: 'Socialização com pessoas e pets',
  ansiedade_separacao: 'Ansiedade de separação',
  gatos: 'Gatos (caixa de areia, arranhador, rotina)',
  idosos: 'Pets idosos',
  adaptacao_novo_pet: 'Chegada de um novo pet na família',
}

export const TRAINING_YEARS: [string, string][] = [
  ['0', 'Menos de 1 ano'],
  ['1', '1 a 3 anos'],
  ['3', '3 a 5 anos'],
  ['5', 'Mais de 5 anos'],
]

export const PRICE_KEYS = {
  avaliacao: 'price_assessment_cents',
  aula_avulsa: 'price_class_cents',
  pacote: 'price_package_cents',
  consultoria: 'price_consult_cents',
} as const satisfies Record<TrainingFormat, string>
