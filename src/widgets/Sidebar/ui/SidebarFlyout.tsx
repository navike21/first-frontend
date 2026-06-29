import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from '@tanstack/react-router'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { MenuItem } from '../model/menu.config'

interface SidebarFlyoutProps {
  item: MenuItem
  isItemActive: boolean
  isChildActive: (href: string) => boolean
  onNavigate: () => void
}

const CLOSE_DELAY = 120

/**
 * Collapsed-rail entry for a group: an icon trigger that reveals a flyout to
 * its right (on hover/focus) listing the group's children. The flyout is
 * portaled to `document.body` so it isn't clipped by the sidebar's
 * `overflow-hidden`.
 */
export const SidebarFlyout = ({
  item,
  isItemActive,
  isChildActive,
  onNavigate,
}: SidebarFlyoutProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<number | null>(null)
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openFlyout = useCallback(() => {
    cancelClose()
    const rect = wrapperRef.current?.getBoundingClientRect()
    if (rect) setCoords({ top: rect.top, left: rect.right + 8 })
    setOpen(true)
  }, [])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY)
  }, [])

  useEffect(() => () => cancelClose(), [])

  const triggerClass = clsx(
    'mb-2 flex w-full items-center justify-center p-3',
    'rounded-lg',
    'duration-fast ease-out-expo transition-colors',
    isItemActive
      ? 'bg-primary-700/10 text-primary-500 dark:bg-primary-950/40 dark:text-primary-500'
      : 'text-slate-500 hover:bg-primary-700/5 hover:text-primary-500 dark:text-slate-300 dark:hover:bg-primary-950/20 dark:hover:text-primary-500'
  )

  const icon = <IconComponent icon={item.icon} className="h-6 w-6" />

  return (
    <div
      ref={wrapperRef}
      className="relative"
      onPointerEnter={openFlyout}
      onPointerLeave={scheduleClose}
      onFocus={openFlyout}
      onBlur={scheduleClose}
    >
      {item.href ? (
        <Link
          to={item.href}
          title={item.label}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={onNavigate}
          className={triggerClass}
        >
          {icon}
        </Link>
      ) : (
        <button
          type="button"
          title={item.label}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={openFlyout}
          className={clsx('cursor-pointer', triggerClass)}
        >
          {icon}
        </button>
      )}

      {open &&
        createPortal(
          <div
            role="menu"
            style={{ position: 'fixed', top: coords.top, left: coords.left }}
            className="animate-dropdown-in z-50"
            onPointerEnter={openFlyout}
            onPointerLeave={scheduleClose}
          >
            <div className="min-w-52 rounded-lg bg-(--surface) p-2 shadow-lg ring-1 ring-(--border)">
              <p className="px-2 py-1 text-xs font-semibold tracking-wide text-(--text-secondary) uppercase">
                {item.label}
              </p>
              <div className="mt-1 flex flex-col gap-0.5">
                {item.children?.map((child) => {
                  const active = isChildActive(child.href)
                  return (
                    <Link
                      key={child.id}
                      to={child.href}
                      role="menuitem"
                      onClick={() => {
                        setOpen(false)
                        onNavigate()
                      }}
                      className={clsx(
                        'flex items-center gap-2 px-2 py-1.5',
                        'rounded-md text-sm font-medium',
                        'transition-colors',
                        active
                          ? 'bg-primary-700/10 text-primary-500 dark:bg-primary-950/30 dark:text-primary-500 font-semibold'
                          : 'hover:bg-primary-700/5 hover:text-primary-500 dark:hover:bg-primary-950/20 dark:hover:text-primary-500 text-slate-500 dark:text-slate-300'
                      )}
                    >
                      {child.icon && (
                        <IconComponent
                          icon={child.icon}
                          className="h-4 w-4 shrink-0"
                        />
                      )}
                      <span>{child.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  )
}
