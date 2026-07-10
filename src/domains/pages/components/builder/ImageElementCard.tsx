import { useRef, useState } from 'react'
import { Button, InputField, FadeCollapse } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderImageElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface ImageElementCardProps {
  element: BuilderImageElement
  language: Language
  onChange: (patch: Partial<BuilderImageElement>) => void
  onPickFile: (file: File) => void
  onDelete: () => void
}

export const ImageElementCard = ({ element, language, onChange, onPickFile, onDelete }: ImageElementCardProps) => {
  const { t } = usePagesTranslation()
  const inputRef = useRef<HTMLInputElement>(null)
  const [editing, setEditing] = useState<Language>(language)
  const [altOpen, setAltOpen] = useState(false)

  const handleFile = (file: File | undefined) => {
    if (file) onPickFile(file)
  }

  return (
    <ElementShell
      id={element.id}
      icon="RiImageLine"
      label={t.builder.imageElement}
      dragLabel={t.builder.dragElement}
      deleteLabel={t.builder.deleteElement}
      onDelete={onDelete}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {element.url ? (
        <img src={element.url} alt={element.alt[language] || ''} className="max-h-40 w-full rounded-md object-cover" />
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-full items-center justify-center rounded-md border border-dashed border-border text-xs text-muted transition-colors hover:border-primary-600/50 hover:text-foreground"
        >
          {t.builder.imageSelect}
        </button>
      )}

      <div className="flex items-center gap-2">
        <Button type="button" variant="outline" size="small" onClick={() => inputRef.current?.click()}>
          {element.url ? t.builder.imageReplace : t.builder.imageSelect}
        </Button>
        <Button type="button" variant="secondary" size="small" onClick={() => setAltOpen((v) => !v)}>
          {t.builder.imageAlt}
        </Button>
      </div>

      <FadeCollapse show={altOpen}>
        <div className="flex flex-col gap-1.5 pt-1">
          <LangChips editing={editing} userLanguage={language} values={element.alt} onChange={setEditing} />
          <InputField
            label={t.builder.imageAlt}
            value={element.alt[editing] ?? ''}
            onChange={(e) => onChange({ alt: { ...element.alt, [editing]: e.target.value } })}
          />
        </div>
      </FadeCollapse>
    </ElementShell>
  )
}
