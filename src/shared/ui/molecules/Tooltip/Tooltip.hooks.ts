import { type RefObject, useState, useLayoutEffect } from 'react'
import type { TooltipPosition, ResolvedTooltipPosition } from './Tooltip.types'

export function useTooltipPosition(
  ref: RefObject<HTMLDivElement | null>,
  position: TooltipPosition,
  isVisible: boolean
): ResolvedTooltipPosition {
  const [autoPosition, setAutoPosition] =
    useState<ResolvedTooltipPosition>('top')

  useLayoutEffect(() => {
    if (position !== 'auto' || !isVisible || !ref.current) {
      return
    }

    const rect = ref.current.getBoundingClientRect()
    const midpoint = window.innerHeight / 2
    const elementCenter = rect.top + rect.height / 2

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAutoPosition(elementCenter < midpoint ? 'bottom' : 'top')
  }, [position, isVisible, ref])

  if (position !== 'auto') {
    return position
  }

  return autoPosition
}
