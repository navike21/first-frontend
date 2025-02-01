import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useNavigate } from '@tanstack/react-router'
import { userSessionLanguage } from '../language/userSessionLanguage'
import { generalIcons } from '@Utils/icons'
import { IItemMenu } from '@Components/MenuList/MenuList'
import { urlLoginPath } from '@Pages/public/Login/languages/urlPath'
import { EProcessName } from '@Enums/processName'

export const useUserSession = () => {
  const { userInformation, setIsAuth } = useAuthInformationStore()

  const { language, setProcessName } = useOptionsBrowserStore()

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
    setProcessName(EProcessName.LOGIN)
    navigate({
      to: urlLoginPath[language],
      reloadDocument: true,
    })
  }

  const handleMenuNavigation = (urlPath: string) => {
    navigate({
      to: urlPath,
    })
  }

  const handleGenerateMainMenu = (): IItemMenu[] =>
    itemsMainMenu.map(({ label, icon, urlPath }) => ({
      icon: generalIcons(SIZE_ICON)[icon],
      label,
      onClick: () => handleMenuNavigation(urlPath),
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
