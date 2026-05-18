import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";
import dotenv from "dotenv";

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * Returns the appropriate Chat model based on the API key type.
 * Supports Google Gemini and OpenRouter (OpenAI-compatible).
 */
export async function getChatModel(options = {}) {
  const isOpenRouter = GEMINI_API_KEY && GEMINI_API_KEY.startsWith("sk-or-");

  if (isOpenRouter) {
    console.log("[AI Model] Using OpenRouter (OpenAI-compatible)");
    return new ChatOpenAI({
      apiKey: GEMINI_API_KEY,
      modelName: options.modelName || "google/gemini-2.5-flash",
      maxTokens: 2000,
      configuration: {
        baseURL: "https://openrouter.ai/api/v1",
        defaultHeaders: {
        "HTTP-Referer": "http://localhost:8080",
        "X-Title": "CareerForge",
      },
      },
      ...options,
    });
  } else {
    console.log("[AI Model] Using Google Generative AI");
    return new ChatGoogleGenerativeAI({
      apiKey: GEMINI_API_KEY,
      modelName: options.modelName || "gemini-1.5-flash",
      maxOutputTokens: 2000,
      ...options,
    });
  }
}
