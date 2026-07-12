import { CoverPicker, Select, Switch } from '@/shared/ui'
import type { StorageFile } from '@/shared/api/storage'
import { usePagesTranslation } from '../../i18n'
import type { BackgroundImage, BackgroundPosition } from '../../model/page.types'

export interface BackgroundImageFieldsProps {
  config: BackgroundImage
  onChange: (patch: Partial<BackgroundImage>) => void
  onPickFile: (file: File) => void
  onSelectLibrary: (file: StorageFile) => void
}

export const BackgroundImageFields = ({ config, onChange, onPickFile, onSelectLibrary }: BackgroundImageFieldsProps) => {
  const { t } = usePagesTranslation()

  const positionOptions = [
    { value: 'top', label: t.builder.background.positionTop },
    { value: 'center', label: t.builder.background.positionCenter },
    { value: 'bottom', label: t.builder.background.positionBottom },
  ]

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-subtle p-3">
      <CoverPicker
        currentUrl={config.url}
        uploadLabel={t.builder.background.uploadLabel}
        dragLabel={t.form.coverDragLabel}
        dragOrLabel={t.form.coverDragOrLabel}
        browseLabel={t.form.coverBrowseLabel}
        removeLabel={t.builder.background.removeLabel}
        onChange={(file) => {
          if (file) onPickFile(file)
        }}
        onRemove={() => onChange({ url: undefined })}
        variant="compact"
        onSelectLibrary={onSelectLibrary}
        libraryTexts={t.builder.mediaLibrary}
      />

      <Select
        label={t.builder.background.positionLabel}
        options={positionOptions}
        value={config.position}
        onChange={(e) => onChange({ position: e.target.value as BackgroundPosition })}
      />

      <Switch
        label={t.builder.background.fullScreen}
        checked={config.fullScreen}
        onChange={(e) => onChange({ fullScreen: e.target.checked })}
      />
      <Switch
        label={t.builder.background.parallax}
        checked={config.parallax}
        onChange={(e) => onChange({ parallax: e.target.checked })}
      />
    </div>
  )
}
