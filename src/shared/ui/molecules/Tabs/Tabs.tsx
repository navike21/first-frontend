import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import type { TabsProps } from './Tabs.types'

/**
 * Controlled, accessible tab bar. Renders only the tablist; the caller renders
 * the active panel based on `activeId`.
 */
export const Tabs = ({
  tabs,
  activeId,
  onChange,
  className,
  ariaLabel,
}: TabsProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const updateIndicator = () => {
      if (!containerRef.current) return
      const activeEl = containerRef.current.querySelector(
        `[id="tab-${activeId}"]`
      ) as HTMLElement
      if (activeEl) {
        setIndicatorStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
        })
      }
    }

    // Run immediately
    updateIndicator()

    // Sync on resize and structural changes
    window.addEventListener('resize', updateIndicator)
    const timer = setTimeout(updateIndicator, 50)

    return () => {
      window.removeEventListener('resize', updateIndicator)
      clearTimeout(timer)
    }
  }, [activeId, tabs])

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label={ariaLabel}
      className={clsx(
        'relative flex items-center gap-1 border-b border-(--border)',
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'group flex items-center gap-2 px-4 py-2.5 -mb-px',
              'border-b-2 border-transparent text-sm font-medium',
              'duration-fast ease-out-expo transition-colors',
              'cursor-pointer rounded-t-md',
              'hover:bg-slate-50/60 dark:hover:bg-slate-800/20',
              isActive
                ? 'text-(--text-primary)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            )}
          >
            {tab.icon && (
              <IconComponent
                icon={tab.icon}
                className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
              />
            )}
            {tab.label}
          </button>
        )
      })}
      
      {/* Dynamic sliding active bar */}
      <div
        className="absolute bottom-0 h-0.5 bg-primary-600 transition-all duration-300 ease-spring"
        style={{
          left: indicatorStyle.left,
          width: indicatorStyle.width,
        }}
      />
    </div>
  )
}
