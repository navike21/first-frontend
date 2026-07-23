import { useState } from 'react'
import clsx from 'clsx'
import { Modal, Chip, DetailField } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import {
  useCategoriesForPagePicker,
  useTagsForPagePicker,
  usePagesForPicker,
  useUsersForPagePicker,
} from '../../api/pages.queries'
import type { Page, PageStatus } from '../../model/page.types'

interface PageDetailModalProps {
  item: Page | null
  onClose: () => void
}

const STATUS_VARIANT: Record<
  PageStatus,
  'success' | 'warning' | 'informative'
> = {
  published: 'success',
  scheduled: 'informative',
  draft: 'warning',
}

const langDotClass = (filled: boolean, active: boolean): string => {
  if (active) return 'bg-primary-600'
  if (filled) return 'bg-emerald-500'
  return 'bg-border'
}

const CoverPlaceholder = () => (
  <div className="from-primary-700/20 via-primary-600/10 to-surface-subtle h-full w-full bg-gradient-to-br" />
)

export const PageDetailModal = ({ item, onClose }: PageDetailModalProps) => {
  const { t, language } = usePagesTranslation()
  const [viewLang, setViewLang] = useState<Language>(language)
  const { data: categoriesData } = useCategoriesForPagePicker()
  const { data: tagsData } = useTagsForPagePicker()
  const { data: pagesData } = usePagesForPicker()
  const { data: usersData } = useUsersForPagePicker()

  if (!item) return null

  const title = item.title[viewLang] || item.title.en
  const effective = item.effectiveStatus ?? item.status
  const parent = pagesData?.find((p) => p.id === item.parentId)

  const userName = (id: string | undefined) => {
    if (!id) return t.form.unknownUser
    const user = usersData?.find((u) => u.id === id)
    return user ? `${user.firstName} ${user.lastName}` : t.form.unknownUser
  }

  const hasContent = (lang: Language) => !!item.title[lang]?.trim()

  return (
    <Modal isOpen={!!item} onClose={onClose} size="xl" title={t.table.viewItem}>
      <div className="-mx-6 -mt-5 mb-5 overflow-hidden">
        {item.coverImageUrl ? (
          <img
            src={item.coverImageUrl}
            alt={title}
            className="aspect-[16/7] w-full object-cover"
          />
        ) : (
          <div className="aspect-[16/7] w-full">
            <CoverPlaceholder />
          </div>
        )}
      </div>

      <div className="space-y-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-lg font-bold">
              {title}
            </h3>
            {item.fullPath?.[viewLang] && (
              <p className="text-muted mt-0.5 truncate font-mono text-xs">
                /{item.fullPath[viewLang]}
              </p>
            )}
          </div>
          <Chip size="x-small" variant={STATUS_VARIANT[effective]}>
            {t.status[effective]}
          </Chip>
        </div>

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

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <DetailField
            label={t.form.parent}
            value={
              parent
                ? parent.title[language] || parent.title.en
                : t.form.noParent
            }
          />
          {item.status === 'scheduled' && item.scheduledAt && (
            <DetailField
              label={t.form.scheduledAt}
              value={new Date(item.scheduledAt).toLocaleString(language)}
            />
          )}
          <DetailField
            label={t.form.createdBy}
            value={userName(item.createdBy)}
          />
          <DetailField
            label={t.form.updatedBy}
            value={userName(item.updatedBy)}
          />
        </div>

        {item.categoryIds.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-muted text-xs font-medium tracking-wide uppercase">
              {t.form.categoryIds}
            </span>
            <div className="flex flex-wrap gap-1">
              {item.categoryIds.map((id) => (
                <Chip key={id} size="small" variant="default">
                  {categoriesData?.find((c) => c.id === id)?.name[language] ??
                    id}
                </Chip>
              ))}
            </div>
          </div>
        )}

        {item.tagIds.length > 0 && (
          <div className="flex flex-col gap-1.5">
            <span className="text-muted text-xs font-medium tracking-wide uppercase">
              {t.form.tagIds}
            </span>
            <div className="flex flex-wrap gap-1">
              {item.tagIds.map((id) => (
                <Chip key={id} size="small" variant="default">
                  {tagsData?.find((tag) => tag.id === id)?.name[language] ?? id}
                </Chip>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
