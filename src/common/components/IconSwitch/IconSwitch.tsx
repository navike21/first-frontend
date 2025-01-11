import { ReactNode } from 'react'
import { IconSwitchContent, IconSwitchSection, IconSwitchTitle } from './styles'
import { Switch, SwitchProps } from '@mui/material'

interface IIconSwitchProps extends SwitchProps {
  icon: ReactNode
  title: string
}

export const IconSwitch = ({ icon, title, ...props }: IIconSwitchProps) => {
  return (
    <IconSwitchContent elevation={1} variant="elevation">
      <IconSwitchSection>
        {icon}
        <Switch size="small" {...props} />
      </IconSwitchSection>
      <IconSwitchSection>
        <IconSwitchTitle>{title}</IconSwitchTitle>
      </IconSwitchSection>
    </IconSwitchContent>
  )
}
