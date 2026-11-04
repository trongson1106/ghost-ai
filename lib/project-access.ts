import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getIdentity() {
  const { userId } = await auth();
  if (!userId) return null;
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress ?? "";
  return { userId, email };
}

export async function getProjectAccess(
  projectId: string,
  userId: string,
  email: string,
) {
  return prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: userId },
        { collaborators: { some: { email } } },
      ],
    },
    select: { id: true, name: true, ownerId: true },
  });
}
