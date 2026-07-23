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
  const { triggerRef, menuRef, position, isOpen, toggle, close } = useUserMenu()
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
          'flex items-center gap-2.5 rounded-full py-1.5 pr-3.5 pl-1.5',
          'bg-surface ring-border-control ring-1 ring-inset',
          'duration-fast ease-out-expo transition-all',
          'hover:ring-border-hover cursor-pointer',
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
          <span className="text-foreground text-[13px] font-semibold">
            {name}
          </span>
        </span>
        <IconComponent
          icon="RiArrowDownSLine"
          className={clsx(
            'text-secondary duration-fast size-3.5 transition-transform',
            isOpen && 'text-primary-600 rotate-180'
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
              'bg-surface-panel ring-border-control ring-1',
              'shadow-menu-panel'
            )}
          >
            <div className="border-border-control border-b px-4 py-3 pb-2">
              <p className="text-foreground truncate text-[13px] font-semibold">
                {name}
              </p>
              <p className="text-secondary truncate text-[11.5px]">{email}</p>
            </div>

            <Link
              to={profileHref as never}
              role="menuitem"
              onClick={close}
              className={clsx(
                'flex items-center gap-2.5 px-4 py-2.5',
                'text-foreground text-[13px]',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent
                icon="RiUserLine"
                className="text-secondary size-[15px]"
              />
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
                'text-foreground text-left text-[13px]',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent
                icon="RiSettings3Line"
                className="text-secondary size-[15px]"
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
                'text-foreground text-left text-[13px]',
                'hover:bg-surface-hover-row'
              )}
            >
              <IconComponent
                icon={theme === 'dark' ? 'RiSunLine' : 'RiMoonLine'}
                className="text-secondary size-[15px]"
              />
              {theme === 'dark' ? labels.themeLight : labels.themeDark}
            </button>

            <div className="bg-border-control h-px" />

            <button
              type="button"
              role="menuitem"
              onClick={() => {
                close()
                onLogoutClick()
              }}
              className={clsx(
                'flex w-full items-center gap-2.5 px-4 py-2.5',
                'text-danger-600 text-left text-[13px]',
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
