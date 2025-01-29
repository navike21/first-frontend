import { Avatar, Badge, styled } from '@mui/material'
import { colorBadge } from './helper'
import { EStatusType } from '@Enums/statusType'
import { ESizes } from '@Enums/size'

export const StyledBadge = styled(Badge)(
  ({ theme, color = EStatusType.SUCCESS }) => ({
    width: 'fit-content',
    '& .MuiBadge-badge': {
      backgroundColor: colorBadge(theme)[color as EStatusType],
      color: colorBadge(theme)[color as EStatusType],
      boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
      width: theme.typography.pxToRem(10),
      height: theme.typography.pxToRem(10),
      borderRadius: '50%',
      ...(color === EStatusType.SUCCESS && {
        '&::before, &::after': {
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '100%',
          borderRadius: '50%',
          content: '""',
          background: 'currentColor',
          opacity: 0,
          animation: 'ripple 1.5s infinite ease-in-out',
        },
        '&::before': {
          animationDelay: '0s',
        },
        '&::after': {
          animationDelay: '0.3s',
        },
        '& .MuiBadge-badge::after': {
          animation: 'ripple 2.5s infinite ease-in-out',
        },
      }),
    },
    '@keyframes ripple': {
      '0%': {
        transform: 'scale(0)',
        opacity: 1,
      },
      '50%': {
        transform: 'scale(1)',
        opacity: 0.5,
      },
      '100%': {
        transform: 'scale(3)',
        opacity: 0,
      },
    },
  })
)

type TAvatarSizes = {
  [key in ESizes]: number
}

const avatarSizeValues: TAvatarSizes = {
  [ESizes.XS]: 24,
  [ESizes.SM]: 32,
  [ESizes.MD]: 40,
  [ESizes.LG]: 48,
  [ESizes.XL]: 56,
  [ESizes.XXL]: 64,
  [ESizes.XXXL]: 72,
}

export const AvatarMUI = styled(Avatar, {
  shouldForwardProp: (prop) => prop !== 'avatarSize',
})<{ avatarSize: ESizes }>(({ theme, avatarSize }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  width: avatarSizeValues[avatarSize],
  height: avatarSizeValues[avatarSize],
}))
