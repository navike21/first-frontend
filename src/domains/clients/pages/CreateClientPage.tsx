import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ClientForm } from '../components/ClientForm/ClientForm'
import { useCreateClient } from '../api/clients.queries'
import { useClientsTranslation } from '../i18n'
import type { CreateClientFormData } from '../model/client.schema'

export const CreateClientPage = () => {
  const navigate = useNavigate()
  const { t, language } = useClientsTranslation()
  const createClient = useCreateClient()

  const handleCreate = (
    data: CreateClientFormData,
    logo?: File | null,
    _removeLogo?: boolean,
    logoLibraryUrl?: string
  ) => {
    createClient.mutate(
      { data, logo, logoLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.created)
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.clients(language) as never })
        },
        onError: onQueuedOr(() =>
          navigate({ to: navPaths.clients(language) as never })
        ),
      }
    )
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <ClientForm
        mode="create"
        isSubmitting={createClient.isPending}
        submitError={createClient.error}
        onCancel={() => navigate({ to: navPaths.clients(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
