import { describe, it, expect, vi } from 'vitest'

// Must be hoisted so env vars are set before the module evaluates them
vi.hoisted(() => {
  vi.stubEnv('VITE_FAKE_USERNAME', 'admin@test.com')
  vi.stubEnv('VITE_FAKE_PASSWORD', 'password123')
})

import { HttpError } from '../api.services'
import { fakeAuthService } from './auth.fake'

describe('fakeAuthService.signIn', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves with mock token and user when credentials match', async () => {
    const promise = fakeAuthService.signIn('admin@test.com', 'password123')
    vi.advanceTimersByTime(900)
    const result = await promise
    expect(result.token).toBe('mock-token-local-dev')
    expect(result.user.email).toBe('admin@test.com')
    expect(result.user.firstName).toBe('Admin')
  })

  it('rejects when credentials do not match', async () => {
    const promise = fakeAuthService.signIn('wrong@test.com', 'wrongpass')
    vi.advanceTimersByTime(900)
    await expect(promise).rejects.toThrow('Usuario o contraseña incorrectos')
  })

  it('does not resolve before the delay elapses', async () => {
    let resolved = false
    fakeAuthService.signIn('admin@test.com', 'password123').then(() => {
      resolved = true
    })
    vi.advanceTimersByTime(800)
    await Promise.resolve()
    expect(resolved).toBe(false)
  })
})

describe('fakeAuthService.forgotPassword', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('always resolves, regardless of the email', async () => {
    const promise = fakeAuthService.forgotPassword('anyone@test.com')
    vi.advanceTimersByTime(900)
    const result = await promise
    expect(result.message).toBeTruthy()
  })
})

describe('fakeAuthService.resetPassword', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('resolves for the fake reset token', async () => {
    const promise = fakeAuthService.resetPassword(
      'fake-reset-token',
      'Password1'
    )
    vi.advanceTimersByTime(900)
    const result = await promise
    expect(result.message).toBeTruthy()
  })

  it('rejects with an INVALID_TOKEN HttpError for any other token', async () => {
    const promise = fakeAuthService.resetPassword('bad-token', 'Password1')
    vi.advanceTimersByTime(900)
    await expect(promise).rejects.toMatchObject({
      code: 'INVALID_TOKEN',
      status: 401,
    })
    await expect(promise).rejects.toBeInstanceOf(HttpError)
  })
})
