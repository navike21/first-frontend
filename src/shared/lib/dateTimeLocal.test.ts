import { describe, it, expect } from 'vitest'
import { splitDateTimeLocal, joinDateTimeLocal } from './dateTimeLocal'

describe('splitDateTimeLocal', () => {
  it('should split a full datetime-local string into date and time', () => {
    expect(splitDateTimeLocal('2026-08-15T14:30')).toEqual({
      date: '2026-08-15',
      time: '14:30',
    })
  })

  it('should truncate seconds when present', () => {
    expect(splitDateTimeLocal('2026-08-15T14:30:45')).toEqual({
      date: '2026-08-15',
      time: '14:30',
    })
  })

  it('should return empty parts for undefined', () => {
    expect(splitDateTimeLocal(undefined)).toEqual({ date: '', time: '' })
  })

  it('should return empty parts for an empty string', () => {
    expect(splitDateTimeLocal('')).toEqual({ date: '', time: '' })
  })

  it('should return an empty time when only a date is present', () => {
    expect(splitDateTimeLocal('2026-08-15')).toEqual({
      date: '2026-08-15',
      time: '',
    })
  })
})

describe('joinDateTimeLocal', () => {
  it('should join a date and time into a datetime-local string', () => {
    expect(joinDateTimeLocal('2026-08-15', '14:30')).toBe('2026-08-15T14:30')
  })

  it('should default the time to midnight when only a date is given', () => {
    expect(joinDateTimeLocal('2026-08-15', '')).toBe('2026-08-15T00:00')
  })

  it('should return an empty string when there is no date', () => {
    expect(joinDateTimeLocal('', '14:30')).toBe('')
  })

  it('should return an empty string when neither is given', () => {
    expect(joinDateTimeLocal('', '')).toBe('')
  })
})
