import { randomUUID } from "crypto";
import { GoogleGenerativeAI, type GenerativeModel } from "@google/generative-ai";
import type {
  LLMAdapter,
  LLMModelConfig,
  LLMResponseChunk,
  NarrationContext,
  NarrationMessage,
} from "./types";

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
      "You are Repo Narrator, an expert software explainer. " +
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
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const finalMessage: NarrationMessage = {
        id: randomUUID(),
        role: "assistant",
        content: text,
        createdAt: new Date().toISOString(),
      };
      return finalMessage;
    }

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
  },
};


