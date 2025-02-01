import { AvatarMUI, StyledBadge } from './styles'
import { EUserStatusType } from '@Enums/statusType'
import { IAvatarProps, statusColor } from './types'
import { ESize } from '@Enums/size'

export const Avatar = ({
  status = EUserStatusType.ONLINE,
  avatarSize = ESize.MD,
  ...props
}: IAvatarProps) => (
  <StyledBadge
    overlap="circular"
    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    variant="dot"
    color={statusColor[status]}
  >
    <AvatarMUI avatarSize={avatarSize} {...props} />
  </StyledBadge>
)
