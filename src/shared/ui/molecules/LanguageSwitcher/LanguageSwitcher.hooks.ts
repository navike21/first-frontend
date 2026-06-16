import { useRouter } from '@tanstack/react-router'
import { translatePath } from '@/shared/router'
import type { Language } from '@/shared/types/languages'
import { useLanguageStore } from '@/shared/model'

export function useLanguageSwitcher() {
  const language = useLanguageStore((s) => s.language)
  const setLanguage = useLanguageStore((s) => s.setLanguage)
  const router = useRouter()

  const handleChange = (newLang: Language) => {
    setLanguage(newLang)
    const newPath = translatePath(router.state.location.pathname, newLang)
    router.navigate({ to: newPath as never, replace: true }).catch(() => null)
  }

  return { language, handleChange }
}
