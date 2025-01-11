import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { settingsLanguages } from '../language/settingsLanguage'

export const useDrawerSettings = () => {
  const { language, themeOption, setThemeOption } = useOptionsBrowserStore()
  const {
    colors: {
      text: { primary: colorIcons },
    },
  } = useThemeInfo()

  const { title, principalSettings } = settingsLanguages[language]

  return {
    colorIcons,
    titleDrawer: title,
    principalSettings,
    sizeIcon: 25,
    themeMode: themeOption,
    setThemeMode: setThemeOption,
  }
}
