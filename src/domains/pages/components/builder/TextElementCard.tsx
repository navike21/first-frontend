import { useState } from 'react'
import { Button, Modal, RichTextArea } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import { isEmptyHtml } from '../../model/pageTranslationProgress'
import type { BuilderTextElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface TextElementCardProps {
  element: BuilderTextElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderTextElement>) => void
  onDelete: () => void
}

const PROSE =
  'prose-sm text-sm leading-relaxed text-foreground [&_a]:text-primary-600 [&_a]:underline [&_h1]:text-xl [&_h1]:font-bold [&_h2]:text-lg [&_h2]:font-bold [&_h3]:text-base [&_h3]:font-semibold [&_li]:ml-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_p]:mb-1 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4'

export const TextElementCard = ({ element, sectionId, columnId, language, onChange, onDelete }: TextElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)

  const raw = element.html[language] ?? ''
  const fallback = element.html.en ?? ''
  let preview = ''
  if (!isEmptyHtml(raw)) preview = raw
  else if (!isEmptyHtml(fallback)) preview = fallback

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiText"
      label={t.builder.textElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      <button type="button" onClick={() => setOpen(true)} className="cursor-pointer rounded-md text-left transition-colors hover:bg-surface-subtle">
        {preview ? (
          <div className={`${PROSE} max-h-40 overflow-hidden px-1 py-0.5`} dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <p className="px-1 py-2 text-xs text-muted">{t.builder.textEmpty}</p>
        )}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.textElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-3">
          <LangChips editing={editing} userLanguage={language} values={element.html} onChange={setEditing} />
          <RichTextArea
            key={`${element.id}-${editing}`}
            value={element.html[editing] ?? ''}
            minRows={8}
            onChange={(html) => onChange({ html: { ...element.html, [editing]: html } })}
          />
        </div>
      </Modal>
    </ElementShell>
  )
}
