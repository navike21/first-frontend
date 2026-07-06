export interface RichTextAreaProps {
  value?: string
  onChange?: (html: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
  label?: string
  helperText?: string
  errorMessage?: string
  variant?: 'default' | 'error'
  maxLength?: number
  showCount?: boolean
  disabled?: boolean
  minRows?: number
}
