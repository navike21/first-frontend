import { ContentLayout } from '@Components/ContentLayout/ContentLayout'
import { useOptionsBrowserStore } from '@Store/optionsBrowser/optionsBrowser'
import { urlProfilePath } from './languages/urlProfilePath'

export const Profile = () => {
  const { language } = useOptionsBrowserStore()

  const { title } = urlProfilePath[language]

  return <ContentLayout title={title}>....</ContentLayout>
}
