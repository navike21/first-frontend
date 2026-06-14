import type { IAuthService, SignInResult } from './auth.types'
import type { AuthUser, UserPreferences } from '@/shared/types'
import { useLanguageStore } from '@/shared/model/language.store'

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

interface BackendLoginResponse {
  data: {
    accessToken: string
    user: {
      id: string
      email: string
      firstName: string
      lastName: string
      profilePictureUrl?: string
      permissions: string[]
      preferences?: UserPreferences
    }
  }
}

export const apiAuthService: IAuthService = {
  signIn: async (email, password): Promise<SignInResult> => {
    const lang = useLanguageStore.getState().language

    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      throw new Error(data.message ?? `Error ${res.status}: ${res.statusText}`)
    }

    const body = (await res.json()) as BackendLoginResponse
    const { accessToken, user } = body.data

    // The login response now carries the photo and preferences directly, so the
    // previous extra GET /users/:id round-trip is no longer needed.
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePictureUrl: user.profilePictureUrl,
      permissions: user.permissions,
      preferences: user.preferences,
    }

    return { token: accessToken, user: authUser }
  },
}
