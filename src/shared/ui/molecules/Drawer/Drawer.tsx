import React, { useEffect } from 'react'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { DrawerProps } from './Drawer.types'

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  placement = 'right',
  title,
  children,
  className,
  backdropClassName,
  isMobileOnly = false,
}) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])
  return (
    <>
      {/*
       * Backdrop
       * Open  → aparece primero: sin delay, fade-in 200 ms
       * Close → desaparece después: delay-300 (espera el slide-out del drawer)
       */}
      <div
        className={clsx(
          'fixed inset-0 z-40',
          'bg-slate-950/70 backdrop-blur-xs',
          'transition-opacity duration-fast ease-out-expo',
          isMobileOnly && 'md:hidden',
          isOpen
            ? 'opacity-100 delay-0'
            : 'pointer-events-none opacity-0 delay-[250ms]',
          backdropClassName
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/*
       * Drawer
       * Open  → aparece después del backdrop: delay-[50ms], slide-in 250 ms
       * Close → sale primero: sin delay, slide-out 250 ms
       */}
      <aside
        className={clsx(
          'fixed inset-y-0 z-50 flex h-full flex-col overflow-x-hidden overflow-y-auto',
          'bg-(--surface)',
          'transition-[translate,width] duration-normal ease-out-expo',
          isMobileOnly
            ? 'shadow-xl md:relative md:z-auto md:translate-x-0 md:shadow-none'
            : 'shadow-xl',
          placement === 'left'
            ? 'left-0 border-r border-(--border)'
            : 'right-0 border-l border-(--border)',
          isOpen
            ? 'translate-x-0 delay-[50ms]'
            : clsx('delay-0', {
                '-translate-x-full': placement === 'left',
                'translate-x-full': placement === 'right',
              }),
          className || 'w-80'
        )}
      >
        {/* Header/Title — only visible on mobile when used as a mobile-only drawer */}
        {title && (
          <div
            className={clsx(
              'flex items-center justify-between border-b border-(--border-subtle) p-4',
              isMobileOnly && 'md:hidden'
            )}
          >
            <div className="flex items-center gap-2">{title}</div>
            <button
              onClick={onClose}
              className={clsx(
                'cursor-pointer p-1.5',
                'rounded-md text-(--text-secondary)',
                'transition-colors duration-fast ease-out-expo',
                'hover:bg-(--surface-subtle) hover:text-(--text-primary)',
                'focus:outline-none',
              )}
              aria-label="Cerrar menú"
            >
              <IconComponent icon="RiCloseLine" className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      </aside>
    </>
  )
}
