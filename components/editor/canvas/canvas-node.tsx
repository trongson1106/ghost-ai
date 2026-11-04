"use client";

import type { NodeProps } from "@xyflow/react";
import { NODE_COLORS } from "@/types/canvas";
import type { CanvasNode } from "@/types/canvas";

export function CanvasNodeComponent({ data }: NodeProps<CanvasNode>) {
  const color = data.colour ?? NODE_COLORS[0];
  return (
    <div
      style={{
        background: color.fill,
        color: color.text,
        borderColor: color.text + "40",
      }}
      className="min-w-[80px] min-h-[40px] w-full h-full flex items-center justify-center rounded border text-sm font-medium px-3 py-2"
    >
      {data.label}
    </div>
  );
}
