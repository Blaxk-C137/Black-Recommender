import { GoogleGenAI } from "@google/genai"

export interface AIRecommendation {
  title: string
  year: string
  reason: string
  hype: string
  searchQuery: string
}

export function stripCodeFences(text: string): string {
  return text.replace(/```(?:json)?\s*/g, "").replace(/```/g, "").trim()
}

export async function getAIRecommendation(
  mediaType: string,
  subType: string,
  genres: string[]
): Promise<AIRecommendation> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error("GEMINI_API_KEY is not set")

  const prompt = `You are a media recommendation expert.

The user wants: ${mediaType} (${subType})
Their favorite genres: ${genres.join(", ")}

Recommend exactly ONE perfect title for them.
Respond in this exact JSON format:
{
  "title": "Title Name",
  "year": "2019",
  "reason": "One sentence why this matches their taste",
  "hype": "One punchy exciting sentence to make them want it",
  "searchQuery": "title name year"
}

Only respond with the JSON. No extra text.`

  const ai = new GoogleGenAI({ apiKey: key })
  const response = await ai.models.generateContent({
    model: process.env.GEMINI_MODEL ?? "gemini-2.5-flash",
    contents: prompt,
  })
  const text = response.text ?? ""
  try {
    return JSON.parse(stripCodeFences(text)) as AIRecommendation
  } catch {
    throw new Error(`Gemini returned unparseable output: ${text.slice(0, 200)}`)
  }
}
