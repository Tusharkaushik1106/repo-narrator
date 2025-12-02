import { NextRequest } from "next/server";
import { fetchRawFile } from "@/lib/github";
import { geminiAdapter } from "@/lib/gemini_adapter";
import type { NarrationMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const {
    owner,
    name,
    path,
  }: { owner?: string; name?: string; path?: string } = await req.json();

  if (!owner || !name || !path) {
    return Response.json(
      { error: "Missing owner, name, or path" },
      { status: 400 },
    );
  }

  let fileContent = "";
  try {
    fileContent = await fetchRawFile(owner, name, path);
  } catch {
    return Response.json(
      { error: "Failed to fetch file content from GitHub." },
      { status: 400 },
    );
  }

  const prompt = [
    "You are Repo Narrator, a senior engineer explaining one file in a codebase.",
    "Given the file content, produce a short JSON description with:",
    '1) "summary": a concise markdown overview (max ~10 lines). Use headings like "Overview" and "Key responsibilities" plus 3–6 bullet points total. Avoid long paragraphs.',
    '2) "mermaid": optional Mermaid JS sequence or flow diagram capturing the main flow (or empty string if not helpful). Keep it small and focused.',
    "",
    "Return ONLY JSON with shape:",
    '{ "summary": string, "mermaid": string }',
    "",
    `File path: ${path}`,
    "",
    "File content:",
    fileContent.slice(0, 4000),
  ].join("\n");

  const messages: NarrationMessage[] = [
    {
      id: "file-summary",
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    },
  ];

  const completion = await geminiAdapter.chat({
    messages,
    config: { streaming: false },
  });

  let parsed:
    | {
        summary: string;
        mermaid: string;
      }
    | undefined;

  try {
    const start = completion.content.indexOf("{");
    const end = completion.content.lastIndexOf("}");
    const jsonSlice = completion.content.slice(start, end + 1);
    parsed = JSON.parse(jsonSlice);
  } catch {
    parsed = {
      summary:
        "Repo Narrator could not parse a structured response, but this file participates in the repository's behavior as shown in the code.",
      mermaid: "",
    };
  }

  return Response.json({
    path,
    code:
      fileContent.length > 16000
        ? `${fileContent.slice(0, 16000)}\n// … truncated`
        : fileContent,
    summary: parsed.summary,
    mermaid: parsed.mermaid,
  });
}


