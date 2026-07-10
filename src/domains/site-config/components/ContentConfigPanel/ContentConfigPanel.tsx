import { useSiteConfigTranslation } from '../../i18n'
import { CONTENT_WIDTHS } from '../../model/site-config.types'
import type { LayoutConfig, ContentWidth } from '../../model/site-config.types'
import { LayoutVariantPicker, ContentWireframe } from '../LayoutVariantPicker'

export interface ContentConfigPanelProps {
  value: LayoutConfig
  onChange: (patch: Partial<LayoutConfig>) => void
}

export const ContentConfigPanel = ({ value, onChange }: ContentConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  const options = CONTENT_WIDTHS.map((width) => ({
    value: width,
    label: width === 'boxed' ? t.content.boxed : t.content.full,
    wireframe: <ContentWireframe width={width} />,
  }))

  return (
    <div className="flex flex-col gap-4">
      <LayoutVariantPicker
        label={t.content.widthLabel}
        options={options}
        value={value.contentWidth}
        onChange={(contentWidth: ContentWidth) => onChange({ contentWidth })}
      />
      <p className="text-xs text-muted">
        {value.contentWidth === 'boxed' ? t.content.boxedHint : t.content.fullHint}
      </p>
    </div>
  )
}
