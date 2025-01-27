import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useNavigate } from '@tanstack/react-router'
import { userSessionLanguage } from '../language/userSessionLanguage'
import { generalIcons } from '@Utils/icons'
import { IItemMenu } from '@Components/MenuList/MenuList'
import { EUrlPublics } from '@Enums/urlPublics'
import { EIcons } from '../enums/icons'
import { EUrlPrivates } from '@Enums/urlPrivates'

export const useUserSession = () => {
  const { userInformation, setIsAuth } = useAuthInformationStore()

  const { language } = useOptionsBrowserStore()

  const {
    mainMenu: { title: titleMainMenu, items: itemsMainMenu },
    logOut,
  } = userSessionLanguage[language]

  const {
    typography: { pxToRem },
  } = useThemeInfo()

  const SIZE_ICON = pxToRem(20)

  const navigate = useNavigate({
    from: 'UserSession',
  })

  const handleLogout = () => {
    setIsAuth(false)
    navigate({
      to: EUrlPublics.LOGIN,
    })
  }

  const handleMenuNavigation = (icon: EIcons) => {
    const url = {
      [EIcons.PROFILE]: EUrlPrivates.USER_PROFILE,
      [EIcons.MESSAGES]: EUrlPrivates.MESSAGES,
      [EIcons.SECURITY]: EUrlPrivates.SECURITY,
      [EIcons.HELP]: EUrlPrivates.HELP_SUPPORT,
      [EIcons.INFO]: EUrlPrivates.SYSTEM_INFORMATION,
    }
    navigate({
      to: url[icon],
    })
  }

  const handleGenerateMainMenu = (): IItemMenu[] =>
    itemsMainMenu.map(({ label, icon }) => ({
      icon: generalIcons(SIZE_ICON)[icon],
      label,
      onClick: () => handleMenuNavigation(icon),
    }))

  return {
    titleMainMenu,
    userInformation,
    sizeIcon: SIZE_ICON,
    logOut,
    handleGenerateMainMenu,
    handleLogout,
  }
}
