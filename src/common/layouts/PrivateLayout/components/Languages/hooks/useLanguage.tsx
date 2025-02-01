import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { iconsFlag } from '@Utils/iconsFlag'
import { IconFlag } from '../styles/LanguagesStyles'
import { useState } from 'react'
import { IItemMenu } from '@Components/MenuList/MenuList'

export const useLanguage = () => {
  const { language, setLanguage } = useOptionsBrowserStore()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const { icon, text } = iconsFlag[language]

  const handleOpenSelectLanguage = (event: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(event.currentTarget)

  const handleCloseSelectLanguage = () => setAnchorEl(null)

  const handleItemsLangsMenu = (): IItemMenu[] =>
    Object.keys(iconsFlag).map((key) => {
      const { icon, text } = iconsFlag[key as keyof typeof iconsFlag]
      return {
        icon: <IconFlag src={icon} alt={text} />,
        label: text,
        selected: language === key,
        onClick: () => {
          setLanguage(key as keyof typeof iconsFlag)
          handleCloseSelectLanguage()
        },
      }
    })

  return {
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
