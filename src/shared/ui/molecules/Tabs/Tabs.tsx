import clsx from 'clsx'
import { LayoutGroup, motion } from 'motion/react'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { snappySpringTransition } from '@/shared/lib'
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
  return (
    <LayoutGroup>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className={clsx(
          'relative flex items-center gap-1 border-b border-border',
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
                'group relative -mb-px flex items-center gap-2 px-4 py-2.5',
                'border-b-2 border-transparent text-sm font-medium',
                'duration-fast ease-out-expo transition-colors',
                'cursor-pointer rounded-t-md',
                'hover:bg-slate-50/60 dark:hover:bg-slate-800/20',
                isActive
                  ? 'text-foreground'
                  : 'text-secondary hover:text-foreground'
              )}
            >
              {tab.icon && (
                <IconComponent
                  icon={tab.icon}
                  className="h-4 w-4 transition-transform duration-200 group-hover:-translate-y-0.5"
                />
              )}
              {tab.label}

              {/* Dynamic sliding active bar */}
              {isActive && (
                <motion.div
                  layoutId="active-tab-bar"
                  className="bg-primary-600 absolute right-0 bottom-0 left-0 h-0.5"
                  transition={snappySpringTransition}
                />
              )}
            </button>
          )
        })}
      </div>
    </LayoutGroup>
  )
}
