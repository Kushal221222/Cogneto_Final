"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Plus, AlertTriangle, Clock, Ban, CheckCircle2 } from "lucide-react"
import { fetchNotes, updateNotePriority, type Note, type Priority } from "@/lib/supabase-client"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"
import MatrixQuadrant from "@/components/matrix/matrix-quadrant"
import MatrixNoteCard from "@/components/matrix/matrix-note-card"

export default function MatrixPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [activeNote, setActiveNote] = useState<Note | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor),
  )

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      loadNotes()
    }

    checkUser()
  }, [router])

  const loadNotes = async () => {
    try {
      const notesData = await fetchNotes()
      setNotes(notesData)
    } catch (error) {
      console.error("Error loading notes:", error)
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDragStart = (event) => {
    const { active } = event
    setActiveId(active.id)
    const draggedNote = notes.find((note) => note.id === active.id)
    setActiveNote(draggedNote)
  }

  const handleDragEnd = async (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const noteId = active.id
      const newPriority = over.id as Priority

      try {
        await updateNotePriority(noteId, newPriority)

        // Update local state
        setNotes(notes.map((note) => (note.id === noteId ? { ...note, priority_type: newPriority } : note)))

        toast({
          title: "Note updated",
          description: "The note priority has been updated.",
          variant: "success",
        })
      } catch (error) {
        console.error("Error updating note priority:", error)
        toast({
          title: "Update failed",
          description: "Failed to update note priority. Please try again.",
          variant: "destructive",
        })
      }
    }

    setActiveId(null)
    setActiveNote(null)
  }

  const getQuadrantNotes = (priority: Priority) => {
    return notes.filter((note) => note.priority_type === priority)
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Priority Matrix</h1>
          </div>

          <Button
            onClick={() => router.push("/dashboard/new")}
            className="bg-gradient-to-r from-purple-600 to-indigo-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your notes...</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToWindowEdges]}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MatrixQuadrant
                id="urgent-important"
                title="Urgent & Important"
                description="Do it now"
                icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
                color="bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                iconColor="text-red-500"
              >
                {getQuadrantNotes("urgent-important").map((note) => (
                  <MatrixNoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => router.push(`/dashboard/edit/${note.id}`)}
                    onDelete={loadNotes}
                  />
                ))}
                {getQuadrantNotes("urgent-important").length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    Drag notes here or create new ones
                  </div>
                )}
              </MatrixQuadrant>

              <MatrixQuadrant
                id="important-not-urgent"
                title="Important, Not Urgent"
                description="Schedule it"
                icon={<Clock className="h-5 w-5 text-orange-500" />}
                color="bg-orange-100 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800"
                iconColor="text-orange-500"
              >
                {getQuadrantNotes("important-not-urgent").map((note) => (
                  <MatrixNoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => router.push(`/dashboard/edit/${note.id}`)}
                    onDelete={loadNotes}
                  />
                ))}
                {getQuadrantNotes("important-not-urgent").length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    Drag notes here or create new ones
                  </div>
                )}
              </MatrixQuadrant>

              <MatrixQuadrant
                id="urgent-not-important"
                title="Urgent, Not Important"
                description="Delegate it"
                icon={<Ban className="h-5 w-5 text-yellow-500" />}
                color="bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                iconColor="text-yellow-500"
              >
                {getQuadrantNotes("urgent-not-important").map((note) => (
                  <MatrixNoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => router.push(`/dashboard/edit/${note.id}`)}
                    onDelete={loadNotes}
                  />
                ))}
                {getQuadrantNotes("urgent-not-important").length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    Drag notes here or create new ones
                  </div>
                )}
              </MatrixQuadrant>

              <MatrixQuadrant
                id="not-urgent-not-important"
                title="Not Urgent, Not Important"
                description="Eliminate or archive"
                icon={<CheckCircle2 className="h-5 w-5 text-gray-500" />}
                color="bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                iconColor="text-gray-500"
              >
                {getQuadrantNotes("not-urgent-not-important").map((note) => (
                  <MatrixNoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => router.push(`/dashboard/edit/${note.id}`)}
                    onDelete={loadNotes}
                  />
                ))}
                {getQuadrantNotes("not-urgent-not-important").length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                    Drag notes here or create new ones
                  </div>
                )}
              </MatrixQuadrant>
            </div>

            <DragOverlay>
              {activeId && activeNote ? (
                <div className="opacity-80">
                  <MatrixNoteCard note={activeNote} onEdit={() => {}} onDelete={() => {}} isDragging />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        )}
      </div>
    </DashboardLayout>
  )
}
