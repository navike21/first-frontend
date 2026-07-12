import { useNavigate } from '@tanstack/react-router'
import { notify } from '@/shared/lib/notify'
import { onQueuedOr } from '@/shared/lib'
import { PageContent, Spinner } from '@/shared/ui'
import { UserForm, useMyProfile, useUpdateProfile } from '..'
import { useUsersTranslation } from '../i18n'
import type { UpdateUserFormData } from '..'
import { navPaths } from '@/shared/router'

const titleByLang: Record<string, string> = {
  es: 'Perfil',
  en: 'Profile',
  de: 'Profil',
  fr: 'Profil',
  it: 'Profilo',
  ja: 'プロフィール',
  ko: '프로필',
  pt: 'Perfil',
  ru: 'Профиль',
  zh: '个人资料',
}

const descByLang: Record<string, string> = {
  es: 'Modifica tus datos de perfil de usuario',
  en: 'Modify your user profile details',
  de: 'Ändern Sie Ihre Benutzerprofildaten',
  fr: 'Modifiez vos informations de profil',
  it: 'Modifica i dettagli del tuo profilo utente',
  ja: 'ユーザープロフィールの詳細を変更します',
  ko: '사용자 프로필 정보를 수정합니다',
  pt: 'Modifique os detalhes do seu perfil de usuário',
  ru: 'Измените данные своего профиля',
  zh: '修改您的用户个人资料详情',
}

export const ProfilePage = () => {
  const navigate = useNavigate()
  const { t, language } = useUsersTranslation()

  const { data: user, isLoading } = useMyProfile()
  const updateProfile = useUpdateProfile()

  const handleUpdate = (
    data: UpdateUserFormData,
    avatar?: File | null,
    removeAvatar?: boolean,
    avatarLibraryUrl?: string
  ) => {
    updateProfile.mutate(
      { data, avatar, removeAvatar, avatarLibraryUrl },
      {
        onSuccess: (res) => {
          notify.success(t.toasts.updated)
          if (res?.warnings?.length) {
            notify.warning(res.warnings.map((w) => w.message).join(' '))
          }
          navigate({ to: navPaths.home(language) as never })
        },
        onError: onQueuedOr(() => {
          if (avatar) notify.warning(t.toasts.offlinePhotoSkipped)
          navigate({ to: navPaths.home(language) as never })
        }),
      }
    )
  }

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center py-40">
        <Spinner size="medium" />
      </div>
    )
  }

  return (
    <PageContent
      title={titleByLang[language] ?? 'Profile'}
      description={descByLang[language] ?? 'Modify your profile details'}
    >
      <div>
        <UserForm
          mode="edit"
          defaultValues={user}
          isSubmitting={updateProfile.isPending}
          onCancel={() => navigate({ to: navPaths.home(language) as never })}
          onCreate={() => {}}
          onUpdate={handleUpdate}
          submitError={updateProfile.error}
          isProfile={true}
        />
      </div>
    </PageContent>
  )
}
