import { formatDate } from './formatDate'

/**
 * Formats a date-time as `dd/mm/YYYY HH:MM:SS` (24h) — same calendar date as
 * `formatDate`, plus the local time. For audit-style timestamps where two
 * events on the same day still need to be told apart.
 */
export const formatDateTime = (value?: string | Date | null): string => {
  if (!value) return '—'
  const dateStr = formatDate(value)
  if (dateStr === '—') return '—'
  try {
    const d = new Date(value)
    if (isNaN(d.getTime())) return dateStr
    const timeStr = d.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    return `${dateStr} ${timeStr}`
  } catch {
    return dateStr
  }
}
