import clsx from 'clsx'
import { useSiteConfigTranslation } from '../../i18n'
import type { FooterConfig } from '../../model/site-config.types'

interface FooterPreviewProps {
  config: FooterConfig
}

// Abstract block-based preview (no sample text): brand blocks = logo/CTA,
// muted bars = headings/links/copyright.

const LogoBlock = () => <span className="h-4 w-12 shrink-0 rounded bg-primary-600" />

const Bar = ({ w, strong }: { w: string; strong?: boolean }) => (
  <span className={clsx('h-2 rounded-full', strong ? 'bg-muted' : 'bg-border', w)} />
)

const SocialDots = () => (
  <div className="flex items-center gap-1.5">
    <span className="h-3 w-3 rounded-full bg-muted" />
    <span className="h-3 w-3 rounded-full bg-muted" />
    <span className="h-3 w-3 rounded-full bg-muted" />
  </div>
)

const NewsletterMock = () => (
  <div className="flex items-center gap-1.5">
    <span className="h-6 w-28 rounded-md border border-border bg-surface" />
    <span className="h-6 w-8 rounded-md bg-primary-600/80" />
  </div>
)

const ColumnMock = ({ seed }: { seed: number }) => {
  const widths = ['w-3/4', 'w-1/2', 'w-2/3']
  return (
    <div className="flex flex-col gap-1.5">
      <Bar w="w-2/3" strong />
      <Bar w={widths[seed % widths.length]} />
      <Bar w={widths[(seed + 1) % widths.length]} />
    </div>
  )
}

const ColumnsRow = ({ config }: { config: FooterConfig }) => (
  <div className={clsx('grid gap-4 px-4 py-3', config.columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}>
    <div className="flex flex-col gap-1.5">
      <LogoBlock />
      <Bar w="w-5/6" />
      <Bar w="w-2/3" />
    </div>
    <ColumnMock seed={0} />
    <ColumnMock seed={1} />
    {config.columns === 4 && (
      <div className="flex flex-col gap-1.5">
        <Bar w="w-2/3" strong />
        {config.showNewsletter ? <NewsletterMock /> : <SocialDots />}
      </div>
    )}
  </div>
)

const BottomBar = ({ config }: { config: FooterConfig }) => (
  <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
    <Bar w="w-24" />
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
              <Bar w="w-9" />
              <Bar w="w-12" />
              <Bar w="w-8" />
              <Bar w="w-11" />
            </div>
            {config.showNewsletter && <NewsletterMock />}
            {config.showSocial && <SocialDots />}
            <Bar w="w-24" />
          </div>
        )}

        {config.variant === 'minimal' && (
          <div className="flex items-center justify-between px-4 py-3">
            <Bar w="w-24" />
            {config.showSocial && <SocialDots />}
          </div>
        )}

        {config.variant === 'cta-columns' && (
          <>
            <div className="flex items-center justify-between border-b border-border bg-primary-700/10 px-4 py-3">
              <Bar w="w-1/3" strong />
              <span className="h-5 w-14 rounded-full bg-primary-600/80" />
            </div>
            <ColumnsRow config={config} />
            <BottomBar config={config} />
          </>
        )}
      </div>
    </div>
  )
}
