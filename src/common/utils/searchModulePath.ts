import { urlProfilePath } from '@Pages/private/profile/languages/urlProfilePath'
import { urlLoginPath } from '@Pages/public/login/languages/urlLoginPath'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { TUrlPathData } from '@Types/urlPath'

const { language } = useOptionsBrowserStore.getState()

export const modules: TUrlPathData[] = [
  urlProfilePath[language],
  urlLoginPath[language],
]

export const searchModulePath = (path: string): TUrlPathData | null => {
  const foundModule = modules.find((module) => module.slug === path)
  if (foundModule) {
    return { slug: foundModule.slug, title: foundModule.title }
  }
  return null
}
