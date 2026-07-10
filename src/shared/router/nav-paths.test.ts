import { describe, it, expect, beforeEach } from 'vitest'
import { navPaths } from './nav-paths'
import { useLanguageStore } from '@/shared/model/language.store'

describe('navPaths', () => {
  beforeEach(() => {
    useLanguageStore.setState({ language: 'es' })
  })

  describe('home', () => {
    it('returns /es when no override given', () => {
      expect(navPaths.home()).toBe('/es')
    })

    it('returns /en when override is en', () => {
      expect(navPaths.home('en')).toBe('/en')
    })
  })

  describe('login', () => {
    it('returns /es/login by default', () => {
      expect(navPaths.login()).toBe('/es/login')
    })

    it('returns /fr/login when override is fr', () => {
      expect(navPaths.login('fr')).toBe('/fr/login')
    })
  })

  describe('forbidden', () => {
    it('returns the es forbidden path', () => {
      expect(navPaths.forbidden('es')).toBe('/es/no-autorizado')
    })

    it('returns the en forbidden path', () => {
      expect(navPaths.forbidden('en')).toBe('/en/unauthorized')
    })
  })

  describe('notFound', () => {
    it('returns the es notFound path', () => {
      expect(navPaths.notFound('es')).toBe('/es/no-encontrada')
    })

    it('returns the en notFound path', () => {
      expect(navPaths.notFound('en')).toBe('/en/not-found')
    })
  })

  describe('users', () => {
    it('returns the es users path', () => {
      expect(navPaths.users('es')).toBe('/es/usuarios')
    })

    it('returns the en users path', () => {
      expect(navPaths.users('en')).toBe('/en/users')
    })
  })

  describe('userCreate', () => {
    it('returns the es userCreate path', () => {
      expect(navPaths.userCreate('es')).toBe('/es/usuarios/nuevo')
    })

    it('returns the en userCreate path', () => {
      expect(navPaths.userCreate('en')).toBe('/en/users/new')
    })
  })

  describe('userEdit', () => {
    it('returns the es userEdit path with userId at the end', () => {
      expect(navPaths.userEdit('user-123', 'es')).toBe(
        '/es/usuarios/editar/user-123'
      )
    })

    it('returns the en userEdit path', () => {
      expect(navPaths.userEdit('u-1', 'en')).toBe('/en/users/edit/u-1')
    })
  })

  describe('userTrash', () => {
    it('returns the es userTrash path', () => {
      expect(navPaths.userTrash('es')).toBe('/es/usuarios/papelera')
    })
  })

  describe('userGroups', () => {
    it('returns the es userGroups path', () => {
      expect(navPaths.userGroups('es')).toBe('/es/grupos')
    })

    it('returns the en userGroups path', () => {
      expect(navPaths.userGroups('en')).toBe('/en/groups')
    })
  })

  describe('userGroupCreate', () => {
    it('returns the es userGroupCreate path', () => {
      expect(navPaths.userGroupCreate('es')).toBe('/es/grupos/nuevo')
    })
  })

  describe('userGroupEdit', () => {
    it('returns the es userGroupEdit path', () => {
      expect(navPaths.userGroupEdit('grp-1', 'es')).toBe(
        '/es/grupos/editar/grp-1'
      )
    })
  })

  describe('userGroupTrash', () => {
    it('returns the es userGroupTrash path', () => {
      expect(navPaths.userGroupTrash('es')).toBe('/es/grupos/papelera')
    })
  })

  describe('uses store language when no override', () => {
    it('uses en from store', () => {
      useLanguageStore.setState({ language: 'en' })
      expect(navPaths.users()).toBe('/en/users')
    })
  })
})
