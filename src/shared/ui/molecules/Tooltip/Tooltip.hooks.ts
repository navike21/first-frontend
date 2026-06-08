import { type RefObject, type CSSProperties, useState, useLayoutEffect, useEffect } from 'react'
import type { TooltipPosition, ResolvedTooltipPosition } from './Tooltip.types'

const GAP = 8

type TooltipPositionState = {
  resolvedPosition: ResolvedTooltipPosition
  style: CSSProperties
}

const DEFAULT_STATE: TooltipPositionState = {
  resolvedPosition: 'top',
  style: {},
}

function computePositionState(
  el: HTMLDivElement,
  position: TooltipPosition
): TooltipPositionState {
  const rect = el.getBoundingClientRect()

  const resolvedPosition: ResolvedTooltipPosition =
    position === 'auto'
      ? rect.top + rect.height / 2 < window.innerHeight / 2
        ? 'bottom'
        : 'top'
      : position

  let style: CSSProperties
  switch (resolvedPosition) {
    case 'top':
      style = {
        position: 'fixed',
        top: rect.top - GAP,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%) translateY(-100%)',
      }
      break
    case 'bottom':
      style = {
        position: 'fixed',
        top: rect.bottom + GAP,
        left: rect.left + rect.width / 2,
        transform: 'translateX(-50%)',
      }
      break
    case 'left':
      style = {
        position: 'fixed',
        top: rect.top + rect.height / 2,
        left: rect.left - GAP,
        transform: 'translateX(-100%) translateY(-50%)',
      }
      break
    case 'right':
      style = {
        position: 'fixed',
        top: rect.top + rect.height / 2,
        left: rect.right + GAP,
        transform: 'translateY(-50%)',
      }
      break
  }

  return { resolvedPosition, style }
}

export function useTooltipPosition(
  ref: RefObject<HTMLDivElement | null>,
  position: TooltipPosition,
  isVisible: boolean
): TooltipPositionState {
  const [state, setState] = useState<TooltipPositionState>(DEFAULT_STATE)

  useLayoutEffect(() => {
    if (!isVisible || !ref.current) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setState(computePositionState(ref.current, position))
  }, [position, isVisible, ref])

  useEffect(() => {
    if (!isVisible || !ref.current) return

    const el = ref.current
    const update = () => setState(computePositionState(el, position))

    window.addEventListener('scroll', update, true)
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update, true)
      window.removeEventListener('resize', update)
    }
  }, [isVisible, position, ref])

  return state
}
