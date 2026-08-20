/**
 * Splits/joins the `datetime-local`-shaped string ("YYYY-MM-DDTHH:mm") that
 * schemas across the app (coupons' startsAt/expiresAt, pages/blog's
 * scheduledAt) already validate and send to the backend — used to back a
 * paired InputDate (date-only) + TimeInput (time-only) with a single RHF
 * field, since InputDate itself has no time mode.
 */
export function splitDateTimeLocal(value?: string): {
  date: string
  time: string
} {
  if (!value) return { date: '', time: '' }
  const [date = '', time = ''] = value.split('T')
  return { date, time: time.slice(0, 5) }
}

export function joinDateTimeLocal(date: string, time: string): string {
  if (!date) return ''
  return `${date}T${time || '00:00'}`
}
