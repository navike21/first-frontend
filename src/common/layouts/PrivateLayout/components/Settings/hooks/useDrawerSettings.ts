import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { settingsLanguages } from '../language/settingsLanguage'
import { EThemeOption } from '@Enums/themeOption'
import { ChangeEvent } from 'react'
import { EColors } from '@Enums/color'
import { fontSize } from '../constants/fontSize'
import { ESizes } from '@Enums/size'

export const useDrawerSettings = () => {
  const {
    language,
    themeOption,
    compact,
    primaryColor,
    textSize,
    setCompact,
    setThemeOption,
    setPrimaryColor,
    setTextSize,
  } = useOptionsBrowserStore()

  const {
    colors: {
      text: { primary: colorIcons },
    },
    typography: { pxToRem },
  } = useThemeInfo()

  const { title, principalSettings } = settingsLanguages[language]

  const handleChangeThemeMode = (event: ChangeEvent<HTMLInputElement>) =>
    setThemeOption(
      event.target.checked ? EThemeOption.DARK : EThemeOption.LIGHT
    )

  const handleChangeCompact = (event: ChangeEvent<HTMLInputElement>) =>
    setCompact(event.target.checked)

  const handleChangePrimaryColor = (color: EColors) => setPrimaryColor(color)

  const handleValueTextSlider = (_: Event, newValue: number | number[]) => {
    if (newValue === 12) {
      setTextSize(ESizes.XS)
    }

    if (newValue === 14) {
      setTextSize(ESizes.SM)
    }

    if (newValue === 16) {
      setTextSize(ESizes.MD)
    }
    if (newValue === 18) {
      setTextSize(ESizes.LG)
    }
    if (newValue === 20) {
      setTextSize(ESizes.XL)
    }
  }

  const handleDefaultValueSlider = () => {
    if (textSize === ESizes.XS) {
      return 12
    }

    if (textSize === ESizes.SM) {
      return 14
    }

    if (textSize === ESizes.MD) {
      return 16
    }

    if (textSize === ESizes.LG) {
      return 18
    }

    if (textSize === ESizes.XL) {
      return 20
    }
  }

  return {
    colorIcons,
    compact,
    fontSize,
    principalSettings,
    primaryColor,
    sizeIcon: pxToRem(26),
    titleDrawer: title,
    themeMode: themeOption,
    handleChangeCompact,
    handleChangePrimaryColor,
    handleChangeThemeMode,
    handleDefaultValueSlider,
    handleValueTextSlider,
  }
}
