import axios, { type AxiosError } from 'axios'
import { notify } from '@shared/lib/notify'
import { useSessionStore } from '@shared/model'

let accessToken: string | null = null

export const getAccessToken = () => accessToken
export const setAccessToken = (token: string) => {
  accessToken = token
}
export const clearAccessToken = () => {
  accessToken = null
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api/v1',
  withCredentials: true,
})

apiClient.interceptors.request.use((config) => {
  const token = accessToken ?? useSessionStore.getState().token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 401) {
      useSessionStore.getState().clearSession()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (status === 403) {
      notify.error('No tienes permiso para realizar esta acción')
      return Promise.reject(error)
    }

    if (status && status >= 400 && status < 500 && message) {
      notify.error(message)
      return Promise.reject(error)
    }

    if (status && status >= 500) {
      notify.error('Error del servidor. Intenta de nuevo.')
      return Promise.reject(error)
    }

    if (!error.response) {
      notify.error('Sin conexión. Verifica tu red.')
    }

    return Promise.reject(error)
  },
)
