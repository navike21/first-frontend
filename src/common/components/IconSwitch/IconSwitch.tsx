import { ReactNode } from 'react'
import { IconSwitchContent, IconSwitchSection, IconSwitchTitle } from './styles'
import { Switch, SwitchProps } from '@mui/material'

interface IIconSwitchProps extends SwitchProps {
  icon: ReactNode
  title: string
}

export const IconSwitch = ({ icon, title, ...props }: IIconSwitchProps) => {
  return (
    <IconSwitchContent elevation={0} variant="outlined">
      <IconSwitchSection>
        {icon}
        <Switch {...props} />
      </IconSwitchSection>
      <IconSwitchSection>
        <IconSwitchTitle>{title}</IconSwitchTitle>
      </IconSwitchSection>
    </IconSwitchContent>
  )
}
