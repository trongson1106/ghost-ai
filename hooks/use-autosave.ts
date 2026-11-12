"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export type SaveStatus = "idle" | "saving" | "saved" | "error";

export function useAutosave(
  projectId: string,
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  onStatusChange?: (status: SaveStatus) => void,
) {
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestRef = useRef({ nodes, edges });
  latestRef.current = { nodes, edges };
  const onStatusChangeRef = useRef(onStatusChange);
  onStatusChangeRef.current = onStatusChange;
  const mountedRef = useRef(false);

  const save = useCallback(async () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const update = (s: SaveStatus) => {
      setStatus(s);
      onStatusChangeRef.current?.(s);
    };
    update("saving");
    try {
      const res = await fetch(`/api/projects/${projectId}/canvas`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(latestRef.current),
      });
      if (!res.ok) throw new Error();
      update("saved");
    } catch {
      update("error");
    }
  }, [projectId]);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, 1500);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [nodes, edges, save]);

  return { status, save };
}
