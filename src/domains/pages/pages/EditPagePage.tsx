import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner, DetailField } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { PageForm } from '../components/PageForm'
import { PageRevisionsPanel } from '../components/PageRevisionsPanel'
import { usePage, useUpdatePage, useUsersForPagePicker } from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'
import { toPagePayload } from '../model/page.schema'
import type { PageFormData } from '../model/page.schema'
import type { Page } from '../model/page.types'

function toLocalDateTimeInput(iso: string | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toFormValues(item: Page): Partial<PageFormData> {
  return {
    title: item.title,
    slug: item.slug,
    seoMetaTitle: item.seo?.metaTitle ?? undefined,
    seoMetaDescription: item.seo?.metaDescription ?? undefined,
    seoKeywords: item.seo?.keywords ?? undefined,
    seoOgImage: item.seo?.ogImage ?? '',
    parentId: item.parentId ?? '',
    status: item.status,
    scheduledAt: toLocalDateTimeInput(item.scheduledAt),
    categoryIds: item.categoryIds,
    tagIds: item.tagIds,
  }
}

export const EditPagePage = () => {
  const navigate = useNavigate()
  const { t, language } = usePagesTranslation()
  const { pageId } = useParams({ strict: false }) as { pageId: string }
  const { data: item, isLoading } = usePage(pageId)
  const updatePage = useUpdatePage(pageId)
  const { data: usersData } = useUsersForPagePicker()

  const handleUpdate = (data: PageFormData, cover?: File | null, removeCover?: boolean, ogImage?: File | null) => {
    updatePage.mutate(
      { data: toPagePayload(data), cover, removeCover, ogImage },
      {
        onSuccess: () => {
          notify.success(t.toasts.updated)
          navigate({ to: navPaths.pages(language) as never })
        },
        onError: onQueuedOr(() => navigate({ to: navPaths.pages(language) as never })),
      },
    )
  }

  if (isLoading || !item) {
    return (
      <PageContent title={t.page.editTitle} description={t.page.editTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  const userName = (id: string | undefined) => {
    if (!id) return t.form.unknownUser
    const user = usersData?.find((u) => u.id === id)
    return user ? `${user.firstName} ${user.lastName}` : t.form.unknownUser
  }

  return (
    <PageContent title={t.page.editTitle} description={t.page.editDescription(item.title[language] || item.title.en)}>
      <div className="mb-4 grid grid-cols-1 gap-4 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2">
        <DetailField label={t.form.createdBy} value={userName(item.createdBy)} />
        <DetailField label={t.form.updatedBy} value={userName(item.updatedBy)} />
      </div>

      <PageForm
        mode="edit"
        pageId={item.id}
        initialValues={toFormValues(item)}
        initialCoverUrl={item.coverImageUrl}
        isSubmitting={updatePage.isPending}
        submitError={updatePage.error}
        onCancel={() => navigate({ to: navPaths.pages(language) as never })}
        onSubmit={handleUpdate}
      />

      <div className="mt-4">
        <PageRevisionsPanel pageId={item.id} />
      </div>
    </PageContent>
  )
}
