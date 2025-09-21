"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import CharacterCount from "@tiptap/extension-character-count"
import { Button } from "@/components/ui/button"

export default function NoteEditor({ onSave }) {
  const editor = useEditor({
    extensions: [StarterKit, CharacterCount],
    content: "<p>Start writing your note...</p>",
    immediatelyRender: false,
  })

  if (!editor) return null

  return (
    <div className="space-y-3 w-full">
      <div className="p-4 border rounded-lg bg-white dark:bg-gray-900">
        <EditorContent editor={editor} className="prose dark:prose-invert min-h-[200px]" />
        <p className="text-sm text-gray-500 mt-2">
          {editor.storage.characterCount.characters()} characters
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex gap-2">
        <Button onClick={() => editor.chain().focus().toggleBold().run()} variant="outline">
          Bold
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant="outline">
          Italic
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant="outline">
          • List
        </Button>
      </div>

      {/* Save */}
      <Button onClick={() => onSave(editor.getHTML())}>Save Note</Button>
    </div>
  )
}
