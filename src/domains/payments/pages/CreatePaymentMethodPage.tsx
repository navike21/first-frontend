import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { PaymentMethodForm } from '../components/PaymentMethodForm'
import { useCreatePaymentMethod } from '../api/paymentMethods.queries'
import { usePaymentsTranslation } from '../i18n'
import { toPaymentMethodPayload } from '../model/paymentMethod.schema'
import type { PaymentMethodFormData } from '../model/paymentMethod.schema'

export const CreatePaymentMethodPage = () => {
  const navigate = useNavigate()
  const { t, language } = usePaymentsTranslation()
  const createMethod = useCreatePaymentMethod()

  const handleCreate = (data: PaymentMethodFormData) => {
    createMethod.mutate(toPaymentMethodPayload(data), {
      onSuccess: () => {
        notify.success(t.toasts.created)
        navigate({ to: navPaths.paymentMethods(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.paymentMethods(language) as never })
      ),
    })
  }

  return (
    <PageContent
      title={t.page.methodsCreateTitle}
      description={t.page.methodsCreateDescription}
    >
      <PaymentMethodForm
        mode="create"
        isSubmitting={createMethod.isPending}
        submitError={createMethod.error}
        onCancel={() => navigate({ to: navPaths.paymentMethods(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
