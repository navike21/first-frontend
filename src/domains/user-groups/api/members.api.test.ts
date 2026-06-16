import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/shared/api', () => ({
  request: vi.fn().mockResolvedValue({ data: {} }),
}))

import { request } from '@/shared/api'
import { membersApi } from './members.api'

const reqMock = vi.mocked(request)

describe('membersApi', () => {
  beforeEach(() => reqMock.mockClear())

  it('list builds the members URL with pagination params', async () => {
    await membersApi.list('g1', { page: 2, limit: 10, search: 'an' })
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.method).toBe('GET')
    expect(cfg.api).toBe('/user-groups/g1/members?page=2&limit=10&search=an')
  })

  it('list without params hits the bare members endpoint', async () => {
    await membersApi.list('g1')
    expect(reqMock.mock.calls[0][0].api).toBe('/user-groups/g1/members')
  })

  it('add POSTs userIds to the group members endpoint', async () => {
    await membersApi.add('g1', ['u1', 'u2'])
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.method).toBe('POST')
    expect(cfg.api).toBe('/user-groups/g1/members')
    expect(cfg.body).toEqual({ userIds: ['u1', 'u2'] })
  })

  it('remove DELETEs the specific member', async () => {
    await membersApi.remove('g1', 'u1')
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.method).toBe('DELETE')
    expect(cfg.api).toBe('/user-groups/g1/members/u1')
  })

  it('searchUsers queries active users by term', async () => {
    await membersApi.searchUsers({ search: 'zoe', limit: 5 })
    const cfg = reqMock.mock.calls[0][0]
    expect(cfg.method).toBe('GET')
    expect(cfg.api).toContain('/users?')
    expect(cfg.api).toContain('status=active')
    expect(cfg.api).toContain('search=zoe')
    expect(cfg.api).toContain('limit=5')
  })
})
