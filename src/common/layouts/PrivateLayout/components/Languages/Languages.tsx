import { IconButton } from '@Components/IconButton/IconButton'
import { ContentAvatar } from './styles/LanguagesStyles'
import { useLanguage } from './hooks/useLanguage'
import { MenuList } from '@Components/MenuList/MenuList'

export const Languages = () => {
  const {
    anchorEl,
    idLanguage,
    openSelectLanguage,
    languageIcon,
    handleItemsLangsMenu,
    handleOpenSelectLanguage,
    handleCloseSelectLanguage,
  } = useLanguage()

  return (
    <>
      <IconButton
        onClick={handleOpenSelectLanguage}
        aria-controls={openSelectLanguage ? idLanguage : undefined}
        aria-haspopup="true"
        aria-expanded={openSelectLanguage ? 'true' : undefined}
      >
        <ContentAvatar src={languageIcon} />
      </IconButton>

      <MenuList
        menuSelectable={{
          anchorEl,
          id: idLanguage,
          open: openSelectLanguage,
          onClose: handleCloseSelectLanguage,
          transformOrigin: { vertical: 'top', horizontal: 'right' },
          anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
        }}
        items={handleItemsLangsMenu()}
      />
    </>
  )
}
