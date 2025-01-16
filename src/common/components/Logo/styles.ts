import { ESizes } from '@Enums/size'
import { styled } from '@mui/material'
import { rotate } from '@Styles/animations'

type TContentLogoProps = {
  size: ESizes
}

export const ContentLogo = styled('div')<TContentLogoProps>(({
  theme,
  size = ESizes.MD,
}) => {
  const sizes = {
    [ESizes.XS]: {
      width: theme.typography.pxToRem(20),
      height: theme.typography.pxToRem(20),
    },
    [ESizes.SM]: {
      width: theme.typography.pxToRem(40),
      height: theme.typography.pxToRem(40),
    },
    [ESizes.MD]: {
      width: theme.typography.pxToRem(60),
      height: theme.typography.pxToRem(60),
    },
    [ESizes.LG]: {
      width: theme.typography.pxToRem(80),
      height: theme.typography.pxToRem(80),
    },
    [ESizes.XL]: {
      width: theme.typography.pxToRem(100),
      height: theme.typography.pxToRem(100),
    },
    [ESizes.XXL]: {
      width: theme.typography.pxToRem(120),
      height: theme.typography.pxToRem(120),
    },
    [ESizes.XXXL]: {
      width: theme.typography.pxToRem(140),
      height: theme.typography.pxToRem(140),
    },
  }
  return {
    [theme.breakpoints.up('xs')]: {
      ...sizes[size],
      position: 'relative',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }
})

export const RadarLogo = styled('span')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0.2,
    borderRadius: '50%',
    backgroundImage: `linear-gradient(135deg, transparent 50%, ${theme.palette.primary.dark} 100%)`,
    animation: `${rotate} 5s linear infinite`,
  },
}))
