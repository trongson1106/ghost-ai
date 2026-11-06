"use client";

import { useEffect } from "react";
import type { useReactFlow } from "@xyflow/react";

type Props = {
  flow: ReturnType<typeof useReactFlow>;
  undo: () => void;
  redo: () => void;
};

const TYPING_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function useKeyboardShortcuts({ flow, undo, redo }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (TYPING_TAGS.has(target.tagName) || target.isContentEditable) return;
      if (!e.ctrlKey && !e.metaKey) return;

      switch (e.key) {
        case "+":
        case "=":
          e.preventDefault();
          flow.zoomIn({ duration: 200 });
          break;
        case "-":
          e.preventDefault();
          flow.zoomOut({ duration: 200 });
          break;
        case "z":
        case "Z":
          e.preventDefault();
          undo();
          break;
        case "y":
        case "Y":
          e.preventDefault();
          redo();
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flow, undo, redo]);
}
