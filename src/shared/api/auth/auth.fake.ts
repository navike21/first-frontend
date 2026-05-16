import type { IAuthService, SignInResult } from './auth.types'

const FAKE_USERNAME = import.meta.env.VITE_FAKE_USERNAME as string
const FAKE_PASSWORD = import.meta.env.VITE_FAKE_PASSWORD as string
const FAKE_DELAY_MS = 900

export const fakeAuthService: IAuthService = {
  signIn: (username, password): Promise<SignInResult> =>
    new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === FAKE_USERNAME && password === FAKE_PASSWORD) {
          resolve({
            token: 'mock-token-local-dev',
            user: {
              id: '1',
              name: 'Admin First',
              email: username,
            },
          })
        } else {
          reject(new Error('Usuario o contraseña incorrectos'))
        }
      }, FAKE_DELAY_MS)
    }),
}
