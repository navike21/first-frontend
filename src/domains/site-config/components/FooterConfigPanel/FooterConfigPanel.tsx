import { Select, Switch, FormGrid } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useSiteConfigTranslation } from '../../i18n'
import { FOOTER_VARIANTS } from '../../model/site-config.types'
import type { FooterConfig, FooterVariant } from '../../model/site-config.types'
import { LayoutVariantPicker, FooterWireframe } from '../LayoutVariantPicker'
import { LocalizedField } from '../LocalizedField'
import { FooterPreview } from './FooterPreview'

export interface FooterConfigPanelProps {
  value: FooterConfig
  language: Language
  onChange: (patch: Partial<FooterConfig>) => void
}

export const FooterConfigPanel = ({
  value,
  language,
  onChange,
}: FooterConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  const variantOptions = FOOTER_VARIANTS.map((variant) => ({
    value: variant,
    label: t.footer.variants[variant],
    wireframe: <FooterWireframe variant={variant} columns={value.columns} />,
  }))

  const hasColumns =
    value.variant === 'columns' || value.variant === 'cta-columns'

  return (
    <div className="flex flex-col gap-6">
      <LayoutVariantPicker
        label={t.footer.variantLabel}
        options={variantOptions}
        value={value.variant}
        onChange={(variant: FooterVariant) => onChange({ variant })}
      />

      <FormGrid className="lg:grid-cols-2">
        {hasColumns && (
          <Select
            label={t.footer.columns}
            options={[
              { value: '3', label: '3' },
              { value: '4', label: '4' },
            ]}
            value={String(value.columns)}
            lang={language}
            onChange={(e) =>
              onChange({ columns: Number(e.target.value) as 3 | 4 })
            }
          />
        )}
        <Switch
          label={t.footer.showSocial}
          checked={value.showSocial}
          onChange={(e) => onChange({ showSocial: e.target.checked })}
        />
        <Switch
          label={t.footer.showNewsletter}
          checked={value.showNewsletter}
          onChange={(e) => onChange({ showNewsletter: e.target.checked })}
        />
      </FormGrid>

      <LocalizedField
        label={t.footer.copyright}
        value={value.copyright}
        userLanguage={language}
        onChange={(lang, text) =>
          onChange({ copyright: { ...value.copyright, [lang]: text } })
        }
      />

      <FooterPreview config={value} />
    </div>
  )
}
