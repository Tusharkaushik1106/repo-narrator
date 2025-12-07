import { NextRequest } from "next/server";
import { geminiAdapter } from "@/lib/gemini_adapter";
import type { NarrationMessage } from "@/lib/types";
import { fetchRepoTree, fetchRawFile } from "@/lib/github";
import { inMemoryVectorStoreAdapter } from "@/lib/vector_store_adapter";

export const runtime = "nodejs";

interface GitHubRepo {
  full_name: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  language: string | null;
}

function parseGitHubUrl(url: string): { owner: string; name: string } | null {
  try {
    const u = new URL(url.trim());
    if (u.hostname !== "github.com") return null;

    const rawPath = u.pathname.startsWith("/") ? u.pathname.slice(1) : u.pathname;
    const [owner, rawName] = rawPath.split("/");
    if (!owner || !rawName) return null;

    const name = rawName.endsWith(".git") ? rawName.slice(0, -4) : rawName;
    return { owner, name };
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { repoUrl } = (await req.json()) as { repoUrl?: string };

    if (!repoUrl) {
      return Response.json({ error: "Missing repoUrl" }, { status: 400 });
    }

    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return Response.json({ error: "Only GitHub URLs are supported for now." }, { status: 400 });
    }

    const { owner, name } = parsed;
    const repoId = `${owner}/${name}`;

    const headers: HeadersInit = {
      "User-Agent": "repo-narrator",
      Accept: "application/vnd.github+json",
    };

    const pat = process.env.GITHUB_PAT;
    if (pat) {
      headers.Authorization = `Bearer ${pat}`;
    }

    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
      headers,
    });

    if (!repoRes.ok) {
      const status = repoRes.status;
      return Response.json(
        {
          error:
            status === 404
              ? "Repository not found or not accessible."
              : "Failed to fetch repository metadata from GitHub.",
        },
        { status: 400 },
      );
    }

    const repo = (await repoRes.json()) as GitHubRepo;

    // Try to fetch README as additional context.
    const readmeRes = await fetch(
      `https://raw.githubusercontent.com/${owner}/${name}/HEAD/README.md`,
      { headers: { "User-Agent": "repo-narrator" } },
    );

    let readme = "";
    if (readmeRes.ok) {
      try {
        readme = await readmeRes.text();
      } catch {
        readme = "";
      }
    }

    const contextPieces = [
      `Full name: ${repo.full_name}`,
      repo.description ? `Description: ${repo.description}` : "",
      `Stars: ${repo.stargazers_count}`,
      `Forks: ${repo.forks_count}`,
      `Open issues: ${repo.open_issues_count}`,
      repo.language ? `Primary language: ${repo.language}` : "",
    ]
      .filter(Boolean)
      .join("\\n");

    const prompt = [
      "You are Repo Narrator, a senior staff engineer who explains repositories.",
      "Given the repository metadata and README, produce:",
      "1) A tight, non-marketing elevator pitch (2–4 sentences).",
      "2) A rough stack radar with 5 axes: Frontend, Backend, Auth, Infra, DX. Scores 0–100.",
      "",
      "Return your answer as JSON ONLY with shape:",
      '{ "elevatorPitch": string, "stackRadar": [{ "subject": string, "value": number }] }',
      "",
      "Repository metadata:",
      contextPieces,
      "",
      "README.md (may be empty):",
      readme || "[no readme found]",
    ].join("\\n");

    const messages: NarrationMessage[] = [
      {
        id: "system",
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
    // Check for rate limit errors - check both message and error object status
    const isRateLimit = 
      (error && typeof error === "object" && "status" in error && error.status === 429) ||
      errorMessage.includes("rate limit") || 
      errorMessage.includes("quota") ||
      errorMessage.includes("429") ||
      errorMessage.includes("Too Many Requests");
    
    if (isRateLimit) {
      return Response.json(
        {
          error: errorMessage,
          retryAfter: 60, // seconds
        },
        { status: 429 },
      );
    }
    return Response.json(
      {
        error: errorMessage || "Failed to generate analysis from Gemini API.",
      },
      { status: 500 },
    );
    }

    let parsedJson:
      | {
          elevatorPitch: string;
          stackRadar: { subject: string; value: number }[];
        }
      | undefined;

    try {
      const start = completion.content.indexOf("{");
      const end = completion.content.lastIndexOf("}");
      const jsonSlice = completion.content.slice(start, end + 1);
      parsedJson = JSON.parse(jsonSlice);
    } catch {
      parsedJson = {
        elevatorPitch:
          "Repo Narrator could not parse a structured response from Gemini, but this repository appears to be a typical GitHub project.",
        stackRadar: [
          { subject: "Frontend", value: 60 },
          { subject: "Backend", value: 60 },
          { subject: "Auth", value: 40 },
          { subject: "Infra", value: 40 },
          { subject: "DX", value: 60 },
        ],
      };
    }

    // --- Lightweight indexing for public repos ---
    const tree = await fetchRepoTree(owner, name);

    const codeEntries = tree.filter(
      (entry) =>
        entry.type === "blob" &&
        /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rb|java|cs|rs|php|kt|swift)$/i.test(
          entry.path,
        ),
    );

    const limited = codeEntries.slice(0, 25);

    const documents: {
      id: string;
      text: string;
      path: string;
      startLine?: number;
      endLine?: number;
      metadata?: Record<string, unknown>;
    }[] = [];

    const fileSizes: Record<string, number> = {};
    let firstFileContent: string | null = null;

    for (const entry of limited) {
      try {
        const text = await fetchRawFile(owner, name, entry.path);
        documents.push({
          id: entry.path,
          text,
          path: entry.path,
          metadata: {
            bytes: entry.size ?? text.length,
          },
        });
        fileSizes[entry.path] = entry.size ?? text.length;
        if (!firstFileContent) {
          firstFileContent = text;
        }
      } catch {
        // ignore individual file failures
      }
    }

    if (documents.length) {
      await inMemoryVectorStoreAdapter.upsertDocuments({
        repoId,
        documents,
      });
    }

    const sizeEntries = Object.entries(fileSizes);
    const maxSize =
      sizeEntries.length > 0
        ? Math.max(...sizeEntries.map(([, size]) => size))
        : 0;

    const hotspots = sizeEntries
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, size]) => ({
        path,
        complexity:
          maxSize > 0 ? Math.round(40 + (60 * size) / maxSize) : 50,
      }));

    // Build complete file tree with all folders and files
    const allEntries = tree.map((entry) => {
      if (entry.type === "tree") {
        // It's a folder
        return {
          path: entry.path,
          type: "folder" as const,
          language: "",
          complexity: "green" as const,
        };
      } else {
        // It's a file
        const ext = entry.path.split(".").pop() ?? "";
        const language =
          ext === "tsx" || ext === "jsx"
            ? "tsx"
            : ext === "ts"
              ? "ts"
              : ext === "js"
                ? "js"
                : ext;
        const size = fileSizes[entry.path] ?? entry.size ?? 0;
        const complexityScore =
          maxSize > 0 ? Math.round(40 + (60 * size) / maxSize) : 50;

        const complexityColor =
          complexityScore >= 80 ? "red" : complexityScore >= 65 ? "yellow" : "green";

        return {
          path: entry.path,
          type: "file" as const,
          language,
          complexity: complexityColor as "green" | "yellow" | "red",
        };
      }
    });

    // For backward compatibility, also include the sample file tree (first 10 code files)
    const sampleFileTree = limited.slice(0, 10).map((entry) => {
      const ext = entry.path.split(".").pop() ?? "";
      const language =
        ext === "tsx" || ext === "jsx"
          ? "tsx"
          : ext === "ts"
            ? "ts"
            : ext === "js"
              ? "js"
              : ext;
      const size = fileSizes[entry.path] ?? 0;
      const complexityScore =
        maxSize > 0 ? Math.round(40 + (60 * size) / maxSize) : 50;

      const complexityColor =
        complexityScore >= 80 ? "red" : complexityScore >= 65 ? "yellow" : "green";

      return {
        path: entry.path,
        language,
        complexity: complexityColor as "green" | "yellow" | "red",
      };
    });

    const sampleCode =
      (firstFileContent &&
        (firstFileContent.length > 4000
          ? `${firstFileContent.slice(0, 4000)}\n// … truncated`
          : firstFileContent)) ||
      readme ||
      `// Sample view for ${repo.full_name}\n// Connect this Monaco editor to real code snippets during indexing.\n`;

    return Response.json({
      repoId,
      repoUrl,
      owner,
      name,
      elevatorPitch: parsedJson?.elevatorPitch ?? "",
      stackRadar: parsedJson?.stackRadar ?? [],
      hotspots,
      sampleFileTree,
      fullFileTree: allEntries, // Include all folders and files
      sampleCode,
    });
  } catch (error: unknown) {
    // Catch any unhandled errors
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
    
    console.error("Error in /api/analyze:", error);
    return Response.json(
      {
        error: errorMessage || "An unexpected error occurred while analyzing the repository.",
      },
      { status: 500 },
    );
  }
}


