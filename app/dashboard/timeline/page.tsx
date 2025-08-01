"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CalendarIcon, ArrowLeft } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { fetchNotes, type Note } from "@/lib/supabase-client"
import { supabase } from "@/lib/supabase-client"
import NoteCard from "@/components/note-card"
import DashboardLayout from "@/components/dashboard-layout"

export default function TimelinePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date>(new Date())
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
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
      setNotes(notesData)
    } catch (error) {
      console.error("Error loading notes:", error)
    } finally {
      setLoading(false)
    }
  }

  // Filter notes by selected date
  const filteredNotes = notes.filter((note) => {
    const noteDate = new Date(note.created_at)
    return (
      noteDate.getDate() === date.getDate() &&
      noteDate.getMonth() === date.getMonth() &&
      noteDate.getFullYear() === date.getFullYear()
    )
  })

  // Get dates with notes for highlighting in calendar
  const datesWithNotes = notes.map((note) => new Date(note.created_at))

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Timeline View</h1>
          </div>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn("w-[240px] justify-start text-left font-normal", !date && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                modifiers={{
                  hasNote: datesWithNotes,
                }}
                modifiersStyles={{
                  hasNote: {
                    fontWeight: "bold",
                    backgroundColor: "rgba(124, 58, 237, 0.1)",
                    color: "#7c3aed",
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </header>

        <div className="mb-8">
          <h2 className="text-lg font-medium mb-4">Notes from {format(date, "MMMM d, yyyy")}</h2>

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
              <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No notes on this date</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You don't have any notes created on {format(date, "MMMM d, yyyy")}.
              </p>
              <Button onClick={() => router.push("/dashboard/new")}>Create a New Note</Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
