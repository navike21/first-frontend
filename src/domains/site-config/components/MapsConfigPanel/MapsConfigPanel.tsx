import { Select } from '@/shared/ui'
import { useSiteConfigTranslation } from '../../i18n'
import { MAP_PROVIDERS } from '../../model/site-config.types'
import type { MapProvider, MapsConfig } from '../../model/site-config.types'

export interface MapsConfigPanelProps {
  value: MapsConfig
  onChange: (patch: Partial<MapsConfig>) => void
}

export const MapsConfigPanel = ({ value, onChange }: MapsConfigPanelProps) => {
  const { t } = useSiteConfigTranslation()

  const options = MAP_PROVIDERS.map((provider) => ({ value: provider, label: t.maps.providers[provider] }))

  return (
    <div className="flex flex-col gap-6">
      <p className="text-xs text-muted">{t.maps.hint}</p>
      <div className="max-w-xs">
        <Select
          label={t.maps.providerLabel}
          options={options}
          value={value.provider}
          onChange={(e) => onChange({ provider: e.target.value as MapProvider })}
        />
      </div>
    </div>
  )
}
