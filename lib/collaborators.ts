import { clerkClient } from "@clerk/nextjs/server";
import type { CollaboratorProfile } from "@/types/collaborator";

export async function enrichWithClerk(
  collaborators: { id: string; email: string }[],
): Promise<CollaboratorProfile[]> {
  if (collaborators.length === 0) return [];

  const emails = collaborators.map((c) => c.email);
  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ emailAddress: emails });

  const byEmail = new Map<string, { name: string | null; imageUrl: string | null }>();
  for (const user of users) {
    const email =
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
        ?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
    if (email) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || null;
      byEmail.set(email, { name, imageUrl: user.imageUrl });
    }
  }

  return collaborators.map((c) => ({
    id: c.id,
    email: c.email,
    ...(byEmail.get(c.email) ?? { name: null, imageUrl: null }),
  }));
}
