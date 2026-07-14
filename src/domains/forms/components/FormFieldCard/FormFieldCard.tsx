import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { InputField, InputNumber, Select, Switch, Button, IconButton, SortableItemActions } from '@/shared/ui'
import type { Language } from '@/shared/i18n'
import { useFormsTranslation } from '../../i18n'
import { FORM_FIELD_TYPES } from '../../model/form.schema'
import { emptyOption } from '../../model/form.builder'
import type { FormFormField } from '../../model/form.schema'
import type { FormFieldType } from '../../model/form.types'

export interface FormFieldCardProps {
  field: FormFormField
  id: string
  editingLanguage: Language
  onChange: (patch: Partial<FormFormField>) => void
  onTypeChange: (type: FormFieldType) => void
  onRemove: () => void
  errorMessage?: string
}

const CHOICE_TYPES: FormFieldType[] = ['select', 'radio']
const LENGTH_TYPES: FormFieldType[] = ['text', 'textarea', 'phone']

export const FormFieldCard = ({
  field,
  id,
  editingLanguage,
  onChange,
  onTypeChange,
  onRemove,
  errorMessage,
}: FormFieldCardProps) => {
  const { t } = useFormsTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const typeOptions = FORM_FIELD_TYPES.map((type) => ({
    value: type,
    label: t.fieldTypes[type],
  }))

  const isChoiceType = CHOICE_TYPES.includes(field.type)
  const showMaxLength = LENGTH_TYPES.includes(field.type)

  const updateOption = (index: number, patch: Partial<{ value: string; label: Record<Language, string> }>) => {
    const options = field.options.map((o, i) => (i === index ? { ...o, ...patch } : o))
    onChange({ options })
  }
  const addOption = () => onChange({ options: [...field.options, emptyOption()] })
  const removeOption = (index: number) => onChange({ options: field.options.filter((_, i) => i !== index) })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={clsx(
        'flex flex-col gap-3 rounded-lg border border-border bg-surface-subtle p-4',
        isDragging && 'opacity-50'
      )}
    >
      <SortableItemActions
        dragLabel={t.form.dragField}
        removeLabel={t.form.removeField}
        attributes={attributes}
        listeners={listeners}
        onRemove={onRemove}
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Select
          label={t.form.fieldType}
          options={typeOptions}
          value={field.type}
          onChange={(e) => onTypeChange(e.target.value as FormFieldType)}
        />
        <InputField
          label={t.form.fieldLabel}
          value={field.label[editingLanguage] ?? ''}
          onChange={(e) => onChange({ label: { ...field.label, [editingLanguage]: e.target.value } })}
          errorMessage={errorMessage}
        />
        <InputField
          label={t.form.fieldPlaceholder}
          value={field.placeholder[editingLanguage] ?? ''}
          onChange={(e) => onChange({ placeholder: { ...field.placeholder, [editingLanguage]: e.target.value } })}
        />
        {showMaxLength && (
          <InputNumber
            label={t.form.fieldMaxLength}
            min={1}
            defaultValue={field.maxLength ? String(field.maxLength) : ''}
            onBlur={(e) => {
              const raw = e.target.value ? Number(e.target.value) : undefined
              onChange({ maxLength: raw })
            }}
          />
        )}
      </div>

      <Switch
        label={t.form.fieldRequired}
        checked={field.required}
        onChange={(e) => onChange({ required: e.target.checked })}
      />

      {isChoiceType && (
        <div className="flex flex-col gap-2 rounded-md border border-border bg-surface p-3">
          <span className="text-sm font-medium text-foreground">{t.form.fieldOptions}</span>
          {field.options.map((option, index) => (
            <div key={index} className="flex items-end gap-2">
              <InputField
                label={t.form.optionValue}
                value={option.value}
                onChange={(e) => updateOption(index, { value: e.target.value })}
              />
              <InputField
                label={t.form.optionLabel}
                value={option.label[editingLanguage] ?? ''}
                onChange={(e) =>
                  updateOption(index, { label: { ...option.label, [editingLanguage]: e.target.value } })
                }
              />
              <IconButton
                icon="RiDeleteBinLine"
                variant="text"
                size="small"
                aria-label={t.form.removeOption}
                onClick={() => removeOption(index)}
              />
            </div>
          ))}
          <Button variant="secondary" onClick={addOption}>
            {t.form.addOption}
          </Button>
        </div>
      )}
    </div>
  )
}
