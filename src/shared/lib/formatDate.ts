/** Placeholder shown for empty / unparseable dates. */
const EMPTY = '—'

/**
 * Formats a date as `dd/mm/YYYY` — the app-wide default for now (intended to
 * become user-configurable later).
 *
 * Accepts an ISO string (date or date-time), a `Date`, or null/undefined.
 * For ISO strings the calendar date is taken verbatim (no timezone math), so
 * date-only values like a birth date never shift by a day.
 */
export const formatDate = (value?: string | Date | null): string => {
  if (!value) return EMPTY

  let year: number
  let month: number
  let day: number

  if (typeof value === 'string') {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (match) {
      year = Number(match[1])
      month = Number(match[2])
      day = Number(match[3])
    } else {
      const parsed = new Date(value)
      if (Number.isNaN(parsed.getTime())) return EMPTY
      year = parsed.getFullYear()
      month = parsed.getMonth() + 1
      day = parsed.getDate()
    }
  } else {
    if (Number.isNaN(value.getTime())) return EMPTY
    year = value.getFullYear()
    month = value.getMonth() + 1
    day = value.getDate()
  }

  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
}
