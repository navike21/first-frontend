export interface NumericOptions {
  decimals: number
  allowNegative: boolean
  thousandSeparator: boolean
}

/** Keeps only digits. */
export const digitsOnly = (input: string): string => input.replace(/\D/g, '')

/**
 * Cleans free input into a canonical numeric string (the value stored in RHF):
 * digits, an optional single `.` with at most `decimals` places, and an
 * optional leading `-` when negatives are allowed. No grouping.
 */
export function sanitizeNumeric(input: string, opts: NumericOptions): string {
  const { decimals, allowNegative } = opts
  const negative = allowNegative && input.trim().startsWith('-')

  let s = input.replace(/[^0-9.]/g, '')
  // Collapse to a single decimal point.
  const dot = s.indexOf('.')
  if (dot !== -1) {
    s = s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, '')
  }

  if (decimals === 0) {
    // No decimals allowed → drop the fractional part entirely.
    s = s.split('.')[0] ?? ''
  } else if (s.includes('.')) {
    const [int, dec = ''] = s.split('.')
    s = `${int}.${dec.slice(0, decimals)}`
  }

  return (negative ? '-' : '') + s
}

/** Formats a canonical numeric string for display (adds thousands grouping). */
export function formatNumeric(raw: string, opts: NumericOptions): string {
  if (raw === '' || raw === '-') return raw
  const negative = raw.startsWith('-')
  const body = negative ? raw.slice(1) : raw
  const [intPart, decPart] = body.split('.')
  const groupedInt = opts.thousandSeparator
    ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    : intPart
  const out = body.includes('.') ? `${groupedInt}.${decPart ?? ''}` : groupedInt
  return (negative ? '-' : '') + out
}

/**
 * Applies a mask where `#` consumes one digit and any other character is a
 * literal (e.g. `+## ### ### ###` → `+51 989 505 027`). Trailing literals are
 * dropped once the digits run out, so the field never shows a dangling
 * separator.
 */
export function applyMask(rawDigits: string, mask: string): string {
  let out = ''
  let di = 0
  for (const ch of mask) {
    if (di >= rawDigits.length) break
    if (ch === '#') {
      out += rawDigits[di]
      di += 1
    } else {
      out += ch
    }
  }
  return out
}

/** Max digits a mask can hold (count of `#`). */
export const maskDigitCount = (mask: string): number =>
  (mask.match(/#/g) ?? []).length
