import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
}

export function formatRelative(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: ptBR })
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(n => n[0].toUpperCase())
    .join('')
}

export function getLevelInfo(points: number) {
  const levels = [
    { level: 1, name: 'Semente',  emoji: '🌱', min: 0,    max: 199,  color: 'text-green-600' },
    { level: 2, name: 'Broto',    emoji: '🌿', min: 200,  max: 499,  color: 'text-green-700' },
    { level: 3, name: 'Flor',     emoji: '🌸', min: 500,  max: 999,  color: 'text-pink-500' },
    { level: 4, name: 'Árvore',   emoji: '🌳', min: 1000, max: 2499, color: 'text-green-800' },
    { level: 5, name: 'Luz',      emoji: '✨', min: 2500, max: Infinity, color: 'text-yellow-500' },
  ]
  return levels.find(l => points >= l.min && points <= l.max) || levels[0]
}

export function getNextLevelPoints(points: number): number {
  const thresholds = [200, 500, 1000, 2500]
  return thresholds.find(t => t > points) || thresholds[thresholds.length - 1]
}

export const BADGES = {
  first_session:     { key: 'first_session',     name: 'Primeiro Passo',       emoji: '🐾', description: 'Realizou sua primeira consulta' },
  five_reviews:      { key: 'five_reviews',       name: 'Voz Ativa',            emoji: '💬', description: 'Enviou 5 avaliações' },
  four_week_streak:  { key: 'four_week_streak',   name: 'Comprometido',         emoji: '🗓️', description: '4 semanas consecutivas de sessões' },
  thirty_checkins:   { key: 'thirty_checkins',    name: 'Coração Aberto',       emoji: '❤️', description: 'Check-in emocional por 30 dias' },
  memorial_purchase: { key: 'memorial_purchase',  name: 'Guardião da Memória',  emoji: '🌟', description: 'Comprou na loja memorial' },
  three_referrals:   { key: 'three_referrals',    name: 'Elo de Apoio',         emoji: '👥', description: 'Indicou 3 amigos' },
  twenty_sessions:   { key: 'twenty_sessions',    name: 'Guerreiro da Cura',    emoji: '🏆', description: '20 sessões completadas' },
}
