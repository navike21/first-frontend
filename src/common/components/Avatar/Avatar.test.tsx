import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Avatar } from './Avatar'
import { EUserStatusType } from '@Enums/statusType'
import { ESize } from '@Enums/size'

describe('Avatar', () => {
  it('renders with default props', () => {
    const { container } = render(<Avatar />)
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status', () => {
    const { container } = render(<Avatar status={EUserStatusType.OFFLINE} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with custom size', () => {
    const { container } = render(<Avatar avatarSize={ESize.SM} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with custom props', () => {
    const { container } = render(
      <Avatar
        alt="Test Avatar"
        src="/test-avatar.jpg"
        status={EUserStatusType.AWAY}
        avatarSize={ESize.LG}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom children', () => {
    const { container } = render(
      <Avatar>
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status and size', () => {
    const { container } = render(
      <Avatar status={EUserStatusType.BUSY} avatarSize={ESize.XL} />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status and children', () => {
    const { container } = render(
      <Avatar status={EUserStatusType.OFFLINE}>
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom size and children', () => {
    const { container } = render(
      <Avatar avatarSize={ESize.SM}>
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status, size, and children', () => {
    const { container } = render(
      <Avatar status={EUserStatusType.AWAY} avatarSize={ESize.LG}>
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status, size, and props', () => {
    const { container } = render(
      <Avatar
        alt="Test Avatar"
        src="/test-avatar.jpg"
        status={EUserStatusType.BUSY}
        avatarSize={ESize.XL}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom size, children, and props', () => {
    const { container } = render(
      <Avatar alt="Test Avatar" src="/test-avatar.jpg" avatarSize={ESize.SM}>
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status, children, and props', () => {
    const { container } = render(
      <Avatar
        alt="Test Avatar"
        src="/test-avatar.jpg"
        status={EUserStatusType.AWAY}
      >
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status, size, children, and props', () => {
    const { container } = render(
      <Avatar
        alt="Test Avatar"
        src="/test-avatar.jpg"
        status={EUserStatusType.BUSY}
        avatarSize={ESize.XL}
      >
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })
})
