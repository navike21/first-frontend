import React, { memo, useCallback } from 'react'
import { ButtonProps as MUIButtonProps, CircularProgress } from '@mui/material'
import { ContentButton, ContentLoader, MUIButton } from './style'

interface IButtonProps extends Omit<MUIButtonProps, 'loading'> {
  loading?: boolean
  loadingText?: string
}

export const Button = memo<IButtonProps>(
  ({
    children,
    loading = false,
    size = 'medium',
    variant = 'contained',
    onClick,
    loadingText = 'Loading...',
    ...props
  }) => {
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (!loading && onClick) {
          onClick(event)
        }
      },
      [loading, onClick]
    )

    return (
      <MUIButton
        disabled={loading}
        size={size}
        variant={variant}
        onClick={handleClick}
        data-variant={variant}
        aria-busy={loading}
        {...props}
      >
        {loading && (
          <ContentLoader aria-label={loadingText}>
            <CircularProgress size={20} aria-hidden="true" />
          </ContentLoader>
        )}
        <ContentButton loading={loading}>
          {loading ? loadingText : children}
        </ContentButton>
      </MUIButton>
    )
  }
)

Button.displayName = 'Button'
