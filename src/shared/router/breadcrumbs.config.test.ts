import { describe, it, expect } from 'vitest'
import { getSegmentLabel, getHomeLabel } from './breadcrumbs.config'

describe('getHomeLabel', () => {
  it('returns Spanish home label', () => {
    expect(getHomeLabel('es')).toBe('Inicio')
  })

  it('returns English home label', () => {
    expect(getHomeLabel('en')).toBe('Home')
  })

  it('returns Japanese home label', () => {
    expect(getHomeLabel('ja')).toBe('ホーム')
  })
})

describe('getSegmentLabel', () => {
  it('returns translated label for a known slug', () => {
    expect(getSegmentLabel('usuarios', 'es')).toBe('Usuarios')
  })

  it('returns English label for English slug', () => {
    expect(getSegmentLabel('users', 'en')).toBe('Users')
  })

  it('returns the raw slug when not in SLUG_TO_MODULE', () => {
    expect(getSegmentLabel('unknown-segment', 'es')).toBe('unknown-segment')
  })

  it('returns label for papelera slug', () => {
    expect(getSegmentLabel('papelera', 'es')).toBe('Papelera')
  })

  it('returns label for no-autorizado slug', () => {
    expect(getSegmentLabel('no-autorizado', 'es')).toBe('No autorizado')
  })
})
