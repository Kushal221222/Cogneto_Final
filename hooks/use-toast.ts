"use client"

// Inspired by react-hot-toast library
import { useState, useCallback } from "react"

import type { ToastActionElement } from "@/components/ui/toast"

type ToastProps = {
  id?: string
  title?: string
  description?: string
  action?: ToastActionElement
  variant?: "default" | "destructive" | "success"
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([])

  const toast = useCallback(
    ({ id = crypto.randomUUID(), ...props }: ToastProps) => {
      setToasts((prev) => {
        // Check if toast with the same ID already exists
        if (prev.find((toast) => toast.id === id)) {
          return prev.map((toast) => (toast.id === id ? { ...toast, ...props } : toast))
        }
        return [...prev, { id, ...props }]
      })

      return {
        id,
        dismiss: () => dismissToast(id),
        update: (props: Omit<ToastProps, "id">) => updateToast({ id, ...props }),
      }
    },
    [setToasts],
  )

  const dismissToast = useCallback(
    (id: string) => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    },
    [setToasts],
  )

  const updateToast = useCallback(
    (props: ToastProps) => {
      setToasts((prev) => prev.map((toast) => (toast.id === props.id ? { ...toast, ...props } : toast)))
    },
    [setToasts],
  )

  const dismissAll = useCallback(() => {
    setToasts([])
  }, [setToasts])

  return {
    toast,
    toasts,
    dismissToast,
    dismissAll,
  }
}
