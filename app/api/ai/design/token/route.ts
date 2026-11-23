import { auth } from "@trigger.dev/sdk";
import { getIdentity } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const identity = await getIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.runId) {
    return Response.json({ error: "Missing runId" }, { status: 400 });
  }

  const record = await prisma.taskRun.findUnique({ where: { runId: body.runId as string } });
  if (!record || record.userId !== identity.userId) {
    return Response.json({ error: "Not Found" }, { status: 404 });
  }

  const token = await auth.createPublicToken({
    scopes: { read: { runs: [body.runId as string] } },
  });

  return Response.json({ token });
}
