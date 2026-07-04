export interface SkeletonProps {
  className?: string
  /** circle → rounded-full · rect → rounded-md · text → rounded h-4 */
  variant?: 'circle' | 'rect' | 'text'
  /** Explicit width — string ('60%', '8rem') or number (px). Overrides any width in className. */
  width?: string | number
  /** Explicit height — string ('2rem') or number (px). Overrides any height in className. */
  height?: string | number
  /**
   * Render N stacked text lines (text variant only).
   * The last line is automatically narrowed to 75% to mimic a natural paragraph ending,
   * unless `width` is explicitly set.
   */
  rows?: number
}
