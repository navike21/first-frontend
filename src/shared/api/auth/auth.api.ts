import type { IAuthService, SignInResult } from './auth.types'

const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? ''

export const apiAuthService: IAuthService = {
  signIn: async (username, password): Promise<SignInResult> => {
    const res = await fetch(`${BASE}/api/v1/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { message?: string }
      throw new Error(data.message ?? `Error ${res.status}: ${res.statusText}`)
    }

    return res.json() as Promise<SignInResult>
  },
}
