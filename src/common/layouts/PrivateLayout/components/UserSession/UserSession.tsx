import { Avatar } from '@Components/Avatar/Avatar'
import { IconButton } from '@Components/IconButton/IconButton'
import { DrawerUserSession } from './components/DrawerUserSession'
import { useState } from 'react'
import { ESize } from '@Enums/size'

export const UserSession = () => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <IconButton onClick={() => setOpen(!open)}>
        <Avatar avatarSize={ESize.SM} />
      </IconButton>
      <DrawerUserSession open={open} setOpen={setOpen} />
    </>
  )
}
