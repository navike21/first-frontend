import { Button, InputField, Select, PhotoPicker } from '@/shared/ui'
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
    setPendingFile,
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
              onChange={setPendingFile}
              disabled={busy}
            />
            <div className="w-full border-t border-slate-200 pt-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-slate-700">{t.form.statusLabel}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{t.form.statusDescription}</p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={statusValue === 'active'}
                  disabled={busy}
                  onClick={onStatusToggle}
                  className={`relative mt-0.5 inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 ${
                    statusValue === 'active' ? 'bg-green-500' : 'bg-slate-300'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                      statusValue === 'active' ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
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
              <InputField
                label={t.form.dateOfBirth}
                placeholder={t.form.dateOfBirthPlaceholder}
                variant={errors.dateOfBirth ? 'error' : undefined}
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
                  value={groupValue ?? ''}
                  onChange={(e) => onGroupChange(e.target.value)}
                  placeholder={t.form.groupIdPlaceholder}
                />
              ) : (
                <div />
              )}
            </div>

            <p className="text-sm font-medium text-slate-600">{t.form.addressSection}</p>
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
              <Button variant="secondary" type="button" disabled={busy} onClick={handleCancel}>
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
