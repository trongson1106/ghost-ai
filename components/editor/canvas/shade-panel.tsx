"use client";

import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ComponentType } from "react";
import type { CanvasNodeData } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

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

function buildDragImage(s: ShapeDef): HTMLElement {
  const { width: w, height: h, shape } = s;
  const fill = NODE_COLORS[0].fill;
  const stroke = NODE_COLORS[0].text;
  const sw = 2, hs = 1, cx = w / 2, cy = h / 2;
  const a = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}"`;

  let inner: string;
  switch (shape) {
    case "pill":
      inner = `<rect x="${hs}" y="${hs}" width="${w - sw}" height="${h - sw}" rx="${cy - hs}" ry="${cy - hs}" ${a}/>`;
      break;
    case "circle":
      inner = `<ellipse cx="${cx}" cy="${cy}" rx="${cx - hs}" ry="${cy - hs}" ${a}/>`;
      break;
    case "diamond":
      inner = `<polygon points="${cx},${hs} ${w - hs},${cy} ${cx},${h - hs} ${hs},${cy}" ${a}/>`;
      break;
    case "hexagon": {
      const pts = [0, 60, 120, 180, 240, 300]
        .map((d) => { const r = (d * Math.PI) / 180; return `${cx + (cx - hs) * Math.cos(r)},${cy + (cy - hs) * Math.sin(r)}`; })
        .join(" ");
      inner = `<polygon points="${pts}" ${a}/>`;
      break;
    }
    case "cylinder": {
      const ey = Math.min(cy * 0.4, 15), rx = cx - hs;
      const ea = `stroke="${stroke}" stroke-width="${sw}"`;
      inner = [
        `<ellipse cx="${cx}" cy="${h - ey}" rx="${rx}" ry="${ey}" fill="${fill}" ${ea}/>`,
        `<rect x="${hs}" y="${ey}" width="${w - sw}" height="${h - ey * 2}" fill="${fill}" stroke="none"/>`,
        `<line x1="${hs}" y1="${ey}" x2="${hs}" y2="${h - ey}" ${ea}/>`,
        `<line x1="${w - hs}" y1="${ey}" x2="${w - hs}" y2="${h - ey}" ${ea}/>`,
        `<ellipse cx="${cx}" cy="${ey}" rx="${rx}" ry="${ey}" fill="${fill}" ${ea}/>`,
      ].join("");
      break;
    }
    default:
      inner = `<rect x="${hs}" y="${hs}" width="${w - sw}" height="${h - sw}" rx="4" ry="4" ${a}/>`;
  }

  const div = document.createElement("div");
  div.style.cssText = "position:fixed;left:-9999px;top:-9999px;opacity:0.75;";
  div.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${inner}</svg>`;
  document.body.appendChild(div);
  return div;
}

export function ShadePanel() {
  const handleDragStart = (e: React.DragEvent, s: ShapeDef) => {
    e.dataTransfer.setData(
      "application/canvas-shape",
      JSON.stringify({ shape: s.shape, width: s.width, height: s.height })
    );
    e.dataTransfer.effectAllowed = "copy";
    const img = buildDragImage(s);
    e.dataTransfer.setDragImage(img, s.width / 2, s.height / 2);
    requestAnimationFrame(() => document.body.removeChild(img));
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
