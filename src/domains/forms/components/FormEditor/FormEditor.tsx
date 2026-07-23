import { useState, useMemo, useEffect } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  sortableKeyboardCoordinates,
  arrayMove,
} from '@dnd-kit/sortable'
import {
  InputField,
  TextArea,
  Select,
  Button,
  ButtonGroup,
  FormGrid,
  SectionLabel,
  LangSidebar,
  LangTabs,
} from '@/shared/ui'
import { requiredLabel } from '@/shared/lib'
import { applyServerFieldErrors } from '@/shared/lib/serverFormErrors'
import type { Language } from '@/shared/i18n'
import { useFormsTranslation } from '../../i18n'
import { createFormSchema } from '../../model/form.schema'
import type { FormFormData, FormFormField } from '../../model/form.schema'
import {
  emptyLocalized,
  createField,
  resetFieldForType,
} from '../../model/form.builder'
import type { FormFieldType } from '../../model/form.types'
import { FormFieldCard } from '../FormFieldCard'

export interface FormEditorProps {
  mode: 'create' | 'edit'
  initialValues?: Partial<FormFormData>
  isSubmitting: boolean
  submitError?: unknown
  onCancel: () => void
  onSubmit: (data: FormFormData) => void
}

export const FormEditor = ({
  mode,
  initialValues,
  isSubmitting,
  submitError,
  onCancel,
  onSubmit,
}: FormEditorProps) => {
  const { t, language } = useFormsTranslation()
  const schema = useMemo(
    () => createFormSchema(t.validation, language),
    [t.validation, language]
  )
  const [editing, setEditing] = useState<Language>(language)

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors },
  } = useForm<FormFormData>({
    resolver: zodResolver(schema) as Resolver<FormFormData>,
    mode: 'onTouched',
    defaultValues: {
      title: emptyLocalized(),
      description: emptyLocalized(),
      successMessage: emptyLocalized(),
      status: 'active',
      notificationEmails: '',
      fields: [],
      ...initialValues,
    },
  })

  useEffect(() => {
    if (submitError) applyServerFieldErrors(submitError, setError)
  }, [submitError, setError])

  const titleValue = useWatch({ control, name: 'title' })
  const descriptionValue = useWatch({ control, name: 'description' })
  const successMessageValue = useWatch({ control, name: 'successMessage' })
  const statusValue = useWatch({ control, name: 'status' })
  const fieldsValue = useWatch({ control, name: 'fields' }) ?? []

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const statusOptions = [
    { value: 'active', label: t.status.active },
    { value: 'inactive', label: t.status.inactive },
  ]

  const addField = (type: FormFieldType) =>
    setValue('fields', [...fieldsValue, createField(type)])
  const removeField = (index: number) =>
    setValue(
      'fields',
      fieldsValue.filter((_, i) => i !== index)
    )
  const updateField = (index: number, patch: Partial<FormFormField>) =>
    setValue(
      'fields',
      fieldsValue.map((f, i) => (i === index ? { ...f, ...patch } : f))
    )
  const changeFieldType = (index: number, type: FormFieldType) =>
    setValue(
      'fields',
      fieldsValue.map((f, i) => (i === index ? resetFieldForType(f, type) : f))
    )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const from = fieldsValue.findIndex((f) => f.fieldId === active.id)
    const to = fieldsValue.findIndex((f) => f.fieldId === over.id)
    if (from < 0 || to < 0) return
    setValue('fields', arrayMove(fieldsValue, from, to))
  }

  const submit = handleSubmit((data) => onSubmit(data))

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className="mb-4 lg:hidden">
        <LangTabs
          editingLanguage={editing}
          userLanguage={language}
          hasContent={(lang) => !!titleValue?.[lang]?.trim()}
          hasError={(lang) => !!errors.title?.[lang] || !!errors.fields}
          onChange={setEditing}
        />
      </div>
      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="hidden lg:block">
          <LangSidebar
            editingLanguage={editing}
            userLanguage={language}
            label={t.form.sectionGeneral}
            hasContent={(lang) => !!titleValue?.[lang]?.trim()}
            hasError={(lang) => !!errors.title?.[lang] || !!errors.fields}
            onChange={setEditing}
          />
        </div>

        <div className="flex flex-1 flex-col gap-6">
          <div className="border-border bg-surface rounded-xl border p-6">
            <SectionLabel>{t.form.sectionGeneral}</SectionLabel>
            <FormGrid>
              <InputField
                label={requiredLabel(t.form.title)}
                value={titleValue?.[editing] ?? ''}
                onChange={(e) =>
                  setValue('title', {
                    ...titleValue,
                    [editing]: e.target.value,
                  })
                }
                errorMessage={errors.title?.[editing]?.message}
              />
              <Select
                label={t.form.status}
                options={statusOptions}
                value={statusValue}
                lang={language}
                onChange={(e) =>
                  setValue('status', e.target.value as FormFormData['status'])
                }
              />
              <TextArea
                label={t.form.description}
                value={descriptionValue?.[editing] ?? ''}
                onChange={(e) =>
                  setValue('description', {
                    ...descriptionValue,
                    [editing]: e.target.value,
                  })
                }
              />
              <TextArea
                label={t.form.successMessage}
                value={successMessageValue?.[editing] ?? ''}
                onChange={(e) =>
                  setValue('successMessage', {
                    ...successMessageValue,
                    [editing]: e.target.value,
                  })
                }
              />
            </FormGrid>
          </div>

          <div className="border-border bg-surface rounded-xl border p-6">
            <SectionLabel>{t.form.sectionNotifications}</SectionLabel>
            <FormGrid>
              <InputField
                label={t.form.notificationEmails}
                helperText={t.form.notificationEmailsHint}
                {...register('notificationEmails')}
              />
            </FormGrid>
          </div>

          <div className="border-border bg-surface rounded-xl border p-6">
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel>{t.form.sectionFields}</SectionLabel>
            </div>

            {errors.fields?.root?.message && (
              <p className="text-error mb-3 text-sm">
                {errors.fields.root.message}
              </p>
            )}

            {fieldsValue.length === 0 ? (
              <p className="text-muted mb-4 text-sm">{t.form.noFields}</p>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={fieldsValue.map((f) => f.fieldId ?? '')}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="mb-4 flex flex-col gap-3">
                    {fieldsValue.map((field, index) => (
                      <FormFieldCard
                        key={field.fieldId}
                        id={field.fieldId ?? ''}
                        field={field}
                        editingLanguage={editing}
                        onChange={(patch) => updateField(index, patch)}
                        onTypeChange={(type) => changeFieldType(index, type)}
                        onRemove={() => removeField(index)}
                        errorMessage={
                          errors.fields?.[index]?.label?.[editing]?.message
                        }
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}

            <div className="flex flex-wrap gap-2">
              {(
                [
                  'text',
                  'textarea',
                  'email',
                  'phone',
                  'select',
                  'radio',
                  'checkbox',
                  'date',
                ] as FormFieldType[]
              ).map((type) => (
                <Button
                  key={type}
                  variant="secondary"
                  size="small"
                  onClick={() => addField(type)}
                >
                  {t.form.addField}: {t.fieldTypes[type]}
                </Button>
              ))}
            </div>
          </div>

          <ButtonGroup className="border-border border-t pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t.form.cancel}
            </Button>
            <Button
              type="button"
              variant="primary"
              loading={isSubmitting}
              onClick={() => {
                void submit()
              }}
            >
              {mode === 'create' ? t.form.create : t.form.save}
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </form>
  )
}
