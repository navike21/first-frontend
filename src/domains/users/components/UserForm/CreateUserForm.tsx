import {
  Button,
  InputField,
  InputNumber,
  InputDate,
  Select,
  PhotoPicker,
  Tabs,
} from '@/shared/ui'
import { PanelLayout } from './PanelLayout'
import { useCreateUserForm } from './CreateUserForm.hooks'
import type { UseCreateUserFormProps } from './CreateUserForm.hooks'
import type { UserFormTab } from './userFormTabs'

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
    activeTab,
    setActiveTab,
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
            <Tabs
              tabs={[
                { id: 'personal', label: t.form.tabPersonal },
                { id: 'account', label: t.form.tabAccount },
              ]}
              activeId={activeTab}
              onChange={(id) => setActiveTab(id as UserFormTab)}
              ariaLabel={t.form.tabPersonal}
            />

            {/* ── Personal details ─────────────────────────────────────────── */}
            <div
              hidden={activeTab !== 'personal'}
              className="animate-tab-fade flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
              <InputField
                label={t.form.email}
                type="email"
                variant={errors.email ? 'error' : undefined}
                errorMessage={errors.email?.message}
                {...register('email')}
              />
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
              </div>

              <p className="text-sm font-medium text-(--text-secondary)">
                {t.form.addressSection}
              </p>
              <InputField
                label={t.form.addressStreet}
                variant={errors.address?.street ? 'error' : undefined}
                errorMessage={errors.address?.street?.message}
                {...register('address.street')}
              />
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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
              className="animate-tab-fade flex flex-col gap-4"
            >
              <p className="text-sm font-medium text-(--text-secondary)">
                {t.form.authSection}
              </p>
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
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

            <div className="flex w-full flex-col-reverse justify-end gap-3 pt-2 sm:flex-row">
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
