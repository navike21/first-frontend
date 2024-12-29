import { Drawer as DrawerMUI, DrawerProps } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ContentDrawer, HeaderDrawer, TitleDrawer } from './styles'
import { IconButton } from '@Components/IconButton'

interface IDrawerProps extends DrawerProps {
  title?: string
}

export const Drawer = ({ ...props }: IDrawerProps) => {
  const { title, children, onClose } = props
  return (
    <DrawerMUI {...props}>
      <ContentDrawer>
        <HeaderDrawer>
          {title && <TitleDrawer>{title}</TitleDrawer>}
          <IconButton
            title="close-config"
            onClick={(event) => onClose?.(event, 'backdropClick')}
            size="small"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </HeaderDrawer>
        {children}
      </ContentDrawer>
    </DrawerMUI>
  )
}
