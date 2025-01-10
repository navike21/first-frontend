import { Drawer as DrawerMUI, DrawerProps } from '@mui/material'
import { IoClose } from 'react-icons/io5'
import { IconButton } from '@Components/IconButton/IconButton'
import { Title } from '@Components/Title/Title'
import { ContentActions, ContentDrawer, HeaderDrawer } from './styles'
import { ReactNode } from 'react'

interface IDrawerProps extends DrawerProps {
  title?: string
  actionsButtons?: ReactNode
}

export const Drawer = ({ actionsButtons, ...props }: IDrawerProps) => {
  const { title, children, onClose } = props
  return (
    <DrawerMUI {...props}>
      <ContentDrawer>
        <HeaderDrawer>
          {title && <Title variant="h5">{title}</Title>}
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
        {children}
      </ContentDrawer>
    </DrawerMUI>
  )
}
