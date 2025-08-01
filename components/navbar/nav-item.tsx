"use client"

import type React from "react"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NavItemProps {
  href: string
  active: boolean
  children: React.ReactNode
}

export default function NavItem({ href, active, children }: NavItemProps) {
  return (
    <Link href={href} className="relative px-3 py-2">
      <span
        className={cn(
          "relative z-10 text-sm font-medium transition-colors",
          active ? "text-purple-700 dark:text-purple-300" : "text-gray-700 dark:text-gray-300",
        )}
      >
        {children}
      </span>
      {active && (
        <motion.span
          layoutId="activeNavIndicator"
          className="absolute inset-0 bg-purple-100 dark:bg-purple-900/30 rounded-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </Link>
  )
}
