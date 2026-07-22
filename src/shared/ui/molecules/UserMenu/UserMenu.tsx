import clsx from 'clsx'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { useTheme, useToggleTheme } from '@/shared/model'
import { Avatar } from '../../atoms/Avatar/Avatar'
import { IconComponent } from '../../atoms/IconComponent/IconComponent'
import { useUserMenu } from './UserMenu.hooks'
import type { UserMenuProps } from './UserMenu.types'

export const UserMenu = ({
  name,
  email,
  avatarSrc,
  avatarStatus,
  profileHref,
  labels,
  onPreferencesClick,
  onLogoutClick,
}: UserMenuProps) => {
  const { triggerRef, menuRef, position, isOpen, toggle, close } =
    useUserMenu()
  const theme = useTheme()
  const toggleTheme = useToggleTheme()

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={labels.ariaLabel}
        className={clsx(
          'flex items-center gap-2.5 rounded-full pl-1.5 pr-3.5 py-1.5',
          'bg-surface ring-1 ring-inset ring-border-control',
          'duration-fast ease-out-expo transition-all',
          'cursor-pointer hover:ring-border-hover',
          isOpen && 'ring-primary-600 shadow-trigger-active'
        )}
      >
        <Avatar
          src={avatarSrc}
          alt={name}
          name={name}
          size="xs"
          status={avatarStatus}
        />
        <span className="hidden flex-col items-start leading-tight md:flex">
          <span className="text-[13px] font-semibold text-foreground">
            {name}
          </span>
        </span>
        <IconComponent
          icon="RiArrowDownSLine"
          className={clsx(
            'size-3.5 text-secondary transition-transform duration-fast',
            isOpen && 'rotate-180 text-primary-600'
          )}
        />
      </button>

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
            className={clsx(
              'z-[9999] w-[230px] overflow-hidden rounded-xl',
              'bg-surface-panel ring-1 ring-border-control',
              'shadow-menu-panel'
            )}
          >
            <div className="border-b border-border-control px-4 py-3 pb-2">
              <p className="truncate text-[13px] font-semibold text-foreground">
                {name}
              </p>
              <p className="truncate text-[11.5px] text-secondary">{email}</p>
            </div>

            <Link
              to={profileHref as never}
              role="menuitem"
              onClick={close}
              className={clsx(
                'flex items-center gap-2.5 px-4 py-2.5',
                'text-[13px] text-foreground',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent icon="RiUserLine" className="size-[15px] text-secondary" />
              {labels.profile}
            </Link>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onPreferencesClick()
              }}
              className={clsx(
                'flex w-full items-center gap-2.5 px-4 py-2.5',
                'text-left text-[13px] text-foreground',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent
                icon="RiSettings3Line"
                className="size-[15px] text-secondary"
              />
              {labels.preferences}
            </button>

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                toggleTheme()
              }}
              className={clsx(
                'flex w-full items-center gap-2.5 px-4 py-2.5',
                'text-left text-[13px] text-foreground',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent
                icon={theme === 'dark' ? 'RiSunLine' : 'RiMoonLine'}
                className="size-[15px] text-secondary"
              />
              {theme === 'dark' ? labels.themeLight : labels.themeDark}
            </button>

            <div className="h-px bg-border-control" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onLogoutClick()
              }}
              className={clsx(
                'flex w-full items-center gap-2.5 px-4 py-2.5',
                'text-left text-[13px] text-danger-600',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent icon="RiLogoutBoxRLine" className="size-[15px]" />
              {labels.logout}
            </button>
          </motion.div>,
          document.body
        )}
    </>
  )
}
