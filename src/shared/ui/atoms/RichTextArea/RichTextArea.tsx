import { useCallback, useEffect, useRef, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import Color from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import { Table } from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import clsx from 'clsx'
import { IconComponent } from '../IconComponent/IconComponent'
import type { IconName } from '@/shared/types/icons'
import type { RichTextAreaProps } from './RichTextArea.types'

const lowlight = createLowlight(common)

// ─── Constants ────────────────────────────────────────────────────────────────

type BlockType = 'paragraph' | 'h1' | 'h2' | 'h3' | 'h4'

const BLOCK_OPTIONS: { value: BlockType; label: string }[] = [
  { value: 'paragraph', label: 'Paragraph' },
  { value: 'h1', label: 'Heading 1' },
  { value: 'h2', label: 'Heading 2' },
  { value: 'h3', label: 'Heading 3' },
  { value: 'h4', label: 'Heading 4' },
]

const TEXT_COLORS = [
  { label: 'Black', value: '#111827' },
  { label: 'Gray', value: '#6B7280' },
  { label: 'Silver', value: '#D1D5DB' },
  { label: 'Red', value: '#EF4444' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Lime', value: '#84CC16' },
  { label: 'Green', value: '#22C55E' },
  { label: 'Teal', value: '#14B8A6' },
  { label: 'Blue', value: '#3B82F6' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Pink', value: '#EC4899' },
] as const

const HIGHLIGHT_COLORS = [
  { label: 'Yellow', value: '#FEF08A' },
  { label: 'Green', value: '#BBF7D0' },
  { label: 'Blue', value: '#BAE6FD' },
  { label: 'Pink', value: '#FBCFE8' },
  { label: 'Orange', value: '#FED7AA' },
  { label: 'Purple', value: '#E9D5FF' },
] as const

const CODE_LANGS = [
  { label: 'Auto', value: '' },
  { label: 'JavaScript', value: 'javascript' },
  { label: 'TypeScript', value: 'typescript' },
  { label: 'Python', value: 'python' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'JSON', value: 'json' },
  { label: 'Bash', value: 'bash' },
  { label: 'SQL', value: 'sql' },
  { label: 'Markdown', value: 'markdown' },
]

const TABLE_GRID = 8

// ─── useDropdown hook ─────────────────────────────────────────────────────────

function useDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return { open, setOpen, ref }
}

// ─── Toolbar primitives ───────────────────────────────────────────────────────

interface ToolbarBtnProps {
  icon: IconName
  title: string
  onClick: () => void
  active?: boolean
  disabled?: boolean
}

const ToolbarBtn = ({ icon, title, onClick, active, disabled }: ToolbarBtnProps) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onMouseDown={(e) => { e.preventDefault(); onClick() }}
    className={clsx(
      'flex h-6 w-6 items-center justify-center rounded transition-colors',
      'disabled:cursor-not-allowed disabled:opacity-40',
      active
        ? 'bg-primary-700/10 text-primary-600'
        : 'text-muted hover:bg-surface-subtle hover:text-foreground',
    )}
  >
    <IconComponent icon={icon} className="h-3.5 w-3.5" />
  </button>
)

const Divider = () => <div className="mx-0.5 h-3.5 w-px shrink-0 bg-border-control" />

// ─── ToolbarSelect (block type) ───────────────────────────────────────────────

interface ToolbarSelectProps {
  value: BlockType
  onChange: (v: BlockType) => void
  disabled?: boolean
}

const ToolbarSelect = ({ value, onChange, disabled }: ToolbarSelectProps) => {
  const { open, setOpen, ref } = useDropdown()
  const currentLabel = BLOCK_OPTIONS.find((o) => o.value === value)?.label ?? 'Paragraph'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onMouseDown={(e) => { e.preventDefault(); setOpen((v) => !v) }}
        className={clsx(
          'flex h-6 items-center gap-1 rounded-sm px-1.5 transition-colors',
          'ring-1 ring-inset bg-surface text-[11px] font-medium text-foreground',
          open ? 'ring-primary-600' : 'ring-border hover:ring-primary-600/40',
          'disabled:cursor-not-allowed disabled:opacity-40',
        )}
      >
        {currentLabel}
        <IconComponent
          icon="RiArrowDownSLine"
          className={clsx('h-3 w-3 text-muted transition-transform', open && 'rotate-180')}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 min-w-[7.5rem] overflow-hidden rounded-sm border border-border bg-surface shadow-md">
          {BLOCK_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                onChange(opt.value)
                setOpen(false)
              }}
              className={clsx(
                'flex w-full items-center px-2.5 py-1.5 text-left text-xs transition-colors',
                value === opt.value
                  ? 'bg-primary-700/10 font-medium text-primary-600'
                  : 'text-foreground hover:bg-surface-subtle',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── ColorDropdown ────────────────────────────────────────────────────────────

const ColorDropdown = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  const { open, setOpen, ref } = useDropdown()
  const currentColor = editor?.getAttributes('textStyle').color as string | undefined

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        title="Text color"
        onMouseDown={(e) => { e.preventDefault(); setOpen((v) => !v) }}
        className={clsx(
          'flex h-6 w-6 flex-col items-center justify-center gap-px rounded transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-40',
          open
            ? 'bg-primary-700/10 text-primary-600'
            : 'text-muted hover:bg-surface-subtle hover:text-foreground',
        )}
      >
        <IconComponent icon="RiFontColor" className="h-3.5 w-3.5" />
        <div
          className="h-0.5 w-3.5 rounded-full"
          style={{ backgroundColor: currentColor ?? 'currentColor' }}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 rounded-sm border border-border bg-surface p-1.5 shadow-md">
          <div className="mb-1 flex items-center justify-between gap-4">
            <span className="text-[10px] text-muted">Color</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().unsetColor().run(); setOpen(false) }}
              className="text-[10px] text-muted hover:text-foreground"
            >
              Reset
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {TEXT_COLORS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                title={label}
                onMouseDown={(e) => {
                  e.preventDefault()
                  editor?.chain().focus().setColor(value).run()
                  setOpen(false)
                }}
                className={clsx(
                  'h-5 w-5 rounded-sm border-2 transition-transform hover:scale-110',
                  currentColor === value ? 'border-primary-600 scale-110' : 'border-transparent',
                )}
                style={{ backgroundColor: value }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── HighlightDropdown ────────────────────────────────────────────────────────

const HighlightDropdown = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  const { open, setOpen, ref } = useDropdown()
  const currentHighlight = editor?.getAttributes('highlight').color as string | undefined

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        title="Highlight"
        onMouseDown={(e) => { e.preventDefault(); setOpen((v) => !v) }}
        className={clsx(
          'flex h-6 w-6 items-center justify-center rounded transition-colors',
          'disabled:cursor-not-allowed disabled:opacity-40',
          open || currentHighlight
            ? 'bg-primary-700/10 text-primary-600'
            : 'text-muted hover:bg-surface-subtle hover:text-foreground',
        )}
        style={currentHighlight ? { backgroundColor: `${currentHighlight}60` } : undefined}
      >
        <IconComponent icon="RiMarkPenLine" className="h-3.5 w-3.5" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 rounded-sm border border-border bg-surface p-1.5 shadow-md">
          <div className="mb-1 flex items-center justify-between gap-4">
            <span className="text-[10px] text-muted">Highlight</span>
            <button
              type="button"
              onMouseDown={(e) => { e.preventDefault(); editor?.chain().focus().unsetHighlight().run(); setOpen(false) }}
              className="text-[10px] text-muted hover:text-foreground"
            >
              Remove
            </button>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {HIGHLIGHT_COLORS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                title={label}
                onMouseDown={(e) => {
                  e.preventDefault()
                  editor?.chain().focus().setHighlight({ color: value }).run()
                  setOpen(false)
                }}
                className={clsx(
                  'h-5 w-5 rounded-sm border-2 transition-transform hover:scale-110',
                  currentHighlight === value ? 'border-primary-600 scale-110' : 'border-border',
                )}
                style={{ backgroundColor: value }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── TablePicker ──────────────────────────────────────────────────────────────

const TablePicker = ({ editor, disabled }: { editor: Editor | null; disabled?: boolean }) => {
  const { open, setOpen, ref } = useDropdown()
  const [hover, setHover] = useState({ rows: 0, cols: 0 })

  return (
    <div ref={ref} className="relative">
      <ToolbarBtn
        icon="RiTable2"
        title="Insert table"
        disabled={disabled}
        active={editor?.isActive('table')}
        onClick={() => setOpen((v) => !v)}
      />

      {open && (
        <div className="absolute left-0 top-full z-50 mt-0.5 rounded-sm border border-border bg-surface p-2 shadow-md">
          <p className="mb-1.5 text-center text-[10px] font-medium text-foreground">
            {hover.rows > 0 ? `${hover.rows} × ${hover.cols}` : 'Choose size'}
          </p>
          <div
            className="grid gap-0.5"
            style={{ gridTemplateColumns: `repeat(${TABLE_GRID}, 1.125rem)` }}
          >
            {Array.from({ length: TABLE_GRID }, (_, row) =>
              Array.from({ length: TABLE_GRID }, (_, col) => (
                <button
                  key={`${row}-${col}`}
                  type="button"
                  onMouseEnter={() => setHover({ rows: row + 1, cols: col + 1 })}
                  onMouseLeave={() => setHover({ rows: 0, cols: 0 })}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    editor
                      ?.chain()
                      .focus()
                      .insertTable({ rows: row + 1, cols: col + 1, withHeaderRow: true })
                      .run()
                    setOpen(false)
                    setHover({ rows: 0, cols: 0 })
                  }}
                  className={clsx(
                    'h-4 w-4 rounded-sm border transition-colors',
                    row < hover.rows && col < hover.cols
                      ? 'border-primary-600 bg-primary-700/20'
                      : 'border-border bg-surface-subtle',
                  )}
                />
              )),
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main component ────────────────────────────────────────────────────────────

export const RichTextArea = ({
  value = '',
  onChange,
  placeholder = '',
  label,
  helperText,
  errorMessage,
  variant = 'default',
  maxLength,
  showCount = false,
  disabled = false,
  minRows = 5,
}: RichTextAreaProps) => {
  const [fullscreen, setFullscreen] = useState(false)
  const [linkInput, setLinkInput] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isUpdating = useRef(false)
  const editorRef = useRef<Editor | null>(null)

  // Stable: reads editor from ref so it can be passed into editorProps (no circular dep)
  const insertImageFromFile = useCallback((file: File) => {
    const ed = editorRef.current
    if (!ed) return
    const reader = new FileReader()
    reader.onload = (e) => {
      const src = e.target?.result as string
      if (src) ed.chain().focus().setImage({ src }).run()
    }
    reader.readAsDataURL(file)
  }, [])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false, autolink: true }),
      Image.configure({
        inline: false,
        allowBase64: true,
        resize: { enabled: true, minWidth: 50, minHeight: 50 },
      }),
      Placeholder.configure({ placeholder }),
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: false }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content: value || '',
    editable: !disabled,
    editorProps: {
      handleDrop: (_view, event, _slice, moved) => {
        if (moved) return false
        const file = (event as DragEvent).dataTransfer?.files[0]
        if (file?.type.startsWith('image/')) {
          event.preventDefault()
          insertImageFromFile(file)
          return true
        }
        return false
      },
      handlePaste: (_view, event) => {
        const file = (event as ClipboardEvent).clipboardData?.files[0]
        if (file?.type.startsWith('image/')) {
          event.preventDefault()
          insertImageFromFile(file)
          return true
        }
        return false
      },
    },
    onUpdate: ({ editor: e }) => {
      if (isUpdating.current) return
      onChange?.(e.getHTML())
    },
  })

  // Keep ref in sync with the editor instance
  useEffect(() => {
    editorRef.current = editor ?? null
  }, [editor])

  // Sync external value → editor without triggering onChange
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    const isEmpty = (h: string) => !h || h === '<p></p>'
    if (isEmpty(value) && isEmpty(current)) return
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

  const handleLink = () => {
    if (!editor) return
    setLinkInput((editor.getAttributes('link').href as string | undefined) ?? '')
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

  const contentMinHeight = fullscreen
    ? undefined
    : { minHeight: `calc(${minRows} * 1.6em + 1.5rem)` }

  const isInTable = editor?.isActive('table') ?? false
  const isInCodeBlock = editor?.isActive('codeBlock') ?? false

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <div className="text-xs font-medium tracking-wide text-secondary uppercase">
          {label}
        </div>
      )}

      <div
        className={clsx(
          'flex flex-col rounded-select border bg-surface-input transition-colors',
          hasError
            ? 'border-danger-600 focus-within:border-danger-600'
            : 'border-border-control hover:border-border-hover focus-within:border-primary-600! focus-within:shadow-focus-ring',
          fullscreen && 'fixed inset-0 z-50 rounded-none',
          disabled && 'opacity-60',
        )}
      >
        {/* ── Main toolbar ──────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-0.5 border-b border-border-control bg-surface-subtle px-2 py-1.5">
          {/* History */}
          <ToolbarBtn icon="RiArrowGoBackLine" title="Undo" disabled={disabled || !editor?.can().undo()} onClick={() => editor?.chain().focus().undo().run()} />
          <ToolbarBtn icon="RiArrowGoForwardLine" title="Redo" disabled={disabled || !editor?.can().redo()} onClick={() => editor?.chain().focus().redo().run()} />

          <Divider />

          {/* Block type */}
          <ToolbarSelect
            value={getBlockType()}
            onChange={(type) => {
              if (!editor) return
              if (type === 'paragraph') editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: parseInt(type.slice(1)) as 1 | 2 | 3 | 4 }).run()
            }}
            disabled={disabled || !editor}
          />

          <Divider />

          {/* Inline marks */}
          <ToolbarBtn icon="RiBold" title="Bold" active={editor?.isActive('bold')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBold().run()} />
          <ToolbarBtn icon="RiItalic" title="Italic" active={editor?.isActive('italic')} disabled={disabled} onClick={() => editor?.chain().focus().toggleItalic().run()} />
          <ToolbarBtn icon="RiUnderline" title="Underline" active={editor?.isActive('underline')} disabled={disabled} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
          <ToolbarBtn icon="RiStrikethrough" title="Strikethrough" active={editor?.isActive('strike')} disabled={disabled} onClick={() => editor?.chain().focus().toggleStrike().run()} />

          <Divider />

          {/* Color & highlight */}
          <ColorDropdown editor={editor} disabled={disabled} />
          <HighlightDropdown editor={editor} disabled={disabled} />

          <Divider />

          {/* Lists */}
          <ToolbarBtn icon="RiListUnordered" title="Bullet list" active={editor?.isActive('bulletList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleBulletList().run()} />
          <ToolbarBtn icon="RiListOrdered" title="Ordered list" active={editor?.isActive('orderedList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleOrderedList().run()} />
          <ToolbarBtn icon="RiListCheck2" title="Task list" active={editor?.isActive('taskList')} disabled={disabled} onClick={() => editor?.chain().focus().toggleTaskList().run()} />

          <Divider />

          {/* Alignment */}
          <ToolbarBtn icon="RiAlignLeft" title="Align left" active={editor?.isActive({ textAlign: 'left' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('left').run()} />
          <ToolbarBtn icon="RiAlignCenter" title="Align center" active={editor?.isActive({ textAlign: 'center' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('center').run()} />
          <ToolbarBtn icon="RiAlignRight" title="Align right" active={editor?.isActive({ textAlign: 'right' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('right').run()} />
          <ToolbarBtn icon="RiAlignJustify" title="Justify" active={editor?.isActive({ textAlign: 'justify' })} disabled={disabled} onClick={() => editor?.chain().focus().setTextAlign('justify').run()} />

          <Divider />

          {/* Link */}
          <ToolbarBtn icon="RiLink" title="Add link" active={editor?.isActive('link')} disabled={disabled} onClick={handleLink} />
          <ToolbarBtn icon="RiLinkUnlink" title="Remove link" disabled={disabled || !editor?.isActive('link')} onClick={() => editor?.chain().focus().unsetLink().run()} />

          {/* Image */}
          <ToolbarBtn icon="RiImageLine" title="Insert image" disabled={disabled} onClick={() => fileInputRef.current?.click()} />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) insertImageFromFile(file)
              e.target.value = ''
            }}
          />

          <Divider />

          {/* Code / HR / Table */}
          <ToolbarBtn icon="RiCodeBoxLine" title="Code block" active={editor?.isActive('codeBlock')} disabled={disabled} onClick={() => editor?.chain().focus().toggleCodeBlock().run()} />
          <ToolbarBtn icon="RiSeparator" title="Horizontal rule" disabled={disabled} onClick={() => editor?.chain().focus().setHorizontalRule().run()} />
          <TablePicker editor={editor} disabled={disabled} />

          <Divider />

          {/* Format clear / Fullscreen */}
          <ToolbarBtn icon="RiFormatClear" title="Clear formatting" disabled={disabled} onClick={() => editor?.chain().focus().clearNodes().unsetAllMarks().run()} />
          <ToolbarBtn
            icon={fullscreen ? 'RiFullscreenExitLine' : 'RiFullscreenLine'}
            title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            onClick={() => setFullscreen((v) => !v)}
          />
        </div>

        {/* ── Context: link input ──────────────────────────── */}
        {linkInput !== null && (
          <div className="flex items-center gap-2 border-b border-border-control bg-surface-subtle px-3 py-1.5">
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
              className="min-w-0 flex-1 rounded border border-border bg-surface px-2 py-1 text-xs text-foreground outline-none focus:border-primary-600"
            />
            <button type="button" onClick={applyLink} className="rounded bg-primary-700/10 px-2.5 py-1 text-xs font-medium text-primary-600 hover:bg-primary-700/20">
              Apply
            </button>
            <button type="button" onClick={() => setLinkInput(null)} className="text-xs text-muted hover:text-foreground">
              Cancel
            </button>
          </div>
        )}

        {/* ── Context: table management ────────────────────── */}
        {isInTable && (
          <div className="flex flex-wrap items-center gap-0.5 border-b border-border-control bg-surface-subtle px-2 py-1">
            <span className="mr-1 text-[10px] font-medium text-muted uppercase">Table</span>
            <ToolbarBtn icon="RiInsertRowTop" title="Add row before" disabled={disabled} onClick={() => editor?.chain().focus().addRowBefore().run()} />
            <ToolbarBtn icon="RiInsertRowBottom" title="Add row after" disabled={disabled} onClick={() => editor?.chain().focus().addRowAfter().run()} />
            <ToolbarBtn icon="RiDeleteRow" title="Delete row" disabled={disabled} onClick={() => editor?.chain().focus().deleteRow().run()} />
            <Divider />
            <ToolbarBtn icon="RiInsertColumnLeft" title="Add column before" disabled={disabled} onClick={() => editor?.chain().focus().addColumnBefore().run()} />
            <ToolbarBtn icon="RiInsertColumnRight" title="Add column after" disabled={disabled} onClick={() => editor?.chain().focus().addColumnAfter().run()} />
            <ToolbarBtn icon="RiDeleteColumn" title="Delete column" disabled={disabled} onClick={() => editor?.chain().focus().deleteColumn().run()} />
            <Divider />
            <ToolbarBtn icon="RiMergeCellsHorizontal" title="Merge cells" disabled={disabled} onClick={() => editor?.chain().focus().mergeCells().run()} />
            <ToolbarBtn icon="RiSplitCellsHorizontal" title="Split cell" disabled={disabled} onClick={() => editor?.chain().focus().splitCell().run()} />
            <Divider />
            <ToolbarBtn icon="RiDeleteBinLine" title="Delete table" disabled={disabled} onClick={() => editor?.chain().focus().deleteTable().run()} />
          </div>
        )}

        {/* ── Context: code block language ─────────────────── */}
        {isInCodeBlock && (
          <div className="flex items-center gap-2 border-b border-border-control bg-surface-subtle px-3 py-1.5">
            <span className="text-[10px] font-medium text-muted uppercase">Language</span>
            <select
              value={(editor?.getAttributes('codeBlock').language as string | undefined) ?? ''}
              onChange={(e) =>
                editor?.chain().focus().updateAttributes('codeBlock', { language: e.target.value || null }).run()
              }
              className="h-5 rounded border border-border bg-surface px-1.5 text-[11px] text-foreground outline-none focus:border-primary-600"
            >
              {CODE_LANGS.map((l) => (
                <option key={l.value} value={l.value}>{l.label}</option>
              ))}
            </select>
          </div>
        )}

        {/* ── Editor content ──────────────────────────────── */}
        <EditorContent
          editor={editor}
          style={contentMinHeight}
          className={clsx(
            'flex-1 cursor-text px-4 py-3 text-sm text-foreground',
            fullscreen && 'overflow-y-auto',
          )}
          onClick={() => editor?.commands.focus()}
        />

        {/* ── Character count ─────────────────────────────── */}
        {(showCount || maxLength !== undefined) && (
          <div
            className={clsx(
              'flex justify-end border-t border-border-control px-3 py-1 text-[11px]',
              isOverLimit ? 'text-danger-600' : 'text-muted',
            )}
          >
            {maxLength !== undefined ? `${textLength} / ${maxLength}` : textLength}
          </div>
        )}
      </div>

      {(helperText || errorMessage) && (
        <p className={clsx('text-xs', errorMessage ? 'text-danger-600' : 'text-muted')}>
          {errorMessage ?? helperText}
        </p>
      )}
    </div>
  )
}
