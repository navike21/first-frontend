import { describe, it, expect, vi } from 'vitest'
import type { FieldValues, UseFormSetError } from 'react-hook-form'

vi.mock('@/shared/model/language.store', () => ({
  useLanguageStore: { getState: () => ({ language: 'es' }) },
}))

import { HttpError } from '@/shared/api/api.services'
import { applyServerFieldErrors } from './serverFormErrors'

// Loose cast: the helper only calls setError(name, { type, message }).
const makeSetError = () =>
  vi.fn() as unknown as UseFormSetError<FieldValues> & ReturnType<typeof vi.fn>

describe('applyServerFieldErrors', () => {
  it('maps 409 RESOURCE_DUPLICATE keys to a localized "already exists" field error', () => {
    const setError = makeSetError()
    const err = new HttpError(409, 'Conflict', 'dup', 'RESOURCE_DUPLICATE', {
      keys: ['email'],
    })

    const handled = applyServerFieldErrors(err, setError)

    expect(handled).toBe(true)
    expect(setError).toHaveBeenCalledWith('email', {
      type: 'server',
      message: 'Ya existe un registro con este valor.',
    })
  })

  it('maps 422 validation issues to per-path field errors', () => {
    const setError = makeSetError()
    const err = new HttpError(
      422,
      'Unprocessable',
      'invalid',
      'VALIDATION_SCHEMA_ERROR',
      { validation: [{ path: 'firstName', message: 'Too short' }] }
    )

    const handled = applyServerFieldErrors(err, setError)

    expect(handled).toBe(true)
    expect(setError).toHaveBeenCalledWith('firstName', {
      type: 'server',
      message: 'Too short',
    })
  })

  it('returns false for a non-HttpError', () => {
    const setError = makeSetError()
    expect(applyServerFieldErrors(new Error('boom'), setError)).toBe(false)
    expect(setError).not.toHaveBeenCalled()
  })

  it('returns false for an HttpError without details', () => {
    const setError = makeSetError()
    const err = new HttpError(500, 'Server Error')
    expect(applyServerFieldErrors(err, setError)).toBe(false)
    expect(setError).not.toHaveBeenCalled()
  })
})
