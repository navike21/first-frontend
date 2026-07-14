import clsx from 'clsx'
import { Button, InputField, Switch, HexColorInput } from '@/shared/ui'
import { PermissionsSelector } from './PermissionsSelector'
import { useEditUserGroupForm } from './EditUserGroupForm.hooks'
import type { UseEditUserGroupFormProps } from './EditUserGroupForm.hooks'

export const EditUserGroupForm = (props: UseEditUserGroupFormProps) => {
  const {
    t,
    register,
    errors,
    busy,
    isSystem,
    permissionsValue,
    setPermissionsValue,
    colorValue,
    setColor,
    statusValue,
    onStatusToggle,
    catalog,
    onSubmit,
    handleCancel,
  } = useEditUserGroupForm(props)

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
        {isSystem && (
          <div
            className={clsx(
              'flex items-center gap-2 px-4 py-3',
              'rounded-lg border border-amber-200 bg-amber-50 text-sm text-amber-700 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-400'
            )}
          >
            <span>{t.form.systemNotice}</span>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputField
            label={t.form.name}
            variant={errors.name ? 'error' : undefined}
            errorMessage={errors.name?.message}
            disabled={busy || isSystem}
            {...register('name')}
          />
          <InputField
            label={t.form.description}
            variant={errors.description ? 'error' : undefined}
            errorMessage={errors.description?.message}
            disabled={busy || isSystem}
            {...register('description')}
          />
          <HexColorInput
            label={t.form.color}
            value={colorValue ?? props.defaultValues.color}
            onChange={setColor}
            disabled={busy || isSystem}
            errorMessage={errors.color?.message}
          />

          <div className="flex items-end pb-1">
            <Switch
              label={t.form.statusLabel}
              helperText={t.form.statusDescription}
              checked={statusValue === 'active'}
              onChange={() => onStatusToggle()}
              disabled={busy || isSystem}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-foreground">
            {t.form.permissions}
          </label>
          <p className="text-xs text-muted">
            {t.form.permissionsHint}
          </p>
          <PermissionsSelector
            value={permissionsValue ?? []}
            onChange={setPermissionsValue}
            catalog={catalog}
            disabled={busy || isSystem}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="secondary"
            type="button"
            disabled={busy}
            onClick={handleCancel}
          >
            {t.form.cancelButton}
          </Button>
          <Button
            variant="primary"
            type="submit"
            loading={busy}
            disabled={isSystem}
          >
            {t.form.saveButton}
          </Button>
        </div>
      </div>
    </form>
  )
}
