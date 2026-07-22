import { describe, it, expect } from 'vitest'
import { createForgotPasswordSchema } from './forgotPassword.schema'

const mockValidation = {
  emailInvalid: 'Introduce un correo electrónico válido',
  passwordMin: 'La contraseña debe tener al menos 8 caracteres',
  passwordUppercase: 'Debe contener al menos una mayúscula',
  passwordNumber: 'Debe contener al menos un número',
  passwordMismatch: 'Las contraseñas no coinciden',
}

const forgotPasswordSchema = createForgotPasswordSchema(mockValidation)

describe('forgotPasswordSchema', () => {
  it('accepts a valid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'ana@navike21.com' })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = forgotPasswordSchema.safeParse({ email: 'not-an-email' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'email')
      expect(issue?.message).toBe('Introduce un correo electrónico válido')
    }
  })

  it('rejects an empty email', () => {
    const result = forgotPasswordSchema.safeParse({ email: '' })
    expect(result.success).toBe(false)
  })
})
