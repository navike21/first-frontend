import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { CouponForm } from '../components/CouponForm'
import {
  useCoupon,
  useUpdateCoupon,
  useCurrencyForCouponPicker,
} from '../api/coupons.queries'
import { useCouponsTranslation } from '../i18n'
import { toCouponPayload, fromCouponValue, fromMoney } from '../model/coupon.schema'
import type { CouponFormData } from '../model/coupon.schema'
import type { Coupon } from '../model/coupon.types'

function toLocalDateTimeInput(iso: string | undefined): string {
  if (!iso) return ''
  const date = new Date(iso)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function toFormValues(coupon: Coupon, currency: string): Partial<CouponFormData> {
  return {
    code: coupon.code,
    type: coupon.type,
    value: fromCouponValue(coupon.type, coupon.value, currency),
    maxDiscountAmount: fromMoney(coupon.maxDiscountAmount),
    usageLimitTotal: coupon.usageLimitTotal ? String(coupon.usageLimitTotal) : '',
    usageLimitPerCustomer: coupon.usageLimitPerCustomer
      ? String(coupon.usageLimitPerCustomer)
      : '',
    startsAt: toLocalDateTimeInput(coupon.startsAt),
    expiresAt: toLocalDateTimeInput(coupon.expiresAt),
    isStackable: coupon.isStackable,
    scopeType: coupon.scope.type,
    targetIds: coupon.scope.targetIds,
    status: coupon.status,
  }
}

export const EditCouponPage = () => {
  const navigate = useNavigate()
  const { t, language } = useCouponsTranslation()
  const { couponId } = useParams({ strict: false }) as { couponId: string }
  const { data: coupon, isLoading } = useCoupon(couponId)
  const { data: currency = 'USD' } = useCurrencyForCouponPicker()
  const updateCoupon = useUpdateCoupon(couponId)

  const handleUpdate = (data: CouponFormData) => {
    updateCoupon.mutate(toCouponPayload(data, currency), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.coupons(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.coupons(language) as never })
      ),
    })
  }

  if (isLoading || !coupon) {
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
      description={t.page.editDescription(coupon.code)}
    >
      <CouponForm
        mode="edit"
        currency={currency}
        timesUsed={coupon.timesUsed}
        initialValues={toFormValues(coupon, currency)}
        isSubmitting={updateCoupon.isPending}
        submitError={updateCoupon.error}
        onCancel={() => navigate({ to: navPaths.coupons(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
