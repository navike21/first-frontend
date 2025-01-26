import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Avatar } from './Avatar'
import { EUserStatusType } from '@Enums/statusType'
import { ESizes } from '@Enums/size'

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
    const { container } = render(<Avatar avatarSize={ESizes.SM} />)
    expect(container).toMatchSnapshot()
  })

  it('renders with custom props', () => {
    const { container } = render(
      <Avatar
        alt="Test Avatar"
        src="/test-avatar.jpg"
        status={EUserStatusType.AWAY}
        avatarSize={ESizes.LG}
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
      <Avatar status={EUserStatusType.BUSY} avatarSize={ESizes.XL} />
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
      <Avatar avatarSize={ESizes.SM}>
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom status, size, and children', () => {
    const { container } = render(
      <Avatar status={EUserStatusType.AWAY} avatarSize={ESizes.LG}>
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
        avatarSize={ESizes.XL}
      />
    )
    expect(container).toMatchSnapshot()
  })

  it('renders with custom size, children, and props', () => {
    const { container } = render(
      <Avatar alt="Test Avatar" src="/test-avatar.jpg" avatarSize={ESizes.SM}>
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
        avatarSize={ESizes.XL}
      >
        <img alt="Test Avatar" src="/test-avatar.jpg" />
      </Avatar>
    )
    expect(container).toMatchSnapshot()
  })
})
