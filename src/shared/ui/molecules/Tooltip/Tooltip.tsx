import { useState, useRef, useEffect } from 'react'
import clsx from 'clsx'
import type {
  TooltipProps,
  TooltipVariant,
  TooltipSize,
  ResolvedTooltipPosition,
} from './Tooltip.types'
import { useTooltipPosition } from './Tooltip.hooks'

const variantClasses: Record<TooltipVariant, string> = {
  dark: 'bg-gray-900 text-white',
  light: 'bg-white text-primary-text shadow ring-1 ring-black/10',
}

const arrowVariantClasses: Record<TooltipVariant, string> = {
  dark: 'bg-gray-900',
  light: 'bg-white',
}

const sizeClasses: Record<TooltipSize, string> = {
  small: 'text-xs px-2 py-1',
  medium: 'text-sm px-3 py-1.5',
  large: 'text-base px-4 py-2',
}

const positionClasses: Record<ResolvedTooltipPosition, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

const arrowPositionClasses: Record<ResolvedTooltipPosition, string> = {
  top: 'top-full left-1/2 -translate-x-1/2 -translate-y-1/2',
  bottom: 'bottom-full left-1/2 -translate-x-1/2 translate-y-1/2',
  left: 'top-1/2 left-full -translate-x-1/2 -translate-y-1/2',
  right: 'top-1/2 right-full translate-x-1/2 -translate-y-1/2',
}

export const Tooltip = ({
  content,
  position = 'auto',
  variant = 'dark',
  size = 'medium',
  children,
  className = '',
}: Readonly<TooltipProps>) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  const isVisible = isHovered || isClicked
  const resolvedPosition = useTooltipPosition(wrapperRef, position, isVisible)

  useEffect(() => {
    if (!isClicked) return

    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsClicked(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isClicked])

  return (
    <div
      ref={wrapperRef}
      data-testid="tooltip-wrapper"
      className={clsx('relative inline-block', className)}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}
      onClick={() => setIsClicked((prev) => !prev)}
    >
      {children}
      {isVisible && (
        <div
          role="tooltip"
          className={clsx(
            'pointer-events-none absolute z-50 rounded-md whitespace-nowrap',
            positionClasses[resolvedPosition],
            variantClasses[variant],
            sizeClasses[size]
          )}
        >
          {content}
          <span
            aria-hidden="true"
            className={clsx(
              'absolute h-2 w-2 rotate-45',
              arrowVariantClasses[variant],
              arrowPositionClasses[resolvedPosition]
            )}
          />
        </div>
      )}
    </div>
  )
}
