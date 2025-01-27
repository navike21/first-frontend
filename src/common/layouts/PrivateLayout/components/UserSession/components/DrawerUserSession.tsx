import { Drawer } from '@Components/Drawer/Drawer'
import { IDrawerProps } from '@Types/typesDrawer'
import {
  ActionsProfile,
  ContentDrawerUserSession,
  InfoUserSession,
  InfoUserSessionContent,
  UserSessionEmail,
  UserSessionName,
} from '../styles/userSessionStyles'
import { Avatar } from '@Components/Avatar/Avatar'
import { ESizes } from '@Enums/size'
import { useUserSession } from '../hooks/useUserSession'
import { MdLogout } from 'react-icons/md'
import { MenuList } from '@Components/MenuList/MenuList'
import { Button } from '@Components/Button/Button'
import { Divider } from '@mui/material'

export const DrawerUserSession = ({ open, setOpen }: IDrawerProps) => {
  const {
    logOut: { title: textLogOut },
    userInformation: { names, fatherLastName, motherLastName, email, avatar },
    sizeIcon,
    titleMainMenu,
    handleLogout,
    handleGenerateMainMenu,
  } = useUserSession()

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <ContentDrawerUserSession>
        <InfoUserSessionContent>
          <Avatar avatarSize={ESizes.XXXL} src={avatar} alt={names} />
          <InfoUserSession>
            <UserSessionName variant="h5">{`${names} ${fatherLastName} ${motherLastName}`}</UserSessionName>
            <UserSessionEmail>{email}</UserSessionEmail>
          </InfoUserSession>
          <Divider>{titleMainMenu}</Divider>
          <ActionsProfile>
            <MenuList items={handleGenerateMainMenu()} />
          </ActionsProfile>
        </InfoUserSessionContent>
        <Button startIcon={<MdLogout size={sizeIcon} />} onClick={handleLogout}>
          {textLogOut}
        </Button>
      </ContentDrawerUserSession>
    </Drawer>
  )
}
