import {
  InputField,
  InputNumber,
  InputDate,
  Select,
  PhotoPicker,
  Switch,
  Wizard,
} from '@/shared/ui'
import { PanelLayout } from './PanelLayout'
import { useEditUserForm } from './EditUserForm.hooks'
import type { UseEditUserFormProps } from './EditUserForm.hooks'

export const EditUserForm = (
  props: UseEditUserFormProps & { isProfile?: boolean }
) => {
  const {
    t,
    register,
    errors,
    genderValue,
    groupIdsValue,
    statusValue,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    onPhotoChange,
    onRemovePhoto,
    onGenderChange,
    onGroupsChange,
    onStatusToggle,
    activeTab,
    steps,
    reachedIndex,
    goToStep,
    handleNext,
    handleBack,
  } = useEditUserForm(props)

  return (
    <form onSubmit={(e) => e.preventDefault()}>
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
            {!props.isProfile && (
              <div className="w-full border-t border-border pt-4">
                <Switch
                  label={t.form.statusLabel}
                  helperText={t.form.statusDescription}
                  checked={statusValue === 'active'}
                  onChange={() => onStatusToggle()}
                  disabled={busy}
                />
              </div>
            )}
          </>
        }
        right={
          <>
            <Wizard
              steps={steps}
              current={activeTab}
              reachedIndex={reachedIndex}
              onStepChange={goToStep}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={onSubmit}
              onCancel={handleCancel}
              isSubmitting={busy}
              backLabel={t.form.back}
              nextLabel={t.form.next}
              submitLabel={t.form.saveButton}
              cancelLabel={t.form.cancelButton}
              optionalLabel={t.form.optional}
            >

            {/* ── Personal details ─────────────────────────────────────────── */}
            <div
              hidden={activeTab !== 'personal'}
              className="animate-tab-fade flex flex-col gap-y-6"
            >
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
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
              {/* Email is immutable on edit (read-only). */}
              <InputField
                label={t.form.email}
                type="email"
                disabled
                defaultValue={props.defaultValues.email ?? ''}
              />
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
                <Select
                  label={t.form.gender}
                  options={genderOptions}
                  value={genderValue ?? ''}
                  onChange={(e) => onGenderChange(e.target.value)}
                  placeholder={t.form.genderPlaceholder}
                  variant={errors.gender ? 'error' : 'default'}
                  errorMessage={errors.gender?.message}
                />
                <InputDate
                  label={t.form.dateOfBirth}
                  mode="date"
                  variant={errors.dateOfBirth ? 'error' : 'default'}
                  errorMessage={errors.dateOfBirth?.message}
                  defaultValue={
                    props.defaultValues.dateOfBirth?.slice(0, 10) ?? ''
                  }
                  {...register('dateOfBirth')}
                />
                <InputNumber
                  label={t.form.phone}
                  mask="+## ### ### ###"
                  variant={errors.phone ? 'error' : undefined}
                  errorMessage={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <p className="text-sm font-medium text-secondary">
                {t.form.addressSection}
              </p>
              <InputField
                label={t.form.addressStreet}
                variant={errors.address?.street ? 'error' : undefined}
                errorMessage={errors.address?.street?.message}
                {...register('address.street')}
              />
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
                <InputField
                  label={t.form.addressCity}
                  variant={errors.address?.city ? 'error' : undefined}
                  errorMessage={errors.address?.city?.message}
                  {...register('address.city')}
                />
                <InputField
                  label={t.form.addressState}
                  variant={errors.address?.state ? 'error' : undefined}
                  errorMessage={errors.address?.state?.message}
                  {...register('address.state')}
                />
                <InputField
                  label={t.form.addressCountry}
                  variant={errors.address?.country ? 'error' : undefined}
                  errorMessage={errors.address?.country?.message}
                  {...register('address.country')}
                />
              </div>
            </div>

            {/* ── Account & access ─────────────────────────────────────────── */}
            <div
              hidden={activeTab !== 'account'}
              className="animate-tab-fade flex flex-col gap-y-6"
            >
              <p className="text-sm font-medium text-secondary">
                {t.form.authSection}
              </p>
              <div className="grid grid-cols-1 gap-x-4 gap-y-6 xl:grid-cols-2">
                <InputField
                  label={t.form.newPassword}
                  type="password"
                  helperText={t.form.passwordKeepHint}
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
              {!props.isProfile && (
                <Select
                  label={t.form.groupId}
                  options={groupOptions}
                  multiple
                  search
                  disabled={groupOptions.length === 0}
                  value={groupIdsValue ?? []}
                  onChange={(e) =>
                    onGroupsChange(
                      Array.from(e.target.selectedOptions, (o) => o.value)
                    )
                  }
                  placeholder={t.form.groupIdPlaceholder}
                  helperText={
                    groupOptions.length === 0 ? t.form.groupsEmpty : undefined
                  }
                />
              )}
            </div>

            </Wizard>
          </>
        }
      />
    </form>
  )
}
