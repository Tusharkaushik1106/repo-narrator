import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getUserUsage } from "@/lib/tokenUsage";

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authConfig)) as
    | { user?: { email?: string | null; id?: string | null } }
    | null;
  const userId = session?.user?.email || session?.user?.id;

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const requestedUserId = searchParams.get("userId");

  if (requestedUserId && requestedUserId !== userId) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  const usage = await getUserUsage(userId);
  return Response.json(usage);
}

