import type { IAuthService, MessageResult, SignInResult } from './auth.types'
import type { AuthUser, UserPreferences } from '@/shared/types'
import { useLanguageStore } from '@/shared/model/language.store'
// Ruta relativa (no el barrel @/shared/api) para evitar un ciclo: el barrel
// re-exporta authService, que vive en este mismo módulo.
import { HttpError, parseErrorBody } from '../api.services'

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

interface BackendMessageResponse {
  message: string
}

async function throwHttpError(res: Response): Promise<never> {
  const data = await parseErrorBody(res)
  throw new HttpError(
    res.status,
    res.statusText,
    data.message ?? `Error ${res.status}: ${res.statusText}`,
    data.code,
    data.details
  )
}

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

  forgotPassword: async (email): Promise<MessageResult> => {
    const lang = useLanguageStore.getState().language

    const res = await fetch(`${BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      body: JSON.stringify({ email }),
    })

    if (!res.ok) await throwHttpError(res)

    const body = (await res.json()) as BackendMessageResponse
    return { message: body.message }
  },

  resetPassword: async (token, password): Promise<MessageResult> => {
    const lang = useLanguageStore.getState().language

    const res = await fetch(`${BASE}/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': lang,
      },
      body: JSON.stringify({ password }),
    })

    if (!res.ok) await throwHttpError(res)

    const body = (await res.json()) as BackendMessageResponse
    return { message: body.message }
  },
}
