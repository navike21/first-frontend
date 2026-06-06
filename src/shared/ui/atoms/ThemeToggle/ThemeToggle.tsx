import { useTheme, useToggleTheme } from '@/shared/model'
import { IconButton } from '../IconButton/IconButton'

export const ThemeToggle = () => {
  const theme = useTheme()
  const toggle = useToggleTheme()

  return (
    <IconButton
      icon={theme === 'dark' ? 'RiSunLine' : 'RiMoonLine'}
      variant="text"
      shape="circle"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    />
  )
}
