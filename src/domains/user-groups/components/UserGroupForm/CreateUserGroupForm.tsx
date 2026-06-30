import clsx from 'clsx'
import { Button, InputField } from '@/shared/ui'
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
      <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
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
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-foreground">
              {t.form.color}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={colorValue}
                onChange={(e) => setColor(e.target.value)}
                disabled={busy}
                className={clsx(
                  'h-9 w-14 cursor-pointer p-0.5',
                  'rounded border border-border',
                  'disabled:cursor-not-allowed'
                )}
              />
              <input
                type="text"
                value={colorValue}
                onChange={(e) => setColor(e.target.value)}
                disabled={busy}
                maxLength={7}
                className={clsx(
                  'h-9 w-28 px-3',
                  'rounded-lg border border-border bg-surface text-sm text-foreground',
                  'focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none',
                  'disabled:cursor-not-allowed disabled:bg-surface-subtle'
                )}
              />
            </div>
            {errors.color && (
              <p className="text-xs text-red-500">{errors.color.message}</p>
            )}
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
            value={permissionsValue}
            onChange={setPermissionsValue}
            catalog={catalog}
            disabled={busy}
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
          <Button variant="primary" type="submit" loading={busy}>
            {t.form.createButton}
          </Button>
        </div>
      </div>
    </form>
  )
}
