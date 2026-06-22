import {
  Button,
  InputField,
  InputNumber,
  InputDate,
  Select,
  PhotoPicker,
  Switch,
  Tabs,
} from '@/shared/ui'
import { PanelLayout } from './PanelLayout'
import { useEditUserForm } from './EditUserForm.hooks'
import type { UseEditUserFormProps } from './EditUserForm.hooks'
import type { UserFormTab } from './userFormTabs'

export const EditUserForm = (props: UseEditUserFormProps) => {
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
    setActiveTab,
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
              className="flex flex-col gap-4"
            >
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
              {/* Email is immutable on edit (read-only). */}
              <InputField
                label={t.form.email}
                type="email"
                disabled
                defaultValue={props.defaultValues.email ?? ''}
              />
              <div className="grid grid-cols-2 gap-4">
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

              <p className="text-sm font-medium text-(--text-secondary)">
                {t.form.addressSection}
              </p>
              <InputField
                label={t.form.addressStreet}
                variant={errors.address?.street ? 'error' : undefined}
                errorMessage={errors.address?.street?.message}
                {...register('address.street')}
              />
              <div className="grid grid-cols-2 gap-4">
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
            <div hidden={activeTab !== 'account'} className="flex flex-col gap-4">
              <p className="text-sm font-medium text-(--text-secondary)">
                {t.form.authSection}
              </p>
              <div className="grid grid-cols-2 gap-4">
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
