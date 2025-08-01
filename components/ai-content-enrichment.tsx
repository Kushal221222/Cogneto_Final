"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Brain, Loader2, Sparkles, CheckCircle, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface AIContentEnrichmentProps {
  title: string
  content: string
  existingSummary?: string
  existingTags?: string[]
  onSummaryGenerated: (summary: string) => void
  onTagsGenerated: (tags: string[]) => void
  disabled?: boolean
  mode?: "create" | "edit"
}

interface AIResponse {
  success: boolean
  summary: string
  tags: string[]
  originalLength: number
  summaryLength: number
  error?: string
}

export default function AIContentEnrichment({
  title,
  content,
  existingSummary = "",
  existingTags = [],
  onSummaryGenerated,
  onTagsGenerated,
  disabled = false,
  mode = "create",
}: AIContentEnrichmentProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [aiSummary, setAiSummary] = useState("")
  const [aiTags, setAiTags] = useState<string[]>([])
  const [hasProcessed, setHasProcessed] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  // Initialize with existing data in edit mode
  useEffect(() => {
    if (mode === "edit" && (existingSummary || existingTags.length > 0)) {
      setAiSummary(existingSummary)
      setAiTags(existingTags)
      setHasProcessed(true)
    }
  }, [mode, existingSummary, existingTags])

  const processWithAI = async () => {
    if (!title.trim() && !content.trim()) {
      toast({
        title: "Content Required",
        description: "Please add a title or content before using AI enhancement.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      console.log("Starting AI processing...")
      const response = await fetch("/api/notes/ai-process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      })

      const data: AIResponse = await response.json()
      console.log("AI response:", data)

      if (!response.ok) {
        throw new Error(data.error || "Failed to process content")
      }

      if (data.success) {
        setAiSummary(data.summary)
        setAiTags(data.tags)
        setHasProcessed(true)

        const actionText = mode === "edit" ? "regenerated" : "generated"
        toast({
          title: `AI Enhancement ${actionText.charAt(0).toUpperCase() + actionText.slice(1)}`,
          description: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} summary (${data.summaryLength} chars) and ${data.tags.length} tags from ${data.originalLength} characters.`,
          variant: "default",
        })
      }
    } catch (error) {
      console.error("AI processing error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to process content with AI"
      setError(errorMessage)

      toast({
        title: "AI Processing Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const applySummary = () => {
    onSummaryGenerated(aiSummary)
    toast({
      title: "Summary Applied",
      description: "AI-generated summary has been added to your note.",
      variant: "default",
    })
  }

  const applyTags = () => {
    onTagsGenerated(aiTags)
    toast({
      title: "Tags Applied",
      description: `${aiTags.length} AI-generated tags have been added to your note.`,
      variant: "default",
    })
  }

  const applyAll = () => {
    onSummaryGenerated(aiSummary)
    onTagsGenerated(aiTags)
    toast({
      title: "AI Enhancements Applied",
      description: "Summary and tags have been added to your note.",
      variant: "default",
    })
  }

  const canProcess = (title.trim() || content.trim()) && !disabled

  const getButtonText = () => {
    if (isProcessing) return "Processing with AI..."
    if (mode === "edit" && hasProcessed) return "Regenerate with AI"
    if (hasProcessed) return "Regenerate with AI"
    return "Enhance with AI"
  }

  const getCardTitle = () => {
    return mode === "edit" ? "AI Content Re-enrichment" : "AI Content Enrichment"
  }

  const getCardDescription = () => {
    return mode === "edit"
      ? "Re-analyze your note content to generate updated summary and tags"
      : "Enhance your note with AI-generated summary and contextual tags"
  }

  return (
    <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {getCardTitle()}
              <Sparkles className="h-4 w-4 text-purple-500" />
            </CardTitle>
            <CardDescription>{getCardDescription()}</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* AI Processing Button */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={processWithAI}
            disabled={!canProcess || isProcessing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {getButtonText()}
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                {getButtonText()}
              </>
            )}
          </Button>

          {hasProcessed && (aiSummary || aiTags.length > 0) && (
            <Button
              onClick={applyAll}
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-950/30 bg-transparent"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Apply All
            </Button>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700 dark:text-red-300 flex-1">
                <p className="font-medium">AI Processing Failed</p>
                <p>{error}</p>
                {error.includes("authentication") && (
                  <p className="mt-1 text-xs">Please check if the Google AI API key is properly configured.</p>
                )}
                {error.includes("quota") && (
                  <p className="mt-1 text-xs">The AI service has reached its usage limit. Please try again later.</p>
                )}
              </div>
              <Button
                onClick={processWithAI}
                size="sm"
                variant="outline"
                className="h-7 text-xs bg-transparent"
                disabled={isProcessing}
              >
                <RefreshCw className="h-3 w-3 mr-1" />
                Retry
              </Button>
            </div>
          </div>
        )}

        {/* AI Results */}
        {hasProcessed && !error && (
          <div className="space-y-4">
            {/* AI Summary */}
            {aiSummary && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    AI-Generated Summary
                  </Label>
                  <Button
                    onClick={applySummary}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 bg-transparent"
                  >
                    Apply Summary
                  </Button>
                </div>
                <Textarea
                  value={aiSummary}
                  onChange={(e) => setAiSummary(e.target.value)}
                  className="min-h-[80px] bg-white/50 dark:bg-gray-900/50 border-purple-200 dark:border-purple-800"
                  placeholder="AI-generated summary will appear here..."
                />
              </div>
            )}

            {/* AI Tags */}
            {aiTags.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-purple-700 dark:text-purple-300">
                    AI-Generated Tags ({aiTags.length})
                  </Label>
                  <Button
                    onClick={applyTags}
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs border-purple-300 text-purple-700 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300 bg-transparent"
                  >
                    Apply Tags
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 p-3 bg-white/50 dark:bg-gray-900/50 border border-purple-200 dark:border-purple-800 rounded-lg">
                  {aiTags.map((tag, index) => (
                    <Badge
                      key={`${tag}-${index}`}
                      variant="secondary"
                      className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-200 cursor-pointer"
                      onClick={() => {
                        const newTags = aiTags.filter((t, i) => i !== index)
                        setAiTags(newTags)
                      }}
                    >
                      {tag}
                      <span className="ml-1 text-xs opacity-60">×</span>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Help Text */}
        <div className="text-xs text-gray-500 dark:text-gray-400 bg-white/30 dark:bg-gray-900/30 p-2 rounded border border-purple-100 dark:border-purple-900">
          <p className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            {mode === "edit"
              ? "AI will re-analyze your note content to generate updated summary and tags"
              : "AI will analyze your note content to generate a concise summary and relevant tags"}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
