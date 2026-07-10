import { useState } from 'react'
import clsx from 'clsx'
import { IconComponent } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useSiteConfigTranslation } from '../../i18n'
import type { HeaderConfig } from '../../model/site-config.types'

interface HeaderPreviewProps {
  config: HeaderConfig
  language: Language
}

const LogoBlock = () => (
  <span className="rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white">LOGO</span>
)

const MenuItems = ({ items }: { items: string[] }) => (
  <>
    {items.map((item) => (
      <span key={item} className="text-[11px] font-medium text-foreground/80">
        {item}
      </span>
    ))}
  </>
)

const CtaButton = ({ label }: { label: string }) => (
  <span className="rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-semibold text-white">{label}</span>
)

interface DesktopBarProps {
  config: HeaderConfig
  menu: string[]
  cta: string
}

const DesktopBar = ({ config, menu, cta }: DesktopBarProps) => {
  const showCta = config.cta.enabled

  if (config.variant === 'logo-left-menu-right') {
    return (
      <div className="flex items-center justify-between">
        <LogoBlock />
        <div className="flex items-center gap-3">
          <MenuItems items={menu} />
          {showCta && <CtaButton label={cta} />}
        </div>
      </div>
    )
  }
  if (config.variant === 'logo-left-menu-center') {
    return (
      <div className="flex items-center justify-between">
        <LogoBlock />
        <div className="flex items-center gap-3">
          <MenuItems items={menu} />
        </div>
        {showCta ? <CtaButton label={cta} /> : <span className="w-8" />}
      </div>
    )
  }
  if (config.variant === 'logo-center-split') {
    const half = Math.ceil(menu.length / 2)
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="flex items-center gap-3">
          <MenuItems items={menu.slice(0, half)} />
        </div>
        <LogoBlock />
        <div className="flex items-center gap-3">
          <MenuItems items={menu.slice(half)} />
          {showCta && <CtaButton label={cta} />}
        </div>
      </div>
    )
  }
  // logo-center-stacked
  return (
    <div className="flex flex-col items-center gap-2">
      <LogoBlock />
      <div className="flex items-center gap-3">
        <MenuItems items={menu} />
        {showCta && <CtaButton label={cta} />}
      </div>
    </div>
  )
}

const MobileBar = ({ config }: { config: HeaderConfig }) => {
  const icon = (
    <IconComponent icon="RiMenuLine" className="h-4 w-4 text-foreground/70" />
  )
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

export const HeaderPreview = ({ config, language }: HeaderPreviewProps) => {
  const { t } = useSiteConfigTranslation()
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop')

  const menu = t.preview.sampleMenu
  const cta = config.cta.label?.[language]?.trim() || t.preview.sampleCta

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
            {device === 'desktop' ? <DesktopBar config={config} menu={menu} cta={cta} /> : <MobileBar config={config} />}
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
