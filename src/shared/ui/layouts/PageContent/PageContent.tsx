import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import clsx from 'clsx'
import { PageHeader, type PageHeaderAction } from '@/shared/ui/molecules/PageHeader'
import { Button } from '@/shared/ui/atoms/Button'
import { LinkButton } from '@/shared/ui/atoms/LinkButton'
import type { PageContentProps } from './PageContent.types'

/* ── Floating title bar (appears when original title scrolls out) ── */

const FloatingTitleBar = ({
  title,
  actions,
  mainEl,
}: {
  title: string
  actions?: PageHeaderAction[]
  mainEl: HTMLElement
}) => {
  const hasActions = actions && actions.length > 0

  // Measure <main>'s position to place the bar with position: fixed
  const [rect, setRect] = useState({ top: 0, left: 0, width: 0 })

  const measure = useCallback(() => {
    const r = mainEl.getBoundingClientRect()
    setRect({ top: r.top, left: r.left, width: r.width })
  }, [mainEl])

  useEffect(() => {
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(mainEl)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [mainEl, measure])

  return createPortal(
    <div
      className="pointer-events-none fixed z-30 overflow-hidden"
      style={{
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: 56,
      }}
    >
      <motion.div
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
        className={clsx(
          'pointer-events-auto',
          'flex h-full items-center justify-between gap-4',
          'border-b border-(--border)',
          'bg-(--surface)/95 backdrop-blur-md',
          'px-4 md:px-8'
        )}
      >
        {/* Inner max-width wrapper to align with main content */}
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          <h2 className="truncate text-base font-bold tracking-tight text-(--text-primary)">
            {title}
          </h2>

          {hasActions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions.map((action) =>
                action.type === 'button' ? (
                  <Button
                    key={action.label}
                    variant={action.variant ?? 'primary'}
                    size="small"
                    icon={action.icon}
                    loading={action.loading}
                    disabled={action.disabled}
                    onClick={action.onClick}
                  >
                    {action.label}
                  </Button>
                ) : (
                  <LinkButton
                    key={action.label}
                    to={action.to as never}
                    variant={action.variant ?? 'primary'}
                    size="small"
                    icon={action.icon}
                  >
                    {action.label}
                  </LinkButton>
                )
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>,
    document.body
  )
}

/* ── PageContent layout ───────────────────────────────────────────── */

export const PageContent = ({
  title,
  description,
  actions,
  children,
  className,
}: PageContentProps) => {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [isTitleHidden, setIsTitleHidden] = useState(false)
  const [mainEl, setMainEl] = useState<HTMLElement | null>(null)

  // Observe when the <h1> title leaves the scroll viewport of <main>
  useEffect(() => {
    if (!titleRef.current) return

    const main = titleRef.current.closest('main')
    if (!main) return
    setMainEl(main)

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleHidden(!entry.isIntersecting)
      },
      {
        root: main,
        threshold: 0,
        rootMargin: '0px',
      }
    )

    observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div className={clsx('animate-page-in space-y-6', className)}>
      <PageHeader
        title={title}
        description={description}
        actions={actions}
        titleRef={titleRef}
      />

      {children}

      {/* Floating title bar — slides in when title scrolls out of view */}
      {mainEl && (
        <AnimatePresence>
          {isTitleHidden && (
            <FloatingTitleBar
              title={title}
              actions={actions}
              mainEl={mainEl}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  )
}
