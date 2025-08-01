"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Trash2, RefreshCw } from "lucide-react"
import { fetchTrashedNotes, restoreNote, permanentlyDeleteNote, emptyTrash, type Note } from "@/lib/supabase-client"
import { supabase } from "@/lib/supabase-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import DashboardLayout from "@/components/dashboard-layout"

export default function TrashPage() {
  const [trashedNotes, setTrashedNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEmptyTrashDialogOpen, setIsEmptyTrashDialogOpen] = useState(false)
  const [isDeleteNoteDialogOpen, setIsDeleteNoteDialogOpen] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [isEmptyingTrash, setIsEmptyingTrash] = useState(false)
  const [isDeletingNote, setIsDeletingNote] = useState(false)
  const [isRestoringNote, setIsRestoringNote] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      loadTrashedNotes()
    }

    checkUser()
  }, [router])

  const loadTrashedNotes = async () => {
    try {
      setLoading(true)
      const notesData = await fetchTrashedNotes()
      setTrashedNotes(notesData)
    } catch (error) {
      console.error("Error loading trashed notes:", error)
      toast({
        title: "Error",
        description: "Failed to load trashed notes. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreNote = async (noteId: string) => {
    try {
      setIsRestoringNote(true)
      await restoreNote(noteId)
      setTrashedNotes(trashedNotes.filter((note) => note.id !== noteId))
      toast({
        title: "Note restored",
        description: "The note has been restored successfully.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error restoring note:", error)
      toast({
        title: "Error",
        description: "Failed to restore note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsRestoringNote(false)
    }
  }

  const handleDeleteNote = async () => {
    if (!selectedNoteId) return

    try {
      setIsDeletingNote(true)
      await permanentlyDeleteNote(selectedNoteId)
      setTrashedNotes(trashedNotes.filter((note) => note.id !== selectedNoteId))
      toast({
        title: "Note deleted",
        description: "The note has been permanently deleted.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeletingNote(false)
      setIsDeleteNoteDialogOpen(false)
      setSelectedNoteId(null)
    }
  }

  const handleEmptyTrash = async () => {
    setIsEmptyingTrash(true)
    try {
      await emptyTrash()
      setTrashedNotes([])
      toast({
        title: "Trash emptied",
        description: "All notes in trash have been permanently deleted.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error emptying trash:", error)
      toast({
        title: "Error",
        description: "Failed to empty trash. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsEmptyingTrash(false)
      setIsEmptyTrashDialogOpen(false)
    }
  }

  // Filter notes by search query
  const filteredNotes = trashedNotes.filter((note) => {
    if (!searchQuery) return true
    return (
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.tags && note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    )
  })

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Trash</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <Input
                type="search"
                placeholder="Search in trash..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              variant="destructive"
              onClick={() => setIsEmptyTrashDialogOpen(true)}
              disabled={trashedNotes.length === 0}
            >
              Empty Trash
            </Button>
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading trashed notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium truncate">{note.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm truncate mt-1">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Deleted on {new Date(note.deleted_at || note.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-4"
                    onClick={() => handleRestoreNote(note.id)}
                    disabled={isRestoringNote}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restore
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedNoteId(note.id)
                      setIsDeleteNoteDialogOpen(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Trash is empty</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? "No trashed notes match your search." : "You don't have any deleted notes."}
            </p>
            <Button onClick={() => router.push("/dashboard")}>Go to All Notes</Button>
          </div>
        )}
      </div>

      {/* Empty Trash Dialog */}
      <AlertDialog open={isEmptyTrashDialogOpen} onOpenChange={setIsEmptyTrashDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Empty Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all notes in the trash.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleEmptyTrash}
              className="bg-red-500 hover:bg-red-600"
              disabled={isEmptyingTrash}
            >
              {isEmptyingTrash ? "Emptying..." : "Empty Trash"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Note Dialog */}
      <AlertDialog open={isDeleteNoteDialogOpen} onOpenChange={setIsDeleteNoteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note Permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this note from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-red-500 hover:bg-red-600"
              disabled={isDeletingNote}
            >
              {isDeletingNote ? "Deleting..." : "Delete Permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  )
}
