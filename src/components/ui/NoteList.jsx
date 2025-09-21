"use client"

import { Button } from "@/components/ui/button"

export default function NoteList({ notes, onSelect, onNew }) {
  return (
    <aside className="w-64 border-r p-4 space-y-2 flex flex-col">
      <h2 className="text-lg font-semibold mb-4">My Notes</h2>

      <Button variant="outline" className="mb-4" onClick={onNew}>
        + New Note
      </Button>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {notes.map((note) => (
          <Button
            key={note.id}
            variant="ghost"
            className="w-full justify-start"
            onClick={() => onSelect(note.id)}
          >
            <div>
              <p className="font-medium">{note.title}</p>
              <p className="text-xs text-gray-500">{note.date}</p>
            </div>
          </Button>
        ))}
      </div>
    </aside>
  )
}
