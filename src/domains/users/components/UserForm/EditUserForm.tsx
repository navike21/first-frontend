import {
  Button,
  InputField,
  InputDate,
  Select,
  PhotoPicker,
  Switch,
} from '@/shared/ui'
import { PanelLayout } from './PanelLayout'
import { useEditUserForm } from './EditUserForm.hooks'
import type { UseEditUserFormProps } from './EditUserForm.hooks'

export const EditUserForm = (props: UseEditUserFormProps) => {
  const {
    t,
    register,
    errors,
    genderValue,
    groupValue,
    statusValue,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    onPhotoChange,
    onRemovePhoto,
    onGenderChange,
    onGroupChange,
    onStatusToggle,
  } = useEditUserForm(props)

  return (
    <form onSubmit={onSubmit}>
      <PanelLayout
        left={
          <>
            <PhotoPicker
              currentUrl={props.defaultValues.profilePictureUrl}
              uploadLabel={t.form.uploadPhoto}
              formatsHint={t.form.uploadFormats}
              onChange={onPhotoChange}
              onRemove={onRemovePhoto}
              removeLabel={t.form.removePhoto}
              disabled={busy}
            />
            <div className="w-full border-t border-(--border) pt-4">
              <Switch
                label={t.form.statusLabel}
                helperText={t.form.statusDescription}
                checked={statusValue === 'active'}
                onChange={() => onStatusToggle()}
                disabled={busy}
              />
            </div>
          </>
        }
        right={
          <>
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.firstName}
                placeholder={t.form.firstNamePlaceholder}
                variant={errors.firstName ? 'error' : undefined}
                errorMessage={errors.firstName?.message}
                {...register('firstName')}
              />
              <InputField
                label={t.form.lastName}
                placeholder={t.form.lastNamePlaceholder}
                variant={errors.lastName ? 'error' : undefined}
                errorMessage={errors.lastName?.message}
                {...register('lastName')}
              />
              <InputField
                label={t.form.phone}
                placeholder={t.form.phonePlaceholder}
                variant={errors.phone ? 'error' : undefined}
                errorMessage={errors.phone?.message}
                {...register('phone')}
              />
              <InputDate
                label={t.form.dateOfBirth}
                placeholder={t.form.dateOfBirthPlaceholder}
                mode="date"
                variant={errors.dateOfBirth ? 'error' : 'default'}
                errorMessage={errors.dateOfBirth?.message}
                defaultValue={props.defaultValues.dateOfBirth ?? ''}
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
                  value={groupValue ?? ''}
                  onChange={(e) => onGroupChange(e.target.value)}
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
              placeholder={t.form.addressStreetPlaceholder}
              {...register('address.street')}
            />
            <div className="grid grid-cols-2 gap-4">
              <InputField
                label={t.form.addressCity}
                placeholder={t.form.addressCityPlaceholder}
                {...register('address.city')}
              />
              <InputField
                label={t.form.addressState}
                placeholder={t.form.addressStatePlaceholder}
                {...register('address.state')}
              />
              <InputField
                label={t.form.addressCountry}
                placeholder={t.form.addressCountryPlaceholder}
                {...register('address.country')}
              />
              <InputField
                label={t.form.addressPostalCode}
                placeholder={t.form.addressPostalCodePlaceholder}
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
                {t.form.saveButton}
              </Button>
            </div>
          </>
        }
      />
    </form>
  )
}
