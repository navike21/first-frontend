import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { iconsFlag } from '@Utils/iconsFlag'
import { IconFlag } from '../styles/LanguagesStyles'
import { useState } from 'react'
import { IItemMenu } from '@Components/MenuList/MenuList'
import { useNavigate } from '@tanstack/react-router'
import { EProcessName } from '@Enums/processName'
import { urlProfilePath } from '@Pages/private/profile/languages/urlProfilePath'
import { urlLoginPath } from '@Pages/public/login/languages/urlLoginPath'
import { ELanguage } from '@Enums/language'

export const useLanguage = () => {
  const { language, processName, setLanguage } = useOptionsBrowserStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const navigate = useNavigate({
    from: 'currentPage',
  })

  const { icon, text } = iconsFlag[language]

  const handleOpenSelectLanguage = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

  const handleCloseSelectLanguage = () => setAnchorEl(null)

  const handleUpdateRoute = (selectedLanguage: ELanguage) => {
    const urlPathReload: Record<EProcessName, string> = {
      [EProcessName.LOGIN]: `/${urlLoginPath[selectedLanguage].slug}`,
      [EProcessName.PROFILE]: `/${urlProfilePath[selectedLanguage].slug}`,
      [EProcessName.HOME]: '/',
      [EProcessName.INFO]: '/info',
      [EProcessName.MESSAGES]: '/messages',
      [EProcessName.HELP]: '/help',
      [EProcessName.SECURITY]: '/security',
    }

    navigate({
      to: urlPathReload[processName as EProcessName],
      viewTransition: true,
      reloadDocument: true,
    })
  }

  const handleItemsLangsMenu = (): IItemMenu[] =>
    Object.keys(iconsFlag).map((key) => {
      const { icon, text } = iconsFlag[key as keyof typeof iconsFlag]
      return {
        icon: <IconFlag src={icon} alt={text} />,
        label: text,
        selected: language === key,
        onClick: () => {
          setLanguage(key as keyof typeof iconsFlag)
          handleUpdateRoute(key as keyof typeof iconsFlag)
          handleCloseSelectLanguage()
        },
      }
    })

  return {
    language,
    anchorEl,
    languageIcon: icon,
    languageText: text,
    iconsFlag,
    idLanguage: 'select-language',
    openSelectLanguage: Boolean(anchorEl),
    handleItemsLangsMenu,
    handleOpenSelectLanguage,
    handleCloseSelectLanguage,
  }
}
