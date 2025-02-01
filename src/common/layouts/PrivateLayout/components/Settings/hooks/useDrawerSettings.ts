import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { settingsLanguages } from '../language/settingsLanguage'
import { EThemeOption } from '@Enums/themeOption'
import { ChangeEvent } from 'react'
import { EColor } from '@Enums/color'
import { fontSize } from '../constants/fontSize'
import { ESize } from '@Enums/size'

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

  const handleChangePrimaryColor = (color: EColor) => setPrimaryColor(color)

  const handleValueTextSlider = (_: Event, newValue: number | number[]) => {
    if (newValue === 12) {
      setTextSize(ESize.XS)
    }

    if (newValue === 14) {
      setTextSize(ESize.SM)
    }

    if (newValue === 16) {
      setTextSize(ESize.MD)
    }
    if (newValue === 18) {
      setTextSize(ESize.LG)
    }
    if (newValue === 20) {
      setTextSize(ESize.XL)
    }
  }

  const handleDefaultValueSlider = () => {
    if (textSize === ESize.XS) {
      return 12
    }

    if (textSize === ESize.SM) {
      return 14
    }

    if (textSize === ESize.MD) {
      return 16
    }

    if (textSize === ESize.LG) {
      return 18
    }

    if (textSize === ESize.XL) {
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
