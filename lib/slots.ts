import type { Availability } from '@/types/db'

/**
 * Horários livres de um psicólogo a partir da grade semanal e dos períodos ocupados.
 * São Paulo não tem horário de verão desde 2019, então o fuso é fixo em -03:00.
 */
const OFFSET = '-03:00'

export type Slot = { startsAt: string; label: string }
export type DaySlots = { date: string; weekday: string; dayLabel: string; slots: Slot[] }

const weekdayFmt = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'America/Sao_Paulo' })
const dayFmt = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', timeZone: 'America/Sao_Paulo' })

/** Data YYYY-MM-DD em São Paulo para um instante. */
function spDate(d: Date) {
  return new Date(d.getTime() - 3 * 3600_000).toISOString().slice(0, 10)
}

export function computeSlots({
  availability,
  busy,
  sessionMinutes,
  minNoticeHours,
  days = 21,
  now = new Date(),
}: {
  availability: Pick<Availability, 'weekday' | 'start_time' | 'end_time'>[]
  busy: { starts_at: string; ends_at: string }[]
  sessionMinutes: number
  minNoticeHours: number
  days?: number
  now?: Date
}): DaySlots[] {
  const earliest = now.getTime() + minNoticeHours * 3600_000
  const busyRanges = busy.map((b) => [new Date(b.starts_at).getTime(), new Date(b.ends_at).getTime()] as const)
  const out: DaySlots[] = []

  for (let i = 0; i < days; i++) {
    const date = spDate(new Date(now.getTime() + i * 86400_000))
    const noon = new Date(`${date}T12:00:00${OFFSET}`)
    const weekday = noon.getUTCDay()
    const slots: Slot[] = []

    for (const w of availability.filter((a) => a.weekday === weekday)) {
      let start = new Date(`${date}T${w.start_time.slice(0, 5)}:00${OFFSET}`).getTime()
      const windowEnd = new Date(`${date}T${w.end_time.slice(0, 5)}:00${OFFSET}`).getTime()
      while (start + sessionMinutes * 60_000 <= windowEnd) {
        const end = start + sessionMinutes * 60_000
        const free = start >= earliest && !busyRanges.some(([bs, be]) => start < be && end > bs)
        if (free) {
          const d = new Date(start)
          slots.push({
            startsAt: d.toISOString(),
            label: new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' }).format(d),
          })
        }
        // Sessões começam em blocos da própria duração + 10 min de intervalo, arredondados à meia hora.
        start += Math.ceil((sessionMinutes + 10) / 30) * 30 * 60_000
      }
    }

    slots.sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    if (slots.length) out.push({ date, weekday: weekdayFmt.format(noon), dayLabel: dayFmt.format(noon), slots })
  }
  return out
}
