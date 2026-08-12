import { useState } from 'react'
import { useParams } from '@tanstack/react-router'
import {
  PageContent,
  Card,
  DetailField,
  SectionLabel,
  Chip,
  Select,
  InputField,
  Button,
  Spinner,
} from '@/shared/ui'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { formatCurrency } from '@/shared/lib/formatCurrency'
import { formatDate } from '@/shared/lib/formatDate'
import { navPaths } from '@/shared/router'
import { useHasPermission, CAN } from '@/shared/lib/permissions'
import {
  useOrder,
  useCustomerForOrder,
  useLocationForOrder,
  useUpdateOrderStatus,
  useUpdateOrderPaymentStatus,
} from '../api/orders.queries'
import { useOrdersTranslation } from '../i18n'
import {
  ORDER_STATUS_TRANSITIONS,
  PAYMENT_STATUS_TRANSITIONS,
} from '../model/order.types'
import type { OrderStatus, PaymentStatus } from '../model/order.types'

function formatAddress(a: {
  address?: string
  addressNumber?: string
  addressInterior?: string
  district?: string
  province?: string
  region?: string
  country?: string
}): string {
  const line1 = [a.address, a.addressNumber].filter(Boolean).join(' ')
  const line2 = [a.addressInterior, a.district, a.province, a.region, a.country]
    .filter(Boolean)
    .join(', ')
  return [line1, line2].filter(Boolean).join(' — ') || '—'
}

export const OrderDetailPage = () => {
  const { t, language } = useOrdersTranslation()
  const { orderId } = useParams({ strict: false }) as { orderId: string }
  const { data: order, isLoading } = useOrder(orderId)
  const { data: customer } = useCustomerForOrder(order?.customerId ?? '')
  const { data: location } = useLocationForOrder(order?.fulfillmentLocationId ?? '')

  const [nextStatus, setNextStatus] = useState('')
  const [trackingNumber, setTrackingNumber] = useState('')
  const [nextPaymentStatus, setNextPaymentStatus] = useState('')

  const updateStatus = useUpdateOrderStatus(orderId)
  const updatePaymentStatus = useUpdateOrderPaymentStatus(orderId)

  const canUpdate = useHasPermission(...CAN.ordersUpdate)

  if (isLoading || !order) {
    return (
      <PageContent title={t.page.detailTitle('')} description="">
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  const nextStatuses = ORDER_STATUS_TRANSITIONS[order.status]
  const nextPaymentStatuses = PAYMENT_STATUS_TRANSITIONS[order.paymentStatus]
  const statusOptions = nextStatuses.map((s) => ({ value: s, label: t.status[s] }))
  const paymentStatusOptions = nextPaymentStatuses.map((s) => ({
    value: s,
    label: t.paymentStatus[s],
  }))

  const handleUpdateStatus = () => {
    if (!nextStatus) return
    updateStatus.mutate(
      { status: nextStatus as OrderStatus, trackingNumber: trackingNumber || undefined },
      {
        onSuccess: () => {
          notify.success(t.toasts.statusUpdated)
          setNextStatus('')
          setTrackingNumber('')
        },
        onError: onQueuedOr(() => {}),
      }
    )
  }

  const handleUpdatePaymentStatus = () => {
    if (!nextPaymentStatus) return
    updatePaymentStatus.mutate(nextPaymentStatus as PaymentStatus, {
      onSuccess: () => {
        notify.success(t.toasts.paymentStatusUpdated)
        setNextPaymentStatus('')
      },
      onError: onQueuedOr(() => {}),
    })
  }

  return (
    <PageContent
      title={t.page.detailTitle(order.orderNumber)}
      description={order.createdAt ? formatDate(order.createdAt) : undefined}
      actions={[
        {
          type: 'link',
          label: t.detail.backToList,
          variant: 'secondary',
          to: navPaths.orders(language),
          size: 'small',
        },
      ]}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailField label={t.detail.orderNumberLabel} value={order.orderNumber} />
              <DetailField
                label={t.detail.customerLabel}
                value={
                  customer ? `${customer.firstName} ${customer.lastName} (${customer.email})` : order.customerId
                }
              />
              <DetailField label={t.detail.locationLabel} value={location?.name ?? order.fulfillmentLocationId} />
              <DetailField
                label={t.detail.createdAtLabel}
                value={order.createdAt ? formatDate(order.createdAt) : undefined}
              />
            </div>
          </Card>

          <Card>
            <SectionLabel>{t.detail.itemsTitle}</SectionLabel>
            <div className="border-border divide-border-control mt-3 divide-y rounded-lg border">
              {order.items.map((item, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="text-foreground text-sm font-medium">
                      {item.nameSnapshot}
                    </span>
                    {item.skuSnapshot && (
                      <span className="text-muted font-mono text-xs">{item.skuSnapshot}</span>
                    )}
                  </div>
                  <div className="text-secondary flex items-center gap-4 text-sm">
                    <span>
                      {formatCurrency(item.unitPrice.amount, item.unitPrice.currency, language)} ×{' '}
                      {item.quantity}
                    </span>
                    <span className="text-foreground font-medium">
                      {formatCurrency(item.lineTotal.amount, item.lineTotal.currency, language)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {t.detail.shippingAddressTitle}
                </span>
                <span className="text-foreground text-sm">
                  {formatAddress(order.shippingAddress)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {t.detail.billingAddressTitle}
                </span>
                <span className="text-foreground text-sm">
                  {formatAddress(order.billingAddress)}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <SectionLabel>{t.detail.notesTitle}</SectionLabel>
            <p className="text-secondary mt-2 text-sm">{order.notes || t.detail.noNotes}</p>
          </Card>
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-80 lg:shrink-0">
          <Card>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {t.detail.statusLabel}
                </span>
                <Chip size="small">{t.status[order.status]}</Chip>
              </div>
              {canUpdate &&
                (nextStatuses.length === 0 ? (
                  <p className="text-muted text-xs">{t.detail.noNextStatus}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Select
                      label={t.detail.changeStatusTo}
                      options={statusOptions}
                      value={nextStatus}
                      lang={language}
                      onChange={(e) => setNextStatus(e.target.value)}
                    />
                    {nextStatus === 'shipped' && (
                      <InputField
                        label={t.detail.trackingNumberLabel}
                        placeholder={t.detail.trackingNumberPlaceholder}
                        value={trackingNumber}
                        onChange={(e) => setTrackingNumber(e.target.value)}
                      />
                    )}
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={!nextStatus}
                      loading={updateStatus.isPending}
                      onClick={handleUpdateStatus}
                    >
                      {t.detail.updateStatus}
                    </Button>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-muted text-xs font-medium tracking-wide uppercase">
                  {t.detail.paymentStatusLabel}
                </span>
                <Chip size="small">{t.paymentStatus[order.paymentStatus]}</Chip>
              </div>
              {canUpdate &&
                (nextPaymentStatuses.length === 0 ? (
                  <p className="text-muted text-xs">{t.detail.noNextPaymentStatus}</p>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Select
                      label={t.detail.changePaymentStatusTo}
                      options={paymentStatusOptions}
                      value={nextPaymentStatus}
                      lang={language}
                      onChange={(e) => setNextPaymentStatus(e.target.value)}
                    />
                    <Button
                      variant="secondary"
                      size="small"
                      disabled={!nextPaymentStatus}
                      loading={updatePaymentStatus.isPending}
                      onClick={handleUpdatePaymentStatus}
                    >
                      {t.detail.updatePaymentStatus}
                    </Button>
                  </div>
                ))}
            </div>
          </Card>

          <Card>
            <SectionLabel>{t.detail.totalsTitle}</SectionLabel>
            <div className="mt-3 flex flex-col gap-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary">{t.detail.subtotal}</span>
                <span className="text-foreground">
                  {formatCurrency(order.subtotal.amount, order.subtotal.currency, language)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">{t.detail.discount}</span>
                <span className="text-foreground">
                  -{formatCurrency(order.discountTotal.amount, order.discountTotal.currency, language)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">{t.detail.shipping}</span>
                <span className="text-foreground">
                  {formatCurrency(order.shippingCost.amount, order.shippingCost.currency, language)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-secondary">{t.detail.tax}</span>
                <span className="text-foreground">
                  {formatCurrency(order.taxTotal.amount, order.taxTotal.currency, language)}
                </span>
              </div>
              <div className="border-border-control flex items-center justify-between border-t pt-2 font-semibold">
                <span className="text-foreground">{t.detail.total}</span>
                <span className="text-foreground">
                  {formatCurrency(order.total.amount, order.total.currency, language)}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContent>
  )
}
