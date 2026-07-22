import { useState } from 'react'
import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { IconComponent } from '@/shared/ui'
import { useSiteConfigTranslation } from '../../i18n'
import type { HeaderConfig } from '../../model/site-config.types'

interface HeaderPreviewProps {
  config: HeaderConfig
}

// Abstract block-based preview (no sample text). The mock blocks use inline
// styles over theme CSS variables (always present in :root) so they never
// depend on Tailwind emitting brand-new utility classes.

const LOGO_STYLE: CSSProperties = {
  flexShrink: 0,
  width: 48,
  height: 16,
  borderRadius: 4,
  backgroundColor: 'var(--color-primary-600)',
}

const pillStyle = (width: number): CSSProperties => ({
  flexShrink: 0,
  width,
  height: 8,
  borderRadius: 9999,
  backgroundColor: 'var(--text-muted)',
})

const CTA_STYLE: CSSProperties = {
  flexShrink: 0,
  width: 56,
  height: 20,
  borderRadius: 9999,
  backgroundColor: 'var(--color-primary-600)',
  opacity: 0.85,
}

const HERO_STYLE: CSSProperties = {
  background:
    'linear-gradient(135deg, color-mix(in srgb, var(--color-primary-600) 28%, transparent), var(--surface-subtle))',
}

const LogoBlock = () => <span style={LOGO_STYLE} />

const MENU_WIDTHS = [36, 48, 32, 44] as const

const MenuBlocks = ({ count = 4, offset = 0 }: { count?: number; offset?: number }) => (
  <>
    {Array.from({ length: count }, (_, i) => (
      <span key={i} style={pillStyle(MENU_WIDTHS[(i + offset) % MENU_WIDTHS.length])} />
    ))}
  </>
)

const CtaBlock = () => <span style={CTA_STYLE} />

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
        {showCta ? <CtaBlock /> : <span style={{ width: 56 }} />}
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

  // Inline positioning for the transparent overlay: same rationale as the mock
  // blocks — never depend on utility classes new to the repo.
  const barClasses = clsx('px-4 py-3', !config.transparent && 'border-b border-border bg-surface')
  const barStyle: CSSProperties | undefined = config.transparent
    ? { position: 'absolute', top: 0, left: 0, right: 0 }
    : undefined

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
                'inline-flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-xs',
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

      <div className="mx-auto w-full" style={device === 'mobile' ? { maxWidth: 224 } : undefined}>
        <div className="overflow-hidden rounded-xl border border-border" style={{ position: 'relative' }}>
          <div className={barClasses} style={barStyle}>
            {device === 'desktop' ? <DesktopBar config={config} /> : <MobileBar config={config} />}
          </div>
          {/* Hero strip below/behind the header to visualize transparency */}
          <div style={{ ...HERO_STYLE, height: device === 'desktop' ? 96 : 128 }} />
        </div>
      </div>
    </div>
  )
}
