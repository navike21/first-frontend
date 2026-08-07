import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { PaymentMethodForm } from '../components/PaymentMethodForm'
import { usePaymentMethod, useUpdatePaymentMethod } from '../api/paymentMethods.queries'
import { usePaymentsTranslation } from '../i18n'
import { toPaymentMethodPayload } from '../model/paymentMethod.schema'
import type { PaymentMethodFormData } from '../model/paymentMethod.schema'
import type { PaymentMethod } from '../model/payment.types'

function toFormValues(method: PaymentMethod): Partial<PaymentMethodFormData> {
  return {
    customerId: method.customerId,
    provider: method.provider,
    providerToken: method.providerToken,
    brand: method.brand,
    last4: method.last4,
    expiryMonth: String(method.expiryMonth),
    expiryYear: String(method.expiryYear),
    isDefault: method.isDefault,
  }
}

export const EditPaymentMethodPage = () => {
  const navigate = useNavigate()
  const { t, language } = usePaymentsTranslation()
  const { methodId } = useParams({ strict: false }) as { methodId: string }
  const { data: method, isLoading } = usePaymentMethod(methodId)
  const updateMethod = useUpdatePaymentMethod(methodId)

  const handleUpdate = (data: PaymentMethodFormData) => {
    updateMethod.mutate(toPaymentMethodPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.paymentMethods(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.paymentMethods(language) as never })
      ),
    })
  }

  if (isLoading || !method) {
    return (
      <PageContent title={t.page.methodsEditTitle} description={t.page.methodsEditTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent
      title={t.page.methodsEditTitle}
      description={t.page.methodsEditDescription(method.brand)}
    >
      <PaymentMethodForm
        mode="edit"
        initialValues={toFormValues(method)}
        isSubmitting={updateMethod.isPending}
        submitError={updateMethod.error}
        onCancel={() => navigate({ to: navPaths.paymentMethods(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
