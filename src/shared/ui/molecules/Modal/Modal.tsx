import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { ModalProps } from './Modal.types'

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'w-full max-w-sm',
  md: 'w-full max-w-md',
  lg: 'w-full max-w-lg',
  xl: 'w-full max-w-2xl',
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
}: ModalProps) => {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const hasHeader = title || showCloseButton

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={clsx(
          'fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs',
          'duration-fast ease-out-expo transition-opacity',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        )}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Centering wrapper */}
      <div
        className={clsx(
          'fixed inset-0 z-50 flex items-center justify-center p-4',
          !isOpen && 'pointer-events-none'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        {/* Panel */}
        <div
          className={clsx(
            'relative flex flex-col rounded-2xl bg-white shadow-2xl',
            'duration-normal ease-out-expo transition-[transform,opacity]',
            isOpen
              ? 'scale-100 opacity-100 delay-50'
              : 'scale-95 opacity-0 delay-0',
            sizeClasses[size]
          )}
        >
          {/* Header */}
          {hasHeader && (
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-6 py-4">
              <div>
                {title && (
                  <h2
                    id="modal-title"
                    className="text-base font-semibold text-slate-800"
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-1 text-sm text-slate-500">{description}</p>
                )}
              </div>
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className={clsx(
                    'shrink-0 cursor-pointer rounded-md p-1.5 text-slate-400',
                    'duration-fast ease-out-expo transition-colors',
                    'hover:bg-slate-100 hover:text-slate-700 focus:outline-none'
                  )}
                  aria-label="Cerrar"
                >
                  <IconComponent icon="RiCloseLine" className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          {children && <div className="px-6 py-5">{children}</div>}

          {/* Footer */}
          {footer && (
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 px-6 py-4">
              {footer}
            </div>
          )}
        </div>
      </div>
    </>,
    document.body
  )
}
