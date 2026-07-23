import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'
import { Drawer } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import {
  analyzePageSeo,
  SOCIAL_IMAGE_MIN_WIDTH,
  SOCIAL_IMAGE_MIN_HEIGHT,
} from '../../model/page.seo'
import type { SeoCheck, SeoCheckStatus, SeoLight } from '../../model/page.seo'
import type { Page } from '../../model/page.types'
import type { PageTranslations } from '../../i18n/types'
import { SeoLengthBar } from '../PageSeoPreview'

export interface PageSeoDrawerProps {
  item: Page | null
  onClose: () => void
}

const DOT_CLASS: Record<SeoCheckStatus, string> = {
  good: 'bg-emerald-500',
  warning: 'bg-amber-500',
  bad: 'bg-red-500',
}

const LIGHT_CLASS: Record<SeoLight, string> = {
  green: 'bg-emerald-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
}

interface CheckGroupProps {
  title: string
  status: SeoCheckStatus
  checks: SeoCheck[]
  labels: PageTranslations['seo']['checks']
}

const CheckGroup = ({ title, status, checks, labels }: CheckGroupProps) => {
  if (checks.length === 0) return null
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-muted text-xs font-semibold tracking-wide uppercase">
        {title}
      </span>
      <ul className="flex flex-col gap-1">
        {checks.map((check) => (
          <li key={check.id} className="flex items-start gap-2">
            <span
              className={clsx(
                'mt-1.5 h-2 w-2 shrink-0 rounded-full',
                DOT_CLASS[status]
              )}
            />
            <span className="text-foreground text-sm">{labels[check.id]}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const PageSeoDrawer = ({ item, onClose }: PageSeoDrawerProps) => {
  const { t, language } = usePagesTranslation()
  const [viewLang, setViewLang] = useState<Language>(language)
  const [imageDims, setImageDims] = useState<{
    width: number
    height: number
  } | null>(null)
  const [analyzedId, setAnalyzedId] = useState<string | null>(null)
  const [measuredUrl, setMeasuredUrl] = useState('')

  // Reset to the user's language each time a page is opened for analysis
  // (state adjusted during render instead of inside an effect).
  if (item && item.id !== analyzedId) {
    setAnalyzedId(item.id)
    setViewLang(language)
  }

  const analysis = item ? analyzePageSeo(item, viewLang) : null
  const socialImageUrl = analysis?.socialImageUrl ?? ''

  if (socialImageUrl !== measuredUrl) {
    setMeasuredUrl(socialImageUrl)
    setImageDims(null)
  }

  useEffect(() => {
    if (!socialImageUrl) return
    const img = new Image()
    img.onload = () =>
      setImageDims({ width: img.naturalWidth, height: img.naturalHeight })
    img.src = socialImageUrl
  }, [socialImageUrl])

  const imageBigEnough =
    !!imageDims &&
    imageDims.width >= SOCIAL_IMAGE_MIN_WIDTH &&
    imageDims.height >= SOCIAL_IMAGE_MIN_HEIGHT

  // Portal to <body>: the page content sits inside animated (transformed)
  // containers, which would otherwise turn the drawer's fixed positioning
  // into a clipped, mispositioned floating panel.
  return createPortal(
    <Drawer
      isOpen={!!item}
      onClose={onClose}
      placement="right"
      className="w-full max-w-lg"
      title={
        <span className="text-foreground text-sm font-semibold">
          {t.seo.drawerTitle}
        </span>
      }
    >
      {item && analysis && (
        <div className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-2">
            <p className="text-foreground truncate text-base font-semibold">
              {item.title[viewLang] || item.title.en}
            </p>
            <div className="flex items-center gap-3">
              <span
                className={clsx(
                  'h-3.5 w-3.5 rounded-full',
                  LIGHT_CLASS[analysis.light]
                )}
              />
              <span className="text-foreground text-2xl font-bold">
                {analysis.score}%
              </span>
              <span className="text-secondary text-xs">
                {t.seo.summary(
                  analysis.goodCount,
                  analysis.warningCount,
                  analysis.badCount
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = lang === viewLang
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setViewLang(lang)}
                  className={clsx(
                    'inline-flex cursor-pointer items-center rounded-md px-2 py-1 text-xs font-semibold tracking-wider uppercase transition-colors',
                    active
                      ? 'bg-primary-700/10 text-primary-600 ring-primary-700/20 ring-1'
                      : 'bg-surface-subtle text-muted hover:text-foreground'
                  )}
                >
                  {lang}
                </button>
              )
            })}
          </div>

          <div className="border-border bg-surface-subtle flex flex-col gap-1 rounded-lg border px-3 py-2">
            <span className="text-muted text-[10px] font-medium tracking-wide uppercase">
              {t.seo.focusKeyword}
            </span>
            {analysis.focusKeyword ? (
              <span className="text-foreground text-sm font-medium">
                {analysis.focusKeyword}
              </span>
            ) : (
              <span className="text-xs text-amber-500">{t.seo.noKeyword}</span>
            )}
          </div>

          <div className="flex flex-col gap-3">
            <SeoLengthBar
              label={t.form.metaTitle}
              metric={analysis.metaTitle}
              charsLabel={t.seo.charsCount(
                analysis.metaTitle.length,
                analysis.metaTitle.min,
                analysis.metaTitle.max
              )}
            />
            <SeoLengthBar
              label={t.form.metaDescription}
              metric={analysis.metaDescription}
              charsLabel={t.seo.charsCount(
                analysis.metaDescription.length,
                analysis.metaDescription.min,
                analysis.metaDescription.max
              )}
            />
          </div>

          <div className="flex flex-col gap-4">
            <CheckGroup
              title={t.seo.groupProblems}
              status="bad"
              checks={analysis.checks.filter((c) => c.status === 'bad')}
              labels={t.seo.checks}
            />
            <CheckGroup
              title={t.seo.groupImprovements}
              status="warning"
              checks={analysis.checks.filter((c) => c.status === 'warning')}
              labels={t.seo.checks}
            />
            <CheckGroup
              title={t.seo.groupGood}
              status="good"
              checks={analysis.checks.filter((c) => c.status === 'good')}
              labels={t.seo.checks}
            />
          </div>

          {socialImageUrl && imageDims && (
            <p
              className={clsx(
                'text-xs',
                imageBigEnough ? 'text-emerald-500' : 'text-amber-500'
              )}
            >
              {t.seo.imageSize(imageDims.width, imageDims.height)} —{' '}
              {t.seo.imageSizeHint}
            </p>
          )}
        </div>
      )}
    </Drawer>,
    document.body
  )
}
