import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { PageForm } from '../components/PageForm'
import { useCreatePage } from '../api/pages.queries'
import { usePagesTranslation } from '../i18n'
import { toPagePayload } from '../model/page.schema'
import type { PageFormData } from '../model/page.schema'

export const CreatePagePage = () => {
  const navigate = useNavigate()
  const { t, language } = usePagesTranslation()
  const createPage = useCreatePage()

  const handleCreate = (
    data: PageFormData,
    cover?: File | null,
    _removeCover?: boolean,
    ogImage?: File | null,
    coverLibraryUrl?: string
  ) => {
    createPage.mutate(
      { data: toPagePayload(data), cover, ogImage, coverLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          // 2xx with warnings = record saved but an image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.pages(language) as never })
        },
        // Offline: the page is queued (without its images). Soft success —
        // warn the images were skipped and go back to the list.
        onError: onQueuedOr(() => {
          if (cover || ogImage) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.pages(language) as never })
        }),
      }
    )
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <PageForm
        mode="create"
        isSubmitting={createPage.isPending}
        submitError={createPage.error}
        onCancel={() => navigate({ to: navPaths.pages(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
