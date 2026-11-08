/** Datas do Saúde: tudo em dias inteiros, no fuso de São Paulo. */
export function todayIso() {
  return new Date(Date.now() - 3 * 3600_000).toISOString().slice(0, 10)
}

export function daysUntil(date: string) {
  const ms = new Date(`${date}T12:00:00Z`).getTime() - new Date(`${todayIso()}T12:00:00Z`).getTime()
  return Math.round(ms / 86_400_000)
}

export function dueLabel(date: string): { text: string; tone: 'ok' | 'atencao' | 'erro' } {
  const d = daysUntil(date)
  if (d < 0) return { text: `Venceu há ${-d} ${d === -1 ? 'dia' : 'dias'}`, tone: 'erro' }
  if (d === 0) return { text: 'Vence hoje', tone: 'atencao' }
  if (d <= 30) return { text: `Em ${d} ${d === 1 ? 'dia' : 'dias'}`, tone: 'atencao' }
  return { text: new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`)), tone: 'ok' }
}

export function shortDate(date: string) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T12:00:00Z`))
}

export function ageLabel(birth: string | null) {
  if (!birth) return null
  const months = Math.floor(-daysUntil(birth) / 30.44)
  if (months < 1) return 'menos de 1 mês'
  if (months < 12) return `${months} ${months === 1 ? 'mês' : 'meses'}`
  const y = Math.floor(months / 12)
  return `${y} ${y === 1 ? 'ano' : 'anos'}`
}

export const SPECIES_LABEL: Record<string, string> = { cao: 'Cão', gato: 'Gato', outros: 'Outro' }

export const INTERESTS: [string, string][] = [
  ['prevencao', 'Vacinas e prevenção'],
  ['consultas', 'Consultas e exames'],
  ['ampla', 'Cobertura mais ampla'],
  ['emergencia', 'Emergência 24h'],
  ['descontos', 'Descontos em clínicas e pet shops'],
]

export const BUDGETS: [string, string][] = [
  ['ate30', 'Até R$ 30 por mês'],
  ['30a90', 'De R$ 30 a R$ 90'],
  ['90a180', 'De R$ 90 a R$ 180'],
  ['acima180', 'Acima de R$ 180'],
  ['nao_sei', 'Ainda não sei'],
]

export const EVENT_KINDS: Record<string, string> = {
  vacina: 'Vacina',
  vermifugo: 'Vermífugo / antipulgas',
  consulta: 'Consulta',
  exame: 'Exame',
  medicamento: 'Medicamento',
  outro: 'Outro',
}


/** Data (AAAA-MM-DD) daqui a n dias, para filtrar lembretes. */
export function isoInDays(n: number) {
  return new Date(Date.now() - 3 * 3600_000 + n * 86_400_000).toISOString().slice(0, 10)
}
