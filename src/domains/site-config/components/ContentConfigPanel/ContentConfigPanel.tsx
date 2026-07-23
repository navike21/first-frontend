import { useState } from 'react'
import { InputNumber, FadeCollapse } from '@/shared/ui'
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

export const ContentConfigPanel = ({
  value,
  onChange,
}: ContentConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()
  const [clampVersion, setClampVersion] = useState(0)

  const options = CONTENT_WIDTHS.map((width) => ({
    value: width,
    label: width === 'boxed' ? t.content.boxed : t.content.full,
    wireframe: (
      <ContentWireframe width={width} boxedMaxWidth={value.boxedMaxWidth} />
    ),
  }))

  const clampMaxWidth = (raw: string) => {
    const parsed = Number(raw) || 0
    const clamped = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, parsed || MIN_WIDTH)
    )
    if (clamped !== parsed) {
      onChange({ boxedMaxWidth: clamped })
      setClampVersion((v) => v + 1)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <LayoutVariantPicker
        label={t.content.widthLabel}
        options={options}
        value={value.contentWidth}
        onChange={(contentWidth: ContentWidth) => onChange({ contentWidth })}
      />
      <p className="text-muted text-xs">
        {value.contentWidth === 'boxed'
          ? t.content.boxedHint
          : t.content.fullHint}
      </p>

      <FadeCollapse show={value.contentWidth === 'boxed'}>
        <div className="max-w-xs">
          <InputNumber
            key={clampVersion}
            label={t.content.boxedMaxWidth}
            helperText={t.content.boxedMaxWidthHint}
            decimals={0}
            defaultValue={
              value.boxedMaxWidth ? String(value.boxedMaxWidth) : ''
            }
            onChange={(e) =>
              onChange({
                boxedMaxWidth: e.target.value ? Number(e.target.value) : 0,
              })
            }
            onBlur={(e) => clampMaxWidth(e.target.value)}
          />
        </div>
      </FadeCollapse>
    </div>
  )
}
