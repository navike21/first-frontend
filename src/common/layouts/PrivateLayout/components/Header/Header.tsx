import { Logo } from '@Components/Logo/Logo'
import { HeaderContent, LogoContent, Navigation } from './styles'
import { ESizes } from '@Enums/size'
import { IconButton } from '@Components/IconButton/IconButton'
import { HiMiniBars3 } from 'react-icons/hi2'
import { Settings } from '../Settings/Settings'

export const Header = () => {
  return (
    <HeaderContent>
      <LogoContent>
        <IconButton>
          <HiMiniBars3 />
        </IconButton>
        <Logo size={ESizes.SM} />
      </LogoContent>
      <Navigation>
        <span>Home</span>
        <span>Profile</span>
        <Settings />
      </Navigation>
    </HeaderContent>
  )
}
