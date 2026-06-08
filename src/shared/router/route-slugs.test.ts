import { describe, it, expect } from 'vitest'
import { translatePath, ROUTE_SLUGS, SLUG_TO_MODULE } from './route-slugs'

describe('SLUG_TO_MODULE', () => {
  it('maps Spanish slug to module key', () => {
    expect(SLUG_TO_MODULE['usuarios']).toBe('users')
  })

  it('maps English slug to module key', () => {
    expect(SLUG_TO_MODULE['users']).toBe('users')
  })

  it('maps forbidden slug', () => {
    expect(SLUG_TO_MODULE['no-autorizado']).toBe('forbidden')
  })
})

describe('translatePath', () => {
  it('returns /en for empty path', () => {
    expect(translatePath('', 'en')).toBe('/en')
  })

  it('returns /en for root path /', () => {
    expect(translatePath('/', 'en')).toBe('/en')
  })

  it('translates /es to /en', () => {
    expect(translatePath('/es', 'en')).toBe('/en')
  })

  it('translates /es/usuarios to /en/users', () => {
    expect(translatePath('/es/usuarios', 'en')).toBe('/en/users')
  })

  it('translates /es/no-autorizado to /en/unauthorized', () => {
    expect(translatePath('/es/no-autorizado', 'en')).toBe('/en/unauthorized')
  })

  it('preserves unknown segments (IDs) unchanged', () => {
    const result = translatePath('/es/usuarios/abc123/editar', 'en')
    expect(result).toBe('/en/users/abc123/edit')
  })

  it('translates to de', () => {
    expect(translatePath('/es/usuarios', 'de')).toBe(`/de/${ROUTE_SLUGS.users.de}`)
  })

  it('handles path with only a lang prefix', () => {
    expect(translatePath('/fr', 'es')).toBe('/es')
  })

  it('passes through unknown slugs unchanged', () => {
    expect(translatePath('/es/unknown-page', 'en')).toBe('/en/unknown-page')
  })
})
