import { Logo } from '@Components/Logo'
import { HeaderComponent } from './styles'
import { ESizes } from '@Enums/sizes'

export const Header = () => {
  return (
    <HeaderComponent>
      <Logo size={ESizes.SM} />
    </HeaderComponent>
  )
}
