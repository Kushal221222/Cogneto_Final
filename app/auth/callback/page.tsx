"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase-client"
import { Brain, Loader2, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the token hash and type from URL parameters
        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type")
        const next = searchParams.get("next") ?? "/dashboard"

        console.log("Auth callback params:", { token_hash: token_hash?.substring(0, 10) + "...", type, next })

        if (token_hash && type) {
          // Verify the OTP token
          const { data, error } = await supabase.auth.verifyOtp({
            type: type as any,
            token_hash,
          })

          if (error) {
            console.error("Error verifying OTP:", error)
            setStatus("error")
            setMessage(error.message || "Failed to verify email. Please try again.")
            return
          }

          if (data.user) {
            console.log("User verified successfully:", data.user.email)
            setStatus("success")
            setMessage("Email verified successfully! Redirecting to dashboard...")

            // Redirect to dashboard after a short delay
            setTimeout(() => {
              router.push(next)
            }, 2000)
          } else {
            setStatus("error")
            setMessage("Verification failed. Please try again.")
          }
        } else {
          // Handle other auth flows (like OAuth)
          const { data, error } = await supabase.auth.getSession()

          if (error) {
            console.error("Error getting session:", error)
            setStatus("error")
            setMessage("Authentication failed. Please try again.")
            return
          }

          if (data.session) {
            setStatus("success")
            setMessage("Authentication successful! Redirecting...")
            setTimeout(() => {
              router.push("/dashboard")
            }, 1000)
          } else {
            setStatus("error")
            setMessage("No active session found. Please try logging in again.")
          }
        }
      } catch (err) {
        console.error("Auth callback error:", err)
        setStatus("error")
        setMessage("An unexpected error occurred. Please try again.")
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Brain className="h-10 w-10 text-purple-600" />
          <span className="ml-2 text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Synapso
          </span>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 text-center">
          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
              <h1 className="text-xl font-semibold">Verifying your account...</h1>
              <p className="text-gray-600 dark:text-gray-300">Please wait while we confirm your email address.</p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="h-8 w-8 mx-auto text-green-600" />
              <h1 className="text-xl font-semibold text-green-600">Success!</h1>
              <p className="text-gray-600 dark:text-gray-300">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="h-8 w-8 mx-auto text-red-600" />
              <h1 className="text-xl font-semibold text-red-600">Verification Failed</h1>
              <p className="text-gray-600 dark:text-gray-300">{message}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => router.push("/login")} variant="outline">
                  Back to Login
                </Button>
                <Button
                  onClick={() => router.push("/signup")}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
