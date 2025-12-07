import { NextRequest } from "next/server";
import type { RepoIdentifier } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { repo }: { repo: RepoIdentifier } = await req.json();

  if (!repo || !repo.type) {
    return Response.json({ error: "Missing repo identifier" }, { status: 400 });
  }

  
  
  
  
  
  

  const fakeJobId = `job_${Date.now().toString(36)}`;

  return Response.json(
    {
      jobId: fakeJobId,
      status: "queued",
    },
    { status: 202 },
  );
}


