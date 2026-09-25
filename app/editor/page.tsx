import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOwnedProjects, getSharedProjects } from "@/lib/projects";
import { EditorHome } from "@/components/editor/editor-home";
import type { ProjectSummary } from "@/types/project";

export default async function EditorPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";

  const [owned, shared] = await Promise.all([
    getOwnedProjects(userId),
    email ? getSharedProjects(email) : Promise.resolve([]),
  ]);

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

  return <EditorHome ownedProjects={ownedProjects} sharedProjects={sharedProjects} />;
}
