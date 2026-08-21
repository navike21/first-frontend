import type { Language } from '@/shared/types/languages'

/** BCP 47 locale tag per UI language, used for number grouping/decimal conventions. */
const CURRENCY_LOCALES: Record<Language, string> = {
  es: 'es-PE',
  en: 'en-US',
  de: 'de-DE',
  fr: 'fr-FR',
  pt: 'pt-BR',
  it: 'it-IT',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  ru: 'ru-RU',
}

/**
 * Formats a Money amount (integer minor units / cents, matching the
 * backend's `Money` type — see `first-backend/src/shared/schemas/money.schema.ts`)
 * as a localized currency string.
 *
 * @example formatCurrency(105000, 'USD', 'en') // "$1,050.00"
 */
export function formatCurrency(
  amount: number,
  currency: string,
  lang: Language
): string {
  return new Intl.NumberFormat(CURRENCY_LOCALES[lang], {
    style: 'currency',
    currency,
  }).format(amount / 100)
}

/**
 * Just the currency symbol (e.g. `"$"`, `"S/"`, `"€"`) for a given ISO 4217
 * code — for fixed prefixes like `PriceInput`. Falls back to the code itself
 * if `Intl` doesn't resolve a distinct symbol.
 */
export function currencySymbol(currency: string, lang: Language): string {
  const parts = new Intl.NumberFormat(CURRENCY_LOCALES[lang], {
    style: 'currency',
    currency,
  }).formatToParts(0)
  return parts.find((part) => part.type === 'currency')?.value ?? currency
}

/**
 * All real ISO 4217 currency codes (via `Intl.supportedValuesOf`, the
 * platform's own up-to-date list — no hardcoded/hand-maintained set), each
 * labeled with its localized name — for a `Select` so a free-typed code can
 * never be a typo/invalid currency (e.g. `ecommerce-settings.currency`).
 */
export function getCurrencyOptions(
  lang: Language
): { value: string; label: string }[] {
  const displayNames = new Intl.DisplayNames([CURRENCY_LOCALES[lang]], {
    type: 'currency',
  })
  return Intl.supportedValuesOf('currency').map((code) => ({
    value: code,
    label: `${code} — ${displayNames.of(code) ?? code}`,
  }))
}
