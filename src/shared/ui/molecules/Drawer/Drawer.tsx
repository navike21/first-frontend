import React, { useEffect } from 'react'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { IconComponent } from '@/shared/ui'
import { springTransition } from '@/shared/lib'
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

  const asideVariants = {
    open: {
      x: 0,
      transition: springTransition,
    },
    closed: {
      x: placement === 'left' ? '-100%' : '100%',
      transition: springTransition,
    },
  }

  return (
    <>
      {/*
       * Backdrop
       * Open  → aparece primero: sin delay, fade-in 200 ms
       * Close → desaparece después: delay-300 (espera el slide-out del drawer)
       */}
      <motion.div
        animate={isOpen ? { opacity: 1 } : { opacity: 0 }}
        initial={false}
        transition={{ duration: 0.2 }}
        className={clsx(
          'fixed inset-0 z-40',
          'bg-slate-950/70 backdrop-blur-xs',
          'duration-fast ease-out-expo transition-opacity',
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
      <motion.aside
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
        variants={asideVariants}
        className={clsx(
          'fixed inset-y-0 z-50 flex h-full flex-col overflow-x-hidden overflow-y-auto',
          'bg-surface',
          'duration-normal ease-out-expo transition-[translate,width]',
          placement === 'left' ? 'shadow-drawer-right' : 'shadow-drawer-left',
          isMobileOnly &&
            'md:relative md:z-auto md:!translate-x-0 md:!transform-none md:shadow-none',
          placement === 'left' ? 'left-0' : 'right-0',
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
              'border-border-subtle flex items-center justify-between border-b p-4',
              isMobileOnly && 'md:hidden'
            )}
          >
            <div className="flex items-center gap-2">{title}</div>
            <button
              onClick={onClose}
              className={clsx(
                'cursor-pointer p-1.5',
                'text-secondary rounded-md',
                'duration-fast ease-out-expo transition-colors',
                'hover:bg-surface-subtle hover:text-foreground',
                'focus:outline-none'
              )}
              aria-label="Cerrar menú"
            >
              <IconComponent icon="RiCloseLine" className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="flex flex-1 flex-col overflow-y-auto">{children}</div>
      </motion.aside>
    </>
  )
}
