import type { FieldValues, Path, UseFormSetError } from 'react-hook-form'
import { HttpError } from '@/shared/api/api.services'
import { useLanguageStore } from '@/shared/model/language.store'
import type { Language } from '@/shared/types/languages'

const DUPLICATE_MESSAGES: Record<Language, string> = {
  es: 'Ya existe un registro con este valor.',
  en: 'A record with this value already exists.',
  de: 'Ein Datensatz mit diesem Wert existiert bereits.',
  fr: 'Un enregistrement avec cette valeur existe déjà.',
  pt: 'Já existe um registo com este valor.',
  it: 'Esiste già un record con questo valore.',
  ja: 'この値のレコードはすでに存在します。',
  ko: '이 값을 가진 레코드가 이미 존재합니다.',
  zh: '已存在具有此值的记录。',
  ru: 'Запись с этим значением уже существует.',
}

/**
 * Maps a backend HttpError onto react-hook-form field errors so the offending
 * inputs highlight inline:
 * - `409 RESOURCE_DUPLICATE` → each `details.keys` field marked as "already exists".
 * - `422 VALIDATION_SCHEMA_ERROR` → each `details.validation[].path` marked with
 *   its message.
 *
 * Returns `true` when at least one field error was applied (the caller can then
 * skip a redundant generic toast). Non-HttpError / detail-less errors return
 * `false` and should fall back to `notify.queryError`.
 */
export function applyServerFieldErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>
): boolean {
  if (!(error instanceof HttpError) || !error.details) return false

  if (error.code === 'RESOURCE_DUPLICATE' && error.details.keys?.length) {
    const message = DUPLICATE_MESSAGES[useLanguageStore.getState().language]
    for (const key of error.details.keys) {
      setError(key as Path<T>, { type: 'server', message })
    }
    return true
  }

  if (
    error.code === 'VALIDATION_SCHEMA_ERROR' &&
    error.details.validation?.length
  ) {
    let applied = false
    for (const issue of error.details.validation) {
      if (issue.path) {
        setError(issue.path as Path<T>, {
          type: 'server',
          message: issue.message,
        })
        applied = true
      }
    }
    return applied
  }

  return false
}
