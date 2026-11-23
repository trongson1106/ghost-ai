import { tasks } from "@trigger.dev/sdk";
import type { specAgentTask } from "@/src/trigger/spec-agent";
import { getIdentity, getProjectAccess } from "@/lib/project-access";
import { prisma } from "@/lib/prisma";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const identity = await getIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body?.projectId || !body?.roomId) {
    return Response.json({ error: "Missing required fields: projectId, roomId" }, { status: 400 });
  }

  const { projectId, roomId } = body as { projectId: string; roomId: string };

  const project = await getProjectAccess(projectId, identity.userId, identity.email);
  if (!project) return Response.json({ error: "Not Found" }, { status: 404 });

  const handle = await tasks.trigger<typeof specAgentTask>("spec-agent", { projectId, roomId });

  await prisma.taskRun.create({
    data: { runId: handle.id, projectId, userId: identity.userId },
  });

  return Response.json({ runId: handle.id });
}
