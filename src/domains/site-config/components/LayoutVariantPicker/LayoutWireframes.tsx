import clsx from 'clsx'
import type { HeaderVariant, FooterVariant, ContentWidth } from '../../model/site-config.types'

// Tiny abstract diagrams used inside the variant picker cards. Pure CSS
// blocks: brand color = logo/CTA, muted pills = menu items / text lines.

const Logo = ({ wide }: { wide?: boolean }) => (
  <span className={clsx('h-2.5 shrink-0 rounded-sm bg-primary-600', wide ? 'w-8' : 'w-6')} />
)

const MenuItem = () => <span className="h-1.5 w-4 shrink-0 rounded-full bg-foreground/25" />

const CtaPill = () => <span className="h-2.5 w-5 shrink-0 rounded-full bg-primary-600/70" />

const TextLine = ({ w }: { w: string }) => <span className={clsx('h-1 rounded-full bg-foreground/20', w)} />

const Dot = () => <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />

const frame = 'w-full rounded-md border border-border bg-surface-subtle'

export const HeaderWireframe = ({ variant }: { variant: HeaderVariant }) => {
  if (variant === 'logo-left-menu-right') {
    return (
      <div className={clsx(frame, 'flex h-12 items-center justify-between px-2')}>
        <Logo />
        <div className="flex items-center gap-1.5">
          <MenuItem />
          <MenuItem />
          <MenuItem />
        </div>
      </div>
    )
  }
  if (variant === 'logo-left-menu-center') {
    return (
      <div className={clsx(frame, 'flex h-12 items-center justify-between px-2')}>
        <Logo />
        <div className="flex items-center gap-1.5">
          <MenuItem />
          <MenuItem />
          <MenuItem />
        </div>
        <CtaPill />
      </div>
    )
  }
  if (variant === 'logo-center-split') {
    return (
      <div className={clsx(frame, 'flex h-12 items-center justify-center gap-2 px-2')}>
        <MenuItem />
        <MenuItem />
        <Logo />
        <MenuItem />
        <MenuItem />
      </div>
    )
  }
  // logo-center-stacked
  return (
    <div className={clsx(frame, 'flex h-12 flex-col items-center justify-center gap-1.5 px-2')}>
      <Logo />
      <div className="flex items-center gap-1.5">
        <MenuItem />
        <MenuItem />
        <MenuItem />
      </div>
    </div>
  )
}

const FooterColumns = ({ count }: { count: number }) => (
  <div className="flex w-full items-start justify-between gap-2 px-2">
    {Array.from({ length: count }, (_, i) => (
      <div key={i} className="flex flex-1 flex-col gap-1">
        <TextLine w="w-3/4" />
        <TextLine w="w-1/2" />
        <TextLine w="w-2/3" />
      </div>
    ))}
  </div>
)

export const FooterWireframe = ({ variant, columns }: { variant: FooterVariant; columns: number }) => {
  if (variant === 'columns') {
    return (
      <div className={clsx(frame, 'flex h-16 flex-col justify-center gap-2 py-2')}>
        <FooterColumns count={columns} />
        <div className="mx-2 border-t border-border pt-1">
          <TextLine w="w-1/3" />
        </div>
      </div>
    )
  }
  if (variant === 'centered') {
    return (
      <div className={clsx(frame, 'flex h-16 flex-col items-center justify-center gap-1.5')}>
        <Logo />
        <div className="flex items-center gap-1.5">
          <MenuItem />
          <MenuItem />
          <MenuItem />
        </div>
        <div className="flex items-center gap-1">
          <Dot />
          <Dot />
          <Dot />
        </div>
      </div>
    )
  }
  if (variant === 'minimal') {
    return (
      <div className={clsx(frame, 'flex h-16 items-center justify-between px-2')}>
        <TextLine w="w-1/3" />
        <div className="flex items-center gap-1">
          <Dot />
          <Dot />
          <Dot />
        </div>
      </div>
    )
  }
  // cta-columns
  return (
    <div className={clsx(frame, 'flex h-16 flex-col justify-center gap-1.5 py-2')}>
      <div className="mx-2 flex items-center justify-between border-b border-border pb-1.5">
        <TextLine w="w-1/3" />
        <CtaPill />
      </div>
      <FooterColumns count={columns} />
    </div>
  )
}

export const ContentWireframe = ({ width }: { width: ContentWidth }) => (
  <div className={clsx(frame, 'flex h-16 justify-center py-2')}>
    <div
      className={clsx(
        'flex flex-col gap-1 rounded-sm bg-primary-700/10 p-1.5',
        width === 'boxed' ? 'w-2/3' : 'w-[94%]',
      )}
    >
      <TextLine w="w-1/2" />
      <TextLine w="w-full" />
      <TextLine w="w-5/6" />
    </div>
  </div>
)
