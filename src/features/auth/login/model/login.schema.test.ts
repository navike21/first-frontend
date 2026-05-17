import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createLoginSchema } from './login.schema'

const mockValidation = {
  emailInvalid: 'Introduce un correo electrónico válido',
  passwordMin: 'La contraseña debe tener al menos 8 caracteres',
}

const loginSchema = createLoginSchema(mockValidation)

describe('loginSchema', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should accept valid credentials', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      email: 'admin@navike21.com',
      password: 'secret123',
    })
    // Assert
    expect(result.success).toBe(true)
  })

  it('should reject an invalid email address', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'secret123',
    })
    // Assert
    expect(result.success).toBe(false)
    if (!result.success) {
      const emailIssue = result.error.issues.find((i) => i.path[0] === 'email')
      expect(emailIssue?.message).toBe('Introduce un correo electrónico válido')
    }
  })

  it('should reject password shorter than 8 characters', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      email: 'admin@navike21.com',
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

  it('should reject empty email', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      email: '',
      password: 'secret123',
    })
    // Assert
    expect(result.success).toBe(false)
  })

  it('should reject empty password', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({ email: 'admin@navike21.com', password: '' })
    // Assert
    expect(result.success).toBe(false)
  })

  it('should reject missing fields', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({})
    // Assert
    expect(result.success).toBe(false)
  })

  it('should accept a valid email with minimum password length', () => {
    // Arrange & Act
    const result = loginSchema.safeParse({
      email: 'a@b.co',
      password: '12345678',
    })
    // Assert
    expect(result.success).toBe(true)
  })
})
