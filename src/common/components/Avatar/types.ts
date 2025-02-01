import { ESize } from '@Enums/size'
import { EStatusType, EUserStatusType } from '@Enums/statusType'
import { AvatarProps } from '@mui/material'

export interface IAvatarProps extends AvatarProps {
  status?: EUserStatusType
  avatarSize?: ESize
}

export type TStatusColor = {
  [key in EUserStatusType]: EStatusType
}

export const statusColor: TStatusColor = {
  online: EStatusType.SUCCESS,
  offline: EStatusType.DEFAULT,
  busy: EStatusType.ERROR,
  away: EStatusType.WARNING,
}
