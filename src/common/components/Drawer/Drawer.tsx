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

  return (
    <DrawerMUI elevation={0} {...props}>
      <HeaderDrawer>
        {titleDrawer ? <Title variant="h5">{titleDrawer}</Title> : <span />}
        <ContentActions>
          {actionsButtons}
          <IconButton onClick={(event) => onClose?.(event, 'backdropClick')}>
            <IoClose />
          </IconButton>
        </ContentActions>
      </HeaderDrawer>
      <ContentDrawer>{children}</ContentDrawer>
    </DrawerMUI>
  )
}
