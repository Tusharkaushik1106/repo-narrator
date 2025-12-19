
import { randomUUID } from "crypto";
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import type {
  LLMModelConfig,
  LLMResponseChunk,
  NarrationMessage,
} from "./types";
import type { LLMAdapter } from "./llm_adapter";

// ✅ DEFAULT to the active 2.5 model
const DEFAULT_MODEL = "models/gemini-2.5-flash";

function normalizeModelName(name: string): string {
  // Simple normalization: just ensure 'models/' prefix
  return name.startsWith("models/") ? name : `models/${name}`;
}

function createClient(config?: Partial<LLMModelConfig>): GenerativeModel {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const client = new GoogleGenerativeAI(apiKey);

  const requestedModel = config?.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;
  const modelName = normalizeModelName(requestedModel);

  const generationConfig =
    typeof config?.maxTokens === "number"
      ? { maxOutputTokens: config.maxTokens }
      : undefined;

  return client.getGenerativeModel({
    model: modelName,
    generationConfig,
  });
}

// ✅ CRITICAL: The Retry Logic to handle "503 Overloaded" errors
async function generateWithRetry(
  model: GenerativeModel, 
  prompt: string, 
  streaming: boolean,
  retries = 3, 
  delay = 1000
): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      if (streaming) {
        return await model.generateContentStream(prompt);
      }
      return await model.generateContent(prompt);
    } catch (error: any) {
      // Check for 503 (Overloaded) or 429 (Rate Limit)
      const isOverloaded = error.message?.includes('503') || error.status === 503;
      const isRateLimited = error.message?.includes('429') || error.status === 429;

      if (isOverloaded || isRateLimited) {
        if (i === retries - 1) throw error; // Give up on last try
        
        console.warn(`Gemini API busy (Attempt ${i + 1}/${retries}). Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff (1s -> 2s -> 4s)
        continue;
      }
      throw error; // Throw other errors immediately
    }
  }
}

export const geminiAdapter: LLMAdapter = {
  async chat({ messages, context, config, onChunk }) {
    const model = createClient(config);

    const systemPrefix =
      "You are gitlore, an expert software explainer. " +
      "You explain repositories in multiple levels of abstraction, " +
      "and you always ground explanations in the provided code context when available.\n\n";

    const contextString = context
      ? `Context:\n- type: ${context.type}\n- path: ${context.path ?? "n/a"}\n- symbol: ${
          context.symbolName ?? "n/a"
        }\n\n`
      : "";

    const prompt =
      systemPrefix +
      contextString +
      messages
        .map((m) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
        .join("\n") +
      "\nAssistant:";

    const streaming = config?.streaming ?? true;

    try {
      if (!streaming || !onChunk) {
        // Non-streaming Mode with Retry
        const result = await generateWithRetry(model, prompt, false);
        const text = result.response.text();
        return {
          id: randomUUID(),
          role: "assistant",
          content: text,
          createdAt: new Date().toISOString(),
        };
      }

      // Streaming Mode with Retry
      const streamingResult = await generateWithRetry(model, prompt, true);
      let fullText = "";

      for await (const chunk of streamingResult.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        onChunk({
          text: chunkText,
          done: false,
        });
      }

      onChunk({
        text: "",
        done: true,
      });

      return {
        id: randomUUID(),
        role: "assistant",
        content: fullText,
        createdAt: new Date().toISOString(),
      };

    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Detailed error messages for the UI
      if (errorMessage.includes("404")) {
         throw new Error("Model not found. Please check GEMINI_MODEL in .env is set to 'gemini-2.5-flash'.");
      }
      if (errorMessage.includes("503")) {
        throw new Error("Gemini is currently overloaded. Please try again in a moment.");
      }
      if (errorMessage.includes("429")) {
        throw new Error("Rate limit exceeded. Please wait a moment.");
      }
      throw error;
    }
  },
};

