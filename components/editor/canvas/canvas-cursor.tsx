"use client";

import { useOther } from "@liveblocks/react";
import type { CursorsCursorProps } from "@liveblocks/react-flow";

export function CanvasCursor({ connectionId }: CursorsCursorProps) {
  const info = useOther(connectionId, (o) => o.info);
  if (!info) return null;

  return (
    <div className="pointer-events-none select-none" style={{ position: "relative" }}>
      <svg width="12" height="19" viewBox="0 0 12 19" fill="none">
        <path
          d="M0 0 L0 15 L4 11 L7 18 L9 17 L6 10 L11 10 Z"
          fill={info.color}
          stroke="white"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
      <div
        className="absolute px-1.5 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap"
        style={{ backgroundColor: info.color, top: "16px", left: "10px" }}
      >
        {info.name}
      </div>
    </div>
  );
}
