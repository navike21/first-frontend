import { useState } from 'react'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import { useSiteConfigTranslation } from '../../i18n'
import type { HeaderConfig } from '../../model/site-config.types'

interface HeaderPreviewProps {
  config: HeaderConfig
}

// Abstract block-based preview (no sample text): brand blocks = logo/CTA,
// muted pills = menu items.

const LogoBlock = () => <span className="h-4 w-12 shrink-0 rounded bg-primary-600" />

const MENU_WIDTHS = ['w-9', 'w-12', 'w-8', 'w-11'] as const

const MenuBlocks = ({ count = 4, offset = 0 }: { count?: number; offset?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <span
        key={i}
        className={clsx('h-2 shrink-0 rounded-full bg-muted', MENU_WIDTHS[(i + offset) % MENU_WIDTHS.length])}
      />
    ))}
  </>
)

const CtaBlock = () => <span className="h-5 w-14 shrink-0 rounded-full bg-primary-600/80" />

const DesktopBar = ({ config }: { config: HeaderConfig }) => {
  const showCta = config.cta.enabled

  if (config.variant === 'logo-left-menu-right') {
    return (
      <div className="flex items-center justify-between">
        <LogoBlock />
        <div className="flex items-center gap-3">
          <MenuBlocks />
          {showCta && <CtaBlock />}
        </div>
      </div>
    )
  }
  if (config.variant === 'logo-left-menu-center') {
    return (
      <div className="flex items-center justify-between">
        <LogoBlock />
        <div className="flex items-center gap-3">
          <MenuBlocks />
        </div>
        {showCta ? <CtaBlock /> : <span className="w-14" />}
      </div>
    )
  }
  if (config.variant === 'logo-center-split') {
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <MenuBlocks count={2} />
        </div>
        <LogoBlock />
        <div className="flex items-center gap-3">
          <MenuBlocks count={2} offset={2} />
          {showCta && <CtaBlock />}
        </div>
      </div>
    )
  }
  // logo-center-stacked
  return (
    <div className="flex flex-col items-center gap-2.5">
      <LogoBlock />
      <div className="flex items-center gap-3">
        <MenuBlocks />
        {showCta && <CtaBlock />}
      </div>
    </div>
  )
}

const MobileBar = ({ config }: { config: HeaderConfig }) => {
  const icon = <IconComponent icon="RiMenuLine" className="h-4 w-4 text-secondary" />
  return (
    <div className="grid grid-cols-3 items-center">
      <div className="flex items-center justify-start gap-2">
        {config.mobile.menuIconPosition === 'left' && icon}
        {config.mobile.logoPosition === 'left' && <LogoBlock />}
      </div>
      <div className="flex justify-center">{config.mobile.logoPosition === 'center' && <LogoBlock />}</div>
      <div className="flex justify-end">{config.mobile.menuIconPosition === 'right' && icon}</div>
    </div>
  )
}

export const HeaderPreview = ({ config }: HeaderPreviewProps) => {
  const { t } = useSiteConfigTranslation()
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  const barClasses = clsx(
    'px-4 py-3',
    config.transparent ? 'absolute inset-x-0 top-0 bg-transparent' : 'border-b border-border bg-surface',
  )

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.preview.title}</span>
        <div className="flex items-center gap-1">
          {(['desktop', 'mobile'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setDevice(d)}
              aria-pressed={device === d}
              className={clsx(
                'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs',
                'transition-colors',
                device === d
                  ? 'bg-primary-700/10 text-primary-600 ring-1 ring-primary-700/20'
                  : 'bg-surface-subtle text-muted hover:text-foreground',
              )}
            >
              <IconComponent icon={d === 'desktop' ? 'RiComputerLine' : 'RiSmartphoneLine'} className="h-3.5 w-3.5" />
              {d === 'desktop' ? t.preview.desktop : t.preview.mobile}
            </button>
          ))}
        </div>
      </div>

      <div className={clsx('mx-auto w-full', device === 'mobile' && 'max-w-56')}>
        <div className="relative overflow-hidden rounded-xl border border-border">
          <div className={barClasses}>
            {device === 'desktop' ? <DesktopBar config={config} /> : <MobileBar config={config} />}
          </div>
          {/* Hero strip below/behind the header to visualize transparency */}
          <div
            className={clsx(
              'bg-gradient-to-br from-primary-700/30 via-primary-600/15 to-surface-subtle',
              device === 'desktop' ? 'h-24' : 'h-32',
            )}
          />
        </div>
      </div>
    </div>
  )
}
