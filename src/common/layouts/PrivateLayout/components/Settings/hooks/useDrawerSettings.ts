import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { settingsLanguages } from '../language/settingsLanguage'
import { EThemeOption } from '@Enums/themeOption'
import { ChangeEvent } from 'react'
import { EColors } from '@Enums/color'

export const useDrawerSettings = () => {
  const {
    language,
    themeOption,
    compact,
    primaryColor,
    setCompact,
    setThemeOption,
    setPrimaryColor,
  } = useOptionsBrowserStore()
  const {
    colors: {
      text: { primary: colorIcons },
    },
  } = useThemeInfo()

  const { title, principalSettings } = settingsLanguages[language]

  const fontSize = [
    {
      value: 8,
      label: '8',
    },
    {
      value: 10,
      label: '10',
    },
    {
      value: 12,
      label: '12',
    },
    {
      value: 14,
      label: '14',
    },
    {
      value: 16,
      label: '16',
    },
  ]

  const handleChangeThemeMode = (event: ChangeEvent<HTMLInputElement>) =>
    setThemeOption(
      event.target.checked ? EThemeOption.DARK : EThemeOption.LIGHT
    )

  const handleChangeCompact = (event: ChangeEvent<HTMLInputElement>) =>
    setCompact(event.target.checked)

  const handleChangePrimaryColor = (color: EColors) => setPrimaryColor(color)

  return {
    colorIcons,
    compact,
    fontSize,
    principalSettings,
    primaryColor,
    sizeIcon: 25,
    titleDrawer: title,
    themeMode: themeOption,
    handleChangeCompact,
    handleChangePrimaryColor,
    handleChangeThemeMode,
  }
}
