import { useNavigate, useParams } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOrFieldErrors } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { navPaths } from '@/shared/router'
import { ShippingRuleForm } from '../components/ShippingRuleForm'
import {
  useShippingRule,
  useUpdateShippingRule,
  useCurrencyForShippingPicker,
} from '../api/shippingRules.queries'
import { useShippingTranslation } from '../i18n'
import { toShippingRulePayload, fromMoney } from '../model/shippingRule.schema'
import type { ShippingRuleFormData } from '../model/shippingRule.schema'
import type { ShippingRule } from '../model/shippingRule.types'

function toFormValues(rule: ShippingRule): Partial<ShippingRuleFormData> {
  return {
    name: rule.name,
    type: rule.type,
    amount: fromMoney(rule.amount),
    freeOverAmount: fromMoney(rule.freeOverAmount),
    zones: rule.zones.map((zone) => ({
      region: zone.region,
      provincesText: (zone.provinces ?? []).join(', '),
    })),
    isActive: rule.isActive,
    order: String(rule.order),
  }
}

export const EditShippingRulePage = () => {
  const navigate = useNavigate()
  const { t, language } = useShippingTranslation()
  const { ruleId } = useParams({ strict: false }) as { ruleId: string }
  const { data: rule, isLoading } = useShippingRule(ruleId)
  const { data: currency = 'USD' } = useCurrencyForShippingPicker()
  const updateRule = useUpdateShippingRule(ruleId)

  const handleUpdate = (data: ShippingRuleFormData) => {
    updateRule.mutate(toShippingRulePayload(data, currency), {
      onSuccess: () => {
        notify.success(t.toasts.updated)
        navigate({ to: navPaths.shippingRules(language) as never })
      },
      onError: onQueuedOrFieldErrors(() =>
        navigate({ to: navPaths.shippingRules(language) as never })
      ),
    })
  }

  if (isLoading || !rule) {
    return (
      <PageContent title={t.page.editTitle} description={t.page.editTitle}>
        <div className="flex justify-center py-20">
          <Spinner variant="gradient" size="large" />
        </div>
      </PageContent>
    )
  }

  return (
    <PageContent title={t.page.editTitle} description={t.page.editDescription(rule.name)}>
      <ShippingRuleForm
        mode="edit"
        currency={currency}
        initialValues={toFormValues(rule)}
        isSubmitting={updateRule.isPending}
        submitError={updateRule.error}
        onCancel={() => navigate({ to: navPaths.shippingRules(language) as never })}
        onSubmit={handleUpdate}
      />
    </PageContent>
  )
}
