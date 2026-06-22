import { Button, InputField, InputDate, Select, PhotoPicker } from '@/shared/ui'
import { PanelLayout } from './PanelLayout'
import { useCreateUserForm } from './CreateUserForm.hooks'
import type { UseCreateUserFormProps } from './CreateUserForm.hooks'

export const CreateUserForm = (props: UseCreateUserFormProps) => {
  const {
    t,
    register,
    errors,
    genderValue,
    groupIdsValue,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    setPendingFile,
    onGenderChange,
    onGroupsChange,
  } = useCreateUserForm(props)

  return (
    <form onSubmit={onSubmit}>
      <PanelLayout
        left={
          <PhotoPicker
            uploadLabel={t.form.uploadPhoto}
            formatsHint={t.form.uploadFormats}
            onChange={setPendingFile}
            disabled={busy}
          />
        }
        right={
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.firstName}
                variant={errors.firstName ? 'error' : undefined}
                errorMessage={errors.firstName?.message}
                {...register('firstName')}
              />
              <InputField
                label={t.form.lastName}
                variant={errors.lastName ? 'error' : undefined}
                errorMessage={errors.lastName?.message}
                {...register('lastName')}
              />
            </div>

            {/* Authentication — kept separate from the profile data */}
            <p className="text-sm font-medium text-(--text-secondary)">
              {t.form.authSection}
            </p>
            <InputField
              label={t.form.email}
              type="email"
              variant={errors.email ? 'error' : undefined}
              errorMessage={errors.email?.message}
              {...register('email')}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.password}
                type="password"
                variant={errors.password ? 'error' : undefined}
                errorMessage={errors.password?.message}
                {...register('password')}
              />
              <InputField
                label={t.form.confirmPassword}
                type="password"
                variant={errors.confirmPassword ? 'error' : undefined}
                errorMessage={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.phone}
                variant={errors.phone ? 'error' : undefined}
                errorMessage={errors.phone?.message}
                {...register('phone')}
              />
              <InputDate
                label={t.form.dateOfBirth}
                mode="date"
                variant={errors.dateOfBirth ? 'error' : 'default'}
                errorMessage={errors.dateOfBirth?.message}
                {...register('dateOfBirth')}
              />
              <Select
                label={t.form.gender}
                options={genderOptions}
                value={genderValue ?? ''}
                onChange={(e) => onGenderChange(e.target.value)}
                placeholder={t.form.genderPlaceholder}
              />
              {groupOptions.length > 0 ? (
                <Select
                  label={t.form.groupId}
                  options={groupOptions}
                  multiple
                  search
                  value={groupIdsValue ?? []}
                  onChange={(e) =>
                    onGroupsChange(
                      Array.from(e.target.selectedOptions, (o) => o.value)
                    )
                  }
                  placeholder={t.form.groupIdPlaceholder}
                />
              ) : (
                <div />
              )}
            </div>

            <p className="text-sm font-medium text-(--text-secondary)">
              {t.form.addressSection}
            </p>
            <InputField
              label={t.form.addressStreet}
              {...register('address.street')}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.addressCity}
                {...register('address.city')}
              />
              <InputField
                label={t.form.addressState}
                {...register('address.state')}
              />
              <InputField
                label={t.form.addressCountry}
                {...register('address.country')}
              />
              <InputField
                label={t.form.addressPostalCode}
                {...register('address.postalCode')}
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
          </>
        }
      />
    </form>
  )
}
