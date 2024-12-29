import { IconButton } from '@Components/IconButton'
import SettingsIcon from '@mui/icons-material/Settings'
import { ContentIconConfig } from './styles'
import { useState } from 'react'
import { Drawer } from '@Components/Drawer'

export const Configuration = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton title="Configuration" onClick={() => setOpen(!open)}>
        <ContentIconConfig>
          <SettingsIcon />
        </ContentIconConfig>
      </IconButton>
      <Drawer
        title="Configuration"
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <span />
      </Drawer>
    </>
  )
}
