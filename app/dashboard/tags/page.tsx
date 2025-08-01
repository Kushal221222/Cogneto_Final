"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Search, TagIcon } from "lucide-react"
import { fetchNotes, type Note } from "@/lib/supabase-client"
import { supabase } from "@/lib/supabase-client"
import NoteCard from "@/components/note-card"
import { Badge } from "@/components/ui/badge"
import DashboardLayout from "@/components/dashboard-layout"

export default function TagsPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [allTags, setAllTags] = useState<string[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      const tagFromUrl = searchParams.get("tag")
      if (tagFromUrl) {
        setSelectedTag(tagFromUrl)
      }

      loadNotes()
    }

    checkUser()
  }, [router, searchParams])

  const loadNotes = async () => {
    try {
      const notesData = await fetchNotes()
      setNotes(notesData)

      // Extract all unique tags
      const tags = notesData.reduce((acc, note) => {
        if (note.tags && Array.isArray(note.tags)) {
          note.tags.forEach((tag) => {
            if (!acc.includes(tag)) {
              acc.push(tag)
            }
          })
        }
        return acc
      }, [] as string[])

      setAllTags(tags.sort())
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter notes by selected tag
  const filteredNotes = notes
    .filter((note) => {
      if (!selectedTag) return true
      return note.tags && note.tags.includes(selectedTag)
    })
    .filter((note) => {
      if (!searchQuery) return true
      return (
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase())
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
            <h1 className="text-2xl font-bold">Tags</h1>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            <Input
              type="search"
              placeholder="Search in filtered notes..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </header>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">All Tags</h2>

          {loading ? (
            <div className="text-center py-6">
              <div className="animate-spin h-6 w-6 border-4 border-purple-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : allTags.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-8">
              <Badge
                variant={!selectedTag ? "default" : "outline"}
                className="cursor-pointer text-sm py-1 px-3"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer text-sm py-1 px-3"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-8">
              <p className="text-gray-500 dark:text-gray-400">No tags found</p>
            </div>
          )}

          <h2 className="text-lg font-medium mb-4">
            {selectedTag ? `Notes tagged with "${selectedTag}"` : "All Notes"}
          </h2>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Loading your notes...</p>
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
              <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notes with this tag</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {selectedTag
                  ? `You don't have any notes tagged with "${selectedTag}".`
                  : "You don't have any notes yet."}
              </p>
              <Button onClick={() => router.push("/dashboard/new")}>Create a New Note</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
