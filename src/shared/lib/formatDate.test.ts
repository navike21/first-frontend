import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('formats a date-only ISO string as dd/mm/YYYY', () => {
    expect(formatDate('1989-02-24')).toBe('24/02/1989')
  })

  it('takes the calendar date from a date-time ISO without timezone shift', () => {
    expect(formatDate('2026-06-17T23:30:00.000Z')).toBe('17/06/2026')
  })

  it('zero-pads day and month', () => {
    expect(formatDate('2026-01-05')).toBe('05/01/2026')
  })

  it('formats a Date instance', () => {
    expect(formatDate(new Date(2026, 5, 7))).toBe('07/06/2026')
  })

  it('returns a dash for empty or invalid values', () => {
    expect(formatDate(null)).toBe('—')
    expect(formatDate(undefined)).toBe('—')
    expect(formatDate('')).toBe('—')
    expect(formatDate('not-a-date')).toBe('—')
  })
})
