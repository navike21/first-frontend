const UNITS = ['KB', 'MB', 'GB'] as const

/** Human-readable file size (e.g. `2.4 MB`), used by MediaCard/MediaPreviewModal. */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`

  let value = bytes / 1024
  let unitIndex = 0
  while (value >= 1024 && unitIndex < UNITS.length - 1) {
    value /= 1024
    unitIndex++
  }
  return `${value.toFixed(1)} ${UNITS[unitIndex]}`
}
