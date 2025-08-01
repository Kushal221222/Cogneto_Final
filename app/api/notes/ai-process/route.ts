import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Google AI with API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title && !content) {
      return NextResponse.json({ error: "Title or content is required for AI processing" }, { status: 400 })
    }

    // Combine title and content for processing
    const fullText = `${title}\n\n${content}`.trim()

    if (fullText.length < 10) {
      return NextResponse.json({ error: "Content too short for meaningful AI processing" }, { status: 400 })
    }

    // Use the correct model name for the current API version
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    // Create prompts for summarization and tag generation
    const summaryPrompt = `
Please provide a concise, semantically accurate summary of the following text. 
The summary should capture the main ideas and key points in 2-3 sentences:

"${fullText}"

Summary:
`

    const tagsPrompt = `
Analyze the following text and generate 4-8 meaningful contextual tags that reflect the underlying themes, sentiments, and philosophical tones. 
Return only the tags as a JSON array of strings, nothing else:

"${fullText}"

Tags:
`

    console.log("Processing with AI model: gemini-1.5-flash")
    console.log("Content length:", fullText.length)

    // Execute both AI requests in parallel
    const [summaryResult, tagsResult] = await Promise.all([
      model.generateContent(summaryPrompt),
      model.generateContent(tagsPrompt),
    ])

    // Extract responses
    const summaryResponse = await summaryResult.response
    const tagsResponse = await tagsResult.response

    const summary = summaryResponse.text().trim()
    let tags: string[] = []

    try {
      // Try to parse tags as JSON array
      const tagsText = tagsResponse.text().trim()
      console.log("Raw tags response:", tagsText)

      // Clean up the response to extract JSON array
      const jsonMatch = tagsText.match(/\[.*\]/s)
      if (jsonMatch) {
        tags = JSON.parse(jsonMatch[0])
      } else {
        // Fallback: split by commas and clean up
        tags = tagsText
          .replace(/["[\]]/g, "")
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
          .slice(0, 8) // Limit to 8 tags
      }
    } catch (parseError) {
      console.error("Error parsing tags:", parseError)
      // Fallback: extract words from the response
      const tagsText = tagsResponse.text().trim()
      tags = tagsText
        .replace(/[^\w\s,]/g, "")
        .split(/[,\n]/)
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 2)
        .slice(0, 6)
    }

    // Ensure tags are properly formatted
    tags = tags
      .map(
        (tag) =>
          tag
            .replace(/^["']|["']$/g, "") // Remove quotes
            .replace(/^\w/, (c) => c.toUpperCase()), // Capitalize first letter
      )
      .filter((tag) => tag.length > 0)

    console.log("Generated summary length:", summary.length)
    console.log("Generated tags count:", tags.length)

    return NextResponse.json({
      success: true,
      summary,
      tags,
      originalLength: fullText.length,
      summaryLength: summary.length,
    })
  } catch (error) {
    console.error("AI processing error:", error)

    // Handle specific Google AI errors
    if (error.message?.includes("API_KEY") || error.message?.includes("PERMISSION_DENIED")) {
      return NextResponse.json(
        {
          error: "AI service authentication error. Please check API key configuration.",
        },
        { status: 401 },
      )
    }

    if (error.message?.includes("quota") || error.message?.includes("RESOURCE_EXHAUSTED")) {
      return NextResponse.json({ error: "AI service quota exceeded. Please try again later." }, { status: 503 })
    }

    if (error.message?.includes("not found") || error.message?.includes("404")) {
      return NextResponse.json({ error: "AI model not available. Please try again later." }, { status: 503 })
    }

    if (error.message?.includes("INVALID_ARGUMENT")) {
      return NextResponse.json({ error: "Invalid content format. Please check your input." }, { status: 400 })
    }

    return NextResponse.json(
      {
        error: "Failed to process content with AI. Please try again.",
      },
      { status: 500 },
    )
  }
}
