import { describe, it, expect, vi } from 'vitest'

// Must be hoisted so env vars are set before the module evaluates them
vi.hoisted(() => {
  vi.stubEnv('VITE_FAKE_USERNAME', 'admin@test.com')
  vi.stubEnv('VITE_FAKE_PASSWORD', 'password123')
})

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
