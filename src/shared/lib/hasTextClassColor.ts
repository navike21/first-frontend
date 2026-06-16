export const hasTextClassColor = (className?: string): boolean =>
  className?.split(/\s+/).some((c) => c.startsWith('text-')) ?? false
