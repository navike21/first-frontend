import { useState } from 'react'
import clsx from 'clsx'
import { Modal, Chip, DetailField } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useServicesTranslation } from '../../i18n'
import type { Service } from '../../model/service.types'

interface ServiceDetailModalProps {
  service: Service | null
  onClose: () => void
}

const langDotClass = (filled: boolean, active: boolean): string => {
  if (active) return 'bg-primary-600'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}

const CoverPlaceholder = () => (
  <div className="from-primary-700/20 via-primary-600/10 to-surface-subtle h-full w-full bg-gradient-to-br" />
)

export const ServiceDetailModal = ({
  service,
  onClose,
}: ServiceDetailModalProps) => {
  const { t, language } = useServicesTranslation()
  const [viewLang, setViewLang] = useState<Language>(language)

  if (!service) return null

  const name = service.name[viewLang] || service.name.en
  const shortDesc =
    service.shortDescription[viewLang] || service.shortDescription.en
  const desc = service.description[viewLang] || service.description.en

  const hasContent = (lang: Language) =>
    !!(service.name[lang]?.trim() || service.shortDescription[lang]?.trim())

  return (
    <Modal
      isOpen={!!service}
      onClose={onClose}
      size="xl"
      title={t.table.viewService}
    >
      {/* ── Cover image — full-width bleed ── */}
      <div className="-mx-6 -mt-5 mb-5 overflow-hidden">
        {service.coverImageUrl ? (
          <img
            src={service.coverImageUrl}
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
        {/* ── Name + status + icon ── */}
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
            <Chip
              size="x-small"
              variant={service.status === 'active' ? 'success' : 'default'}
            >
              {t.status[service.status]}
            </Chip>
            {service.icon && (
              <img
                src={service.icon}
                alt={name}
                className="border-border bg-surface-subtle h-9 w-9 rounded-md border object-contain p-1"
              />
            )}
          </div>
        </div>

        {/* ── Language switcher ── */}
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

        {/* ── Data grid ── */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DetailField
            label={t.form.slug}
            value={service.slug[viewLang] || service.slug.en || undefined}
          />
          <DetailField label={t.form.order} value={service.order} />
          <DetailField
            label={t.form.tags}
            value={service.tags.length ? service.tags.join(', ') : undefined}
          />
          <DetailField
            label={t.form.pillars}
            value={
              service.pillars.length
                ? service.pillars.map((p) => t.pillars[p]).join(', ')
                : undefined
            }
          />
        </div>

        {/* ── Description ── */}
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
