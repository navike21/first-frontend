import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { LocationForm } from '../components/LocationForm'
import { useLocation, useUpdateLocation } from '../api/locations.queries'
import { useInventoryTranslation } from '../i18n'
import { toLocationPayload } from '../model/location.schema'
import type { LocationFormData } from '../model/location.schema'
import type { Location } from '../model/location.types'

function toFormValues(location: Location): Partial<LocationFormData> {
  return {
    name: location.name,
    type: location.type,
    country: location.address?.country ?? '',
    ubigeoCode: location.address?.ubigeoCode ?? '',
    region: location.address?.region ?? '',
    province: location.address?.province ?? '',
    district: location.address?.district ?? '',
    address: location.address?.address ?? '',
    addressNumber: location.address?.addressNumber ?? '',
    addressInterior: location.address?.addressInterior ?? '',
    fulfillsOnline: location.fulfillsOnline,
    isActive: location.isActive,
  }
}

export const EditLocationPage = () => {
  const navigate = useNavigate()
  const { t, language } = useInventoryTranslation()
  const { locationId } = useParams({ strict: false }) as { locationId: string }
  const { data: location, isLoading } = useLocation(locationId)
  const updateLocation = useUpdateLocation(locationId)

  const handleUpdate = (data: LocationFormData) => {
    updateLocation.mutate(toLocationPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.locations(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.locations(language) as never })
      ),
    })
  }

  if (isLoading || !location) {
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
      description={t.page.editDescription(location.name)}
    >
      <LocationForm
        mode="edit"
        initialValues={toFormValues(location)}
        isSubmitting={updateLocation.isPending}
        submitError={updateLocation.error}
        onCancel={() => navigate({ to: navPaths.locations(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
