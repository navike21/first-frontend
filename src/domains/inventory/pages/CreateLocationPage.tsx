import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { LocationForm } from '../components/LocationForm'
import { useCreateLocation } from '../api/locations.queries'
import { useInventoryTranslation } from '../i18n'
import { toLocationPayload } from '../model/location.schema'
import type { LocationFormData } from '../model/location.schema'

export const CreateLocationPage = () => {
  const navigate = useNavigate()
  const { t, language } = useInventoryTranslation()
  const createLocation = useCreateLocation()

  const handleCreate = (data: LocationFormData) => {
    createLocation.mutate(toLocationPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.locations(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.locations(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <LocationForm
        mode="create"
        isSubmitting={createLocation.isPending}
        submitError={createLocation.error}
        onCancel={() => navigate({ to: navPaths.locations(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
