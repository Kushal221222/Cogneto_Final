"use client"

import type React from "react"

import { useDroppable } from "@dnd-kit/core"
import { cn } from "@/lib/utils"

interface MatrixQuadrantProps {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  iconColor: string
  children: React.ReactNode
}

export default function MatrixQuadrant({
  id,
  title,
  description,
  icon,
  color,
  iconColor,
  children,
}: MatrixQuadrantProps) {
  const { isOver, setNodeRef } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-lg border p-4 transition-all duration-200",
        color,
        isOver && "ring-2 ring-purple-500 dark:ring-purple-400 scale-[1.02]",
      )}
    >
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-2 rounded-full", color)}>{icon}</div>
        <div>
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <div className="space-y-3 min-h-[200px]">{children}</div>
    </div>
  )
}
