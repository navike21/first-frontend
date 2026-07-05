import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ServiceForm } from '../components/ServiceForm/ServiceForm'
import { useServiceById, useUpdateService } from '../api/services.queries'
import { useServicesTranslation } from '../i18n'
import { toServicePayload } from '../model/service.schema'
import type { ServiceFormData } from '../model/service.schema'
import type { Service } from '../model/service.types'

function toFormValues(svc: Service): Partial<ServiceFormData> {
  return {
    name: svc.name,
    shortDescription: svc.shortDescription,
    description: svc.description,
    slug: svc.slug,
    pillars: svc.pillars,
    tags: svc.tags.join(', '),
    order: svc.order,
    isActive: svc.isActive,
  }
}

export const EditServicePage = () => {
  const navigate = useNavigate()
  const { t, language } = useServicesTranslation()
  const { serviceId } = useParams({ strict: false }) as { serviceId: string }
  const { data: service, isLoading } = useServiceById(serviceId)
  const updateService = useUpdateService(service?.id ?? '')

  const handleUpdate = (
    data: ServiceFormData,
    cover?: File | null,
    iconFile?: File | null,
    removeCover?: boolean,
    removeIcon?: boolean
  ) => {
    updateService.mutate(
      {
        data: toServicePayload(data),
        cover,
        iconFile,
        removeCover,
        removeIcon,
      },
      {
        onSuccess: () => {
          notify.success(t.toasts.updated)
          navigate({ to: navPaths.services(language) as never })
        },
        onError: onQueuedOr(() =>
          navigate({ to: navPaths.services(language) as never })
        ),
      }
    )
  }

  if (isLoading || !service) {
    return (
      <PageContent title={t.page.editTitle} description={t.page.editTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  const iconUrl = service.icon?.startsWith('http') ? service.icon : undefined

  return (
    <PageContent
      title={t.page.editTitle}
      description={t.page.editDescription(service.name[language] || service.name.en)}
    >
      <ServiceForm
        mode="edit"
        initialValues={toFormValues(service)}
        {...(service.coverImageUrl ? { initialCoverUrl: service.coverImageUrl } : {})}
        {...(iconUrl ? { initialIconUrl: iconUrl } : {})}
        isSubmitting={updateService.isPending}
        submitError={updateService.error}
        onCancel={() => navigate({ to: navPaths.services(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
