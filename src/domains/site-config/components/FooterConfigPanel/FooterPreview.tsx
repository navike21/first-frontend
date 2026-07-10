import clsx from 'clsx'
import type { CSSProperties } from 'react'
import { useSiteConfigTranslation } from '../../i18n'
import type { FooterConfig } from '../../model/site-config.types'

interface FooterPreviewProps {
  config: FooterConfig
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

const barStyle = (widthPct: number, strong?: boolean): CSSProperties => ({
  height: 8,
  borderRadius: 9999,
  width: `${widthPct}%`,
  backgroundColor: strong ? 'var(--text-muted)' : 'var(--border)',
})

const DOT_STYLE: CSSProperties = {
  width: 12,
  height: 12,
  borderRadius: 9999,
  backgroundColor: 'var(--text-muted)',
}

const CTA_STYLE: CSSProperties = {
  width: 56,
  height: 20,
  borderRadius: 9999,
  backgroundColor: 'var(--color-primary-600)',
  opacity: 0.85,
}

const LogoBlock = () => <span style={LOGO_STYLE} />

const Bar = ({ w, strong }: { w: number; strong?: boolean }) => <span style={barStyle(w, strong)} />

const SocialDots = () => (
  <div className="flex items-center gap-1.5">
    <span style={DOT_STYLE} />
    <span style={DOT_STYLE} />
    <span style={DOT_STYLE} />
  </div>
)

const NewsletterMock = () => (
  <div className="flex items-center gap-1.5">
    <span className="rounded-md border border-border bg-surface" style={{ width: 112, height: 24 }} />
    <span className="rounded-md" style={{ width: 32, height: 24, backgroundColor: 'var(--color-primary-600)', opacity: 0.85 }} />
  </div>
)

const ColumnMock = ({ seed }: { seed: number }) => {
  const widths = [75, 50, 66]
  return (
    <div className="flex flex-col gap-1.5">
      <Bar w={66} strong />
      <Bar w={widths[seed % widths.length]} />
      <Bar w={widths[(seed + 1) % widths.length]} />
    </div>
  )
}

const ColumnsRow = ({ config }: { config: FooterConfig }) => (
  <div className={clsx('grid gap-4 px-4 py-3', config.columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}>
    <div className="flex flex-col gap-1.5">
      <LogoBlock />
      <Bar w={83} />
      <Bar w={66} />
    </div>
    <ColumnMock seed={0} />
    <ColumnMock seed={1} />
    {config.columns === 4 && (
      <div className="flex flex-col gap-1.5">
        <Bar w={66} strong />
        {config.showNewsletter ? <NewsletterMock /> : <SocialDots />}
      </div>
    )}
  </div>
)

const BottomBar = ({ config }: { config: FooterConfig }) => (
  <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
    <span style={{ ...barStyle(100), width: 96 }} />
    {config.showSocial && <SocialDots />}
  </div>
)

export const FooterPreview = ({ config }: FooterPreviewProps) => {
  const { t } = useSiteConfigTranslation()

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.preview.title}</span>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {config.variant === 'columns' && (
          <>
            <ColumnsRow config={config} />
            <BottomBar config={config} />
          </>
        )}

        {config.variant === 'centered' && (
          <div className="flex flex-col items-center gap-2.5 px-4 py-4">
            <LogoBlock />
            <div className="flex items-center gap-3">
              <span style={pill(36)} />
              <span style={pill(48)} />
              <span style={pill(32)} />
              <span style={pill(44)} />
            </div>
            {config.showNewsletter && <NewsletterMock />}
            {config.showSocial && <SocialDots />}
            <span style={{ ...barStyle(100), width: 96 }} />
          </div>
        )}

        {config.variant === 'minimal' && (
          <div className="flex items-center justify-between px-4 py-3">
            <span style={{ ...barStyle(100), width: 96 }} />
            {config.showSocial && <SocialDots />}
          </div>
        )}

        {config.variant === 'cta-columns' && (
          <>
            <div
              className="flex items-center justify-between border-b border-border px-4 py-3"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary-600) 10%, transparent)' }}
            >
              <span style={{ ...barStyle(33, true) }} />
              <span style={CTA_STYLE} />
            </div>
            <ColumnsRow config={config} />
            <BottomBar config={config} />
          </>
        )}
      </div>
    </div>
  )
}

function pill(width: number): CSSProperties {
  return { flexShrink: 0, width, height: 8, borderRadius: 9999, backgroundColor: 'var(--text-muted)' }
}
