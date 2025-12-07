import { NextRequest } from "next/server";
import { fetchRawFile } from "@/lib/github";
import { geminiAdapter } from "@/lib/gemini_adapter";
import type { NarrationMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
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
      '2) "mermaid": REQUIRED Mermaid JS diagram (sequenceDiagram, flowchart, or graph) capturing the main flow. IMPORTANT:',
      "   - ALWAYS generate a diagram - it's very useful for understanding code flow",
      "   - Use valid Mermaid syntax ONLY - no markdown, no code fences, no JSON escaping",
      "   - MUST start with diagram type declaration: 'sequenceDiagram', 'flowchart TD', or 'graph LR'",
      "   - Example valid syntax:",
      "     flowchart TD",
      "       A[\"Start\"] --> B[\"Process\"]",
      "       B --> C[\"End\"]",
      "   - ALWAYS quote ALL node labels that contain spaces, hyphens, or special characters",
      "   - Ensure every opening bracket [ has a closing bracket ]",
      "   - Ensure every opening quote \" has a closing quote \"",
      "   - Do NOT include trailing semicolons",
      "   - Keep it simple: max 8-10 nodes",
      "   - For simple files, create a basic flowchart showing the main function/component flow",
      "   - Only return empty string if the file has no meaningful flow (e.g., pure data/config files)",
      "   - Return the raw Mermaid code only, nothing else",
      "",
      "Return ONLY valid JSON with shape:",
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

    let completion;
    try {
      completion = await geminiAdapter.chat({
        messages,
        config: { streaming: false },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      const isRateLimit = 
        (error && typeof error === "object" && "status" in error && error.status === 429) ||
        errorMessage.includes("rate limit") || 
        errorMessage.includes("quota") ||
        errorMessage.includes("429") ||
        errorMessage.includes("Too Many Requests");
      
      if (isRateLimit) {
        return Response.json(
          {
            error: errorMessage || "Gemini API rate limit exceeded. The free tier allows 20 requests per day.",
            retryAfter: 60,
          },
          { status: 429 },
        );
      }
      
      return Response.json(
        {
          error: errorMessage || "Failed to generate file summary from Gemini API.",
        },
        { status: 500 },
      );
    }

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
  } catch (error: unknown) {
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isRateLimit = 
      (error && typeof error === "object" && "status" in error && error.status === 429) ||
      errorMessage.includes("rate limit") || 
      errorMessage.includes("quota") ||
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests");
    
    if (isRateLimit) {
      return Response.json(
        {
          error: errorMessage || "Gemini API rate limit exceeded. The free tier allows 20 requests per day.",
          retryAfter: 60,
        },
        { status: 429 },
      );
    }
    
    console.error("Error in /api/file-summary:", error);
    return Response.json(
      {
        error: errorMessage || "An unexpected error occurred while generating file summary.",
      },
      { status: 500 },
    );
  }
}


