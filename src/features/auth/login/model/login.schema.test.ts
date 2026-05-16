import { describe, it, expect, vi, beforeEach } from 'vitest'
import { loginSchema } from './login.schema'

describe('loginSchema', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should accept valid credentials', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      username: 'admin',
      password: 'secret123',
    })
    // Assert
    expect(result.success).toBe(true)
  })

  it('should reject username shorter than 3 characters', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      username: 'ab',
      password: 'secret123',
    })
    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      const usernameIssue = result.error.issues.find(
        (i) => i.path[0] === 'username'
      )
      expect(usernameIssue?.message).toBe('Introduce tu nombre de usuario')
    }
  })

  it('should reject password shorter than 8 characters', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      username: 'admin',
      password: 'short',
    })
    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      const passwordIssue = result.error.issues.find(
        (i) => i.path[0] === 'password'
      )
      expect(passwordIssue?.message).toBe(
        'La contraseña debe tener al menos 8 caracteres'
      )
    }
  })

  it('should reject empty username', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      username: '',
      password: 'secret123',
    })
    // Assert
    expect(result.success).toBe(false)
  })

  it('should reject empty password', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({ username: 'admin', password: '' })
    // Assert
    expect(result.success).toBe(false)
  })

  it('should reject missing fields', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({})
    // Assert
    expect(result.success).toBe(false)
  })

  it('should accept credentials exactly at minimum lengths', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      username: 'abc',
      password: '12345678',
    })
    // Assert
    expect(result.success).toBe(true)
  })
})
