import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { OrderBuilderForm } from '../components/OrderBuilder'
import { useCreateOrder, useCurrencyForOrderPicker } from '../api/orders.queries'
import { useOrdersTranslation } from '../i18n'
import { toOrderPayload } from '../model/order.schema'
import type { OrderBuilderFormData } from '../model/order.schema'

export const CreateOrderPage = () => {
  const navigate = useNavigate()
  const { t, language } = useOrdersTranslation()
  const { data: currency = 'USD' } = useCurrencyForOrderPicker()
  const createOrder = useCreateOrder()

  const handleCreate = (data: OrderBuilderFormData) => {
    createOrder.mutate(toOrderPayload(data), {
      onSuccess: (res) => {
        notify.success(t.toasts.created)
        const orderId = res.data?.id
        navigate({
          to: (orderId
            ? navPaths.orderDetail(orderId, language)
            : navPaths.orders(language)) as never,
        })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.orders(language) as never })
      ),
    })
  }

  return (
    <PageContent title={t.page.createTitle} description={t.page.createDescription}>
      <OrderBuilderForm
        currency={currency}
        isSubmitting={createOrder.isPending}
        submitError={createOrder.error}
        onCancel={() => navigate({ to: navPaths.orders(language) as never })}
        onSubmit={handleCreate}
      />
    </PageContent>
  )
}
