import { Logo } from '@Components/Logo'
import { HeaderComponent, NavigationHeader } from './styles'
import { ESizes } from '@Enums/sizes'
import { Configuration } from '../Configuration'

export const Header = () => {
  return (
    <HeaderComponent>
      <Logo size={ESizes.SM} />
      <NavigationHeader>
        <p>Home</p>
        <p>About</p>
        <p>Services</p>
        <Configuration />
        <p>Blog</p>
      </NavigationHeader>
    </HeaderComponent>
  )
}
