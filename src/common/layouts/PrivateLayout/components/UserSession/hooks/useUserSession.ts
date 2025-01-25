import { URL_LOGIN } from '@Constants/publicPagesURL'
import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useNavigate } from '@tanstack/react-router'
import { userSessionLanguage } from '../language/userSessionLanguage'
import { generalIcons } from '@Utils/icons'
import { IItemMenu } from '@Components/MenuList/MenuList'

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
      to: URL_LOGIN,
      viewTransition: true,
    })
  }

  const handleGenerateMainMenu = (): IItemMenu[] =>
    itemsMainMenu.map(({ label, icon }) => ({
      icon: generalIcons(SIZE_ICON)[icon],
      label,
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
