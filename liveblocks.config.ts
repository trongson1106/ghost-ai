import type { LiveList } from "@liveblocks/client";

export type ChatMessage = {
  id: string;
  role: "user" | "ai";
  text: string;
  userName: string;
  timestamp: number;
};

declare global {
  interface Liveblocks {
    Presence: {
      cursor: { x: number; y: number } | null;
      thinking: boolean;
      isTyping: boolean;
    };

    UserMeta: {
      id: string;
      info: {
        name: string;
        avatar: string;
        color: string;
      };
    };

    Storage: {
      chat: LiveList<ChatMessage>;
    };

    RoomEvent: { type: "AI_STATUS"; thinking: boolean; message: string };
  }
}

export {};
