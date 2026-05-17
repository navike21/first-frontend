import { redirect } from '@tanstack/react-router'
import { isTokenStored } from '@/shared/model'
import { useLanguageStore } from '@/shared/model/language.store'

export const requireAuth = (): void => {
  if (!isTokenStored()) {
    throw redirect({ to: '/no-autorizado' })
  }
}

export const requireGuest = (): void => {
  if (isTokenStored()) {
    const lang = useLanguageStore.getState().language
    throw redirect({ to: `/${lang}` as never })
  }
}
