"use client";

import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { CanvasNodeData } from "@/types/canvas";

type Shape = NonNullable<CanvasNodeData["shape"]>;

type ShapeDef = {
  shape: Shape;
  icon: ComponentType<LucideProps>;
  width: number;
  height: number;
  label: string;
};

const SHAPES: ShapeDef[] = [
  { shape: "rectangle", icon: RectangleHorizontal, width: 200, height: 80, label: "Rectangle" },
  { shape: "diamond", icon: Diamond, width: 160, height: 160, label: "Diamond" },
  { shape: "circle", icon: Circle, width: 100, height: 100, label: "Circle" },
  { shape: "pill", icon: Pill, width: 200, height: 80, label: "Pill" },
  { shape: "cylinder", icon: Cylinder, width: 120, height: 100, label: "Cylinder" },
  { shape: "hexagon", icon: Hexagon, width: 140, height: 120, label: "Hexagon" },
];

export function ShadePanel() {
  const handleDragStart = (e: React.DragEvent, s: ShapeDef) => {
    e.dataTransfer.setData(
      "application/canvas-shape",
      JSON.stringify({ shape: s.shape, width: s.width, height: s.height })
    );
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-bg-elevated border border-border-default shadow-lg">
      {SHAPES.map((s) => (
        <button
          key={s.shape}
          draggable
          onDragStart={(e) => handleDragStart(e, s)}
          title={s.label}
          className="p-1.5 rounded hover:bg-bg-subtle text-text-secondary hover:text-text-primary transition-colors cursor-grab active:cursor-grabbing"
        >
          <s.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}
