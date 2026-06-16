import { beforeEach, describe, expect, it, vi } from 'vitest'

import { VARIANT_ICON_MAP } from './variantIconMap'

describe('VARIANT_ICON_MAP', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should not define an entry for the default variant', () => {
    expect(VARIANT_ICON_MAP['default']).toBeUndefined()
  })

  it('should map success to RiCheckboxCircleFill with emerald color class', () => {
    expect(VARIANT_ICON_MAP['success']).toEqual({
      icon: 'RiCheckboxCircleFill',
      className: 'text-emerald-500 mr-3 size-5',
    })
  })

  it('should map error to RiErrorWarningFill with red color class', () => {
    expect(VARIANT_ICON_MAP['error']).toEqual({
      icon: 'RiErrorWarningFill',
      className: 'text-red-500 mr-3 size-5',
    })
  })

  it('should map warning to RiErrorWarningFill with yellow color class', () => {
    expect(VARIANT_ICON_MAP['warning']).toEqual({
      icon: 'RiErrorWarningFill',
      className: 'text-yellow-500 mr-3 size-5',
    })
  })
})
