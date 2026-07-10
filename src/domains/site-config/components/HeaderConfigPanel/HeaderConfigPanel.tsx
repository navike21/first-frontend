import { InputField, Select, Switch, FormGrid, SectionLabel } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useSiteConfigTranslation } from '../../i18n'
import { HEADER_VARIANTS } from '../../model/site-config.types'
import type { HeaderConfig, HeaderVariant } from '../../model/site-config.types'
import { LayoutVariantPicker, HeaderWireframe } from '../LayoutVariantPicker'
import { LocalizedField } from '../LocalizedField'
import { HeaderPreview } from './HeaderPreview'

export interface HeaderConfigPanelProps {
  value: HeaderConfig
  language: Language
  onChange: (patch: Partial<HeaderConfig>) => void
}

export const HeaderConfigPanel = ({ value, language, onChange }: HeaderConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  const variantOptions = HEADER_VARIANTS.map((variant) => ({
    value: variant,
    label: t.header.variants[variant],
    wireframe: <HeaderWireframe variant={variant} />,
  }))

  const positionLabel = (v: string): string => {
    if (v === 'left') return t.header.positionLeft
    if (v === 'center') return t.header.positionCenter
    return t.header.positionRight
  }
  const positionOptions = (values: readonly string[]) =>
    values.map((v) => ({ value: v, label: positionLabel(v) }))

  return (
    <div className="flex flex-col gap-6">
      <LayoutVariantPicker
        label={t.header.variantLabel}
        options={variantOptions}
        value={value.variant}
        onChange={(variant: HeaderVariant) => onChange({ variant })}
      />

      <FormGrid className="lg:grid-cols-2">
        <Switch
          label={t.header.sticky}
          checked={value.sticky}
          onChange={(e) => onChange({ sticky: e.target.checked })}
        />
        <Switch
          label={t.header.transparent}
          checked={value.transparent}
          onChange={(e) => onChange({ transparent: e.target.checked })}
        />
      </FormGrid>

      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-subtle p-4">
        <Switch
          label={t.header.ctaEnabled}
          checked={value.cta.enabled}
          onChange={(e) => onChange({ cta: { ...value.cta, enabled: e.target.checked } })}
        />
        {value.cta.enabled && (
          <FormGrid className="lg:grid-cols-2">
            <LocalizedField
              label={t.header.ctaLabel}
              value={value.cta.label}
              userLanguage={language}
              onChange={(lang, text) => onChange({ cta: { ...value.cta, label: { ...value.cta.label, [lang]: text } } })}
            />
            <InputField
              label={t.header.ctaUrl}
              value={value.cta.url}
              onChange={(e) => onChange({ cta: { ...value.cta, url: e.target.value } })}
            />
          </FormGrid>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <SectionLabel>{t.header.mobileTitle}</SectionLabel>
        <FormGrid className="lg:grid-cols-2">
          <Select
            label={t.header.mobileLogoPosition}
            options={positionOptions(['left', 'center'])}
            value={value.mobile.logoPosition}
            lang={language}
            onChange={(e) =>
              onChange({ mobile: { ...value.mobile, logoPosition: e.target.value as 'left' | 'center' } })
            }
          />
          <Select
            label={t.header.mobileMenuIcon}
            options={positionOptions(['left', 'right'])}
            value={value.mobile.menuIconPosition}
            lang={language}
            onChange={(e) =>
              onChange({ mobile: { ...value.mobile, menuIconPosition: e.target.value as 'left' | 'right' } })
            }
          />
        </FormGrid>
      </div>

      <HeaderPreview config={value} />
    </div>
  )
}
