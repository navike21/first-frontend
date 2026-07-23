import {
  InputField,
  InputNumber,
  InputDate,
  Select,
  PhotoPicker,
  Wizard,
  LocationSelect,
  FormGrid,
  PanelLayout,
} from '@/shared/ui'
import { useCreateUserForm } from './CreateUserForm.hooks'
import type { UseCreateUserFormProps } from './CreateUserForm.hooks'

export const CreateUserForm = (props: UseCreateUserFormProps) => {
  const {
    t,
    language,
    register,
    errors,
    genderValue,
    groupIdsValue,
    addressCountry,
    addressUbigeoCode,
    addressRegion,
    addressProvince,
    addressDistrict,
    genderOptions,
    groupOptions,
    busy,
    onSubmit,
    handleCancel,
    onPickFile,
    onSelectLibrary,
    libraryUrl,
    onGenderChange,
    onGroupsChange,
    onAddressChange,
    activeTab,
    steps,
    reachedIndex,
    goToStep,
    handleNext,
    handleBack,
  } = useCreateUserForm(props)

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <PanelLayout
        left={
          <PhotoPicker
            currentUrl={libraryUrl ?? undefined}
            uploadLabel={t.form.uploadPhoto}
            formatsHint={t.form.uploadFormats}
            onChange={onPickFile}
            disabled={busy}
            onSelectLibrary={onSelectLibrary}
            libraryTexts={t.mediaLibrary}
          />
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
              submitLabel={t.form.createButton}
              cancelLabel={t.form.cancelButton}
              optionalLabel={t.form.optional}
            >

            {/* ── Personal details ─────────────────────────────────────────── */}
            <div
              hidden={activeTab !== 'personal'}
              className="animate-tab-fade flex flex-col gap-y-6"
            >
              <FormGrid>
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
              </FormGrid>
              <InputField
                label={t.form.email}
                type="email"
                variant={errors.email ? 'error' : undefined}
                errorMessage={errors.email?.message}
                {...register('email')}
              />
              <FormGrid>
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
                  {...register('dateOfBirth')}
                />
                <InputNumber
                  label={t.form.phone}
                  mask="+## ### ### ###"
                  variant={errors.phone ? 'error' : undefined}
                  errorMessage={errors.phone?.message}
                  {...register('phone')}
                />
              </FormGrid>

              <p className="text-sm font-medium text-secondary">
                {t.form.addressSection}
              </p>
              <LocationSelect
                value={{
                  countryCode: addressCountry,
                  ubigeoCode: addressUbigeoCode,
                  region: addressRegion,
                  province: addressProvince,
                  district: addressDistrict,
                }}
                onChange={onAddressChange}
                countryLabel={t.form.addressCountry}
                regionLabel={t.form.addressRegion}
                cityLabel={t.form.addressProvince}
                lang={language}
              />
              <FormGrid>
                <InputField
                  label={t.form.address}
                  variant={errors.address?.address ? 'error' : undefined}
                  errorMessage={errors.address?.address?.message}
                  {...register('address.address')}
                />
                <InputField
                  label={t.form.addressNumber}
                  variant={errors.address?.addressNumber ? 'error' : undefined}
                  errorMessage={errors.address?.addressNumber?.message}
                  {...register('address.addressNumber')}
                />
                <InputField
                  label={t.form.addressInterior}
                  variant={errors.address?.addressInterior ? 'error' : undefined}
                  errorMessage={errors.address?.addressInterior?.message}
                  {...register('address.addressInterior')}
                />
              </FormGrid>
            </div>

            {/* ── Account & access ─────────────────────────────────────────── */}
            <div
              hidden={activeTab !== 'account'}
              className="animate-tab-fade flex flex-col gap-y-6"
            >
              <p className="text-sm font-medium text-secondary">
                {t.form.authSection}
              </p>
              <FormGrid>
                <InputField
                  label={t.form.password}
                  type="password"
                  autoComplete="new-password"
                  variant={errors.password ? 'error' : undefined}
                  errorMessage={errors.password?.message}
                  {...register('password')}
                />
                <InputField
                  label={t.form.confirmPassword}
                  type="password"
                  autoComplete="new-password"
                  variant={errors.confirmPassword ? 'error' : undefined}
                  errorMessage={errors.confirmPassword?.message}
                  {...register('confirmPassword')}
                />
              </FormGrid>
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
            </div>

            </Wizard>
          </>
        }
      />
    </form>
  )
}
