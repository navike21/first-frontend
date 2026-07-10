import { useRef, useState } from 'react'
import clsx from 'clsx'
import { Button, InputField, Modal, Select } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderImageElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface ImageElementCardProps {
  element: BuilderImageElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderImageElement>) => void
  onPickFile: (file: File) => void
  onDelete: () => void
}

const ALIGN_CLASS: Record<BuilderImageElement['align'], string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const ImageElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onPickFile,
  onDelete,
}: ImageElementCardProps) => {
  const { t } = usePagesTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)

  const alignOptions: { value: BuilderImageElement['align']; label: string }[] = [
    { value: 'left', label: t.builder.alignLeft },
    { value: 'center', label: t.builder.alignCenter },
    { value: 'right', label: t.builder.alignRight },
  ]

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiImageLine"
      label={t.builder.imageElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onPickFile(file)
          e.target.value = ''
        }}
      />

      {element.url ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={clsx('flex w-full rounded-md transition-colors hover:bg-surface-subtle', ALIGN_CLASS[element.align])}
        >
          <img
            src={element.url}
            alt={element.alt[language] || ''}
            className="max-h-40 rounded-md object-cover"
            style={{
              ...(element.width && { width: element.width }),
              ...(element.height && { height: element.height }),
            }}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.imageSelect}
        </button>
      )}

      {/* Editor de imagen: 2 columnas — preview/reemplazo | opciones */}
      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.imageElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-3">
            {element.url ? (
              <div className={clsx('flex rounded-lg border border-border bg-surface-subtle p-2', ALIGN_CLASS[element.align])}>
                <img
                  src={element.url}
                  alt={element.alt[editing] || ''}
                  className="max-h-56 rounded-md object-contain"
                  style={{
                    ...(element.width && { width: element.width }),
                    ...(element.height && { height: element.height }),
                  }}
                />
              </div>
            ) : (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-xs text-muted">
                {t.builder.imageSelect}
              </div>
            )}
            <Button type="button" variant="outline" size="small" onClick={() => inputRef.current?.click()}>
              {element.url ? t.builder.imageReplace : t.builder.imageSelect}
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <InputField
              label={t.builder.widthLabel}
              helperText={t.builder.sizeHint}
              value={element.width}
              onChange={(e) => onChange({ width: e.target.value.trim() })}
            />
            <InputField
              label={t.builder.heightLabel}
              helperText={t.builder.sizeHint}
              value={element.height}
              onChange={(e) => onChange({ height: e.target.value.trim() })}
            />
            <Select
              label={t.builder.alignLabel}
              options={alignOptions}
              value={element.align}
              lang={language}
              onChange={(e) => onChange({ align: e.target.value as BuilderImageElement['align'] })}
            />
            <div className="flex flex-col gap-1.5">
              <LangChips editing={editing} userLanguage={language} values={element.alt} onChange={setEditing} />
              <InputField
                label={t.builder.imageAlt}
                value={element.alt[editing] ?? ''}
                onChange={(e) => onChange({ alt: { ...element.alt, [editing]: e.target.value } })}
              />
            </div>
          </div>
        </div>
      </Modal>
    </ElementShell>
  )
}
