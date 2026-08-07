import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CustomerForm } from '../components/CustomerForm'
import { useCreateCustomer } from '../api/customers.queries'
import { useCustomersTranslation } from '../i18n'
import { toCustomerPayload } from '../model/customer.schema'
import type { CustomerFormData } from '../model/customer.schema'

export const CreateCustomerPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCustomersTranslation()
  const createCustomer = useCreateCustomer()

  const handleCreate = (data: CustomerFormData) => {
    createCustomer.mutate(toCustomerPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.customers(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.customers(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.createTitle}
      description={t.page.createDescription}
    >
      <CustomerForm
        mode="create"
        isSubmitting={createCustomer.isPending}
        submitError={createCustomer.error}
        onCancel={() => navigate({ to: navPaths.customers(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
