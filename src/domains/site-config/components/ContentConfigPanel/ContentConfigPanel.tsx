import { InputField } from '@/shared/ui'
import { useSiteConfigTranslation } from '../../i18n'
import { CONTENT_WIDTHS } from '../../model/site-config.types'
import type { LayoutConfig, ContentWidth } from '../../model/site-config.types'
import { LayoutVariantPicker, ContentWireframe } from '../LayoutVariantPicker'

export interface ContentConfigPanelProps {
  value: LayoutConfig
  onChange: (patch: Partial<LayoutConfig>) => void
}

const MIN_WIDTH = 640
const MAX_WIDTH = 1920

export const ContentConfigPanel = ({ value, onChange }: ContentConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  const options = CONTENT_WIDTHS.map((width) => ({
    value: width,
    label: width === 'boxed' ? t.content.boxed : t.content.full,
    wireframe: <ContentWireframe width={width} boxedMaxWidth={value.boxedMaxWidth} />,
  }))

  const handleMaxWidthChange = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 4)
    onChange({ boxedMaxWidth: digits ? Number(digits) : 0 })
  }

  const clampMaxWidth = () => {
    const clamped = Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value.boxedMaxWidth || MIN_WIDTH))
    if (clamped !== value.boxedMaxWidth) onChange({ boxedMaxWidth: clamped })
  }

  return (
    <div className="flex flex-col gap-6">
      <LayoutVariantPicker
        label={t.content.widthLabel}
        options={options}
        value={value.contentWidth}
        onChange={(contentWidth: ContentWidth) => onChange({ contentWidth })}
      />
      <p className="text-xs text-muted">
        {value.contentWidth === 'boxed' ? t.content.boxedHint : t.content.fullHint}
      </p>

      {value.contentWidth === 'boxed' && (
        <div className="max-w-xs">
          <InputField
            label={t.content.boxedMaxWidth}
            helperText={t.content.boxedMaxWidthHint}
            inputMode="numeric"
            value={value.boxedMaxWidth ? String(value.boxedMaxWidth) : ''}
            onChange={(e) => handleMaxWidthChange(e.target.value)}
            onBlur={clampMaxWidth}
          />
        </div>
      )}
    </div>
  )
}
