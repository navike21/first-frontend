import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { PortfolioForm } from '../components/PortfolioForm'
import { useCreatePortfolio } from '../api/portfolio.queries'
import { usePortfolioTranslation } from '../i18n'
import { toPortfolioPayload } from '../model/portfolio.schema'
import type { PortfolioFormData, GalleryOrderToken } from '../model/portfolio.schema'

export const CreatePortfolioPage = () => {
  const navigate = useNavigate()
  const { t, language } = usePortfolioTranslation()
  const createPortfolio = useCreatePortfolio()

  const handleCreate = (
    data: PortfolioFormData,
    cover?: File | null,
    _removeCover?: boolean,
    galleryFiles?: File[],
    _galleryOrder?: GalleryOrderToken[],
    coverLibraryUrl?: string,
  ) => {
    createPortfolio.mutate(
      { data: toPortfolioPayload(data, language), cover, galleryFiles, coverLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          // 2xx with warnings = record saved but an image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.portfolio(language) as never })
        },
        // Offline: the portfolio item is queued (without its images). Soft
        // success — warn the images were skipped and go back to the list.
        onError: onQueuedOr(() => {
          if (cover || galleryFiles?.length) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.portfolio(language) as never })
        }),
      },
    )
  }

  return (
    <PageContent title={t.page.createTitle} description={t.page.createDescription}>
      <PortfolioForm
        mode="create"
        isSubmitting={createPortfolio.isPending}
        submitError={createPortfolio.error}
        onCancel={() => navigate({ to: navPaths.portfolio(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
