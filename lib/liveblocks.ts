import { Liveblocks } from "@liveblocks/node";

const CURSOR_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
  "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9",
];

export function getCursorColor(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

declare global {
  // eslint-disable-next-line no-var
  var _liveblocks: Liveblocks | undefined;
}

function makeClient() {
  return new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET_KEY! });
}

export const liveblocks =
  process.env.NODE_ENV === "production"
    ? makeClient()
    : (globalThis._liveblocks ??= makeClient());
