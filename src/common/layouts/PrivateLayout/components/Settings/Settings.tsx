import { useState } from 'react'
import { IconButton } from '@mui/material'
import { useThemeInfo } from '@Hooks/useThemeInfo'
import { DrawerSettings } from './components/DrawerSettings'
import { IoIosSettings } from 'react-icons/io'

export const Settings = () => {
  const [open, setOpen] = useState(false)
  const {
    colors: {
      text: { primary: colorIcons },
    },
  } = useThemeInfo()
  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <IoIosSettings color={colorIcons} />
      </IconButton>
      <DrawerSettings open={open} setOpen={setOpen} />
    </>
  )
}
