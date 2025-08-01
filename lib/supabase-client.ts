import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create a singleton instance of the Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey)

export type Priority =
  | "urgent-important"
  | "important-not-urgent"
  | "urgent-not-important"
  | "not-urgent-not-important"
  | null

export type Note = {
  id: string
  title: string
  content: string
  tags: string[]
  created_at: string
  updated_at: string
  user_id: string
  favorite?: boolean
  deleted?: boolean
  deleted_at?: string
  priority_type?: Priority // Updated to match the database schema
  due_date?: string
  reminder_time?: string // Updated to match the database schema
  is_task?: boolean // Added to match the database schema
  completed?: boolean // Added to match the database schema
  delegated_to?: string // Added to match the database schema
  image_url?: string
}

export async function fetchNotes() {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Only fetch notes that aren't deleted and belong to the current user
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("deleted", false)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data as Note[]
  } catch (error) {
    console.error("Error fetching notes:", error)
    throw new Error(`Failed to fetch notes: ${error.message}`)
  }
}

export async function fetchNoteById(id: string) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase.from("notes").select("*").eq("id", id).eq("user_id", userId).single()

    if (error) throw error
    return data as Note
  } catch (error) {
    console.error("Error fetching note by ID:", error)
    throw new Error(`Failed to fetch note: ${error.message}`)
  }
}

export async function createNote(
  title: string,
  content: string,
  tags: string[] = [],
  priority: Priority = null,
  due_date: string = null,
  image_url: string = null,
) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Ensure tags is an array
    const processedTags = Array.isArray(tags) ? tags : []

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          title,
          content,
          tags: processedTags,
          user_id: userId,
          favorite: false,
          deleted: false,
          priority_type: priority, // Updated to match the database schema
          due_date,
          image_url,
          is_task: false, // Default value
          completed: false, // Default value
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()

    if (error) {
      console.error("Supabase insert error:", error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error("No data returned after insert")
    }

    return data[0] as Note
  } catch (error) {
    console.error("Error creating note:", error)
    throw new Error(`Failed to create note: ${error.message}`)
  }
}

export async function updateNote(id: string, updates: Partial<Note>) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // If priority is being updated, map it to priority_type
    if (updates.priority_type !== undefined) {
      updates.priority_type = updates.priority_type
      delete updates.priority
    }

    // Ensure we're updating with the current timestamp
    const updatedData = {
      ...updates,
      updated_at: new Date().toISOString(),
    }

    const { data, error } = await supabase.from("notes").update(updatedData).eq("id", id).eq("user_id", userId).select()

    if (error) throw error
    return data[0] as Note
  } catch (error) {
    console.error("Error updating note:", error)
    throw new Error(`Failed to update note: ${error.message}`)
  }
}

export async function updateNotePriority(id: string, priority: Priority) {
  return updateNote(id, { priority_type: priority }) // Updated to match the database schema
}

export async function deleteNote(id: string) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Soft delete - mark as deleted
    const { error } = await supabase
      .from("notes")
      .update({
        deleted: true,
        deleted_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error deleting note:", error)
    throw new Error(`Failed to delete note: ${error.message}`)
  }
}

export async function permanentlyDeleteNote(id: string) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Hard delete - remove from database
    const { error } = await supabase.from("notes").delete().eq("id", id).eq("user_id", userId)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error permanently deleting note:", error)
    throw new Error(`Failed to permanently delete note: ${error.message}`)
  }
}

export async function fetchTrashedNotes() {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Fetch only deleted notes
    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("deleted", true)
      .order("deleted_at", { ascending: false })

    if (error) throw error
    return data as Note[]
  } catch (error) {
    console.error("Error fetching trashed notes:", error)
    throw new Error(`Failed to fetch trashed notes: ${error.message}`)
  }
}

export async function restoreNote(id: string) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .update({
        deleted: false,
        deleted_at: null,
      })
      .eq("id", id)
      .eq("user_id", userId)
      .select()

    if (error) throw error
    return data[0] as Note
  } catch (error) {
    console.error("Error restoring note:", error)
    throw new Error(`Failed to restore note: ${error.message}`)
  }
}

export async function emptyTrash() {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { error } = await supabase.from("notes").delete().eq("user_id", userId).eq("deleted", true)

    if (error) throw error
    return true
  } catch (error) {
    console.error("Error emptying trash:", error)
    throw new Error(`Failed to empty trash: ${error.message}`)
  }
}

export async function toggleFavorite(id: string, isFavorite: boolean) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .update({ favorite: isFavorite })
      .eq("id", id)
      .eq("user_id", userId)
      .select()

    if (error) throw error
    return data[0] as Note
  } catch (error) {
    console.error("Error toggling favorite:", error)
    throw new Error(`Failed to toggle favorite: ${error.message}`)
  }
}

export async function fetchFavoriteNotes() {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("deleted", false)
      .eq("favorite", true)
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data as Note[]
  } catch (error) {
    console.error("Error fetching favorite notes:", error)
    throw new Error(`Failed to fetch favorite notes: ${error.message}`)
  }
}

export async function suggestRelatedNotes(noteId: string) {
  try {
    // This is a simplified version - in a real app, you'd implement a more sophisticated algorithm
    const currentNote = await fetchNoteById(noteId)

    // Get notes with similar tags
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("deleted", false)
      .neq("id", noteId)
      .filter("tags", "cs", `{${currentNote.tags.join(",")}}`)
      .limit(5)

    if (error) throw error
    return data as Note[]
  } catch (error) {
    console.error("Error suggesting related notes:", error)
    throw new Error(`Failed to suggest related notes: ${error.message}`)
  }
}

export async function uploadImage(file: File): Promise<string> {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Supabase Storage
    // Make sure the bucket exists first
    const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("note-images")

    if (bucketError && bucketError.message.includes("not found")) {
      // Create the bucket if it doesn't exist
      await supabase.storage.createBucket("note-images", {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      })
    }

    const { data, error } = await supabase.storage.from("note-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (error) {
      console.error("Storage upload error:", error)
      throw error
    }

    // Get the public URL
    const { data: urlData } = supabase.storage.from("note-images").getPublicUrl(fileName)

    if (!urlData || !urlData.publicUrl) {
      throw new Error("Failed to get public URL for uploaded image")
    }

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading image:", error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }
}

export async function uploadFile(file: File, noteId: string) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    // Create a unique file name
    const fileExt = file.name.split(".").pop()
    const fileName = `${userId}/${noteId}/${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage.from("note-attachments").upload(fileName, file)

    if (error) throw error

    // Get the public URL
    const { data: urlData } = supabase.storage.from("note-attachments").getPublicUrl(fileName)

    // Update the note with the file URL
    const note = await fetchNoteById(noteId)
    const files = note.files || []
    files.push(urlData.publicUrl)

    await updateNote(noteId, { files })

    return urlData.publicUrl
  } catch (error) {
    console.error("Error uploading file:", error)
    throw new Error(`Failed to upload file: ${error.message}`)
  }
}

export async function fetchNotesByPriority(priority: Priority) {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("deleted", false)
      .eq("priority_type", priority) // Updated to match the database schema
      .order("updated_at", { ascending: false })

    if (error) throw error
    return data as Note[]
  } catch (error) {
    console.error("Error fetching notes by priority:", error)
    throw new Error(`Failed to fetch notes by priority: ${error.message}`)
  }
}

export async function setReminder(noteId: string, reminderDate: string) {
  return updateNote(noteId, { reminder_time: reminderDate }) // Updated to match the database schema
}

export async function fetchReminders() {
  try {
    const { data: session } = await supabase.auth.getSession()
    const userId = session?.session?.user?.id

    if (!userId) {
      throw new Error("User not authenticated")
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("user_id", userId)
      .eq("deleted", false)
      .not("reminder_time", "is", null) // Updated to match the database schema
      .order("reminder_time", { ascending: true }) // Updated to match the database schema

    if (error) throw error
    return data as Note[]
  } catch (error) {
    console.error("Error fetching reminders:", error)
    throw new Error(`Failed to fetch reminders: ${error.message}`)
  }
}

export async function suggestPriority(title: string, content: string): Promise<Priority> {
  // Simple keyword-based priority suggestion
  const text = `${title} ${content}`.toLowerCase()

  // Check for urgent and important keywords
  const urgentKeywords = [
    "urgent",
    "asap",
    "immediately",
    "deadline",
    "due today",
    "due tomorrow",
    "critical",
    "emergency",
  ]
  const importantKeywords = ["important", "priority", "crucial", "essential", "significant", "key", "major"]

  const isUrgent = urgentKeywords.some((keyword) => text.includes(keyword))
  const isImportant = importantKeywords.some((keyword) => text.includes(keyword))

  if (isUrgent && isImportant) return "urgent-important"
  if (isImportant && !isUrgent) return "important-not-urgent"
  if (isUrgent && !isImportant) return "urgent-not-important"

  return null
}

// New function to toggle task completion status
export async function toggleTaskCompletion(id: string, isCompleted: boolean) {
  return updateNote(id, { completed: isCompleted })
}

// New function to set task status
export async function setTaskStatus(id: string, isTask: boolean) {
  return updateNote(id, { is_task: isTask })
}

// New function to delegate a task
export async function delegateTask(id: string, delegatedTo: string) {
  return updateNote(id, { delegated_to: delegatedTo })
}
