import { ReactNode, useId } from 'react'
import {
  IconSwitchContent,
  IconSwitchContentLabel,
  IconSwitchSection,
  IconSwitchTitle,
} from './styles'
import { Switch, SwitchProps } from '@mui/material'

interface IIconSwitchProps extends SwitchProps {
  icon: ReactNode
  title: string
}

export const IconSwitch = ({ icon, title, ...props }: IIconSwitchProps) => {
  const idElement = useId()

  return (
    <IconSwitchContentLabel htmlFor={idElement}>
      <IconSwitchContent elevation={1} variant="elevation">
        <IconSwitchSection>
          {icon}
          <Switch size="small" {...props} id={idElement} />
        </IconSwitchSection>
        <IconSwitchSection>
          <IconSwitchTitle>{title}</IconSwitchTitle>
        </IconSwitchSection>
      </IconSwitchContent>
    </IconSwitchContentLabel>
  )
}
