import { ReactNode } from 'react'
import { DrawerProps } from '@mui/material'
import { IconButton } from '@Components/IconButton/IconButton'
import { Title } from '@Components/Title/Title'
import { IoClose } from 'react-icons/io5'
import {
  ContentActions,
  ContentDrawer,
  DrawerMUI,
  HeaderDrawer,
} from './styles'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'

interface IDrawerProps extends DrawerProps {
  titleDrawer?: string
  actionsButtons?: ReactNode
}

export const Drawer = ({
  actionsButtons,
  titleDrawer,
  ...props
}: IDrawerProps) => {
  const { children, onClose } = props
  const { themeOption } = useOptionsBrowserStore()
  return (
    <DrawerMUI themeOption={themeOption} elevation={0} {...props}>
      <HeaderDrawer>
        {titleDrawer && <Title variant="h5">{titleDrawer}</Title>}
        <ContentActions>
          {actionsButtons}
          <IconButton
            title="close-config"
            onClick={(event) => onClose?.(event, 'backdropClick')}
          >
            <IoClose />
          </IconButton>
        </ContentActions>
      </HeaderDrawer>
      <ContentDrawer>{children}</ContentDrawer>
    </DrawerMUI>
  )
}
