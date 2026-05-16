import { signIn, signOut, fetchAuthSession } from 'aws-amplify/auth'
import type { IAuthService, SignInResult } from './auth.types'

export const cognitoAuthService: IAuthService = {
  signIn: async (username, password): Promise<SignInResult> => {
    const result = await signIn({ username, password })

    if (!result.isSignedIn) {
      throw new Error('Sign in did not complete. Check nextStep for MFA or confirmation.')
    }

    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken

    if (!idToken) {
      throw new Error('No id token returned from Cognito session.')
    }

    const payload = idToken.payload
    const token = idToken.toString()
    const user = {
      id: (payload.sub as string) ?? '',
      name: ((payload['name'] ?? payload['cognito:username']) as string) ?? '',
      email: (payload['email'] as string) ?? '',
    }

    return { token, user }
  },

  signOut: async () => {
    await signOut()
  },

  getToken: async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.idToken?.toString() ?? null
    } catch {
      return null
    }
  },
}
