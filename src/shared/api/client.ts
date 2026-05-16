import axios, { type AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@shared/config/env'
import { notify } from '@shared/lib/notify'

let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

function processRefreshQueue(token: string) {
  refreshQueue.forEach((cb) => cb(token))
  refreshQueue = []
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
})

// Request interceptor — attach access token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle errors centrally
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // 401 — try silent token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            resolve(apiClient(originalRequest))
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const { data } = await apiClient.post<{ data: { accessToken: string } }>('/auth/refresh')
        const newToken = data.data.accessToken
        setAccessToken(newToken)
        processRefreshQueue(newToken)
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
        }
        return apiClient(originalRequest)
      } catch {
        clearAccessToken()
        processRefreshQueue('')
        // Redirect to login handled by the router auth guard
        window.location.href = '/login'
      } finally {
        isRefreshing = false
      }
    }

    // Network error (no response)
    if (!error.response) {
      notify.error('Sin conexión', 'Verifica tu conexión a internet')
      return Promise.reject(error)
    }

    const message = error.response.data?.message

    // 403 — forbidden
    if (error.response.status === 403) {
      notify.error('Sin permisos', message ?? 'No tienes acceso a este recurso')
    }

    // 4xx — show backend message
    else if (error.response.status >= 400 && error.response.status < 500) {
      notify.error(message ?? 'Error en la solicitud')
    }

    // 5xx — server error
    else if (error.response.status >= 500) {
      notify.error('Error del servidor', 'Intenta de nuevo en unos momentos')
    }

    return Promise.reject(error)
  },
)

// Token storage — in-memory (most secure) with localforage fallback for persistence
let _accessToken: string | null = null

export function getAccessToken() {
  return _accessToken
}

export function setAccessToken(token: string) {
  _accessToken = token
}

export function clearAccessToken() {
  _accessToken = null
}
