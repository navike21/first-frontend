import { ReactNode } from '@tanstack/react-router'
import { Content } from './style'
import { Title } from '@Components/Title/Title'
import { Breadcrumb } from '@Components/Breadcrumb/Breadcrumb'

interface IContentLayoutProp {
  children: ReactNode
  title: string
}

export const ContentLayout = ({ children, title }: IContentLayoutProp) => {
  return (
    <Content>
      <Title variant="h4">{title}</Title>
      <Breadcrumb />
      {children}
    </Content>
  )
}
