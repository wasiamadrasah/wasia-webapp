"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import TextAlign from "@tiptap/extension-text-align"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import { Table } from "@tiptap/extension-table"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import CharacterCount from "@tiptap/extension-character-count"

import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  CheckSquare,
  ChevronDown,
  Code,
  Code2,
  Columns2,
  CornerDownLeft,
  Grid3X3,
  Highlighter,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  PilcrowIcon,
  Quote,
  Redo2,
  RemoveFormatting,
  RowsIcon,
  SeparatorHorizontal,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table as TableIcon,
  Trash2,
  Underline as UnderlineIcon,
  Unlink2,
  Undo2,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// ── Types ────────────────────────────────────────────────────────────────────

type TiptapEditorProps = {
  name: string
  label: string
  initialValue?: string | null
  minHeightClassName?: string
  allowImage?: boolean
  maxCharacters?: number
}

// ── Constants ────────────────────────────────────────────────────────────────

const TEXT_COLORS = [
  { label: "Default", value: "" },
  { label: "Red", value: "#ef4444" },
  { label: "Orange", value: "#f97316" },
  { label: "Yellow", value: "#eab308" },
  { label: "Green", value: "#22c55e" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Purple", value: "#a855f7" },
  { label: "Pink", value: "#ec4899" },
  { label: "Gray", value: "#6b7280" },
  { label: "Black", value: "#111827" },
  { label: "White", value: "#ffffff" },
]

const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fef08a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Purple", value: "#e9d5ff" },
  { label: "Red", value: "#fecaca" },
  { label: "Gray", value: "#e5e7eb" },
]

const BLOCK_TYPES = [
  { label: "Paragraph", value: "paragraph", icon: <PilcrowIcon className="mr-2 h-4 w-4" /> },
  { label: "Heading 1", value: "h1", icon: <span className="mr-2 text-sm font-bold">H1</span> },
  { label: "Heading 2", value: "h2", icon: <span className="mr-2 text-sm font-bold">H2</span> },
  { label: "Heading 3", value: "h3", icon: <span className="mr-2 text-sm font-bold">H3</span> },
  { label: "Heading 4", value: "h4", icon: <span className="mr-2 text-sm font-bold">H4</span> },
  { label: "Heading 5", value: "h5", icon: <span className="mr-2 text-sm font-bold">H5</span> },
  { label: "Heading 6", value: "h6", icon: <span className="mr-2 text-sm font-bold">H6</span> },
  { label: "Blockquote", value: "blockquote", icon: <Quote className="mr-2 h-4 w-4" /> },
  { label: "Code Block", value: "codeBlock", icon: <Code2 className="mr-2 h-4 w-4" /> },
]

// ── Toolbar Button ────────────────────────────────────────────────────────────

function ToolbarButton({
  tooltip,
  isActive = false,
  disabled = false,
  onClick,
  children,
}: {
  tooltip: string
  isActive?: boolean
  disabled?: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          onMouseDown={(e) => e.preventDefault()}
          onClick={onClick}
          aria-pressed={isActive}
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition-all",
            "disabled:pointer-events-none disabled:opacity-40",
            isActive
              ? "bg-blue-600 text-white shadow-sm"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
          ].join(" ")}
        >
          {children}
        </button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}

// ── Separator ────────────────────────────────────────────────────────────────

function ToolbarSep() {
  return <div className="mx-0.5 h-6 w-px shrink-0 bg-border" />
}

// ── Block Type Selector ───────────────────────────────────────────────────────

function BlockTypeSelector({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null

  const active = (() => {
    if (editor.isActive("heading", { level: 1 })) return BLOCK_TYPES[1]
    if (editor.isActive("heading", { level: 2 })) return BLOCK_TYPES[2]
    if (editor.isActive("heading", { level: 3 })) return BLOCK_TYPES[3]
    if (editor.isActive("heading", { level: 4 })) return BLOCK_TYPES[4]
    if (editor.isActive("heading", { level: 5 })) return BLOCK_TYPES[5]
    if (editor.isActive("heading", { level: 6 })) return BLOCK_TYPES[6]
    if (editor.isActive("blockquote")) return BLOCK_TYPES[7]
    if (editor.isActive("codeBlock")) return BLOCK_TYPES[8]
    return BLOCK_TYPES[0]
  })()

  const apply = (value: string) => {
    const chain = editor.chain().focus()
    if (value === "paragraph") chain.setParagraph().run()
    else if (value === "blockquote") chain.toggleBlockquote().run()
    else if (value === "codeBlock") chain.toggleCodeBlock().run()
    else {
      const level = parseInt(value.replace("h", "")) as 1 | 2 | 3 | 4 | 5 | 6
      chain.toggleHeading({ level }).run()
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          className="inline-flex h-8 min-w-[120px] items-center justify-between gap-1 rounded-md border border-border bg-background px-2 text-sm text-foreground transition hover:bg-muted"
        >
          <span className="flex items-center">
            {active.icon}
            {active.label}
          </span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-40">
        {BLOCK_TYPES.map((bt, i) => (
          <React.Fragment key={bt.value}>
            {i === 7 && <DropdownMenuSeparator />}
            <DropdownMenuItem
              className={bt.value === active.value ? "bg-muted font-medium" : ""}
              onSelect={() => apply(bt.value)}
            >
              {bt.icon}
              {bt.label}
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// ── Color Picker ──────────────────────────────────────────────────────────────

function ColorPicker({
  editor,
  type,
}: {
  editor: ReturnType<typeof useEditor>
  type: "color" | "highlight"
}) {
  if (!editor) return null
  const colors = type === "color" ? TEXT_COLORS : HIGHLIGHT_COLORS
  const isColor = type === "color"

  const currentColor = isColor
    ? (editor.getAttributes("textStyle").color as string | undefined) ?? ""
    : (editor.getAttributes("highlight").color as string | undefined) ?? ""

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              className="inline-flex h-8 w-9 flex-col items-center justify-center gap-0.5 rounded-md text-sm transition hover:bg-muted"
            >
              {isColor ? (
                <Palette className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Highlighter className="h-4 w-4 text-muted-foreground" />
              )}
              <span
                className="h-1 w-4 rounded-full"
                style={{ backgroundColor: currentColor || (isColor ? "#111827" : "#fef08a") }}
              />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            {isColor ? "Text color" : "Highlight"}
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="start">
        <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          {isColor ? "Text Color" : "Highlight"}
        </p>
        <div className="grid grid-cols-5 gap-1.5">
          {colors.map((c) => (
            <button
              key={c.value || "default"}
              type="button"
              title={c.label}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (isColor) {
                  if (!c.value) editor.chain().focus().unsetColor().run()
                  else editor.chain().focus().setColor(c.value).run()
                } else {
                  if (editor.isActive("highlight", { color: c.value }))
                    editor.chain().focus().unsetHighlight().run()
                  else editor.chain().focus().setHighlight({ color: c.value }).run()
                }
              }}
              className={[
                "h-7 w-7 rounded-md border-2 transition-transform hover:scale-110",
                currentColor === c.value ? "border-blue-500 ring-2 ring-blue-200" : "border-border",
              ].join(" ")}
              style={{
                backgroundColor: c.value || "transparent",
                backgroundImage: !c.value
                  ? "repeating-linear-gradient(45deg,#ccc 0,#ccc 2px,transparent 0,transparent 50%)"
                  : undefined,
                backgroundSize: "6px 6px",
              }}
            />
          ))}
        </div>
        {isColor && (
          <button
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => editor.chain().focus().unsetColor().run()}
            className="mt-2 w-full rounded-md border border-border py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            Clear color
          </button>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ── Table Controls ────────────────────────────────────────────────────────────

function TableControls({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null
  const inTable = editor.isActive("table")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              className={[
                "inline-flex h-8 w-8 items-center justify-center rounded-md text-sm transition",
                inTable
                  ? "bg-blue-600 text-white"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              ].join(" ")}
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs">
            Table
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2" align="start">
        {!inTable ? (
          <>
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Insert Table
            </p>
            {[
              [3, 3], [3, 4], [4, 4], [5, 5],
            ].map(([rows, cols]) => (
              <button
                key={`${rows}x${cols}`}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows, cols, withHeaderRow: true })
                    .run()
                }
                className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
              >
                <Grid3X3 className="h-4 w-4 text-muted-foreground" />
                {rows} × {cols} table
              </button>
            ))}
          </>
        ) : (
          <>
            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Table Actions
            </p>
            <div className="grid grid-cols-1 gap-0.5">
              {[
                { label: "Add row above", icon: <RowsIcon className="h-3.5 w-3.5" />, action: () => editor.chain().focus().addRowBefore().run() },
                { label: "Add row below", icon: <RowsIcon className="h-3.5 w-3.5" />, action: () => editor.chain().focus().addRowAfter().run() },
                { label: "Delete row", icon: <Minus className="h-3.5 w-3.5" />, action: () => editor.chain().focus().deleteRow().run() },
                { label: "Add col before", icon: <Columns2 className="h-3.5 w-3.5" />, action: () => editor.chain().focus().addColumnBefore().run() },
                { label: "Add col after", icon: <Columns2 className="h-3.5 w-3.5" />, action: () => editor.chain().focus().addColumnAfter().run() },
                { label: "Delete column", icon: <Minus className="h-3.5 w-3.5" />, action: () => editor.chain().focus().deleteColumn().run() },
                { label: "Delete table", icon: <Trash2 className="h-3.5 w-3.5 text-destructive" />, action: () => editor.chain().focus().deleteTable().run(), danger: true },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={item.action}
                  className={[
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted",
                    item.danger ? "text-destructive" : "",
                  ].join(" ")}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  )
}

// ── Link Panel ────────────────────────────────────────────────────────────────

function LinkPanel({
  editor,
  onClose,
  savedSelection,
}: {
  editor: ReturnType<typeof useEditor>
  onClose: () => void
  savedSelection: { from: number; to: number } | null
}) {
  const [value, setValue] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editor) return
    const existing = editor.getAttributes("link").href as string | undefined
    setValue(existing || "https://")
    setTimeout(() => inputRef.current?.focus(), 50)
  }, [editor])

  const apply = () => {
    if (!editor || !savedSelection) return
    const trimmed = value.trim()
    if (!trimmed) {
      editor.chain().focus().setTextSelection(savedSelection).unsetLink().run()
      onClose()
      return
    }
    const url = /^[a-z][a-z\d+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`
    if (savedSelection.from === savedSelection.to) {
      editor.chain().focus().setTextSelection(savedSelection)
        .insertContent({ type: "text", text: url, marks: [{ type: "link", attrs: { href: url } }] })
        .run()
    } else {
      editor.chain().focus().setTextSelection(savedSelection).extendMarkRange("link").setLink({ href: url }).run()
    }
    onClose()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-3 py-2">
      <Link2 className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply() } if (e.key === "Escape") onClose() }}
        placeholder="https://example.com or mailto:..."
        className="h-8 flex-1 min-w-[200px] max-w-md text-sm"
      />
      <Button type="button" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white" onClick={apply}>
        Apply
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-8" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ── Image Panel ───────────────────────────────────────────────────────────────

function ImagePanel({
  editor,
  onClose,
  savedSelection,
}: {
  editor: ReturnType<typeof useEditor>
  onClose: () => void
  savedSelection: { from: number; to: number } | null
}) {
  const [url, setUrl] = useState("https://")
  const [alt, setAlt] = useState("")
  const urlRef = useRef<HTMLInputElement>(null)

  useEffect(() => { setTimeout(() => urlRef.current?.focus(), 50) }, [])

  const insert = () => {
    if (!editor || !savedSelection) return
    const src = /^[a-z][a-z\d+.-]*:/i.test(url.trim()) ? url.trim() : `https://${url.trim()}`
    try { new URL(src) } catch { return }
    editor.chain().focus().setTextSelection(savedSelection)
      .setImage({ src, alt: alt.trim() || "Image" }).run()
    onClose()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-t border-border bg-muted/30 px-3 py-2">
      <ImagePlus className="h-4 w-4 shrink-0 text-muted-foreground" />
      <Input
        ref={urlRef}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); insert() } if (e.key === "Escape") onClose() }}
        placeholder="Image URL"
        className="h-8 flex-1 min-w-[180px] max-w-sm text-sm"
      />
      <Input
        value={alt}
        onChange={(e) => setAlt(e.target.value)}
        placeholder="Alt text (optional)"
        className="h-8 w-40 text-sm"
      />
      <Button type="button" size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white" onClick={insert}>
        Insert
      </Button>
      <Button type="button" size="sm" variant="outline" className="h-8" onClick={onClose}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export function TiptapEditor({
  name,
  label,
  initialValue,
  minHeightClassName = "min-h-[360px]",
  allowImage = true,
  maxCharacters = 50000,
}: TiptapEditorProps) {
  const [html, setHtml] = useState(initialValue?.trim() || "<p></p>")
  const [panel, setPanel] = useState<"link" | "image" | null>(null)
  const [savedSelection, setSavedSelection] = useState<{ from: number; to: number } | null>(null)

  const initialContent = useMemo(() => initialValue?.trim() || "<p></p>", [initialValue])

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3, 4, 5, 6] } }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true, protocols: ["http", "https", "mailto"] }),
      Image.configure({ allowBase64: false }),
      Placeholder.configure({ placeholder: "Start writing your content here..." }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Subscript,
      Superscript,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Table.configure({ resizable: false }),
      TableRow,
      TableHeader,
      TableCell,
      CharacterCount.configure({ limit: maxCharacters }),
    ],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => setHtml(e.getHTML()),
  })

  useEffect(() => {
    if (!editor) return
    if (editor.getHTML() === initialContent) return
    editor.commands.setContent(initialContent)
  }, [editor, initialContent])

  const openPanel = (type: "link" | "image") => {
    if (!editor) return
    const sel = editor.state.selection
    setSavedSelection({ from: sel.from, to: sel.to })
    setPanel(type)
  }

  const charCount = editor ? (editor.storage.characterCount as { characters: () => number } | undefined)?.characters() ?? 0 : 0
  const wordCount  = editor ? (editor.storage.characterCount as { words: () => number } | undefined)?.words() ?? 0 : 0

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-1.5">
        <Label className="text-sm font-medium">{label}</Label>

        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-blue-500/30">

          {/* ── Toolbar ── */}
          <div className="border-b border-border bg-muted/40 px-2 py-1.5">
            <div className="flex flex-wrap items-center gap-1">

              {/* History */}
              <ToolbarButton
                tooltip="Undo (Ctrl+Z)"
                disabled={!editor?.can().undo()}
                onClick={() => editor?.chain().focus().undo().run()}
              >
                <Undo2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Redo (Ctrl+Y)"
                disabled={!editor?.can().redo()}
                onClick={() => editor?.chain().focus().redo().run()}
              >
                <Redo2 className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSep />

              {/* Block type */}
              {editor && <BlockTypeSelector editor={editor} />}

              <ToolbarSep />

              {/* Text format */}
              <ToolbarButton
                tooltip="Bold (Ctrl+B)"
                isActive={editor?.isActive("bold")}
                disabled={!editor?.can().toggleBold()}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <Bold className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Italic (Ctrl+I)"
                isActive={editor?.isActive("italic")}
                disabled={!editor?.can().toggleItalic()}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <Italic className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Underline (Ctrl+U)"
                isActive={editor?.isActive("underline")}
                disabled={!editor?.can().toggleUnderline()}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <UnderlineIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Strikethrough"
                isActive={editor?.isActive("strike")}
                disabled={!editor?.can().toggleStrike()}
                onClick={() => editor?.chain().focus().toggleStrike().run()}
              >
                <Strikethrough className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Inline code"
                isActive={editor?.isActive("code")}
                disabled={!editor?.can().toggleCode()}
                onClick={() => editor?.chain().focus().toggleCode().run()}
              >
                <Code className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSep />

              {/* Script */}
              <ToolbarButton
                tooltip="Subscript"
                isActive={editor?.isActive("subscript")}
                onClick={() => editor?.chain().focus().toggleSubscript().run()}
              >
                <SubscriptIcon className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Superscript"
                isActive={editor?.isActive("superscript")}
                onClick={() => editor?.chain().focus().toggleSuperscript().run()}
              >
                <SuperscriptIcon className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSep />

              {/* Color */}
              {editor && <ColorPicker editor={editor} type="color" />}
              {editor && <ColorPicker editor={editor} type="highlight" />}

              <ToolbarSep />

              {/* Lists */}
              <ToolbarButton
                tooltip="Bullet list"
                isActive={editor?.isActive("bulletList")}
                onClick={() => editor?.chain().focus().toggleBulletList().run()}
              >
                <List className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Ordered list"
                isActive={editor?.isActive("orderedList")}
                onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              >
                <ListOrdered className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Task list"
                isActive={editor?.isActive("taskList")}
                onClick={() => editor?.chain().focus().toggleTaskList().run()}
              >
                <CheckSquare className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSep />

              {/* Alignment */}
              <ToolbarButton
                tooltip="Align left"
                isActive={editor?.isActive({ textAlign: "left" })}
                onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              >
                <AlignLeft className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Align center"
                isActive={editor?.isActive({ textAlign: "center" })}
                onClick={() => editor?.chain().focus().setTextAlign("center").run()}
              >
                <AlignCenter className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Align right"
                isActive={editor?.isActive({ textAlign: "right" })}
                onClick={() => editor?.chain().focus().setTextAlign("right").run()}
              >
                <AlignRight className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Justify"
                isActive={editor?.isActive({ textAlign: "justify" })}
                onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
              >
                <AlignJustify className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSep />

              {/* Insert */}
              <ToolbarButton
                tooltip="Insert link"
                isActive={editor?.isActive("link")}
                disabled={!editor}
                onClick={() => openPanel("link")}
              >
                <Link2 className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Remove link"
                disabled={!editor?.isActive("link")}
                onClick={() => editor?.chain().focus().unsetLink().run()}
              >
                <Unlink2 className="h-4 w-4" />
              </ToolbarButton>
              {allowImage && (
                <ToolbarButton
                  tooltip="Insert image"
                  disabled={!editor}
                  onClick={() => openPanel("image")}
                >
                  <ImagePlus className="h-4 w-4" />
                </ToolbarButton>
              )}
              {editor && <TableControls editor={editor} />}
              <ToolbarButton
                tooltip="Horizontal rule"
                disabled={!editor}
                onClick={() => editor?.chain().focus().setHorizontalRule().run()}
              >
                <SeparatorHorizontal className="h-4 w-4" />
              </ToolbarButton>
              <ToolbarButton
                tooltip="Hard break (Shift+Enter)"
                disabled={!editor}
                onClick={() => editor?.chain().focus().setHardBreak().run()}
              >
                <CornerDownLeft className="h-4 w-4" />
              </ToolbarButton>

              <ToolbarSep />

              {/* Clear */}
              <ToolbarButton
                tooltip="Clear formatting"
                disabled={!editor}
                onClick={() => editor?.chain().focus().unsetAllMarks().run()}
              >
                <RemoveFormatting className="h-4 w-4" />
              </ToolbarButton>
            </div>
          </div>

          {/* ── Inline Panels (Link / Image) ── */}
          {panel === "link" && editor && (
            <LinkPanel editor={editor} savedSelection={savedSelection} onClose={() => setPanel(null)} />
          )}
          {panel === "image" && editor && (
            <ImagePanel editor={editor} savedSelection={savedSelection} onClose={() => setPanel(null)} />
          )}

          {/* ── Editor Content ── */}
          <EditorContent
            editor={editor}
            className={[
              "tiptap-content px-5 py-4 focus-within:outline-none",
              minHeightClassName,
            ].join(" ")}
          />

          {/* ── Status Bar ── */}
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-4 py-1.5 text-[11px] text-muted-foreground">
            <span>
              {wordCount} {wordCount === 1 ? "word" : "words"}
            </span>
            <span className={charCount >= maxCharacters * 0.9 ? "text-amber-500 font-medium" : ""}>
              {charCount.toLocaleString()} / {maxCharacters.toLocaleString()} characters
            </span>
          </div>
        </div>

        <input type="hidden" name={name} value={html} />
      </div>
    </TooltipProvider>
  )
}
