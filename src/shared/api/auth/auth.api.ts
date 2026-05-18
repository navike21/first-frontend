import type { IAuthService, SignInResult } from './auth.types'
import type { AuthUser } from '@/shared/types'
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

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      permissions: user.permissions,
    }

    try {
      const profileRes = await fetch(`${BASE}/users/${user.id}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      if (profileRes.ok) {
        const profileBody = (await profileRes.json()) as { data: { profilePictureUrl?: string } }
        authUser.profilePictureUrl = profileBody.data.profilePictureUrl
      }
    } catch {
      // non-critical — user logs in without photo
    }

    return { token: accessToken, user: authUser }
  },
}
