import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import clsx from 'clsx'
import {
  RiBold,
  RiItalic,
  RiUnderline,
  RiStrikethrough,
  RiListUnordered,
  RiListOrdered,
  RiAlignLeft,
  RiAlignCenter,
  RiAlignRight,
  RiAlignJustify,
  RiLink,
  RiLinkUnlink,
  RiImageLine,
  RiFormatClear,
  RiFullscreenLine,
  RiFullscreenExitLine,
} from '@remixicon/react'
import type { RichTextAreaProps } from './RichTextArea.types'

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4'

// ─── Toolbar button ────────────────────────────────────────────────────────

interface ToolbarBtnProps {
  onClick: () => void
  active?: boolean
  disabled?: boolean
  title: string
  children: React.ReactNode
}

const ToolbarBtn = ({ onClick, active, disabled, title, children }: ToolbarBtnProps) => (
  <button
    type="button"
    onMouseDown={(e) => { e.preventDefault(); onClick() }}
    disabled={disabled}
    title={title}
    className={clsx(
      'flex h-7 w-7 items-center justify-center rounded text-sm transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-40',
      active
        ? 'bg-primary-700/10 text-primary-600'
        : 'text-secondary hover:bg-surface-subtle hover:text-foreground',
    )}
  >
    {children}
  </button>
)

const Divider = () => <div className="mx-0.5 h-4 w-px shrink-0 bg-border" />

// ─── Main component ────────────────────────────────────────────────────────

export const RichTextArea = ({
  value = '',
  onChange,
  onImageUpload,
  placeholder = '',
  label,
  helperText,
  errorMessage,
  variant = 'default',
  maxLength,
  showCount = false,
  disabled = false,
  minRows = 6,
}: RichTextAreaProps) => {
  const [fullscreen, setFullscreen] = useState(false)
  const [linkInput, setLinkInput] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isUpdating = useRef(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({ inline: false, allowBase64: false }),
      Placeholder.configure({ placeholder }),
    ],
    content: value || '',
    editable: !disabled,
    onUpdate: ({ editor: e }) => {
      if (isUpdating.current) return
      onChange?.(e.getHTML())
    },
  })

  // Sync external value without causing an update loop
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current) {
      isUpdating.current = true
      editor.commands.setContent(value || '', { emitUpdate: false })
      isUpdating.current = false
    }
  }, [value, editor])

  useEffect(() => {
    editor?.setEditable(!disabled)
  }, [disabled, editor])

  const textLength = editor?.getText()?.replace(/\n/g, '').length ?? 0
  const isOverLimit = maxLength !== undefined && textLength > maxLength
  const hasError = variant === 'error' || !!errorMessage || isOverLimit

  const getBlockType = (): BlockType => {
    if (!editor) return 'paragraph'
    if (editor.isActive('heading', { level: 1 })) return 'h1'
    if (editor.isActive('heading', { level: 2 })) return 'h2'
    if (editor.isActive('heading', { level: 3 })) return 'h3'
    if (editor.isActive('heading', { level: 4 })) return 'h4'
    return 'paragraph'
  }

  const handleBlockChange = (type: BlockType) => {
    if (!editor) return
    if (type === 'paragraph') {
      editor.chain().focus().setParagraph().run()
    } else {
      const level = parseInt(type.slice(1)) as 1 | 2 | 3 | 4
      editor.chain().focus().toggleHeading({ level }).run()
    }
  }

  const handleLink = () => {
    if (!editor) return
    const current = editor.getAttributes('link').href as string | undefined
    setLinkInput(current ?? '')
  }

  const applyLink = () => {
    if (!editor || linkInput === null) return
    if (linkInput.trim()) {
      editor.chain().focus().setLink({ href: linkInput.trim(), target: '_blank' }).run()
    } else {
      editor.chain().focus().unsetLink().run()
    }
    setLinkInput(null)
  }

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor || !onImageUpload) return
      try {
        const url = await onImageUpload(file)
        if (url) editor.chain().focus().setImage({ src: url }).run()
      } catch {
        // upload errors are handled by the caller
      }
    },
    [editor, onImageUpload],
  )

  const containerStyle = clsx(
    'flex flex-col rounded-lg border bg-surface transition-colors',
    hasError
      ? 'border-red-400 focus-within:border-red-500 focus-within:ring-1 focus-within:ring-red-400/30'
      : 'border-border focus-within:border-primary-600 focus-within:ring-1 focus-within:ring-primary-600/20',
    fullscreen && 'fixed inset-0 z-50 rounded-none',
    disabled && 'opacity-60',
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="text-xs font-medium tracking-wide text-secondary uppercase">
          {label}
        </div>
      )}

      <div className={containerStyle}>
        {/* ── Toolbar ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5">
          {/* Block type */}
          <select
            value={getBlockType()}
            onChange={(e) => handleBlockChange(e.target.value as BlockType)}
            disabled={disabled || !editor}
            className={clsx(
              'h-7 rounded border border-border bg-surface-subtle px-2 text-xs font-medium text-foreground',
              'focus:outline-none focus:ring-1 focus:ring-primary-600/30',
              'disabled:opacity-40',
            )}
          >
            <option value="paragraph">Paragraph</option>
            <option value="h1">H1</option>
            <option value="h2">H2</option>
            <option value="h3">H3</option>
            <option value="h4">H4</option>
          </select>

          <Divider />

          <ToolbarBtn title="Bold" active={editor?.isActive('bold')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBold().run()}>
            <RiBold />
          </ToolbarBtn>
          <ToolbarBtn title="Italic" active={editor?.isActive('italic')} disabled={disabled} onClick={() => editor?.chain().focus().toggleItalic().run()}>
            <RiItalic />
          </ToolbarBtn>
          <ToolbarBtn title="Underline" active={editor?.isActive('underline')} disabled={disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()}>
            <RiUnderline />
          </ToolbarBtn>
          <ToolbarBtn title="Strikethrough" active={editor?.isActive('strike')} disabled={disabled} onClick={() => editor?.chain().focus().toggleStrike().run()}>
            <RiStrikethrough />
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn title="Bullet list" active={editor?.isActive('bulletList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()}>
            <RiListUnordered />
          </ToolbarBtn>
          <ToolbarBtn title="Ordered list" active={editor?.isActive('orderedList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()}>
            <RiListOrdered />
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn title="Align left" active={editor?.isActive({ textAlign: 'left' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('left').run()}>
            <RiAlignLeft />
          </ToolbarBtn>
          <ToolbarBtn title="Align center" active={editor?.isActive({ textAlign: 'center' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('center').run()}>
            <RiAlignCenter />
          </ToolbarBtn>
          <ToolbarBtn title="Align right" active={editor?.isActive({ textAlign: 'right' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('right').run()}>
            <RiAlignRight />
          </ToolbarBtn>
          <ToolbarBtn title="Justify" active={editor?.isActive({ textAlign: 'justify' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('justify').run()}>
            <RiAlignJustify />
          </ToolbarBtn>

          <Divider />

          <ToolbarBtn title="Add link" active={editor?.isActive('link')} disabled={disabled} onClick={handleLink}>
            <RiLink />
          </ToolbarBtn>
          <ToolbarBtn title="Remove link" disabled={disabled || !editor?.isActive('link')} onClick={() => editor?.chain().focus().unsetLink().run()}>
            <RiLinkUnlink />
          </ToolbarBtn>

          {onImageUpload && (
            <>
              <ToolbarBtn title="Insert image" disabled={disabled} onClick={() => fileInputRef.current?.click()}>
                <RiImageLine />
              </ToolbarBtn>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(file)
                  e.target.value = ''
                }}
              />
            </>
          )}

          <Divider />

          <ToolbarBtn title="Clear formatting" disabled={disabled} onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()}>
            <RiFormatClear />
          </ToolbarBtn>
          <ToolbarBtn title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'} onClick={() => setFullscreen((v) => !v)}>
            {fullscreen ? <RiFullscreenExitLine /> : <RiFullscreenLine />}
          </ToolbarBtn>
        </div>

        {/* ── Link input ──────────────────────────────────────── */}
        {linkInput !== null && (
          <div className="flex items-center gap-2 border-b border-border bg-surface-subtle px-3 py-2">
            <input
              autoFocus
              type="url"
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); applyLink() }
                if (e.key === 'Escape') setLinkInput(null)
              }}
              placeholder="https://..."
              className="min-w-0 flex-1 rounded border border-border bg-surface px-2 py-1 text-sm text-foreground outline-none focus:border-primary-600"
            />
            <button type="button" onClick={applyLink} className="rounded bg-primary-700/10 px-2.5 py-1 text-xs font-medium text-primary-600 hover:bg-primary-700/20">
              Apply
            </button>
            <button type="button" onClick={() => setLinkInput(null)} className="text-xs text-muted hover:text-foreground">
              Cancel
            </button>
          </div>
        )}

        {/* ── Editor content ──────────────────────────────────── */}
        <EditorContent
          editor={editor}
          className={clsx(
            'flex-1 cursor-text px-4 py-3 text-sm text-foreground',
            fullscreen ? 'overflow-y-auto' : `min-h-[calc(${minRows}*1.5rem+1.5rem)]`,
          )}
          onClick={() => editor?.commands.focus()}
        />

        {/* ── Character count ─────────────────────────────────── */}
        {(showCount || maxLength !== undefined) && (
          <div className={clsx(
            'flex justify-end border-t border-border px-3 py-1 text-[11px]',
            isOverLimit ? 'text-red-500' : 'text-muted',
          )}>
            {maxLength !== undefined ? `${textLength} / ${maxLength}` : textLength}
          </div>
        )}
      </div>

      {(helperText || errorMessage) && (
        <p className={clsx(
          'text-xs',
          errorMessage ? 'text-red-500' : 'text-muted',
        )}>
          {errorMessage ?? helperText}
        </p>
      )}
    </div>
  )
}
