import { Select, IconButton, Tooltip } from '@/shared/ui'
import { useDivisions } from '@/shared/api/geo'
import type { Language } from '@/shared/types/languages'
import { useShippingTranslation } from '../../i18n'

// Peru-only for now — same "app is Peru-first" default LocationSelect uses
// elsewhere (clients/customers/orders addresses). Shipping's own matching
// logic (calculateShippingCost) only ever compares region/province by name,
// never district, so this stops one level shallower than LocationSelect.
const COUNTRY = 'PE'

export interface ShippingZoneRowProps {
  index: number
  region: string
  provinces: string[]
  lang: Language
  onRegionChange: (region: string) => void
  onProvincesChange: (provinces: string[]) => void
  onRemove: () => void
}

export const ShippingZoneRow = ({
  index,
  region,
  provinces,
  lang,
  onRegionChange,
  onProvincesChange,
  onRemove,
}: ShippingZoneRowProps) => {
  const { t } = useShippingTranslation()
  const { data: regions, isFetching: isFetchingRegions } = useDivisions(COUNTRY)
  const regionItem = regions?.items.find((r) => r.name === region)
  const { data: provinceDivisions, isFetching: isFetchingProvinces } = useDivisions(
    COUNTRY,
    regionItem?.code
  )

  const regionOptions = (regions?.items ?? []).map((r) => ({
    value: r.name,
    label: r.name,
  }))
  const provinceOptions = (provinceDivisions?.items ?? []).map((p) => ({
    value: p.name,
    label: p.name,
  }))

  return (
    <div className="border-border bg-surface-subtle flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="text-foreground text-sm font-semibold">
          {t.form.zones} {index + 1}
        </span>
        <Tooltip heading={t.form.removeZone} position="top" size="small">
          <IconButton
            icon="RiDeleteBinLine"
            variant="text"
            size="small"
            aria-label={t.form.removeZone}
            onClick={onRemove}
          />
        </Tooltip>
      </div>
      <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
        <Select
          label={t.form.zoneRegion}
          options={regionOptions}
          value={region}
          lang={lang}
          loading={isFetchingRegions}
          onChange={(e) => {
            onRegionChange(e.target.value)
            onProvincesChange([])
          }}
        />
        <Select
          label={t.form.zoneProvinces}
          helperText={t.form.zoneProvincesHint}
          multiple
          options={provinceOptions}
          value={provinces}
          lang={lang}
          disabled={!region}
          loading={isFetchingProvinces}
          onChange={(e) => {
            const selected = Array.from(e.target.selectedOptions).map(
              (o) => o.value
            )
            onProvincesChange(selected)
          }}
        />
      </div>
    </div>
  )
}
