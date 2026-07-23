import { Button, ButtonGroup, InputField, HexColorInput } from '@/shared/ui'
import { PermissionsSelector } from './PermissionsSelector'
import { useCreateUserGroupForm } from './CreateUserGroupForm.hooks'
import type { UseCreateUserGroupFormProps } from './CreateUserGroupForm.hooks'

export const CreateUserGroupForm = (props: UseCreateUserGroupFormProps) => {
  const {
    t,
    register,
    errors,
    busy,
    permissionsValue,
    setPermissionsValue,
    colorValue,
    setColor,
    catalog,
    onSubmit,
    handleCancel,
  } = useCreateUserGroupForm(props)

  return (
    <form onSubmit={onSubmit}>
      <div className="border-border bg-surface flex flex-col gap-4 rounded-xl border p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label={t.form.name}
            variant={errors.name ? 'error' : undefined}
            errorMessage={errors.name?.message}
            disabled={busy}
            {...register('name')}
          />
          <InputField
            label={t.form.description}
            variant={errors.description ? 'error' : undefined}
            errorMessage={errors.description?.message}
            disabled={busy}
            {...register('description')}
          />
          <HexColorInput
            label={t.form.color}
            value={colorValue}
            onChange={setColor}
            disabled={busy}
            errorMessage={errors.color?.message}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-foreground text-sm font-medium">
            {t.form.permissions}
          </label>
          <p className="text-muted text-xs">{t.form.permissionsHint}</p>
          <PermissionsSelector
            value={permissionsValue}
            onChange={setPermissionsValue}
            catalog={catalog}
            disabled={busy}
          />
        </div>

        <ButtonGroup className="pt-2">
          <Button
            variant="secondary"
            type="button"
            disabled={busy}
            onClick={handleCancel}
          >
            {t.form.cancelButton}
          </Button>
          <Button variant="primary" type="submit" loading={busy}>
            {t.form.createButton}
          </Button>
        </ButtonGroup>
      </div>
    </form>
  )
}
