import { HttpError } from '../api.services'
import type { IAuthService, MessageResult, SignInResult } from './auth.types'

const FAKE_USERNAME = import.meta.env.VITE_FAKE_USERNAME as string
const FAKE_PASSWORD = import.meta.env.VITE_FAKE_PASSWORD as string
const FAKE_DELAY_MS = 900

// Token de prueba para poder ejercitar el flujo de reset en modo fake — cualquier
// otro valor simula un link inválido/expirado (mismo code que devuelve el backend real).
const FAKE_RESET_TOKEN = 'fake-reset-token'

export const fakeAuthService: IAuthService = {
  signIn: (email, password): Promise<SignInResult> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === FAKE_USERNAME && password === FAKE_PASSWORD) {
          resolve({
            token: 'mock-token-local-dev',
            user: {
              id: '1',
              email,
              firstName: 'Admin',
              lastName: 'First',
              permissions: [],
            },
          })
        } else {
          reject(new Error('Usuario o contraseña incorrectos'))
        }
      }, FAKE_DELAY_MS)
    }),

  forgotPassword: (): Promise<MessageResult> =>
    new Promise((resolve) => {
      setTimeout(
        () => resolve({ message: 'Si el correo existe, te enviamos un enlace.' }),
        FAKE_DELAY_MS
      )
    }),

  resetPassword: (token, _password): Promise<MessageResult> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (token === FAKE_RESET_TOKEN) {
          resolve({ message: 'Contraseña actualizada correctamente.' })
        } else {
          reject(
            new HttpError(401, 'Unauthorized', 'Token inválido o expirado', 'INVALID_TOKEN')
          )
        }
      }, FAKE_DELAY_MS)
    }),
}
