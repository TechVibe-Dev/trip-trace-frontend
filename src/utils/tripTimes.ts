import type { Trip } from '../types/trip'

// API timestamps are UTC; Date formats them in the browser's local time zone.
const timeFormat = new Intl.DateTimeFormat('es-UY', {
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
})

// Built by hand: Intl's es-UY day/month drops the leading zero on the day.
function dayMonth(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

function parse(isoDateTime: string | null): Date | null {
  if (!isoDateTime) return null
  const date = new Date(isoDateTime)
  return Number.isNaN(date.getTime()) ? null : date
}

export function formatTime(isoDateTime: string | null): string | null {
  const date = parse(isoDateTime)
  return date ? timeFormat.format(date) : null
}

export function formatDayMonth(isoDateTime: string | null): string | null {
  const date = parse(isoDateTime)
  return date ? dayMonth(date) : null
}

export function formatDateTime(isoDateTime: string | null): string {
  const date = parse(isoDateTime)
  return date ? `${dayMonth(date)} ${timeFormat.format(date)}` : '—'
}

// Calendar days between two timestamps in local time, not elapsed 24h
// periods: 23:10 to 01:35 is one day apart.
export function daysBetween(fromIso: string | null, toIso: string | null): number {
  const from = parse(fromIso)
  const to = parse(toIso)
  if (!from || !to) return 0
  const fromDay = Date.UTC(from.getFullYear(), from.getMonth(), from.getDate())
  const toDay = Date.UTC(to.getFullYear(), to.getMonth(), to.getDate())
  return Math.round((toDay - fromDay) / 86_400_000)
}

export function formatDuration(startIso: string | null, endIso: string | null): string {
  const start = parse(startIso)
  const end = parse(endIso)
  if (!start || !end) return '—'
  const minutes = Math.floor((end.getTime() - start.getTime()) / 60_000)
  return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}min` : `${minutes}min`
}

// Short schedule for the trips list, depending on the trip's status.
export function formatTripSchedule(trip: Trip): string | null {
  switch (trip.status) {
    case 'COMPLETED': {
      const departure = formatTime(trip.started_at)
      const arrival = formatTime(trip.ended_at)
      if (!departure || !arrival) return null
      const dayOffset = daysBetween(trip.started_at, trip.ended_at)
      const suffix = dayOffset > 0 ? ` (+${dayOffset})` : ''
      return `${formatDayMonth(trip.started_at)} · ${departure} → ${arrival}${suffix}`
    }
    case 'IN_PROGRESS': {
      const departure = formatTime(trip.started_at)
      return departure ? `${formatDayMonth(trip.started_at)} · salió ${departure}` : null
    }
    case 'PLANNED': {
      const departure = formatTime(trip.planned_departure_at)
      return departure ? `${formatDayMonth(trip.planned_departure_at)} · sale ${departure}` : null
    }
    default:
      return null
  }
}
