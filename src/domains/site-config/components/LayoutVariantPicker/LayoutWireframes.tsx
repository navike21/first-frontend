import clsx from 'clsx'
import type { CSSProperties } from 'react'
import type {
  HeaderVariant,
  FooterVariant,
  ContentWidth,
} from '../../model/site-config.types'

// Tiny abstract diagrams used inside the variant picker cards. The mock
// blocks are painted with inline styles over theme CSS variables (always
// present in :root) so they never depend on Tailwind emitting brand-new
// utility classes.

const block = (extra: CSSProperties): CSSProperties => ({
  flexShrink: 0,
  borderRadius: 9999,
  ...extra,
})

const LOGO_STYLE: CSSProperties = block({
  width: 24,
  height: 10,
  borderRadius: 3,
  backgroundColor: 'var(--color-primary-600)',
})

const MENU_STYLE: CSSProperties = block({
  width: 16,
  height: 6,
  backgroundColor: 'var(--text-muted)',
})

const CTA_STYLE: CSSProperties = block({
  width: 20,
  height: 10,
  backgroundColor: 'var(--color-primary-600)',
  opacity: 0.7,
})

const DOT_STYLE: CSSProperties = block({
  width: 6,
  height: 6,
  backgroundColor: 'var(--text-muted)',
})

const lineStyle = (widthPct: number): CSSProperties => ({
  height: 4,
  borderRadius: 9999,
  backgroundColor: 'var(--border)',
  width: `${widthPct}%`,
})

const Logo = () => <span style={LOGO_STYLE} />
const MenuItem = () => <span style={MENU_STYLE} />
const CtaPill = () => <span style={CTA_STYLE} />
const TextLine = ({ w }: { w: number }) => <span style={lineStyle(w)} />
const Dot = () => <span style={DOT_STYLE} />

const frame = 'w-full rounded-md border border-border bg-surface-subtle'

export const HeaderWireframe = ({ variant }: { variant: HeaderVariant }) => {
  if (variant === 'logo-left-menu-right') {
    return (
      <div
        className={clsx(frame, 'flex h-12 items-center justify-between px-2')}
      >
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
      <div
        className={clsx(frame, 'flex h-12 items-center justify-between px-2')}
      >
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
      <div
        className={clsx(
          frame,
          'flex h-12 items-center justify-center gap-2 px-2'
        )}
      >
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
    <div
      className={clsx(
        frame,
        'flex h-12 flex-col items-center justify-center gap-1.5 px-2'
      )}
    >
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
        <TextLine w={75} />
        <TextLine w={50} />
        <TextLine w={66} />
      </div>
    ))}
  </div>
)

export const FooterWireframe = ({
  variant,
  columns,
}: {
  variant: FooterVariant
  columns: number
}) => {
  if (variant === 'columns') {
    return (
      <div
        className={clsx(frame, 'flex h-16 flex-col justify-center gap-2 py-2')}
      >
        <FooterColumns count={columns} />
        <div className="border-border mx-2 flex flex-col border-t pt-1">
          <TextLine w={33} />
        </div>
      </div>
    )
  }
  if (variant === 'centered') {
    return (
      <div
        className={clsx(
          frame,
          'flex h-16 flex-col items-center justify-center gap-1.5'
        )}
      >
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
      <div
        className={clsx(frame, 'flex h-16 items-center justify-between px-2')}
      >
        <span style={lineStyle(33)} className="max-w-16" />
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
    <div
      className={clsx(frame, 'flex h-16 flex-col justify-center gap-1.5 py-2')}
    >
      <div className="border-border mx-2 flex items-center justify-between border-b pb-1.5">
        <span style={lineStyle(33)} />
        <CtaPill />
      </div>
      <FooterColumns count={columns} />
    </div>
  )
}

export interface ContentWireframeProps {
  width: ContentWidth
  /** For 'boxed': scales the inner block proportionally (640–1920 px viewport). */
  boxedMaxWidth?: number
}

export const ContentWireframe = ({
  width,
  boxedMaxWidth,
}: ContentWireframeProps) => {
  const boxed = width === 'boxed'
  // Map the configured max width onto the mini viewport (1920 px = full).
  const pct = boxed
    ? Math.min(92, Math.max(30, ((boxedMaxWidth ?? 1200) / 1920) * 100))
    : 100
  const innerStyle: CSSProperties = boxed
    ? {
        width: `${pct}%`,
        borderLeft: '1px dashed var(--color-primary-600)',
        borderRight: '1px dashed var(--color-primary-600)',
        borderRadius: 2,
      }
    : { width: '100%', height: '100%' }
  return (
    <div
      className={clsx(
        frame,
        'flex h-16 justify-center overflow-hidden',
        boxed && 'py-2'
      )}
    >
      <div
        className="bg-primary-700/10 flex flex-col justify-center gap-1 p-1.5"
        style={innerStyle}
      >
        <TextLine w={50} />
        <TextLine w={100} />
        <TextLine w={83} />
      </div>
    </div>
  )
}
