import clsx from 'clsx'
import { Button, InputField, Switch } from '@/shared/ui'
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
      <div className="flex flex-col gap-4 rounded-xl border border-(--border) bg-(--surface) p-6">
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
            placeholder={t.form.namePlaceholder}
            variant={errors.name ? 'error' : undefined}
            errorMessage={errors.name?.message}
            disabled={busy || isSystem}
            {...register('name')}
          />
          <InputField
            label={t.form.description}
            placeholder={t.form.descriptionPlaceholder}
            variant={errors.description ? 'error' : undefined}
            errorMessage={errors.description?.message}
            disabled={busy || isSystem}
            {...register('description')}
          />
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-(--text-primary)">
              {t.form.color}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorValue ?? props.defaultValues.color}
                onChange={(e) => setColor(e.target.value)}
                disabled={busy || isSystem}
                className={clsx(
                  'h-9 w-14 cursor-pointer p-0.5',
                  'rounded border border-(--border)',
                  'disabled:cursor-not-allowed'
                )}
              />
              <input
                type="text"
                value={colorValue ?? props.defaultValues.color}
                onChange={(e) => setColor(e.target.value)}
                disabled={busy || isSystem}
                maxLength={7}
                className={clsx(
                  'h-9 w-28 px-3',
                  'rounded-lg border border-(--border) bg-(--surface) text-sm text-(--text-primary)',
                  'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none',
                  'disabled:cursor-not-allowed disabled:bg-(--surface-subtle)'
                )}
              />
            </div>
            {errors.color && (
              <p className="text-xs text-red-500">{errors.color.message}</p>
            )}
          </div>

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
          <label className="text-sm font-medium text-(--text-primary)">
            {t.form.permissions}
          </label>
          <p className="text-xs text-(--text-muted)">
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
