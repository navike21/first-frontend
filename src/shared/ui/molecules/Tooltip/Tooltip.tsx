import { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import type {
  TooltipProps,
  TooltipVariant,
  TooltipSize,
  ResolvedTooltipPosition,
} from './Tooltip.types'
import { useTooltipPosition } from './Tooltip.hooks'

const variantClasses: Record<TooltipVariant, string> = {
  dark: 'bg-gray-950 text-white shadow-lg shadow-black/40 ring-1 ring-white/10',
  light:
    'bg-white dark:bg-slate-700 text-(--text-primary) shadow-lg ring-1 ring-black/10 dark:ring-white/10',
}

const arrowVariantClasses: Record<TooltipVariant, string> = {
  dark: 'bg-gray-950',
  light: 'bg-white dark:bg-slate-700',
}

// Anchor the entrance scale to the edge nearest the trigger so it grows outward.
const originByPosition: Record<ResolvedTooltipPosition, string> = {
  top: 'bottom center',
  bottom: 'top center',
  left: 'center right',
  right: 'center left',
}

const sizeClasses: Record<TooltipSize, string> = {
  small: 'text-xs px-2.5 py-1.5',
  medium: 'text-sm px-3.5 py-2',
  large: 'text-base px-5 py-2.5',
}

const arrowPositionClasses: Record<ResolvedTooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
  left: 'top-1/2 left-full -translate-x-1/2 -translate-y-1/2',
  right: 'top-1/2 right-full translate-x-1/2 -translate-y-1/2',
}

export const Tooltip = ({
  content,
  heading,
  icon,
  subtitle,
  position = 'auto',
  variant = 'dark',
  size = 'medium',
  children,
  className = '',
}: Readonly<TooltipProps>) => {
  const [isHovered, setIsHovered] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const isVisible = isHovered
  const { resolvedPosition, style } = useTooltipPosition(
    wrapperRef,
    position,
    isVisible
  )

  const isStructured = Boolean(heading)
  const hasSubtitle = Boolean(subtitle)

  return (
    <div
      ref={wrapperRef}
      data-testid="tooltip-wrapper"
      className={clsx('relative inline-block', className)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      // Dismiss on click: when the trigger performs an action (e.g. opening a
      // modal), the hint should disappear instead of lingering on top of it.
      onClick={() => setIsHovered(false)}
    >
      {children}
      {isVisible &&
        createPortal(
          <div
            role="tooltip"
            style={{
              ...style,
              transformOrigin: originByPosition[resolvedPosition],
            }}
            className={clsx(
              'animate-tooltip-in pointer-events-none z-[9999]',
              'rounded-lg',
              variantClasses[variant],
              sizeClasses[size],
              hasSubtitle ? 'max-w-xs whitespace-normal' : 'whitespace-nowrap'
            )}
          >
            {isStructured ? (
              <div
                className={clsx(
                  'flex items-start',
                  hasSubtitle ? 'gap-2' : 'gap-1.5'
                )}
              >
                {icon && (
                  <IconComponent
                    icon={icon}
                    className={clsx(
                      'shrink-0',
                      hasSubtitle ? 'mt-0.5 h-4 w-4' : 'h-3.5 w-3.5',
                      variant === 'dark'
                        ? 'text-slate-300'
                        : 'text-slate-500 dark:text-slate-400'
                    )}
                  />
                )}
                <div className="flex flex-col gap-0.5">
                  <span className="leading-tight font-medium">{heading}</span>
                  {subtitle && (
                    <span
                      className={clsx(
                        'leading-snug font-normal',
                        variant === 'dark'
                          ? 'text-slate-400'
                          : 'text-slate-500 dark:text-slate-400',
                        size === 'small' ? 'text-xs' : 'text-xs'
                      )}
                    >
                      {subtitle}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              content
            )}
            <span
              aria-hidden="true"
              className={clsx(
                'absolute h-2 w-2 rotate-45',
                arrowVariantClasses[variant],
                arrowPositionClasses[resolvedPosition]
              )}
            />
          </div>,
          document.body
        )}
    </div>
  )
}
