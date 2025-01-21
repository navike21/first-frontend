import { useState } from 'react'
import { DrawerSettings } from './components/DrawerSettings'
import { IoIosSettings } from 'react-icons/io'
import { IconButton } from '@Components/IconButton/IconButton'
import { useDrawerSettings } from './hooks/useDrawerSettings'

export const Settings = () => {
  const [open, setOpen] = useState(false)
  const { colorIcons, sizeIcon } = useDrawerSettings()
  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <IoIosSettings color={colorIcons} size={sizeIcon} />
      </IconButton>
      <DrawerSettings open={open} setOpen={setOpen} />
    </>
  )
}
