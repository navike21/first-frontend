import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CustomerForm } from '../components/CustomerForm'
import { useCustomer, useUpdateCustomer } from '../api/customers.queries'
import { useCustomersTranslation } from '../i18n'
import { toCustomerPayload } from '../model/customer.schema'
import type { CustomerFormData } from '../model/customer.schema'
import type { Customer } from '../model/customer.types'

function toFormValues(customer: Customer): Partial<CustomerFormData> {
  return {
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    phone: customer.phone ?? '',
    documentType: customer.documentType ?? '',
    documentNumber: customer.documentNumber ?? '',
    notes: customer.notes ?? '',
    status: customer.status,
    addresses: customer.addresses.map((a) => ({
      type: a.type,
      isDefault: a.isDefault,
      country: a.country ?? '',
      ubigeoCode: a.ubigeoCode ?? '',
      region: a.region ?? '',
      province: a.province ?? '',
      district: a.district ?? '',
      address: a.address ?? '',
      addressNumber: a.addressNumber ?? '',
      addressInterior: a.addressInterior ?? '',
    })),
  }
}

export const EditCustomerPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCustomersTranslation()
  const { customerId } = useParams({ strict: false }) as { customerId: string }
  const { data: customer, isLoading } = useCustomer(customerId)
  const updateCustomer = useUpdateCustomer(customerId)

  const handleUpdate = (data: CustomerFormData) => {
    updateCustomer.mutate(toCustomerPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.customers(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.customers(language) as never })
      ),
    })
  }

  if (isLoading || !customer) {
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
      description={t.page.editDescription(
        `${customer.firstName} ${customer.lastName}`
      )}
    >
      <CustomerForm
        mode="edit"
        initialValues={toFormValues(customer)}
        isSubmitting={updateCustomer.isPending}
        submitError={updateCustomer.error}
        onCancel={() => navigate({ to: navPaths.customers(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
