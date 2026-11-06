"use client";

import { ZoomIn, ZoomOut, Maximize2, Undo2, Redo2 } from "lucide-react";
import type { useReactFlow } from "@xyflow/react";

type Props = {
  flow: ReturnType<typeof useReactFlow>;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
};

export function CanvasControls({ flow, canUndo, canRedo, undo, redo }: Props) {
  return (
    <div className="flex items-center gap-1 bg-bg-elevated border border-border-default rounded-full px-2 py-1.5 shadow-lg">
      <button
        onClick={() => flow.zoomIn({ duration: 200 })}
        className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
        title="Zoom in (Ctrl++)"
      >
        <ZoomIn className="h-4 w-4" />
      </button>
      <button
        onClick={() => flow.fitView({ duration: 200 })}
        className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
        title="Fit view"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => flow.zoomOut({ duration: 200 })}
        className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors"
        title="Zoom out (Ctrl+-)"
      >
        <ZoomOut className="h-4 w-4" />
      </button>

      <div className="w-px h-5 bg-border-default mx-1" />

      <button
        onClick={undo}
        disabled={!canUndo}
        className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors disabled:opacity-30 disabled:pointer-events-none"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="p-1.5 rounded-full text-text-secondary hover:text-text-primary hover:bg-bg-subtle transition-colors disabled:opacity-30 disabled:pointer-events-none"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="h-4 w-4" />
      </button>
    </div>
  );
}
