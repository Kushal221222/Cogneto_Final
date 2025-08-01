"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use the correct redirect URL - this should match your Supabase dashboard configuration
      const isProduction = window.location.hostname !== "localhost"
      const baseUrl = isProduction ? "https://synapso.vercel.app" : window.location.origin

      const redirectTo = `${baseUrl}/reset-password`

      console.log("Sending password reset email with redirect URL:", redirectTo)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo,
      })

      if (error) {
        console.error("Error sending reset email:", error)
        throw error
      }

      console.log("Password reset email sent successfully")
      setIsSuccess(true)

      toast({
        title: "Password reset email sent",
        description:
          "Check your email for a link to reset your password. The link will take you directly to create a new password.",
        variant: "success",
      })
    } catch (error) {
      console.error("Error sending password reset email:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to send password reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Brain className="h-10 w-10 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Synapso
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <Button variant="ghost" size="icon" className="mr-2" onClick={() => router.push("/login")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Reset Password</h1>
          </div>

          {isSuccess ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-md">
                <p className="mb-2 font-medium">Reset link sent!</p>
                <p className="text-sm mb-2">
                  Check your email for a password reset link. Click the link to go directly to the password creation
                  page.
                </p>
                <p className="text-xs">If you don't see the email in a few minutes, check your spam folder.</p>
              </div>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Return to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  We'll send you a link to create a new password directly.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending Reset Link...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="text-sm text-purple-600 hover:text-purple-800 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Remember your password? Sign in
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
