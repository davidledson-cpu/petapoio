// Constantes e cálculos do PetApoio Cuida que valem no servidor e no navegador.

export type CareService = 'hospedagem' | 'visita' | 'passeio' | 'creche' | 'especiais'
export type CareLevel = 'cadastrado' | 'verificado' | 'qualificado' | 'especializado'
export type Species = 'cao' | 'gato' | 'outros'
export type PetSize = 'pequeno' | 'medio' | 'grande'

export const SERVICES: Record<CareService, { label: string; unit: string; short: string; text: string }> = {
  hospedagem: {
    label: 'Hospedagem domiciliar',
    short: 'Hospedagem',
    unit: 'diária',
    text: 'Seu pet fica na casa do cuidador por uma ou mais noites. A experiência mais próxima de deixar com alguém da família.',
  },
  visita: {
    label: 'Cuidador em domicílio',
    short: 'Visita em casa',
    unit: 'visita',
    text: 'O cuidador vai até a sua casa para alimentar, dar água, limpar, brincar e fazer companhia.',
  },
  passeio: {
    label: 'Passeador de cães',
    short: 'Passeio',
    unit: 'passeio',
    text: 'Passeios agendados, individuais ou em grupos pequenos, com duração e percurso combinados.',
  },
  creche: {
    label: 'Creche e período diurno',
    short: 'Creche',
    unit: 'dia',
    text: 'O pet passa o dia com o cuidador, com atividades, alimentação e descanso, e volta para casa à noite.',
  },
  especiais: {
    label: 'Cuidados especiais',
    short: 'Cuidados especiais',
    unit: 'atendimento',
    text: 'Pets idosos, filhotes ou com rotina específica, dentro dos limites de cada cuidador. Não inclui atos veterinários.',
  },
}

export const LEVELS: Record<CareLevel, { label: string; requirement: string; order: number }> = {
  cadastrado: { label: 'Cadastrado', order: 1, requirement: 'Identidade, contato e endereço verificados.' },
  verificado: { label: 'Verificado', order: 2, requirement: 'Entrevista com a equipe, referências e documentação adicional.' },
  qualificado: { label: 'Qualificado', order: 3, requirement: 'Curso de cuidados, primeiros socorros pet ou formação relevante comprovada.' },
  especializado: { label: 'Especializado', order: 4, requirement: 'Experiência comprovada com necessidades específicas e formação compatível.' },
}

export const SPECIES: Record<Species, string> = { cao: 'Cães', gato: 'Gatos', outros: 'Outros pets' }
export const SPECIES_ONE: Record<Species, string> = { cao: 'Cão', gato: 'Gato', outros: 'Outro' }
export const SIZES: Record<PetSize, string> = { pequeno: 'Pequeno', medio: 'Médio', grande: 'Grande' }

/** Região-piloto: bairros de Belo Horizonte e entorno, com o centro aproximado de cada um. */
export const PILOT_CITY = 'Belo Horizonte'
export const NEIGHBORHOODS: Record<string, [number, number]> = {
  Anchieta: [-19.9475, -43.9275],
  Barreiro: [-19.9766, -44.0203],
  Belvedere: [-19.9772, -43.9406],
  Buritis: [-19.973, -43.968],
  Carmo: [-19.9431, -43.9373],
  Castelo: [-19.8823, -43.9978],
  Centro: [-19.9191, -43.9386],
  'Cidade Nova': [-19.8891, -43.928],
  Cruzeiro: [-19.9424, -43.9306],
  Estoril: [-19.9622, -43.9622],
  Floresta: [-19.9132, -43.9283],
  'Funcionários': [-19.9344, -43.9301],
  Gutierrez: [-19.9372, -43.9586],
  'Havaí': [-19.9663, -43.975],
  Lourdes: [-19.9302, -43.9443],
  Mangabeiras: [-19.9523, -43.9183],
  'Ouro Preto': [-19.8661, -43.9903],
  Pampulha: [-19.8507, -43.9705],
  Prado: [-19.9283, -43.9632],
  'Santa Efigênia': [-19.9244, -43.9203],
  'Santa Tereza': [-19.9152, -43.9122],
  'Santo Antônio': [-19.9472, -43.9451],
  Savassi: [-19.9371, -43.9352],
  Serra: [-19.9381, -43.9172],
  Sion: [-19.9553, -43.9333],
  'Vila da Serra (Nova Lima)': [-19.9822, -43.9452],
}
export const NEIGHBORHOOD_NAMES = Object.keys(NEIGHBORHOODS).sort((a, b) => a.localeCompare(b, 'pt-BR'))

/** Distância aproximada (km) entre os centros de dois bairros. */
export function distanceKm(a: string, b: string): number | null {
  const pa = NEIGHBORHOODS[a]
  const pb = NEIGHBORHOODS[b]
  if (!pa || !pb) return null
  const R = 6371
  const toRad = (d: number) => (d * Math.PI) / 180
  const dLat = toRad(pb[0] - pa[0])
  const dLng = toRad(pb[1] - pa[1])
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(pa[0])) * Math.cos(toRad(pb[0])) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

export type CaregiverPrices = {
  price_hosting_cents: number | null
  price_visit_cents: number | null
  price_walk_cents: number | null
  price_daycare_cents: number | null
}

export function priceFor(c: CaregiverPrices, service: CareService): number | null {
  switch (service) {
    case 'hospedagem': return c.price_hosting_cents
    case 'visita': return c.price_visit_cents
    case 'passeio': return c.price_walk_cents
    case 'creche': return c.price_daycare_cents
    default: return c.price_visit_cents ?? c.price_hosting_cents
  }
}

/** Mesmo cálculo da função request_care no banco: hospedagem conta noites, o resto conta dias. */
export function unitsFor(service: CareService, start: string, end: string): number {
  const ms = new Date(`${end}T12:00:00`).getTime() - new Date(`${start}T12:00:00`).getTime()
  const days = Math.round(ms / 86_400_000)
  if (!Number.isFinite(days) || days < 0) return 0
  return Math.max(1, days + (service === 'hospedagem' ? 0 : 1))
}

export const CARE_REQUEST_STATUS: Record<string, string> = {
  nova: 'Recebida',
  em_contato: 'Confirmando com o cuidador',
  confirmada: 'Confirmada',
  concluida: 'Concluída',
  cancelada: 'Cancelada',
}

export const CARE_REQUEST_TONE = {
  nova: 'atencao',
  em_contato: 'atencao',
  confirmada: 'ok',
  concluida: 'neutro',
  cancelada: 'erro',
} as const
