import { format, isValid, parseISO, isBefore, isAfter } from 'date-fns'
import type { Locale } from 'date-fns'
import type { Matcher } from 'react-day-picker'

/** Parse an ISO string (YYYY-MM-DD) to Date without using new Date() directly */
export const parseToDate = (isoStr: string | undefined): Date | undefined => {
  if (!isoStr) return undefined
  const d = parseISO(isoStr)
  return isValid(d) ? d : undefined
}

/** Format a Date to ISO string YYYY-MM-DD (DB-safe) */
export const dateToISO = (date: Date): string => format(date, 'yyyy-MM-dd')

/** Format a Date to month ISO string YYYY-MM-01 */
export const monthToISO = (date: Date): string => format(date, 'yyyy-MM-01')

/** Build ISO string for year-only selection: YYYY-01-01 */
export const yearToISO = (year: number): string =>
  `${String(year).padStart(4, '0')}-01-01`

/** Format an ISO string for display using the given format and locale */
export const formatDisplayDate = (
  isoStr: string | undefined,
  formatStr: string,
  locale: Locale
): string => {
  const date = parseToDate(isoStr)
  if (!date) return ''
  return format(date, formatStr, { locale })
}

/** Build react-day-picker Matcher array from ISO min/max strings */
export const buildDisabledMatcher = (
  minDate?: string,
  maxDate?: string
): Matcher[] => {
  const matchers: Matcher[] = []
  const min = parseToDate(minDate)
  const max = parseToDate(maxDate)
  if (min) matchers.push({ before: min })
  if (max) matchers.push({ after: max })
  return matchers
}

/** True when a year is fully outside [minDate.year, maxDate.year] */
export const isYearDisabled = (
  year: number,
  minDate?: string,
  maxDate?: string
): boolean => {
  const min = parseToDate(minDate)
  const max = parseToDate(maxDate)
  if (min && year < min.getFullYear()) return true
  if (max && year > max.getFullYear()) return true
  return false
}

/** True when a month (0-indexed) in a given year is outside the min/max range */
export const isMonthDisabled = (
  year: number,
  month: number,
  minDate?: string,
  maxDate?: string
): boolean => {
  const min = parseToDate(minDate)
  const max = parseToDate(maxDate)
  if (min) {
    const minY = min.getFullYear()
    const minM = min.getMonth()
    if (year < minY || (year === minY && month < minM)) return true
  }
  if (max) {
    const maxY = max.getFullYear()
    const maxM = max.getMonth()
    if (year > maxY || (year === maxY && month > maxM)) return true
  }
  return false
}

/** Returns 12 consecutive years anchored to a decade boundary */
export const getYearPage = (centerYear: number): number[] => {
  const start = Math.floor(centerYear / 12) * 12
  return Array.from({ length: 12 }, (_, i) => start + i)
}

/** Returns today's date as a Date (necessary for calendar default month) */
export const todayDate = (): Date => parseISO(format(new Date(), 'yyyy-MM-dd'))
