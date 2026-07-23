import { useState } from 'react'
import clsx from 'clsx'
import { Modal, Chip, DetailField } from '@/shared/ui'
import { formatDate } from '@/shared/lib/formatDate'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePortfolioTranslation } from '../../i18n'
import type { Portfolio } from '../../model/portfolio.types'

interface PortfolioDetailModalProps {
  item: Portfolio | null
  onClose: () => void
}

const STATUS_VARIANT = {
  published: 'success',
  draft: 'warning',
  archived: 'default',
} as const

const langDotClass = (filled: boolean, active: boolean): string => {
  if (active) return 'bg-primary-600'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}

const CoverPlaceholder = () => (
  <div className="from-primary-700/20 via-primary-600/10 to-surface-subtle h-full w-full bg-gradient-to-br" />
)

export const PortfolioDetailModal = ({
  item,
  onClose,
}: PortfolioDetailModalProps) => {
  const { t, language } = usePortfolioTranslation()
  const [viewLang, setViewLang] = useState<Language>(language)

  if (!item) return null

  const name = item.name[viewLang] || item.name.en
  const shortDesc = item.shortDescription[viewLang] || item.shortDescription.en
  const desc = item.description[viewLang] || item.description.en

  const hasContent = (lang: Language) =>
    !!(item.name[lang]?.trim() || item.shortDescription[lang]?.trim())

  return (
    <Modal isOpen={!!item} onClose={onClose} size="xl" title={t.table.viewItem}>
      {/* Cover */}
      <div className="-mx-6 -mt-5 mb-5 overflow-hidden">
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt={name}
            className="aspect-[16/7] w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/7] w-full">
            <CoverPlaceholder />
          </div>
        )}
      </div>

      <div className="space-y-5">
        {/* Name + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-lg font-bold">
              {name}
            </h3>
            <p className="text-secondary mt-0.5 line-clamp-2 text-sm">
              {shortDesc}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Chip size="x-small" variant={STATUS_VARIANT[item.status]}>
              {t.status[item.status]}
            </Chip>
            {item.featured && (
              <span className="text-primary-600 text-xs font-medium">
                ★ Featured
              </span>
            )}
          </div>
        </div>

        {/* Language switcher */}
        <div className="flex flex-col gap-2">
          <span className="text-muted text-xs font-medium tracking-wide uppercase">
            {t.form.tabTranslations}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const active = lang === viewLang
              const filled = hasContent(lang)
              return (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setViewLang(lang)}
                  className={clsx(
                    'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold tracking-wider uppercase transition-colors',
                    active
                      ? 'bg-primary-700/10 text-primary-600 ring-primary-700/20 ring-1'
                      : 'bg-surface-subtle text-muted hover:text-foreground'
                  )}
                >
                  {lang}
                  <span
                    className={clsx(
                      'h-1.5 w-1.5 rounded-full',
                      langDotClass(filled, active)
                    )}
                  />
                </button>
              )
            })}
          </div>
        </div>

        {/* Data grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DetailField label={t.form.slug} value={item.slug || undefined} />
          <DetailField
            label={t.form.startDate}
            value={formatDate(item.startDate)}
          />
          {item.endDate && (
            <DetailField
              label={t.form.endDate}
              value={formatDate(item.endDate)}
            />
          )}
          <DetailField label={t.form.order} value={item.order} />
          {item.projectUrl && (
            <DetailField label={t.form.projectUrl} value={item.projectUrl} />
          )}
          {item.technologies.length > 0 && (
            <DetailField
              label={t.form.technologies}
              value={item.technologies.join(', ')}
            />
          )}
        </div>

        {/* Description */}
        {desc && (
          <div className="flex flex-col gap-1.5">
            <span className="text-muted text-xs font-medium tracking-wide uppercase">
              {t.form.description}
            </span>
            <div
              className="prose-sm text-foreground [&_a]:text-primary-600 text-sm leading-relaxed [&_a]:underline [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4"
              dangerouslySetInnerHTML={{ __html: desc }}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}
