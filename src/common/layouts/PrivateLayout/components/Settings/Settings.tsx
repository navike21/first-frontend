import { useState } from 'react'
import { IconButton } from '@mui/material'
import { AnimateIcon } from '@Components/AnimateIcon/AnimateIcon'
import settingsIcon from '@Json/animateIcons/system-regular-63-settings-cog-loop-cog.json'
import { DrawerSettings } from './components/DrawerSettings'

export const Settings = () => {
  const [open, setOpen] = useState(false)

  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <AnimateIcon icon={settingsIcon} />
      </IconButton>
      <DrawerSettings open={open} setOpen={setOpen} />
    </>
  )
}
