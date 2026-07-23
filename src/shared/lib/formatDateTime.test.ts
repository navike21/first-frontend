import { describe, it, expect } from 'vitest'
import { formatDateTime } from './formatDateTime'

describe('formatDateTime', () => {
  it('appends the local time to the formatted calendar date', () => {
    const d = new Date(2026, 5, 7, 9, 5, 3)
    expect(formatDateTime(d)).toBe('07/06/2026 09:05:03')
  })

  it('accepts an ISO date-time string', () => {
    const d = new Date('2026-01-05T14:30:00')
    const expected = `05/01/2026 ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`
    expect(formatDateTime('2026-01-05T14:30:00')).toBe(expected)
  })

  it('falls back to the date-only string for a date-only ISO value (midnight)', () => {
    const d = new Date('1989-02-24')
    const expected = `24/02/1989 ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}`
    expect(formatDateTime('1989-02-24')).toBe(expected)
  })

  it('returns a dash for empty or invalid values', () => {
    expect(formatDateTime(null)).toBe('—')
    expect(formatDateTime(undefined)).toBe('—')
    expect(formatDateTime('')).toBe('—')
    expect(formatDateTime('not-a-date')).toBe('—')
  })
})
