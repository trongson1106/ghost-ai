import { clerkClient } from "@clerk/nextjs/server";
import { getIdentity } from "@/lib/project-access";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const identity = await getIdentity();
  if (!identity) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.length < 2) return Response.json({ emails: [] });

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ query: q, limit: 5 });

  const emails = users.flatMap((u) => {
    const primary = u.emailAddresses.find((e) => e.id === u.primaryEmailAddressId);
    return primary ? [primary.emailAddress] : [];
  });

  return Response.json({ emails });
}
