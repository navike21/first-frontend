import { useState } from 'react'
import clsx from 'clsx'
import { Modal, Chip, DetailField } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { useBlogTranslation } from '../../i18n'
import {
  useCategoriesForBlogPicker,
  useTagsForBlogPicker,
  useCollaboratorsForBlogPicker,
} from '../../api/blog.queries'
import type { Post, BlogStatus } from '../../model/blog.types'

interface BlogPostDetailModalProps {
  item: Post | null
  onClose: () => void
}

const STATUS_VARIANT: Record<
  BlogStatus,
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

export const BlogPostDetailModal = ({
  item,
  onClose,
}: BlogPostDetailModalProps) => {
  const { t, language } = useBlogTranslation()
  const [viewLang, setViewLang] = useState<Language>(language)
  const { data: categoriesData } = useCategoriesForBlogPicker()
  const { data: tagsData } = useTagsForBlogPicker()
  const { data: collaboratorsData } = useCollaboratorsForBlogPicker()

  if (!item) return null

  const title = item.title[viewLang] || item.title.en
  const excerpt = item.excerpt?.[viewLang] || item.excerpt?.en
  const content = item.content[viewLang] || item.content.en
  const slug = item.slug[viewLang] || item.slug.en
  const effective = item.effectiveStatus ?? item.status

  const hasContent = (lang: Language) =>
    !!(item.title[lang]?.trim() || item.content[lang]?.trim())

  const categoryLabel = (id: string) =>
    categoriesData?.find((c) => c.id === id)?.name[language] ?? id
  const tagLabel = (id: string) =>
    tagsData?.find((tag) => tag.id === id)?.name[language] ?? id
  const authorName = collaboratorsData?.find(
    (c) => c.id === item.authorId
  )?.name

  return (
    <Modal isOpen={!!item} onClose={onClose} size="xl" title={t.table.viewItem}>
      {/* Cover */}
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
        {/* Title + status */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-lg font-bold">
              {title}
            </h3>
            {excerpt && (
              <p className="text-secondary mt-0.5 line-clamp-2 text-sm">
                {excerpt}
              </p>
            )}
          </div>
          <div className="flex shrink-0 flex-col items-end gap-2">
            <Chip size="x-small" variant={STATUS_VARIANT[effective]}>
              {t.status[effective]}
            </Chip>
            {item.status === 'scheduled' &&
              item.scheduledAt &&
              effective === 'scheduled' && (
                <span className="text-muted text-xs">
                  {t.table.scheduledFor(
                    new Date(item.scheduledAt).toLocaleString(language)
                  )}
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
          <DetailField label={t.form.slug} value={slug || undefined} />
          {authorName && (
            <DetailField label={t.form.authorId} value={authorName} />
          )}
        </div>

        {(item.categoryIds.length > 0 || item.tagIds.length > 0) && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {item.categoryIds.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {t.table.colCategories}
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.categoryIds.map((id) => (
                    <Chip key={id} size="x-small" variant="default">
                      {categoryLabel(id)}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
            {item.tagIds.length > 0 && (
              <div className="flex flex-col gap-1.5">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {t.table.colTags}
                </span>
                <div className="flex flex-wrap gap-1">
                  {item.tagIds.map((id) => (
                    <Chip key={id} size="x-small" variant="default">
                      {tagLabel(id)}
                    </Chip>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        {content && (
          <div className="flex flex-col gap-1.5">
            <span className="text-muted text-xs font-medium tracking-wide uppercase">
              {t.form.content}
            </span>
            <div
              className="prose-sm text-foreground [&_a]:text-primary-600 text-sm leading-relaxed [&_a]:underline [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        )}
      </div>
    </Modal>
  )
}
