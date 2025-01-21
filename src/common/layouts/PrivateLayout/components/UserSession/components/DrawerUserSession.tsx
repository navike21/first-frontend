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
import { IconButton } from '@Components/IconButton/IconButton'
import { MdLogout } from 'react-icons/md'
import { Tooltip } from '@Components/Tooltip/Tooltip'
// import { TooltipInfo } from '@Components/Tooltip/styles'

export const DrawerUserSession = ({ open, setOpen }: IDrawerProps) => {
  const {
    userInformation: { names, fatherLastName, motherLastName, email, avatar },
    handleLogout,
  } = useUserSession()

  return (
    <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
      <ContentDrawerUserSession>
        <InfoUserSessionContent>
          <Avatar avatarSize={ESizes.XXXL} src={avatar} alt={names} />
          <InfoUserSession>
            <UserSessionName variant="h6">{`${names} ${fatherLastName} ${motherLastName}`}</UserSessionName>
            <UserSessionEmail>{email}</UserSessionEmail>
          </InfoUserSession>
          <ActionsProfile>
            <Tooltip
              title="Log out"
              placement="top"
              arrow
              // slots={{
              //   tooltip: TooltipInfo,
              // }}
            >
              <IconButton onClick={handleLogout}>
                <MdLogout />
              </IconButton>
            </Tooltip>
          </ActionsProfile>
        </InfoUserSessionContent>
      </ContentDrawerUserSession>
    </Drawer>
  )
}
