import { Logo } from '@Components/Logo/Logo'
import { HeaderContent, LogoContent, Navigation } from './styles'
import { ESize } from '@Enums/size'
import { IconButton } from '@Components/IconButton/IconButton'
import { HiMiniBars3 } from 'react-icons/hi2'
import { Settings } from '../Settings/Settings'
import { useThemeInfo } from '@Hooks/useThemeInfo'
import { UserSession } from '../UserSession/UserSession'
import { Languages } from '../Languages/Languages'

export const Header = () => {
  const {
    colors: {
      text: { primary: colorIcons },
    },
  } = useThemeInfo()

  return (
    <HeaderContent>
      <LogoContent>
        <IconButton>
          <HiMiniBars3 color={colorIcons} />
        </IconButton>
        <Logo size={ESize.SM} />
      </LogoContent>
      <Navigation>
        <Languages />
        <Settings />
        <UserSession />
      </Navigation>
    </HeaderContent>
  )
}
