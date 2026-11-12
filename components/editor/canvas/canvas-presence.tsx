"use client";

import { useOthers } from "@liveblocks/react";
import { UserButton } from "@clerk/nextjs";

const MAX_VISIBLE = 5;

function CollabAvatar({
  name,
  imageUrl,
  color,
  index,
}: {
  name?: string | null;
  imageUrl?: string | null;
  color?: string | null;
  index: number;
}) {
  const initials = name
    ? name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white overflow-hidden shrink-0"
      style={{
        backgroundColor: color ?? "#555",
        boxShadow: "0 0 0 2px var(--bg-base)",
        marginLeft: index > 0 ? "-8px" : "0",
        zIndex: MAX_VISIBLE - index,
        position: "relative",
      }}
      title={name ?? undefined}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={name ?? ""} className="w-full h-full object-cover" />
      ) : (
        initials
      )}
    </div>
  );
}

export function CanvasPresence() {
  const others = useOthers();
  const visible = others.slice(0, MAX_VISIBLE);
  const overflow = others.length - MAX_VISIBLE;

  return (
    <div className="flex items-center gap-2 p-2">
      {others.length > 0 && (
        <>
          <div className="flex items-center">
            {visible.map((other, i) => (
              <CollabAvatar
                key={other.connectionId}
                name={other.info?.name}
                imageUrl={other.info?.avatar}
                color={other.info?.color}
                index={i}
              />
            ))}
            {overflow > 0 && (
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-text-primary bg-bg-elevated shrink-0"
                style={{
                  boxShadow: "0 0 0 2px var(--bg-base)",
                  marginLeft: "-8px",
                  zIndex: 0,
                  position: "relative",
                }}
              >
                +{overflow}
              </div>
            )}
          </div>
          <div className="w-px h-6 bg-border-default" />
        </>
      )}
      <UserButton
        appearance={{ elements: { userButtonAvatarBox: "w-8 h-8" } }}
      />
    </div>
  );
}
