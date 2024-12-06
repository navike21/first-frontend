import { keyframes, styled } from '@mui/material'

const rotate = keyframes({
  '0%': {
    transform: 'rotate(0deg)',
  },
  '100%': {
    transform: 'rotate(360deg)',
  },
})

export const ContentLogo = styled('div')(({ theme }) => ({
  [theme.breakpoints.up('xs')]: {
    width: theme.typography.pxToRem(85),
    height: theme.typography.pxToRem(85),
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
}))

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
