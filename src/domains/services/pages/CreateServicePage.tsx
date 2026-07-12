import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ServiceForm } from '../components/ServiceForm/ServiceForm'
import { useCreateService } from '../api/services.queries'
import { useServicesTranslation } from '../i18n'
import { toServicePayload } from '../model/service.schema'
import type { ServiceFormData } from '../model/service.schema'

export const CreateServicePage = () => {
  const navigate = useNavigate()
  const { t, language } = useServicesTranslation()
  const createService = useCreateService()

  const handleCreate = (
    data: ServiceFormData,
    cover?: File | null,
    iconFile?: File | null,
    _removeCover?: boolean,
    _removeIcon?: boolean,
    coverLibraryUrl?: string,
    iconLibraryUrl?: string
  ) => {
    createService.mutate(
      { data: toServicePayload(data), cover, iconFile, coverLibraryUrl, iconLibraryUrl },
      {
        onSuccess: () => {
          notify.success(t.toasts.created)
          navigate({ to: navPaths.services(language) as never })
        },
        onError: onQueuedOr(() =>
          navigate({ to: navPaths.services(language) as never })
        ),
      }
    )
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <ServiceForm
        mode="create"
        isSubmitting={createService.isPending}
        submitError={createService.error}
        onCancel={() => navigate({ to: navPaths.services(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
