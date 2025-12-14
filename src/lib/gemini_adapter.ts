import { randomUUID } from "crypto";
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import type {
  LLMModelConfig,
  LLMResponseChunk,
  NarrationContext,
  NarrationMessage,
} from "./types";
import type { LLMAdapter } from "./llm_adapter";

const DEFAULT_MODEL = "gemini-2.5-flash";

function createClient(config?: Partial<LLMModelConfig>): GenerativeModel {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const client = new GoogleGenerativeAI(apiKey);

  const modelName = config?.model ?? process.env.GEMINI_MODEL ?? DEFAULT_MODEL;

  return client.getGenerativeModel({
    model: modelName,
  });
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

    if (!streaming || !onChunk) {
      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const finalMessage: NarrationMessage = {
          id: randomUUID(),
          role: "assistant",
          content: text,
          createdAt: new Date().toISOString(),
        };
        return finalMessage;
      } catch (error: unknown) {
        const isRateLimit = 
          (error && typeof error === "object" && "status" in error && error.status === 429) ||
          (error instanceof Error && (
            error.message.includes("429") || 
            error.message.includes("quota") || 
            error.message.includes("rate limit") ||
            error.message.includes("Too Many Requests")
          ));
        
        if (isRateLimit) {
          throw new Error(
            "Gemini API rate limit exceeded. The free tier allows 20 requests per day. " +
            "Please wait ~60 seconds and try again, or upgrade your API plan. " +
            "See https://ai.google.dev/gemini-api/docs/rate-limits for more info."
          );
        }
        throw error;
      }
    }

    try {
      const streamingResult = await model.generateContentStream(prompt);

      let fullText = "";

      for await (const chunk of streamingResult.stream) {
        const chunkText = chunk.text();
        fullText += chunkText;
        const responseChunk: LLMResponseChunk = {
          text: chunkText,
          done: false,
        };
        onChunk(responseChunk);
      }

      onChunk({
        text: "",
        done: true,
      });

      const finalMessage: NarrationMessage = {
        id: randomUUID(),
        role: "assistant",
        content: fullText,
        createdAt: new Date().toISOString(),
      };

      return finalMessage;
    } catch (error: unknown) {
      const isRateLimit = 
        (error && typeof error === "object" && "status" in error && error.status === 429) ||
        (error instanceof Error && (
          error.message.includes("429") || 
          error.message.includes("quota") || 
          error.message.includes("rate limit") ||
          error.message.includes("Too Many Requests")
        ));
      
      if (isRateLimit) {
        throw new Error(
          "Gemini API rate limit exceeded. The free tier allows 20 requests per day. " +
          "Please wait ~60 seconds and try again, or upgrade your API plan. " +
          "See https://ai.google.dev/gemini-api/docs/rate-limits for more info."
        );
      }
      throw error;
    }
  },
};


