import clsx from 'clsx'
import type { Language } from '@/shared/i18n'
import { useSiteConfigTranslation } from '../../i18n'
import type { FooterConfig } from '../../model/site-config.types'

interface FooterPreviewProps {
  config: FooterConfig
  language: Language
}

const LogoBlock = () => (
  <span className="rounded bg-primary-600 px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-white">LOGO</span>
)

const SocialDots = () => (
  <div className="flex items-center gap-1.5">
    <span className="h-3 w-3 rounded-full bg-foreground/30" />
    <span className="h-3 w-3 rounded-full bg-foreground/30" />
    <span className="h-3 w-3 rounded-full bg-foreground/30" />
  </div>
)

const NewsletterMock = ({ placeholder }: { placeholder: string }) => (
  <div className="flex items-center gap-1.5">
    <span className="flex h-6 w-32 items-center rounded-md border border-border bg-surface px-2 text-[9px] text-muted">
      {placeholder}
    </span>
    <span className="rounded-md bg-primary-600 px-2 py-1 text-[9px] font-semibold text-white">→</span>
  </div>
)

const ColumnMock = ({ title, items }: { title: string; items: string[] }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] font-semibold text-foreground/80">{title}</span>
    {items.map((item) => (
      <span key={item} className="text-[9px] text-foreground/50">
        {item}
      </span>
    ))}
  </div>
)

interface ColumnsRowProps {
  config: FooterConfig
  menu: string[]
  newsletter: string
}

const ColumnsRow = ({ config, menu, newsletter }: ColumnsRowProps) => (
  <div className={clsx('grid gap-4 px-4 py-3', config.columns === 3 ? 'grid-cols-3' : 'grid-cols-4')}>
    <div className="flex flex-col gap-1.5">
      <LogoBlock />
      <span className="text-[9px] leading-snug text-foreground/50">Lorem ipsum dolor sit amet.</span>
    </div>
    <ColumnMock title={menu[0] ?? ''} items={menu.slice(1, 3)} />
    <ColumnMock title={menu[2] ?? ''} items={menu.slice(0, 2)} />
    {config.columns === 4 && (
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold text-foreground/80">{menu[3] ?? ''}</span>
        {config.showNewsletter ? <NewsletterMock placeholder={newsletter} /> : <SocialDots />}
      </div>
    )}
  </div>
)

const BottomBar = ({ config, copyrightText }: { config: FooterConfig; copyrightText: string }) => (
  <div className="flex items-center justify-between border-t border-border px-4 py-2">
    <span className="text-[9px] text-foreground/50">{copyrightText}</span>
    {config.showSocial && <SocialDots />}
  </div>
)

export const FooterPreview = ({ config, language }: FooterPreviewProps) => {
  const { t } = useSiteConfigTranslation()

  const menu = t.preview.sampleMenu
  const copyrightText = config.copyright?.[language]?.trim() || t.preview.sampleCopyright
  const newsletter = t.preview.sampleNewsletter

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted">{t.preview.title}</span>
      <div className="overflow-hidden rounded-xl border border-border bg-surface">
        {config.variant === 'columns' && (
          <>
            <ColumnsRow config={config} menu={menu} newsletter={newsletter} />
            <BottomBar config={config} copyrightText={copyrightText} />
          </>
        )}

        {config.variant === 'centered' && (
          <div className="flex flex-col items-center gap-2 px-4 py-4">
            <LogoBlock />
            <div className="flex items-center gap-3">
              {menu.map((item) => (
                <span key={item} className="text-[10px] font-medium text-foreground/70">
                  {item}
                </span>
              ))}
            </div>
            {config.showNewsletter && <NewsletterMock placeholder={newsletter} />}
            {config.showSocial && <SocialDots />}
            <span className="text-[9px] text-foreground/50">{copyrightText}</span>
          </div>
        )}

        {config.variant === 'minimal' && (
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-[9px] text-foreground/50">{copyrightText}</span>
            {config.showSocial && <SocialDots />}
          </div>
        )}

        {config.variant === 'cta-columns' && (
          <>
            <div className="flex items-center justify-between border-b border-border bg-primary-700/10 px-4 py-3">
              <span className="text-[11px] font-semibold text-foreground">{t.preview.sampleCta}</span>
              <span className="rounded-full bg-primary-600 px-2.5 py-1 text-[10px] font-semibold text-white">
                {t.preview.sampleCta}
              </span>
            </div>
            <ColumnsRow config={config} menu={menu} newsletter={newsletter} />
            <BottomBar config={config} copyrightText={copyrightText} />
          </>
        )}
      </div>
    </div>
  )
}
