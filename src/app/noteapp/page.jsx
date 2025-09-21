"use client"

import { useState, useEffect } from "react"
import NoteEditor from "@/components/ui/NoteEditor"
import NoteList from "@/components/ui/NoteList"
import demoNotes from "@/data/notes.json"

export default function NotesPage() {
  const [notes, setNotes] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    setNotes(demoNotes)
  }, [])

  const handleSave = (html) => {
    if (selected && selected.id.startsWith("new-")) {
      // Update the new note
      const updatedNotes = notes.map((note) =>
        note.id === selected.id ? { ...note, content: html } : note
      )
      setNotes(updatedNotes)
      setSelected({ ...selected, content: html })
    } else {
      const newNote = {
        id: `note-${Date.now()}`,
        title: `Note ${notes.length + 1}`,
        date: new Date().toLocaleDateString(),
        content: html,
      }
      setNotes([...notes, newNote])
      setSelected(newNote)
    }
  }

  const handleNewNote = () => {
    const newNote = {
      id: `new-${Date.now()}`,
      title: "New Note",
      date: new Date().toLocaleDateString(),
    }
    setSelected(newNote)
  }

  return (
    <main className="flex h-screen">
      <NoteList
        notes={notes}
        onSelect={(id) => setSelected(notes.find((n) => n.id === id) || null)}
        onNew={handleNewNote}
      />
      <div className="flex-1 p-6 overflow-y-auto">
        <NoteEditor key={selected?.id} onSave={handleSave} />
        {selected && (
          <div className="mt-6 space-y-4">
            <h1 className="text-xl font-bold">{selected.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: selected.content }}
              className="prose dark:prose-invert"
            />
          </div>
        )}
      </div>
    </main>
  )
}
