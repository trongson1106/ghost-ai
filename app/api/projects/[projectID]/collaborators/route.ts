import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getIdentity } from "@/lib/project-access";
import { enrichWithClerk } from "@/lib/collaborators";
import type { NextRequest } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectID: string }> },
) {
  const identity = await getIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, email } = identity;
  const { projectID } = await params;

  const project = await prisma.project.findFirst({
    where: {
      id: projectID,
      OR: [{ ownerId: userId }, { collaborators: { some: { email } } }],
    },
    select: { id: true, ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });

  const [rows, client] = await Promise.all([
    prisma.projectCollaborator.findMany({
      where: { projectId: projectID },
      orderBy: { createdAt: "asc" },
      select: { id: true, email: true },
    }),
    clerkClient(),
  ]);

  const [collaborators, ownerUser] = await Promise.all([
    enrichWithClerk(rows),
    client.users.getUser(project.ownerId),
  ]);

  const ownerEmail =
    ownerUser.emailAddresses.find((e) => e.id === ownerUser.primaryEmailAddressId)
      ?.emailAddress ?? ownerUser.emailAddresses[0]?.emailAddress ?? "";
  const owner = {
    email: ownerEmail,
    name: [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(" ") || null,
    imageUrl: ownerUser.imageUrl,
  };

  return Response.json({ owner, collaborators });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ projectID: string }> },
) {
  const identity = await getIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, email: currentEmail } = identity;
  const { projectID } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectID },
    select: { ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId) return Response.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const inviteEmail =
    typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!inviteEmail || !inviteEmail.includes("@")) {
    return Response.json({ error: "Valid email required" }, { status: 400 });
  }

  if (inviteEmail === currentEmail) {
    return Response.json({ error: "You are already the owner" }, { status: 400 });
  }

  const client = await clerkClient();
  const { data: clerkUsers } = await client.users.getUserList({ emailAddress: [inviteEmail] });
  if (clerkUsers.length === 0) {
    return Response.json({ error: "No account found with that email" }, { status: 400 });
  }

  const row = await prisma.projectCollaborator.upsert({
    where: { projectId_email: { projectId: projectID, email: inviteEmail } },
    update: {},
    create: { projectId: projectID, email: inviteEmail },
    select: { id: true, email: true },
  });

  const [collaborator] = await enrichWithClerk([row]);
  return Response.json({ collaborator }, { status: 201 });
}
