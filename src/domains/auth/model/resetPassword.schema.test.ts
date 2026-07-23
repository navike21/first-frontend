import { describe, it, expect } from 'vitest'
import { createResetPasswordSchema } from './resetPassword.schema'

const mockValidation = {
  emailInvalid: 'Introduce un correo electrónico válido',
  passwordMin: 'La contraseña debe tener al menos 8 caracteres',
  passwordUppercase: 'Debe contener al menos una mayúscula',
  passwordNumber: 'Debe contener al menos un número',
  passwordMismatch: 'Las contraseñas no coinciden',
}

const resetPasswordSchema = createResetPasswordSchema(mockValidation)

describe('resetPasswordSchema', () => {
  it('accepts a strong password that matches its confirmation', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'Password1',
      confirmPassword: 'Password1',
    })
    expect(result.success).toBe(true)
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'Pass1',
      confirmPassword: 'Pass1',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'password')
      expect(issue?.message).toBe(
        'La contraseña debe tener al menos 8 caracteres'
      )
    }
  })

  it('rejects a password without an uppercase letter', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'password1',
      confirmPassword: 'password1',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'password')
      expect(issue?.message).toBe('Debe contener al menos una mayúscula')
    }
  })

  it('rejects a password without a number', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'Password',
      confirmPassword: 'Password',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find((i) => i.path[0] === 'password')
      expect(issue?.message).toBe('Debe contener al menos un número')
    }
  })

  it('rejects mismatched passwords', () => {
    const result = resetPasswordSchema.safeParse({
      password: 'Password1',
      confirmPassword: 'Password2',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === 'confirmPassword'
      )
      expect(issue?.message).toBe('Las contraseñas no coinciden')
    }
  })

  it('rejects an empty password', () => {
    const result = resetPasswordSchema.safeParse({
      password: '',
      confirmPassword: '',
    })
    expect(result.success).toBe(false)
  })
})
