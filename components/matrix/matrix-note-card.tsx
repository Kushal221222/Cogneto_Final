"use client"

import { useState } from "react"
import { useDraggable } from "@dnd-kit/core"
import { CSS } from "@dnd-kit/utilities"
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
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoreHorizontal, Trash, Edit } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteNote, type Note } from "@/lib/supabase-client"
import { cn } from "@/lib/utils"

interface MatrixNoteCardProps {
  note: Note
  onEdit: () => void
  onDelete: () => void
  isDragging?: boolean
}

export default function MatrixNoteCard({ note, onEdit, onDelete, isDragging = false }: MatrixNoteCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: note.id,
    data: {
      note,
    },
  })

  const style = transform
    ? {
        transform: CSS.Transform.toString(transform),
        zIndex: 999,
      }
    : undefined

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteNote(note.id)
      onDelete()
    } catch (error) {
      console.error("Error deleting note:", error)
    } finally {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date)
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
        className={cn("cursor-grab active:cursor-grabbing", isDragging && "opacity-50")}
      >
        <Card className="p-3 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-sm line-clamp-2">{note.title}</h4>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-500 focus:text-red-500"
                  onClick={() => setIsDeleteDialogOpen(true)}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">{note.content}</p>

          <div className="flex items-center justify-between mt-3">
            <div className="flex flex-wrap gap-1">
              {note.tags &&
                note.tags.slice(0, 2).map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs px-1 py-0">
                    {tag}
                  </Badge>
                ))}
              {note.tags && note.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1 py-0">
                  +{note.tags.length - 2}
                </Badge>
              )}
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(note.created_at)}</span>
          </div>
        </Card>
      </div>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your note.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
