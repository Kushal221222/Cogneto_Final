"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Brain, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { supabase } from "@/lib/supabase-client"
import { useToast } from "@/hooks/use-toast"

export default function ResetPassword() {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkResetSession = async () => {
      setIsCheckingSession(true)
      setError(null)

      try {
        // Check if we have a valid session from the password reset email
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        console.log("Current session:", session ? "exists" : "none")
        console.log("Session error:", sessionError)

        // If we have a session, we can proceed with password reset
        if (session && session.user) {
          console.log("Valid session found for password reset")
          setIsCheckingSession(false)
          return
        }

        // Check URL hash for auth tokens (Supabase sends tokens in URL hash)
        const hashParams = new URLSearchParams(window.location.hash.substring(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        const tokenType = hashParams.get("type")

        console.log("Hash params:", {
          hasAccessToken: !!accessToken,
          hasRefreshToken: !!refreshToken,
          type: tokenType,
        })

        if (accessToken && refreshToken && tokenType === "recovery") {
          // Set the session using the tokens from the URL
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (setSessionError) {
            console.error("Error setting session:", setSessionError)
            setError("Invalid or expired reset link. Please request a new password reset link.")
          } else {
            console.log("Session set successfully from URL tokens")
          }
        } else {
          // No valid tokens found
          console.log("No valid reset tokens found")
          setError("No valid reset token found. Please request a new password reset link.")
        }

        setIsCheckingSession(false)
      } catch (err) {
        console.error("Error checking reset session:", err)
        setError("An error occurred while verifying your reset link. Please request a new password reset link.")
        setIsCheckingSession(false)
      }
    }

    checkResetSession()
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      })
      return
    }

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      console.log("Updating password...")

      // Update the user's password
      const { data, error: updateError } = await supabase.auth.updateUser({
        password: password,
      })

      if (updateError) {
        console.error("Error updating password:", updateError)
        throw updateError
      }

      console.log("Password updated successfully:", data)
      setIsSuccess(true)

      toast({
        title: "Password updated successfully",
        description: "Your password has been reset. You can now log in with your new password.",
        variant: "success",
      })

      // Clear the URL hash to remove tokens
      window.history.replaceState({}, document.title, window.location.pathname)

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 3000)
    } catch (err) {
      console.error("Error resetting password:", err)
      toast({
        title: "Error updating password",
        description: err.message || "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="animate-spin h-8 w-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Verifying your reset link...</p>
      </div>
    )
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
          <h1 className="text-xl font-semibold mb-6">Create New Password</h1>

          {error ? (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-4 rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Reset Link Invalid</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
              <Button className="w-full" onClick={() => router.push("/forgot-password")}>
                Request New Reset Link
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="space-y-4">
              <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 p-4 rounded-md">
                <p className="font-medium">Password Reset Successful!</p>
                <p className="mt-1">
                  Your password has been successfully updated and saved to the database. You'll be redirected to the
                  login page in a moment.
                </p>
              </div>
              <Button className="w-full" onClick={() => router.push("/login")}>
                Go to Login Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-4 rounded-md mb-4">
                <p className="text-sm">
                  Create your new password below. Once confirmed, it will be securely saved to your account.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Password must be at least 6 characters long
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
