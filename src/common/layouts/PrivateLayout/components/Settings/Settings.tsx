import { Drawer } from '@Components/Drawer/Drawer'
import { IconButton } from '@mui/material'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { useState } from 'react'
import { settingsLanguages } from './language/settingsLanguage'
import { AnimateIcon } from '@Components/AnimateIcon/AnimateIcon'
import settingsIcon from '@Json/animateIcons/system-regular-63-settings-cog-loop-cog.json'

export const Settings = () => {
  const [open, setOpen] = useState(false)
  const { language } = useOptionsBrowserStore()

  const { title } = settingsLanguages[language]

  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <AnimateIcon icon={settingsIcon} loop />
      </IconButton>

      <Drawer
        title={title}
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <span />
      </Drawer>
    </>
  )
}
