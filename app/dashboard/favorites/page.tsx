"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, Star } from "lucide-react"
import { fetchNotes, type Note } from "@/lib/supabase-client"
import { supabase } from "@/lib/supabase-client"
import NoteCard from "@/components/note-card"
import DashboardLayout from "@/components/dashboard-layout"

export default function FavoritesPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

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
      // In a real app, you would filter by favorites in the database query
      // For now, we'll simulate this by filtering notes with a "favorite" property
      setNotes(notesData.filter((note) => note.favorite === true))
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter notes by search query
  const filteredNotes = notes.filter((note) => {
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
            <h1 className="text-2xl font-bold">Favorite Notes</h1>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search favorites..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your favorite notes...</p>
          </div>
        ) : filteredNotes.length > 0 ? (
          <div className="space-y-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                viewMode="list"
                onEdit={() => router.push(`/dashboard/edit/${note.id}`)}
                onDelete={loadNotes}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No favorite notes</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery
                ? "No favorite notes match your search."
                : "You haven't added any notes to your favorites yet."}
            </p>
            <Button onClick={() => router.push("/dashboard")}>Go to All Notes</Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
