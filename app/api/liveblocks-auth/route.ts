import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getIdentity, getProjectAccess } from "@/lib/project-access";
import { liveblocks, getCursorColor } from "@/lib/liveblocks";

export async function POST(request: Request) {
  const identity = await getIdentity();
  if (!identity) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { room } = await request.json();
  const project = await getProjectAccess(room, identity.userId, identity.email);
  if (!project) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const user = await currentUser();
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    identity.email;
  const avatar = user?.imageUrl ?? "";
  const color = getCursorColor(identity.userId);

  await liveblocks.getOrCreateRoom(room, { defaultAccesses: [] });

  const session = liveblocks.prepareSession(identity.userId, {
    userInfo: { name, avatar, color },
  });
  session.allow(room, session.FULL_ACCESS);

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
