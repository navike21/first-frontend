import clsx from 'clsx'
import type { HTMLAttributes, ReactNode } from 'react'
import { useId } from 'react'
import { IconComponent } from '../IconComponent/IconComponent'
import type { IconName } from '@/shared/types/icons'
import { hasTextClassColor } from '@/shared/lib/hasTextClassColor'

type Variant = 'default' | 'error' | 'success' | 'warning' | 'info'

export interface HelperTextProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode
  idField?: string
  size?: 'small' | 'medium' | 'large'
  showIcon?: boolean
  variant?: Variant
}

const ICON_BY_VARIANT: Record<Variant, IconName> = {
  default: 'RiInformationFill',
  error: 'RiCloseCircleFill',
  info: 'RiInformationFill',
  success: 'RiCheckboxCircleFill',
  warning: 'RiErrorWarningFill',
}

export const HelperText = ({
  children,
  className,
  idField,
  size = 'small',
  showIcon = false,
  variant = 'default',
  ...props
}: HelperTextProps) => {
  const generatedId = useId()
  const ID_HELPER_TEXT = idField ? `${idField}-helper-text` : generatedId
  const HAS_TEXT_CLASS_COLOR = hasTextClassColor(className)

  return (
    <div
      {...props}
      id={ID_HELPER_TEXT}
      data-variant={variant}
      className={clsx(
        className,
        'flex items-center gap-2',
        {
          'text-(--text-secondary)': variant === 'default' && !HAS_TEXT_CLASS_COLOR,
          'text-red-500 dark:text-red-400': variant === 'error' && !HAS_TEXT_CLASS_COLOR,
          'text-emerald-500 dark:text-emerald-400': variant === 'success' && !HAS_TEXT_CLASS_COLOR,
          'text-yellow-500 dark:text-yellow-400': variant === 'warning' && !HAS_TEXT_CLASS_COLOR,
          'text-blue-500 dark:text-blue-400': variant === 'info' && !HAS_TEXT_CLASS_COLOR,
        },
        {
          'text-xs': size === 'small',
          'text-sm': size === 'medium',
          'text-base': size === 'large',
        }
      )}
      role={variant === 'error' ? 'alert' : undefined}
      aria-live={variant === 'error' ? 'polite' : undefined}
    >
      {showIcon && (
        <IconComponent
          icon={ICON_BY_VARIANT[variant]}
          className={clsx({
            'size-4': size === 'small',
            'size-5': size === 'medium',
            'size-6': size === 'large',
          })}
        />
      )}
      {children}
    </div>
  )
}
