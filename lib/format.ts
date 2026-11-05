const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function money(cents: number | null | undefined) {
  return cents == null ? '—' : brl.format(cents / 100)
}

export const TZ = 'America/Sao_Paulo'

export function dateTime(iso: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: TZ,
  }).format(new Date(iso))
}

export function dateOnly(iso: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', timeZone: TZ }).format(
    new Date(iso),
  )
}

export function timeOnly(iso: string | Date) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: TZ }).format(new Date(iso))
}

export function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

export const APPOINTMENT_STATUS: Record<string, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  confirmado: 'Confirmada',
  cancelado: 'Cancelada',
  concluido: 'Realizada',
  nao_compareceu: 'Não compareceu',
  expirado: 'Reserva expirada',
}

export const ORDER_STATUS: Record<string, string> = {
  aguardando_pagamento: 'Aguardando pagamento',
  pago: 'Pagamento aprovado',
  em_producao: 'Em produção',
  enviado: 'Enviado',
  entregue: 'Entregue',
  cancelado: 'Cancelado',
}

export const PSYCH_STATUS: Record<string, string> = {
  pendente: 'Em análise',
  aprovado: 'Aprovado',
  recusado: 'Não aprovado',
  suspenso: 'Suspenso',
}
