import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/project-access";
import type { NextRequest } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ projectID: string; collaboratorId: string }> },
) {
  const identity = await getIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = identity;
  const { projectID, collaboratorId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectID },
    select: { ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 });

  const collaborator = await prisma.projectCollaborator.findUnique({
    where: { id: collaboratorId },
    select: { id: true, projectId: true },
  });

  if (!collaborator || collaborator.projectId !== projectID) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.projectCollaborator.delete({ where: { id: collaboratorId } });
  return Response.json({ success: true });
}
