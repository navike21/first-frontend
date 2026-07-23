import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ClientForm } from '../components/ClientForm/ClientForm'
import { useClient, useUpdateClient } from '../api/clients.queries'
import { useClientsTranslation } from '../i18n'
import type { CreateClientFormData } from '../model/client.schema'
import type { Client } from '../model/client.types'

function toFormValues(client: Client): Partial<CreateClientFormData> {
  return {
    businessName: client.businessName,
    clientType: client.clientType,
    documentType: client.documentType,
    documentNumber: client.documentNumber,
    country: client.country,
    ubigeoCode: client.ubigeoCode,
    region: client.region,
    province: client.province,
    district: client.district,
    address: client.address,
    addressNumber: client.addressNumber,
    addressInterior: client.addressInterior,
    website: client.website,
    email: client.email,
    phone: client.phone,
    industry: client.industry,
    language: client.language,
    currency: client.currency,
    primaryContact: client.primaryContact,
    notes: client.notes,
    status: client.status,
  }
}

export const EditClientPage = () => {
  const navigate = useNavigate()
  const { t, language } = useClientsTranslation()
  const { clientId } = useParams({ strict: false }) as { clientId: string }
  const { data: client, isLoading } = useClient(clientId)
  const updateClient = useUpdateClient(clientId)

  const handleUpdate = (
    data: CreateClientFormData,
    logo?: File | null,
    removeLogo?: boolean,
    logoLibraryUrl?: string
  ) => {
    updateClient.mutate(
      { data, logo, removeLogo, logoLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.updated)
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.clients(language) as never })
        },
        onError: onQueuedOrFieldErrors(() =>
          navigate({ to: navPaths.clients(language) as never })
        ),
      }
    )
  }

  if (isLoading || !client) {
    return (
      <PageContent title={t.page.editTitle} description={t.page.editTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  const logoProps = client.logoUrl ? { initialLogoUrl: client.logoUrl } : {}

  return (
    <PageContent
      title={t.page.editTitle}
      description={t.page.editDescription(client.businessName)}
    >
      <ClientForm
        mode="edit"
        initialValues={toFormValues(client)}
        {...logoProps}
        isSubmitting={updateClient.isPending}
        submitError={updateClient.error}
        onCancel={() => navigate({ to: navPaths.clients(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
