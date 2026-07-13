import { useState } from 'react'
import { Button, IconComponent, InputField, Modal } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderVideoElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface VideoElementCardProps {
  element: BuilderVideoElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderVideoElement>) => void
  onDelete: () => void
}

export const VideoElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onDelete,
}: VideoElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiVideoLine"
      label={t.builder.videoElement}
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
        <IconComponent icon="RiVideoLine" className="h-5 w-5 shrink-0 text-muted" />
        {element.url ? (
          <span className="truncate text-xs text-foreground">{element.url}</span>
        ) : (
          <span className="text-xs text-muted">{t.builder.videoEmpty}</span>
        )}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.videoElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <InputField
            label={t.builder.videoUrlLabel}
            helperText={t.builder.videoUrlHint}
            value={element.url}
            onChange={(e) => onChange({ url: e.target.value.trim() })}
          />
          <div className="flex flex-col gap-2">
            <LangChips editing={editing} userLanguage={language} values={element.caption} onChange={setEditing} />
            <InputField
              label={t.builder.videoCaptionLabel}
              value={element.caption[editing] ?? ''}
              onChange={(e) => onChange({ caption: { ...element.caption, [editing]: e.target.value } })}
            />
          </div>
        </div>
      </Modal>
    </ElementShell>
  )
}
