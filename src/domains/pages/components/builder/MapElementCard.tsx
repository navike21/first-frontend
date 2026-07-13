import { useState } from 'react'
import { Button, IconComponent, InputField, Modal, Switch } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderMapElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface MapElementCardProps {
  element: BuilderMapElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderMapElement>) => void
  onDelete: () => void
}

const parseCoord = (raw: string): number | undefined => {
  if (!raw.trim()) return undefined
  const n = Number(raw)
  return Number.isFinite(n) ? n : undefined
}

export const MapElementCard = ({ element, sectionId, columnId, language, onChange, onDelete }: MapElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiMapPin2Line"
      label={t.builder.mapElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-surface-subtle"
      >
        <IconComponent icon="RiMapPin2Line" className="h-5 w-5 shrink-0 text-muted" />
        {element.address ? (
          <span className="truncate text-xs text-foreground">{element.address}</span>
        ) : (
          <span className="text-xs text-muted">{t.builder.mapEmpty}</span>
        )}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.mapElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <InputField
            label={t.builder.mapAddressLabel}
            value={element.address}
            onChange={(e) => onChange({ address: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <InputField
              label={t.builder.mapLatLabel}
              inputMode="decimal"
              value={element.lat !== undefined ? String(element.lat) : ''}
              onChange={(e) => onChange({ lat: parseCoord(e.target.value) })}
            />
            <InputField
              label={t.builder.mapLngLabel}
              inputMode="decimal"
              value={element.lng !== undefined ? String(element.lng) : ''}
              onChange={(e) => onChange({ lng: parseCoord(e.target.value) })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <LangChips editing={editing} userLanguage={language} values={element.caption} onChange={setEditing} />
            <InputField
              label={t.builder.mapCaptionLabel}
              value={element.caption[editing] ?? ''}
              onChange={(e) => onChange({ caption: { ...element.caption, [editing]: e.target.value } })}
            />
          </div>
          <Switch
            label={t.builder.mapShowDirectionsLabel}
            helperText={t.builder.mapShowDirectionsHint}
            checked={element.showDirectionsButtons}
            onChange={(e) => onChange({ showDirectionsButtons: e.target.checked })}
          />
        </div>
      </Modal>
    </ElementShell>
  )
}
