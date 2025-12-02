import { NextRequest } from "next/server";
import type { RepoIdentifier } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { repo }: { repo: RepoIdentifier } = await req.json();

  if (!repo || !repo.type) {
    return Response.json({ error: "Missing repo identifier" }, { status: 400 });
  }

  // NOTE: This is a placeholder. In a real deployment you would:
  // - For GitHub: use a short-lived OAuth token or a securely stored PAT.
  //   Never log or persist raw PATs in plaintext.
  // - For zip uploads: read from storage and unpack server-side.
  // - Walk the repo, parse by language, create chunks, and upsert embeddings
  //   to your configured vector store adapter.

  const fakeJobId = `job_${Date.now().toString(36)}`;

  return Response.json(
    {
      jobId: fakeJobId,
      status: "queued",
    },
    { status: 202 },
  );
}


