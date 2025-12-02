import { NextRequest } from "next/server";
import { geminiAdapter } from "@/lib/gemini_adapter";
import type { NarrationMessage, NarrationContext } from "@/lib/types";
import { inMemoryVectorStoreAdapter } from "@/lib/vector_store_adapter";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { question, repoId, context }: { question: string; repoId?: string; context?: NarrationContext } =
    await req.json();

  if (!question || typeof question !== "string") {
    return Response.json({ error: "Missing question" }, { status: 400 });
  }

  const messages: NarrationMessage[] = [
    {
      id: "style",
      role: "assistant",
      content:
        "When you answer, use clear markdown with short sections, bullet points, and numbered steps. Avoid giant walls of text.",
      createdAt: new Date().toISOString(),
    },
    {
      id: "user-question",
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    },
  ];

  let retrievedContext = "";

  if (repoId) {
    const matches = await inMemoryVectorStoreAdapter.query({
      repoId,
      query: question,
      topK: 8,
    });

    if (matches.length) {
      retrievedContext =
        "Relevant code snippets:\n" +
        matches
          .map(
            (m, idx) =>
              `#${idx + 1} ${m.path}:${m.startLine ?? "?"}-${m.endLine ?? "?"}\n${m.snippet ?? ""}`,
          )
          .join("\n\n");

      messages.unshift({
        id: "rag-context",
        role: "assistant",
        content:
          "Use the following snippets as ground truth context. Prefer citing them when answering.\n\n" +
          retrievedContext,
        createdAt: new Date().toISOString(),
      });
    }
  }

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  (async () => {
    try {
      await geminiAdapter.chat({
        messages,
        context,
        config: { streaming: true },
        onChunk: async (chunk) => {
          if (!chunk.text) return;
          await writer.write(encoder.encode(chunk.text));
        },
      });
    } catch (error) {
      await writer.write(
        encoder.encode(
          "\n\n[Repo Narrator] Sorry, something went wrong while talking to Gemini.",
        ),
      );
    } finally {
      await writer.close();
    }
  })();

  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}


