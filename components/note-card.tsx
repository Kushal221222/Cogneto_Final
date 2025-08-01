"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Edit, MoreVertical, Star, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { deleteNote, toggleFavorite, type Note } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"
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
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface NoteCardProps {
  note: Note
  viewMode: "grid" | "list"
  onEdit: () => void
  onDelete: () => void
}

export default function NoteCard({ note, viewMode, onEdit, onDelete }: NoteCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isFavoriting, setIsFavoriting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleEdit = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    router.push(`/dashboard/edit/${note.id}`)
  }

  const handleDelete = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    setIsDeleting(true)
    try {
      await deleteNote(note.id)
      toast({
        title: "Note moved to trash",
        description: "The note has been moved to the trash.",
        variant: "success",
      })
      onDelete()
    } catch (error) {
      console.error("Error deleting note:", error)
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavoriting(true)
    try {
      await toggleFavorite(note.id, !note.favorite)
      toast({
        title: note.favorite ? "Removed from favorites" : "Added to favorites",
        description: note.favorite
          ? "The note has been removed from your favorites."
          : "The note has been added to your favorites.",
        variant: "success",
      })
      onDelete() // This will trigger a refresh of the notes list
    } catch (error) {
      console.error("Error toggling favorite:", error)
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsFavoriting(false)
    }
  }

  const openDeleteDialog = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsDeleteDialogOpen(true)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent-important":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
      case "important-not-urgent":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300"
      case "urgent-not-important":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
      case "not-urgent-not-important":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "urgent-important":
        return "Urgent & Important"
      case "important-not-urgent":
        return "Important, Not Urgent"
      case "urgent-not-important":
        return "Urgent, Not Important"
      case "not-urgent-not-important":
        return "Not Urgent or Important"
      default:
        return "No Priority"
    }
  }

  if (viewMode === "list") {
    return (
      <>
        <div
          onClick={handleEdit}
          className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow cursor-pointer"
        >
          <div className="flex flex-1 min-w-0 gap-4">
            {note.image_url && (
              <div className="flex-shrink-0 hidden sm:block">
                <div className="h-16 w-16 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img
                    src={note.image_url || "/placeholder.svg"}
                    alt={note.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium truncate">{note.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm truncate mt-1">{note.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {format(new Date(note.created_at), "MMM d, yyyy")}
                </span>
                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {note.tags.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{note.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-yellow-500"
              onClick={handleToggleFavorite}
              disabled={isFavoriting}
            >
              <Star className={`h-5 w-5 ${note.favorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => handleEdit(e)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={openDeleteDialog}
                  className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
              <AlertDialogDescription>
                This will move the note to trash. You can restore it later from the trash section.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleDelete()}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={isDeleting}
              >
                {isDeleting ? "Moving..." : "Move to Trash"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    )
  }

  return (
    <>
      <Card
        className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
        onClick={handleEdit}
      >
        <CardContent className="flex-1 p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-medium line-clamp-1">{note.title}</h3>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-yellow-500"
                onClick={handleToggleFavorite}
                disabled={isFavoriting}
              >
                <Star className={`h-5 w-5 ${note.favorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-gray-500"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={(e) => handleEdit(e)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={openDeleteDialog}
                    className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {note.image_url && (
            <div className="mb-3 rounded-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <img src={note.image_url || "/placeholder.svg"} alt={note.title} className="w-full h-32 object-cover" />
            </div>
          )}

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{note.content}</p>

          <div className="flex flex-wrap gap-1 mb-3">
            {note.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>

          {note.priority_type && (
            <Badge className={`mb-3 ${getPriorityColor(note.priority_type)}`}>
              {getPriorityLabel(note.priority_type)}
            </Badge>
          )}

          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 space-x-3">
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {format(new Date(note.created_at), "MMM d, yyyy")}
            </div>
            {note.due_date && (
              <div className="flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Due: {format(new Date(note.due_date), "MMM d, yyyy")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move to Trash?</AlertDialogTitle>
            <AlertDialogDescription>
              This will move the note to trash. You can restore it later from the trash section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDelete()}
              className="bg-red-500 hover:bg-red-600 text-white"
              disabled={isDeleting}
            >
              {isDeleting ? "Moving..." : "Move to Trash"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
