import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { PortfolioForm } from '../components/PortfolioForm'
import { usePortfolioBySlug, useUpdatePortfolio } from '../api/portfolio.queries'
import { usePortfolioTranslation } from '../i18n'
import { toPortfolioPayload } from '../model/portfolio.schema'
import type { PortfolioFormData } from '../model/portfolio.schema'
import type { Portfolio } from '../model/portfolio.types'

function toFormValues(item: Portfolio): Partial<PortfolioFormData> {
  return {
    slug: item.slug,
    name: item.name,
    shortDescription: item.shortDescription,
    description: item.description,
    serviceIds: item.serviceIds,
    clientId: item.clientId ?? '',
    technologies: item.technologies.join(', '),
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
  const { portfolioSlug } = useParams({ strict: false }) as { portfolioSlug: string }
  const { data: item, isLoading } = usePortfolioBySlug(portfolioSlug)
  const updatePortfolio = useUpdatePortfolio(item?.id ?? '')

  const handleUpdate = (data: PortfolioFormData, cover?: File | null, removeCover?: boolean) => {
    updatePortfolio.mutate(
      { data: toPortfolioPayload(data), cover, removeCover },
      {
        onSuccess: () => {
          notify.success(t.toasts.updated)
          navigate({ to: navPaths.portfolio(language) as never })
        },
        onError: onQueuedOr(() => navigate({ to: navPaths.portfolio(language) as never })),
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
        isSubmitting={updatePortfolio.isPending}
        submitError={updatePortfolio.error}
        onCancel={() => navigate({ to: navPaths.portfolio(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
