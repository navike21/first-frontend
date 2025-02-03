import { useThemeInfo } from '@Hooks/useThemeInfo'
import { useAuthInformationStore } from '@Store/authInformation/authInformation'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useNavigate } from '@tanstack/react-router'
import { userSessionLanguage } from '../language/userSessionLanguage'
import { generalIcons } from '@Utils/icons'
import { IItemMenu } from '@Components/MenuList/MenuList'
import { urlLoginPath } from '@Pages/public/login/languages/urlLoginPath'
import { EProcessName } from '@Enums/processName'
import { EIcons } from '../enums/icons'

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
      to: urlLoginPath[language].slug,
      reloadDocument: true,
    })
  }

  const processNameOfMenuNavigation = {
    [EIcons.PROFILE]: EProcessName.PROFILE,
    [EIcons.MESSAGES]: EProcessName.MESSAGES,
    [EIcons.SECURITY]: EProcessName.SECURITY,
    [EIcons.HELP]: EProcessName.HELP,
    [EIcons.INFO]: EProcessName.INFO,
  }

  const handleMenuNavigation = (urlPath: string, icon: EIcons) => {
    setProcessName(processNameOfMenuNavigation[icon])
    navigate({
      to: `/${urlPath}`,
    })
  }

  const handleGenerateMainMenu = (): IItemMenu[] =>
    itemsMainMenu.map(({ label, icon, urlPath }) => ({
      icon: generalIcons(SIZE_ICON)[icon],
      label,
      onClick: () => handleMenuNavigation(urlPath, icon),
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
