"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, CalendarIcon, Plus, X, ImageIcon, Loader2, Upload } from "lucide-react"
import { createNote, suggestPriority, uploadImage, type Priority } from "@/lib/supabase-client"
import { supabase } from "@/lib/supabase-client"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import AIContentEnrichment from "@/components/ai-content-enrichment"

export default function NewNote() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])
  const [priority, setPriority] = useState<Priority>(null)
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [allExistingTags, setAllExistingTags] = useState<string[]>([])
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
      }
    }

    checkUser()
    loadExistingTags()
  }, [router])

  const loadExistingTags = async () => {
    try {
      const { data, error } = await supabase.from("notes").select("tags").eq("deleted", false)

      if (error) throw error

      // Extract all unique tags from existing notes
      const existingTags = data.reduce((acc, note) => {
        if (note.tags && Array.isArray(note.tags)) {
          note.tags.forEach((tag) => {
            if (!acc.includes(tag)) {
              acc.push(tag)
            }
          })
        }
        return acc
      }, [] as string[])

      setAllExistingTags(existingTags.sort())
    } catch (error) {
      console.error("Error loading existing tags:", error)
    }
  }

  // Generate tag suggestions based on title and content
  useEffect(() => {
    // Only suggest tags if we have title or content
    if (!title && !content) {
      setSuggestedTags([])
      return
    }

    // Extract potential tags from title and content
    const words = `${title} ${content}`.toLowerCase().split(/\s+/)

    // Filter out common words, short words, and words already used as tags
    const potentialTags = words.filter(
      (word) =>
        word.length > 3 &&
        !tags.includes(word) &&
        !["the", "and", "for", "with", "this", "that", "have", "from"].includes(word),
    )

    // Find existing tags that might be relevant
    const relevantExistingTags = allExistingTags.filter(
      (tag) =>
        !tags.includes(tag) &&
        (title.toLowerCase().includes(tag.toLowerCase()) || content.toLowerCase().includes(tag.toLowerCase())),
    )

    // Combine and deduplicate
    const combined = [...new Set([...relevantExistingTags, ...potentialTags.slice(0, 3)])]

    // Limit to 5 suggestions
    setSuggestedTags(combined.slice(0, 5))

    // Suggest priority based on content
    const suggestPriorityBasedOnContent = async () => {
      if (title || content) {
        const suggestedPriority = await suggestPriority(title, content)
        if (suggestedPriority && !priority) {
          setPriority(suggestedPriority)
          toast({
            title: "Priority suggested",
            description: `Based on your content, we've suggested a priority level.`,
            variant: "default",
          })
        }
      }
    }

    suggestPriorityBasedOnContent()
  }, [title, content, tags, allExistingTags, priority, toast])

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleAddSuggestedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag])
      // Remove from suggestions
      setSuggestedTags(suggestedTags.filter((t) => t !== tag))
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      })
      return
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Only image files are allowed",
        variant: "destructive",
      })
      return
    }

    setImageFile(file)

    // Create a preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleUploadImage = async () => {
    if (!imageFile) return null

    setUploadingImage(true)
    try {
      // Create the bucket if it doesn't exist
      const { data: bucketData, error: bucketError } = await supabase.storage.getBucket("note-images")

      if (bucketError && bucketError.message.includes("not found")) {
        await supabase.storage.createBucket("note-images", {
          public: true,
          fileSizeLimit: 5242880, // 5MB
        })
      }

      const url = await uploadImage(imageFile)
      setImageUrl(url)
      toast({
        title: "Image uploaded",
        description: "Your image has been uploaded successfully",
        variant: "default",
      })
      return url
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Upload failed",
        description: error.message || "Failed to upload image. Please try again.",
        variant: "destructive",
      })
      return null
    } finally {
      setUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview(null)
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // AI Enhancement handlers
  const handleAISummaryGenerated = (summary: string) => {
    // Append AI summary to content with clear separator
    const separator = "\n\n--- AI Summary ---\n"
    const newContent = content + separator + summary
    setContent(newContent)
  }

  const handleAITagsGenerated = (aiTags: string[]) => {
    // Replace existing tags with AI-generated tags
    setTags(aiTags)
    // Clear suggested tags since we now have AI tags
    setSuggestedTags([])
  }

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your note")
      return
    }

    setSaving(true)
    setError("")

    try {
      // Upload image if present
      let finalImageUrl = imageUrl
      if (imageFile && !imageUrl) {
        finalImageUrl = await handleUploadImage()
      }

      const dueDateString = dueDate ? dueDate.toISOString() : null
      await createNote(title, content, tags, priority, dueDateString, finalImageUrl)
      toast({
        title: "Note created",
        description: "Your note has been saved successfully.",
        variant: "default",
      })
      router.push("/dashboard")
    } catch (error) {
      console.error("Error saving note:", error)
      setError(`Failed to save note: ${error.message}`)
      toast({
        title: "Error",
        description: `Failed to save note: ${error.message}`,
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "urgent-important":
        return "text-red-500 bg-red-100 dark:bg-red-900/20"
      case "important-not-urgent":
        return "text-orange-500 bg-orange-100 dark:bg-orange-900/20"
      case "urgent-not-important":
        return "text-yellow-500 bg-yellow-100 dark:bg-yellow-900/20"
      case "not-urgent-not-important":
        return "text-gray-500 bg-gray-100 dark:bg-gray-800"
      default:
        return "text-gray-500 bg-gray-100 dark:bg-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-600" />
              <span className="font-bold text-lg">Cogneto</span>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Note"
            )}
          </Button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Note title"
                className="text-lg font-medium mt-1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your note here..."
                className="min-h-[200px] md:min-h-[300px] mt-1 resize-none"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={priority || ""} onValueChange={(value) => setPriority(value as Priority)}>
                  <SelectTrigger className={cn("mt-1", priority && getPriorityColor(priority))}>
                    <SelectValue placeholder="Select Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Priority</SelectItem>
                    <SelectItem value="urgent-important" className="text-red-500">
                      Urgent & Important
                    </SelectItem>
                    <SelectItem value="important-not-urgent" className="text-orange-500">
                      Important, Not Urgent
                    </SelectItem>
                    <SelectItem value="urgent-not-important" className="text-yellow-500">
                      Urgent, Not Important
                    </SelectItem>
                    <SelectItem value="not-urgent-not-important" className="text-gray-500">
                      Not Urgent, Not Important
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !dueDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={dueDate} onSelect={setDueDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Image Upload Section */}
            <div>
              <Label htmlFor="image">Image (Optional)</Label>
              <div className="mt-2 flex flex-col space-y-4">
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="flex-shrink-0"
                  >
                    <ImageIcon className="h-4 w-4 mr-2" />
                    {imageFile ? "Change Image" : "Add Image"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="image"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />

                  {imageFile && !imageUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleUploadImage}
                      disabled={uploadingImage}
                      className="flex-shrink-0 bg-transparent"
                    >
                      {uploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Now
                        </>
                      )}
                    </Button>
                  )}

                  {imagePreview && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleRemoveImage}
                      className="text-red-500 hover:text-red-700 flex-shrink-0"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  )}
                </div>

                {imagePreview && (
                  <div className="relative mt-2 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="max-h-64 max-w-full object-contain mx-auto"
                    />
                    {uploadingImage && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 text-white animate-spin" />
                      </div>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Supported formats: JPG, PNG, GIF. Maximum size: 5MB.
                </p>
              </div>
            </div>

            <div>
              <Label htmlFor="tags">Tags</Label>
              <div className="flex flex-wrap gap-2 mt-2 mb-3">
                {tags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md text-sm"
                  >
                    <span>#{tag}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-grow"
                />
                <Button type="button" onClick={handleAddTag} className="flex-shrink-0">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>

              {/* Tag suggestions */}
              {suggestedTags.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm text-gray-500 dark:text-gray-400">Suggested Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {suggestedTags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        onClick={() => handleAddSuggestedTag(tag)}
                      >
                        + {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Content Enrichment Module */}
        <AIContentEnrichment
          title={title}
          content={content}
          onSummaryGenerated={handleAISummaryGenerated}
          onTagsGenerated={handleAITagsGenerated}
          disabled={saving}
          mode="create"
        />
      </main>
    </div>
  )
}
