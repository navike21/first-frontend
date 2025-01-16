import { ButtonProps, CircularProgress } from '@mui/material'
import { ContentButton, ContentLoader, MUIButton } from './style'

interface IButtonProps extends ButtonProps {
  loading?: boolean
}

export const Button = ({
  children,
  loading,
  size = 'small',
  variant = 'contained',
  ...props
}: IButtonProps) => (
  <MUIButton disabled={loading} size={size} variant={variant} {...props}>
    {loading && (
      <ContentLoader>
        <CircularProgress size={20} />
      </ContentLoader>
    )}
    <ContentButton loading={loading}>{children}</ContentButton>
  </MUIButton>
)
