import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import type { CreateUserFormData } from '../model/user.schema'

vi.mock('@/shared/api', () => ({
  request: vi.fn().mockResolvedValue({ data: {} }),
}))

import { request } from '@/shared/api'
import { usersApi } from './users.api'

const reqMock = vi.mocked(request)

const baseData: CreateUserFormData = {
  email: 'a@b.com',
  password: 'Passw0rd',
  firstName: 'An',
  lastName: 'Bo',
  status: 'active',
}

describe('usersApi — backend-driven avatar (multipart)', () => {
  beforeEach(() => reqMock.mockClear())

  it('create without avatar sends a plain JSON body', async () => {
    // Act
    await usersApi.create(baseData)
    // Assert
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.body).toEqual(baseData)
    expect(cfg.method).toBe('POST')
  })

  it('create with avatar sends FormData with `data` + `avatar` parts', async () => {
    // Arrange
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    // Act
    await usersApi.create(baseData, file)
    // Assert
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.body).toBeInstanceOf(FormData)
    const fd = cfg.body as FormData
    expect(fd.get('data')).toBe(JSON.stringify(baseData))
    expect(fd.get('avatar')).toBe(file)
  })

  it('update with avatar sends FormData to PATCH /users/:id', async () => {
    // Arrange
    const file = new File(['x'], 'a.webp', { type: 'image/webp' })
    // Act
    await usersApi.update('u1', { firstName: 'Ne' }, file)
    // Assert
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.api).toBe('/users/u1')
    expect(cfg.method).toBe('PATCH')
    expect(cfg.body).toBeInstanceOf(FormData)
    expect((cfg.body as FormData).get('avatar')).toBe(file)
  })

  it('update with removeAvatar (no file) sends profilePictureUrl="" to clear', async () => {
    // Act
    await usersApi.update('u1', { firstName: 'Ne' }, undefined, true)
    // Assert
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.body).toEqual({ firstName: 'Ne', profilePictureUrl: '' })
    expect(cfg.body).not.toBeInstanceOf(FormData)
  })
})

describe('usersApi — avatar offline (queued without the photo)', () => {
  beforeEach(() => reqMock.mockClear())

  const setOnline = (online: boolean) =>
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      value: online,
    })

  afterEach(() => setOnline(true))

  it('create with avatar offline sends JSON (FormData cannot be queued)', async () => {
    // Arrange
    setOnline(false)
    const file = new File(['x'], 'a.png', { type: 'image/png' })
    // Act
    await usersApi.create(baseData, file)
    // Assert
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.body).not.toBeInstanceOf(FormData)
    expect(cfg.body).toEqual(baseData)
  })

  it('update with avatar offline sends JSON to PATCH /users/:id', async () => {
    // Arrange
    setOnline(false)
    const file = new File(['x'], 'a.webp', { type: 'image/webp' })
    // Act
    await usersApi.update('u1', { firstName: 'Ne' }, file)
    // Assert
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.api).toBe('/users/u1')
    expect(cfg.method).toBe('PATCH')
    expect(cfg.body).not.toBeInstanceOf(FormData)
    expect(cfg.body).toEqual({ firstName: 'Ne' })
  })
})
