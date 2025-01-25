import { EIcons } from '@Layouts/PrivateLayout/components/UserSession/enums/icons'
import { ReactNode } from 'react'
import { MdLock, MdPerson, MdMessage, MdHelp, MdInfo } from 'react-icons/md'

export const generalIcons = (sizeIcon: string): Record<EIcons, ReactNode> => ({
  [EIcons.MESSAGES]: <MdMessage size={sizeIcon} />,
  [EIcons.PROFILE]: <MdPerson size={sizeIcon} />,
  [EIcons.SECURITY]: <MdLock size={sizeIcon} />,
  [EIcons.HELP]: <MdHelp size={sizeIcon} />,
  [EIcons.INFO]: <MdInfo size={sizeIcon} />,
})
