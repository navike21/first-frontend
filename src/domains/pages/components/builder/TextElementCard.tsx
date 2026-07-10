import { useState } from 'react'
import { RichTextArea } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderTextElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface TextElementCardProps {
  element: BuilderTextElement
  language: Language
  onChange: (patch: Partial<BuilderTextElement>) => void
  onDelete: () => void
}

export const TextElementCard = ({ element, language, onChange, onDelete }: TextElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)

  return (
    <ElementShell
      id={element.id}
      icon="RiText"
      label={t.builder.textElement}
      dragLabel={t.builder.dragElement}
      deleteLabel={t.builder.deleteElement}
      onDelete={onDelete}
    >
      <LangChips editing={editing} userLanguage={language} values={element.html} onChange={setEditing} />
      <RichTextArea
        key={`${element.id}-${editing}`}
        value={element.html[editing] ?? ''}
        minRows={3}
        onChange={(html) => onChange({ html: { ...element.html, [editing]: html } })}
      />
    </ElementShell>
  )
}
