"use client";

import { Component, type ReactNode } from "react";
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import { CanvasFlow } from "./canvas-flow";

class CanvasErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state = { error: null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-state-error">Canvas connection error</p>
        </div>
      );
    }
    return this.props.children;
  }
}

interface CanvasRoomProps {
  roomId: string;
}

export function CanvasRoom({ roomId }: CanvasRoomProps) {
  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
        <CanvasErrorBoundary>
          <ClientSideSuspense
            fallback={
              <div className="flex-1 flex items-center justify-center">
                <p className="text-sm text-text-muted">Connecting…</p>
              </div>
            }
          >
            <CanvasFlow />
          </ClientSideSuspense>
        </CanvasErrorBoundary>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
