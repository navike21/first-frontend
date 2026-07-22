import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { SUPPORTED_LANGUAGES } from '@/shared/i18n'
import type { Language } from '@/shared/i18n'
import { PortfolioForm } from '../components/PortfolioForm'
import { usePortfolioById, useUpdatePortfolio } from '../api/portfolio.queries'
import { usePortfolioTranslation } from '../i18n'
import { toPortfolioPayload } from '../model/portfolio.schema'
import type { PortfolioFormData, GalleryOrderToken } from '../model/portfolio.schema'
import type { Portfolio } from '../model/portfolio.types'

const EMPTY_LANGS = Object.fromEntries(SUPPORTED_LANGUAGES.map((l) => [l, ''])) as Record<Language, string>

function toFormValues(item: Portfolio): Partial<PortfolioFormData> {
  const existingSlug = typeof item.slug === 'string' ? item.slug : ''
  const slugByLang = typeof item.slug === 'object'
    ? (item.slug as Record<Language, string>)
    : { ...EMPTY_LANGS, en: existingSlug }
  return {
    slug: slugByLang,
    name: item.name,
    shortDescription: item.shortDescription,
    description: item.description,
    serviceIds: item.serviceIds,
    clientId: item.clientId ?? '',
    technologies: item.technologies ?? [],
    projectUrl: item.projectUrl ?? '',
    startDate: item.startDate,
    endDate: item.endDate ?? '',
    featured: item.featured,
    order: item.order,
    status: item.status,
  }
}

export const EditPortfolioPage = () => {
  const navigate = useNavigate()
  const { t, language } = usePortfolioTranslation()
  const { portfolioId } = useParams({ strict: false }) as { portfolioId: string }
  const { data: item, isLoading } = usePortfolioById(portfolioId)
  const updatePortfolio = useUpdatePortfolio(item?.id ?? '')

  const handleUpdate = (
    data: PortfolioFormData,
    cover?: File | null,
    removeCover?: boolean,
    galleryFiles?: File[],
    galleryOrder?: GalleryOrderToken[],
    coverLibraryUrl?: string,
  ) => {
    updatePortfolio.mutate(
      { data: toPortfolioPayload(data, language), cover, removeCover, galleryFiles, galleryOrder, coverLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.updated)
          // 2xx with warnings = record saved but an image upload failed.
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.portfolio(language) as never })
        },
        // Offline: the edit is queued (without its images). Soft success —
        // warn the images were skipped and go back to the list.
        onError: onQueuedOr(() => {
          if (cover || galleryFiles?.length) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.portfolio(language) as never })
        }),
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

  return (
    <PageContent
      title={t.page.editTitle}
      description={t.page.editDescription(item.name[language] || item.name.en)}
    >
      <PortfolioForm
        mode="edit"
        initialValues={toFormValues(item)}
        initialCoverUrl={item.coverImageUrl}
        initialGalleryUrls={item.gallery}
        isSubmitting={updatePortfolio.isPending}
        submitError={updatePortfolio.error}
        onCancel={() => navigate({ to: navPaths.portfolio(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
