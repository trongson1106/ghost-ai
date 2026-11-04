import { redirect } from "next/navigation";
import { getIdentity, getProjectAccess } from "@/lib/project-access";
import { getOwnedProjects, getSharedProjects } from "@/lib/projects";
import { AccessDenied } from "@/components/editor/access-denied";
import { WorkspaceShell } from "@/components/editor/workspace-shell";
import type { ProjectSummary } from "@/types/project";

interface Props {
  params: Promise<{ roomID: string }>;
}

export default async function WorkspacePage({ params }: Props) {
  const { roomID } = await params;

  const identity = await getIdentity();
  if (!identity) redirect("/sign-in");

  const { userId, email } = identity;

  const [project, owned, shared] = await Promise.all([
    getProjectAccess(roomID, userId, email),
    getOwnedProjects(userId),
    email ? getSharedProjects(email) : Promise.resolve([]),
  ]);

  if (!project) return <AccessDenied />;

  const ownedProjects: ProjectSummary[] = owned.map((p) => ({
    id: p.id,
    name: p.name,
    owned: true,
  }));

  const sharedProjects: ProjectSummary[] = shared.map((p) => ({
    id: p.id,
    name: p.name,
    owned: false,
  }));

  return (
    <WorkspaceShell
      project={{ id: project.id, name: project.name }}
      isOwner={project.ownerId === userId}
      ownedProjects={ownedProjects}
      sharedProjects={sharedProjects}
    />
  );
}
