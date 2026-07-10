import clsx from 'clsx'
import { Avatar, Button, Modal, Spinner } from '@/shared/ui'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { PageTranslations } from '../../i18n/types'
import {
  usePage,
  usePagesForPicker,
  useCategoriesForPagePicker,
  useTagsForPagePicker,
  useUsersForPagePicker,
} from '../../api/pages.queries'
import type { Page, PageLocalizedString, PageRevision } from '../../model/page.types'

export interface PageRevisionCompareModalProps {
  pageId: string
  revision: PageRevision | null
  onClose: () => void
  onRestore: (revision: PageRevision) => void
}

interface DiffRow {
  id: string
  label: string
  from: string
  to: string
  kind?: 'text' | 'image'
}

interface DiffContext {
  t: PageTranslations
  language: Language
  parentName: (id: string | null | undefined) => string
  categoryNames: (ids: string[]) => string
  tagNames: (ids: string[]) => string
}

// Revision snapshots store the full page document, so the comparison shapes
// the snapshot into a Page and diffs it field by field against the live page.
function snapshotToPage(revision: PageRevision): Page {
  const snapshot = revision.snapshot as Partial<Page>
  return {
    ...snapshot,
    id: revision.pageId,
    slug: snapshot.slug ?? ({} as PageLocalizedString),
    fullPath: snapshot.fullPath ?? ({} as PageLocalizedString),
    title: snapshot.title ?? ({} as PageLocalizedString),
    status: snapshot.status ?? 'draft',
    categoryIds: snapshot.categoryIds ?? [],
    tagIds: snapshot.tagIds ?? [],
  }
}

function sectionsOf(page: Page): unknown[] {
  return (page as unknown as { sections?: unknown[] }).sections ?? []
}

function addLocalizedDiffs(
  rows: DiffRow[],
  id: string,
  label: string,
  current: Partial<Record<Language, string>> | undefined,
  snapshot: Partial<Record<Language, string>> | undefined,
): void {
  for (const lang of SUPPORTED_LANGUAGES) {
    const from = current?.[lang]?.trim() ?? ''
    const to = snapshot?.[lang]?.trim() ?? ''
    if (from !== to) rows.push({ id: `${id}.${lang}`, label: `${label} · ${lang.toUpperCase()}`, from, to })
  }
}

function buildDiffRows(current: Page, snapshot: Page, ctx: DiffContext): DiffRow[] {
  const { t, language } = ctx
  const rows: DiffRow[] = []

  addLocalizedDiffs(rows, 'title', t.form.title, current.title, snapshot.title)
  addLocalizedDiffs(rows, 'slug', t.form.slug, current.slug, snapshot.slug)
  addLocalizedDiffs(rows, 'description', t.form.description, current.description, snapshot.description)
  addLocalizedDiffs(rows, 'metaTitle', t.form.metaTitle, current.seo?.metaTitle, snapshot.seo?.metaTitle)
  addLocalizedDiffs(
    rows,
    'metaDescription',
    t.form.metaDescription,
    current.seo?.metaDescription,
    snapshot.seo?.metaDescription,
  )
  addLocalizedDiffs(rows, 'keywords', t.form.keywords, current.seo?.keywords, snapshot.seo?.keywords)

  if (current.status !== snapshot.status) {
    rows.push({ id: 'status', label: t.form.status, from: t.status[current.status], to: t.status[snapshot.status] })
  }

  const fromScheduled = current.scheduledAt ? new Date(current.scheduledAt).toLocaleString(language) : ''
  const toScheduled = snapshot.scheduledAt ? new Date(snapshot.scheduledAt).toLocaleString(language) : ''
  if (fromScheduled !== toScheduled) {
    rows.push({ id: 'scheduledAt', label: t.form.scheduledAt, from: fromScheduled, to: toScheduled })
  }

  if ((current.parentId ?? '') !== (snapshot.parentId ?? '')) {
    rows.push({
      id: 'parent',
      label: t.form.parent,
      from: ctx.parentName(current.parentId),
      to: ctx.parentName(snapshot.parentId),
    })
  }

  const fromCategories = ctx.categoryNames(current.categoryIds)
  const toCategories = ctx.categoryNames(snapshot.categoryIds)
  if (fromCategories !== toCategories) {
    rows.push({ id: 'categories', label: t.form.categoryIds, from: fromCategories, to: toCategories })
  }

  const fromTags = ctx.tagNames(current.tagIds)
  const toTags = ctx.tagNames(snapshot.tagIds)
  if (fromTags !== toTags) {
    rows.push({ id: 'tags', label: t.form.tagIds, from: fromTags, to: toTags })
  }

  if ((current.coverImageUrl ?? '') !== (snapshot.coverImageUrl ?? '')) {
    rows.push({
      id: 'cover',
      label: t.form.cover,
      from: current.coverImageUrl ?? '',
      to: snapshot.coverImageUrl ?? '',
      kind: 'image',
    })
  }

  if ((current.seo?.ogImage ?? '') !== (snapshot.seo?.ogImage ?? '')) {
    rows.push({
      id: 'ogImage',
      label: t.form.ogImage,
      from: current.seo?.ogImage ?? '',
      to: snapshot.seo?.ogImage ?? '',
    })
  }

  const fromSections = sectionsOf(current)
  const toSections = sectionsOf(snapshot)
  if (JSON.stringify(fromSections) !== JSON.stringify(toSections)) {
    rows.push({
      id: 'sections',
      label: t.revisions.fieldSections,
      from: t.revisions.sectionsCount(fromSections.length),
      to: t.revisions.sectionsCount(toSections.length),
    })
  }

  return rows
}

interface DiffLineProps {
  side: 'from' | 'to'
  sideLabel: string
  value: string
  kind?: 'text' | 'image'
}

// Unified git-style diff line: "−" is the current version (brand color),
// "+" is the restorable revision (amber).
const DiffLine = ({ side, sideLabel, value, kind }: DiffLineProps) => (
  <div
    className={clsx(
      'flex items-start gap-2 rounded-md px-3 py-1.5',
      side === 'from' ? 'bg-primary-700/10' : 'bg-amber-500/10',
    )}
  >
    <span
      aria-label={sideLabel}
      title={sideLabel}
      className={clsx(
        'select-none font-mono text-sm font-bold leading-5',
        side === 'from' ? 'text-primary-600' : 'text-amber-500',
      )}
    >
      {side === 'from' ? '−' : '+'}
    </span>
    {kind === 'image' && value ? (
      <img src={value} alt={sideLabel} className="h-14 w-24 rounded object-cover" />
    ) : (
      <p
        className={clsx(
          'min-w-0 flex-1 whitespace-pre-wrap break-words text-sm leading-5',
          value ? 'text-foreground' : 'text-muted',
        )}
      >
        {value || '—'}
      </p>
    )}
  </div>
)

export const PageRevisionCompareModal = ({ pageId, revision, onClose, onRestore }: PageRevisionCompareModalProps) => {
  const { t, language } = usePagesTranslation()
  const { data: current, isLoading } = usePage(pageId)
  const { data: pagesData } = usePagesForPicker()
  const { data: categoriesData } = useCategoriesForPagePicker()
  const { data: tagsData } = useTagsForPagePicker()
  const { data: usersData } = useUsersForPagePicker()

  if (!revision) return null

  const parentName = (id: string | null | undefined): string => {
    if (!id) return t.form.noParent
    const parent = pagesData?.find((p) => p.id === id)
    return parent ? parent.title[language] || parent.title.en : id
  }
  const categoryNames = (ids: string[]): string =>
    ids.map((id) => categoriesData?.find((c) => c.id === id)?.name[language] ?? id).join(', ')
  const tagNames = (ids: string[]): string =>
    ids.map((id) => tagsData?.find((tag) => tag.id === id)?.name[language] ?? id).join(', ')

  const author = usersData?.find((u) => u.id === revision.createdBy)
  const authorName = author ? `${author.firstName} ${author.lastName}` : t.form.unknownUser

  const rows = current
    ? buildDiffRows(current, snapshotToPage(revision), { t, language, parentName, categoryNames, tagNames })
    : []

  return (
    <Modal
      isOpen={!!revision}
      onClose={onClose}
      size="lg"
      title={t.revisions.previewTitle(new Date(revision.createdAt).toLocaleString(language))}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t.revisions.cancel}
          </Button>
          <Button variant="primary" onClick={() => onRestore(revision)}>
            {t.revisions.restore}
          </Button>
        </>
      }
    >
      <div className="mb-4 flex items-center gap-2">
        <Avatar
          size="sm"
          name={authorName}
          {...(author?.profilePictureUrl && { src: author.profilePictureUrl })}
        />
        <span className="text-sm text-secondary">{t.revisions.by(authorName)}</span>
      </div>

      {isLoading && (
        <div className="flex justify-center py-8">
          <Spinner variant="gradient" size="medium" />
        </div>
      )}

      {!isLoading && current && rows.length === 0 && <p className="text-sm text-secondary">{t.revisions.noChanges}</p>}

      {!isLoading && current && rows.length > 0 && (
        <div className="flex flex-col">
          <span className="border-b border-border pb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            {t.revisions.changesCount(rows.length)}
          </span>
          <div className="flex flex-col divide-y divide-border">
            {rows.map((row) => (
              <div key={row.id} className="flex flex-col gap-1 py-3">
                <span className="text-xs font-medium uppercase tracking-wide text-muted">{row.label}</span>
                <DiffLine
                  side="from"
                  sideLabel={t.revisions.compareCurrent}
                  value={row.from}
                  {...(row.kind && { kind: row.kind })}
                />
                <DiffLine
                  side="to"
                  sideLabel={t.revisions.compareRevision}
                  value={row.to}
                  {...(row.kind && { kind: row.kind })}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}
