import { useState } from 'react'
import clsx from 'clsx'
import { Button, InputField, Modal, Select } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { usePagesTranslation } from '../../i18n'
import type { BuilderButtonElement } from '../../model/page.types'
import { LangChips } from './LangChips'
import { ElementShell } from './ElementShell'

export interface ButtonElementCardProps {
  element: BuilderButtonElement
  sectionId: string
  columnId: string
  language: Language
  onChange: (patch: Partial<BuilderButtonElement>) => void
  onDelete: () => void
}

const ALIGN_CLASS: Record<BuilderButtonElement['align'], string> = {
  left: 'justify-start',
  center: 'justify-center',
  right: 'justify-end',
}

export const ButtonElementCard = ({
  element,
  sectionId,
  columnId,
  language,
  onChange,
  onDelete,
}: ButtonElementCardProps) => {
  const { t } = usePagesTranslation()
  const [editing, setEditing] = useState<Language>(language)
  const [open, setOpen] = useState(false)

  const label = element.label[language] || element.label.en

  const variantOptions: { value: BuilderButtonElement['variant']; label: string }[] = [
    { value: 'primary', label: t.builder.buttonVariant.primary },
    { value: 'secondary', label: t.builder.buttonVariant.secondary },
    { value: 'outline', label: t.builder.buttonVariant.outline },
  ]
  const alignOptions: { value: BuilderButtonElement['align']; label: string }[] = [
    { value: 'left', label: t.builder.alignLeft },
    { value: 'center', label: t.builder.alignCenter },
    { value: 'right', label: t.builder.alignRight },
  ]
  const targetOptions: { value: BuilderButtonElement['target']; label: string }[] = [
    { value: '_self', label: t.builder.buttonTargetSelf },
    { value: '_blank', label: t.builder.buttonTargetBlank },
  ]

  return (
    <ElementShell
      id={element.id}
      sectionId={sectionId}
      columnId={columnId}
      icon="RiCursorLine"
      label={t.builder.buttonElement}
      dragLabel={t.builder.dragElement}
      editLabel={t.builder.edit}
      deleteLabel={t.builder.deleteElement}
      onEdit={() => setOpen(true)}
      onDelete={onDelete}
    >
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={clsx('flex w-full rounded-md p-1 transition-colors hover:bg-surface-subtle', ALIGN_CLASS[element.align])}
      >
        {label ? (
          <span
            className={clsx(
              'inline-flex items-center rounded-md px-4 py-2 text-xs font-medium',
              element.variant === 'primary' && 'bg-primary-700 text-white',
              element.variant === 'secondary' && 'text-primary-700 ring-1 ring-primary-700 ring-inset',
              element.variant === 'outline' && 'text-primary-700 ring-1 ring-primary-700 ring-inset',
            )}
          >
            {label}
          </span>
        ) : (
          <span className="px-1 py-2 text-xs text-muted">{t.builder.buttonEmpty}</span>
        )}
      </button>

      <Modal
        isOpen={open}
        onClose={() => setOpen(false)}
        size="lg"
        title={t.builder.buttonElement}
        footer={
          <Button variant="primary" onClick={() => setOpen(false)}>
            {t.builder.done}
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <LangChips editing={editing} userLanguage={language} values={element.label} onChange={setEditing} />
            <InputField
              label={t.builder.buttonLabel}
              value={element.label[editing] ?? ''}
              onChange={(e) => onChange({ label: { ...element.label, [editing]: e.target.value } })}
            />
          </div>
          <InputField
            label={t.builder.buttonUrl}
            value={element.url}
            onChange={(e) => onChange({ url: e.target.value.trim() })}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Select
              label={t.builder.buttonVariantLabel}
              options={variantOptions}
              value={element.variant}
              lang={language}
              onChange={(e) => onChange({ variant: e.target.value as BuilderButtonElement['variant'] })}
            />
            <Select
              label={t.builder.alignLabel}
              options={alignOptions}
              value={element.align}
              lang={language}
              onChange={(e) => onChange({ align: e.target.value as BuilderButtonElement['align'] })}
            />
            <Select
              label={t.builder.buttonTargetLabel}
              options={targetOptions}
              value={element.target}
              lang={language}
              onChange={(e) => onChange({ target: e.target.value as BuilderButtonElement['target'] })}
            />
          </div>
        </div>
      </Modal>
    </ElementShell>
  )
}
