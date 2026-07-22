import { useEffect, useRef, useState } from 'react'

interface MenuPosition {
  top?: number
  bottom?: number
  right: number
  openAbove: boolean
}

// Estimado generoso (header + 4 filas + divisor) para decidir si el panel
// abre hacia arriba cuando no hay espacio debajo — mismo criterio que
// ActionMenu/Select.
const ESTIMATED_PANEL_HEIGHT = 260
const PANEL_GAP = 8

export const useUserMenu = () => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<MenuPosition | null>(null)
  const isOpen = position !== null

  const close = () => setPosition(null)

  const toggle = () => {
    if (position) {
      close()
      return
    }
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const openAbove =
      rect.bottom + PANEL_GAP + ESTIMATED_PANEL_HEIGHT > window.innerHeight
    setPosition({
      right: window.innerWidth - rect.right,
      openAbove,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + PANEL_GAP }
        : { top: rect.bottom + PANEL_GAP }),
    })
  }

  useEffect(() => {
    if (!position) return

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      close()
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [position])

  return { triggerRef, menuRef, position, isOpen, toggle, close }
}
