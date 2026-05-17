import type { IAuthService, SignInResult } from './auth.types'
import type { AuthUser } from '@/shared/types'

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

interface BackendLoginResponse {
  data: {
    accessToken: string
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      permissions: string[]
    }
  }
}

export const apiAuthService: IAuthService = {
  signIn: async (email, password): Promise<SignInResult> => {
    const res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      throw new Error(data.message ?? `Error ${res.status}: ${res.statusText}`)
    }

    const body = (await res.json()) as BackendLoginResponse
    const { accessToken, user } = body.data

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: user.permissions,
    }

    return { token: accessToken, user: authUser }
  },
}
