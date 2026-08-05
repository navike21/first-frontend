import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { IconButton, IconComponent } from '@/shared/ui'
import type { ActionMenuProps } from './ActionMenu.types'

interface MenuPosition {
  top?: number
  bottom?: number
  right: number
  openAbove: boolean
}

const ITEM_HEIGHT = 36
const MENU_PADDING = 8
const MENU_GAP = 4

export const ActionMenu = ({
  items,
  triggerLabel,
  disabled,
  triggerIcon = 'RiMore2Fill',
  wide = false,
}: ActionMenuProps) => {
  const triggerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<MenuPosition | null>(null)

  const close = () => setPosition(null)

  const toggle = () => {
    if (position) {
      close()
      return
    }
    const rect = triggerRef.current?.getBoundingClientRect()
    if (!rect) return
    const estimatedHeight = items.length * ITEM_HEIGHT + MENU_PADDING
    const openAbove =
      rect.bottom + MENU_GAP + estimatedHeight > window.innerHeight
    setPosition({
      right: window.innerWidth - rect.right,
      openAbove,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + MENU_GAP }
        : { top: rect.bottom + MENU_GAP }),
    })
  }

  useEffect(() => {
    if (!position) return

    const handlePointerDown = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      )
        return
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

  return (
    <div ref={triggerRef} className={wide ? 'flex' : 'inline-flex'}>
      {wide ? (
        <button
          type="button"
          aria-label={triggerLabel}
          aria-haspopup="menu"
          aria-expanded={!!position}
          disabled={disabled}
          onClick={toggle}
          className={clsx(
            'border-border-control text-secondary flex w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-dashed px-3 py-2 text-sm font-medium transition-colors',
            'hover:border-primary-600 hover:text-primary-600 hover:bg-primary-700/5',
            disabled && 'cursor-not-allowed opacity-50'
          )}
        >
          <IconComponent icon={triggerIcon} className="h-4 w-4 shrink-0" />
          {triggerLabel}
        </button>
      ) : (
        <IconButton
          icon={triggerIcon}
          variant="text"
          size="small"
          aria-label={triggerLabel}
          aria-haspopup="menu"
          aria-expanded={!!position}
          disabled={disabled}
          onClick={toggle}
        />
      )}
      {position &&
        createPortal(
          <motion.div
            ref={menuRef}
            role="menu"
            initial={{
              opacity: 0,
              scaleY: 0.95,
              y: position.openAbove ? 4 : -4,
            }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            style={{
              transformOrigin: position.openAbove ? 'bottom' : 'top',
              position: 'fixed',
              right: position.right,
              ...(position.openAbove
                ? { bottom: position.bottom }
                : { top: position.top }),
            }}
            className="bg-surface-panel shadow-menu-panel ring-border-control z-[9999] min-w-48 overflow-hidden rounded-xl py-1 ring-1"
          >
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                role="menuitem"
                onClick={() => {
                  close()
                  item.onClick()
                }}
                className={clsx(
                  'flex w-full cursor-pointer items-center gap-2.5 px-3 py-2',
                  'text-left text-sm',
                  'transition-colors',
                  item.danger
                    ? 'border-border-control text-danger-600 hover:bg-surface-hover-row mt-1 border-t'
                    : 'text-foreground hover:bg-surface-hover-row'
                )}
              >
                <IconComponent icon={item.icon} className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            ))}
          </motion.div>,
          document.body
        )}
    </div>
  )
}
