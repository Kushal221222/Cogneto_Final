"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, FileText, Plus, Tag, Trash2, Star, Grid3X3, Menu, X } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import TopNavbar from "@/components/dashboard/top-navbar"
import { cn } from "@/lib/utils"

export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession()

      if (!data.session) {
        router.push("/login")
        return
      }

      setUser(data.session.user)
    }

    checkUser()
  }, [router])

  const isActive = (path: string) => {
    return pathname === path
  }

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false)
    }
  }, [pathname])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Top Navbar */}
      <TopNavbar user={user} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Toggle */}
        <div className="md:hidden fixed bottom-4 right-4 z-20">
          <Button
            variant="default"
            size="icon"
            className="rounded-full shadow-lg bg-purple-600 hover:bg-purple-700"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Sidebar */}
        <aside
          className={cn(
            "w-64 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 transition-all duration-300 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full",
            "fixed md:static inset-y-0 left-0 z-10 md:translate-x-0 pt-16 md:pt-0",
          )}
        >
          <div className="h-full overflow-y-auto p-4">
            <nav className="space-y-6">
              <div>
                <Button
                  variant="default"
                  className="w-full justify-start gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  onClick={() => router.push("/dashboard/new")}
                >
                  <Plus className="h-4 w-4" />
                  New Note
                </Button>
              </div>

              <div className="space-y-1">
                <Button
                  variant={isActive("/dashboard") ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive("/dashboard") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" : ""}`}
                  onClick={() => router.push("/dashboard")}
                >
                  <FileText className="h-4 w-4" />
                  All Notes
                </Button>
                <Button
                  variant={isActive("/dashboard/matrix") ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive("/dashboard/matrix") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" : ""}`}
                  onClick={() => router.push("/dashboard/matrix")}
                >
                  <Grid3X3 className="h-4 w-4" />
                  Priority Matrix
                </Button>
                <Button
                  variant={isActive("/dashboard/timeline") ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive("/dashboard/timeline") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" : ""}`}
                  onClick={() => router.push("/dashboard/timeline")}
                >
                  <Calendar className="h-4 w-4" />
                  Timeline
                </Button>
                <Button
                  variant={isActive("/dashboard/tags") ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive("/dashboard/tags") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" : ""}`}
                  onClick={() => router.push("/dashboard/tags")}
                >
                  <Tag className="h-4 w-4" />
                  Tags
                </Button>
                <Button
                  variant={isActive("/dashboard/favorites") ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive("/dashboard/favorites") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" : ""}`}
                  onClick={() => router.push("/dashboard/favorites")}
                >
                  <Star className="h-4 w-4" />
                  Favorites
                </Button>
                <Button
                  variant={isActive("/dashboard/trash") ? "default" : "ghost"}
                  className={`w-full justify-start gap-2 ${isActive("/dashboard/trash") ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50" : ""}`}
                  onClick={() => router.push("/dashboard/trash")}
                >
                  <Trash2 className="h-4 w-4" />
                  Trash
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Tags</h3>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => router.push("/dashboard/tags?tag=work")}
                  >
                    #work
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => router.push("/dashboard/tags?tag=ideas")}
                  >
                    #ideas
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-sm"
                    onClick={() => router.push("/dashboard/tags?tag=personal")}
                  >
                    #personal
                  </Button>
                </div>
              </div>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-y-auto pt-16 md:pt-6">{children}</main>
      </div>
    </div>
  )
}
