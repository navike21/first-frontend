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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    measure()
    const ro = new ResizeObserver(() => measure())
    ro.observe(mainEl)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [mainEl, measure])

  // Measure the inner bar height so the clipping wrapper matches it
  // (mobile is taller: title + buttons row; desktop is single row)
  const innerRef = useRef<HTMLDivElement>(null)
  const [barHeight, setBarHeight] = useState(56)
  useEffect(() => {
    const update = () => {
      if (innerRef.current) setBarHeight(innerRef.current.offsetHeight)
    }
    update()
    const ro = new ResizeObserver(update)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [])

  return createPortal(
    <div
      className="pointer-events-none fixed z-30 overflow-hidden"
      style={{ top: rect.top, left: rect.left, width: rect.width, height: barHeight }}
    >
      <motion.div
        ref={innerRef}
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 400, mass: 0.8 }}
        className={clsx(
          'pointer-events-auto w-full',
          'border-b border-border',
          'bg-surface/95 backdrop-blur-md',
          'px-4 py-2 md:px-8'
        )}
      >
        {/* Inner max-width wrapper */}
        <div className="mx-auto w-full max-w-7xl">
          {/* Title — always visible */}
          <h2 className="truncate text-base font-bold tracking-tight text-foreground">
            {title}
          </h2>

          {/* Actions:
              mobile  → full row below title, each button flex-1 (50/50)
              desktop → inline right of title via absolute/flex trick handled
                        by swapping to a row layout from sm up              */}
          {hasActions && (
            <div className={clsx(
              'mt-1.5 flex items-center gap-2',
              'sm:absolute sm:inset-y-0 sm:right-4 sm:mt-0 sm:flex sm:items-center sm:gap-2 md:right-8'
            )}>
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
                    className="flex-1 whitespace-nowrap sm:flex-none"
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
                    className="flex-1 whitespace-nowrap sm:flex-none"
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

  useEffect(() => {
    if (!titleRef.current) return
    const main = titleRef.current.closest('main')
    if (!main) return
    setMainEl(main)

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsTitleHidden(!entry.isIntersecting)
      },
      { root: main, threshold: 0, rootMargin: '0px' }
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
