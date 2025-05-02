"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useReality } from "../reality-provider"
import { PencilLine, Save, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

type ReaderNotesProps = {
  currentLocation?: string
}

export function ReaderNotes({ currentLocation }: ReaderNotesProps) {
  const { realityState, recordMemory } = useReality()
  const [notes, setNotes] = useState<any[]>([])
  const [activeNote, setActiveNote] = useState<number | null>(null)
  const [editMode, setEditMode] = useState(false)
  const [noteTitle, setNoteTitle] = useState("")
  const [noteContent, setNoteContent] = useState("")

  // Load notes from reality state
  useEffect(() => {
    const savedNotes = Object.entries(realityState.memories)
      .filter(([key]) => key.startsWith("note-"))
      .map(([key, value]) => ({
        id: key.replace("note-", ""),
        ...(value as any),
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    setNotes(savedNotes)
  }, [realityState.memories])

  const createNewNote = () => {
    const newNoteId = `note-${Date.now()}`
    const newNote = {
      id: newNoteId.replace("note-", ""),
      title: "New Note",
      content: "",
      location: currentLocation || "Unknown location",
      timestamp: new Date().toISOString(),
    }

    recordMemory(newNoteId, newNote)
    setActiveNote(0) // New note will be at the top after sorting
    setEditMode(true)
    setNoteTitle("New Note")
    setNoteContent("")
  }

  const saveNote = () => {
    if (activeNote === null) return

    const note = notes[activeNote]
    const updatedNote = {
      ...note,
      title: noteTitle,
      content: noteContent,
      timestamp: new Date().toISOString(),
    }

    recordMemory(`note-${note.id}`, updatedNote)
    setEditMode(false)
  }

  const deleteNote = () => {
    if (activeNote === null) return

    const note = notes[activeNote]

    // In a real app, we would delete from storage
    // For now, we'll just set the content to indicate deletion
    recordMemory(`note-${note.id}`, {
      ...note,
      deleted: true,
      timestamp: new Date().toISOString(),
    })

    setActiveNote(null)
    setEditMode(false)
  }

  const selectNote = (index: number) => {
    setActiveNote(index)
    setNoteTitle(notes[index].title)
    setNoteContent(notes[index].content)
    setEditMode(false)
  }

  return (
    <Card className="border-primary/30 bg-black/70">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <PencilLine className="h-5 w-5 mr-2 text-primary/80" />
              Reader Notes
            </CardTitle>
            <CardDescription>Keep track of your thoughts and discoveries</CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={createNewNote}
            className="border-primary/30 hover:border-primary/60"
          >
            <Plus className="h-4 w-4 mr-1" /> New Note
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 h-[300px]">
          <div className="col-span-1 border-r border-primary/20 pr-4 overflow-y-auto">
            <div className="space-y-2">
              {notes
                .filter((note) => !note.deleted)
                .map((note, index) => (
                  <div
                    key={note.id}
                    className={cn(
                      "p-2 border rounded-md cursor-pointer hover:bg-primary/10 transition-colors",
                      activeNote === index ? "border-primary bg-primary/10" : "border-primary/20",
                    )}
                    onClick={() => selectNote(index)}
                  >
                    <p className="font-medium truncate">{note.title}</p>
                    <p className="text-xs text-muted-foreground truncate">{note.location}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(note.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                ))}

              {notes.filter((note) => !note.deleted).length === 0 && (
                <div className="text-center p-4">
                  <p className="text-muted-foreground">No notes yet. Create your first note to get started.</p>
                </div>
              )}
            </div>
          </div>

          <div className="col-span-2">
            {activeNote !== null && notes[activeNote] ? (
              <div className="h-full flex flex-col">
                {editMode ? (
                  <>
                    <Input
                      value={noteTitle}
                      onChange={(e) => setNoteTitle(e.target.value)}
                      className="mb-2 bg-black/50 border-primary/30"
                      placeholder="Note title"
                    />
                    <Textarea
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      className="flex-1 resize-none bg-black/50 border-primary/30"
                      placeholder="Write your note here..."
                    />
                    <div className="flex justify-end space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditMode(false)}
                        className="border-primary/30 hover:border-primary/60"
                      >
                        Cancel
                      </Button>
                      <Button size="sm" onClick={saveNote} className="bg-primary hover:bg-primary/90">
                        <Save className="h-4 w-4 mr-1" /> Save
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-medium">{notes[activeNote].title}</h3>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => setEditMode(true)} className="h-8 w-8">
                          <PencilLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={deleteNote}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mb-2">
                      <span>{notes[activeNote].location}</span>
                      <span className="mx-1">•</span>
                      <span>{new Date(notes[activeNote].timestamp).toLocaleString()}</span>
                    </div>
                    <div className="flex-1 overflow-y-auto border border-primary/20 rounded-md p-3">
                      <p className="whitespace-pre-wrap">{notes[activeNote].content}</p>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center p-4">
                  <p className="text-muted-foreground">Select a note from the list or create a new one.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
