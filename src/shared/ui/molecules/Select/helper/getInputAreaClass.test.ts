import { beforeEach, describe, expect, it, vi } from 'vitest'

import { getInputAreaClass } from './getInputAreaClass'

const base = {
  disabled: false,
  isOpen: false,
  variant: 'default' as const,
  isMultipleWithChips: false,
}

describe('getInputAreaClass', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  describe('ring width', () => {
    it('should apply ring-1 when dropdown is closed', () => {
      // Arrange & Act
      const result = getInputAreaClass({ ...base, isOpen: false })

      // Assert
      expect(result).toContain('ring-1')
      expect(result).not.toContain('ring-2')
    })

    it('should apply ring-2 when dropdown is open', () => {
      // Arrange & Act
      const result = getInputAreaClass({ ...base, isOpen: true })

      // Assert
      expect(result).toContain('ring-2')
      expect(result).not.toContain('ring-1')
    })
  })

  describe('background', () => {
    it('should apply bg-white when not disabled', () => {
      const result = getInputAreaClass({ ...base, disabled: false })
      expect(result).toContain('bg-white')
      expect(result).not.toContain('bg-slate-400/50')
    })

    it('should apply bg-slate-400/50 when disabled', () => {
      const result = getInputAreaClass({ ...base, disabled: true })
      expect(result).toContain('bg-slate-400/50')
      expect(result).not.toContain('bg-white')
    })
  })

  describe('variant ring colors', () => {
    it('should apply ring-slate-300 for default variant', () => {
      const result = getInputAreaClass({ ...base, variant: 'default' })
      expect(result).toContain('ring-slate-300')
    })

    it('should apply ring-emerald-500 for success variant', () => {
      const result = getInputAreaClass({ ...base, variant: 'success' })
      expect(result).toContain('ring-emerald-500')
    })

    it('should apply ring-red-500 for error variant', () => {
      const result = getInputAreaClass({ ...base, variant: 'error' })
      expect(result).toContain('ring-red-500')
    })

    it('should apply ring-yellow-500 for warning variant', () => {
      const result = getInputAreaClass({ ...base, variant: 'warning' })
      expect(result).toContain('ring-yellow-500')
    })

    it('should not apply variant ring color when disabled', () => {
      const result = getInputAreaClass({
        ...base,
        variant: 'success',
        disabled: true,
      })
      expect(result).not.toContain('ring-emerald-500')
    })
  })

  describe('height', () => {
    it('should apply h-10 when not isMultipleWithChips', () => {
      const result = getInputAreaClass({ ...base, isMultipleWithChips: false })
      expect(result).toContain('h-10')
      expect(result).not.toContain('h-auto')
    })

    it('should apply h-auto min-h-10 when isMultipleWithChips', () => {
      const result = getInputAreaClass({ ...base, isMultipleWithChips: true })
      expect(result).toContain('h-auto')
      expect(result).toContain('min-h-10')
    })
  })

  describe('classInput passthrough', () => {
    it('should append custom classInput to the result', () => {
      const result = getInputAreaClass({ ...base, classInput: 'custom-class' })
      expect(result).toContain('custom-class')
    })

    it('should work without classInput', () => {
      const result = getInputAreaClass({ ...base })
      expect(typeof result).toBe('string')
    })
  })
})
