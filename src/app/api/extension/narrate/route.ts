import { NextRequest } from "next/server";
import { geminiAdapter } from "@/lib/gemini_adapter";
import type { NarrationMessage } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const extensionKey = req.headers.get("x-gitlore-extension-key");
    const expectedKey = process.env.EXTENSION_SECRET;

    if (!extensionKey || extensionKey !== expectedKey) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileContent, filePath }: { fileContent?: string; filePath?: string } =
      await req.json();

    console.log("Analyze Request:", filePath, "Length:", fileContent?.length);

    if (!fileContent || typeof fileContent !== "string") {
      return Response.json({ error: "Missing fileContent" }, { status: 400 });
    }

    // Truncate file content to prevent token limit issues
    const truncatedContent = fileContent.substring(0, 3000);

    const messages: NarrationMessage[] = [
      {
        id: "narrate-prompt",
        role: "user",
        content: `You are a senior code architect. Analyze this file and return a strictly formatted JSON object.

REQUIRED JSON STRUCTURE:
{
  "purpose": "One clear sentence explaining what this file does.",
  "components": "List of key functions/classes/variables.",
  "architecture": "One sentence on how this fits into the larger system."
}

RULES:
1. Do NOT use Markdown.
2. Do NOT write HTML tags.
3. Keep it concise (under 20 words per section).
4. Return ONLY valid JSON.
5. Ensure each field is a complete sentence.

File: ${filePath || "unknown"}

Code:
${truncatedContent}${fileContent.length > 3000 ? "\n[... truncated for brevity]" : ""}`,
        createdAt: new Date().toISOString(),
      },
    ];

    const completion = await geminiAdapter.chat({
      messages,
      config: {
        model: "gemini-2.5-flash",
        maxTokens: 1000,
        streaming: false,
      },
    });

    const aiResponse = completion.content;
    console.log("AI Response:", aiResponse);

    // Clean and parse JSON response
    let cleanJson = aiResponse.replace(/```json|```/g, '').trim();
    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    const data = JSON.parse(cleanJson);
    
    // Safety check: ensure all fields exist
    return Response.json({
      purpose: data.purpose || 'Analysis failed',
      components: data.components || 'None detected',
      architecture: data.architecture || 'Standalone utility'
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Narrate endpoint error:", errorMessage);
    return Response.json({
      purpose: 'Error analyzing file.',
      components: 'Check server logs.',
      architecture: errorMessage
    });
  }
}

