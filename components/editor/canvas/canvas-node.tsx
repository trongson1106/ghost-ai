"use client";

import { useState, useEffect, useCallback } from "react";
import type { NodeProps } from "@xyflow/react";
import { Handle, Position, NodeResizer, NodeToolbar, useReactFlow } from "@xyflow/react";
import { NODE_COLORS } from "@/types/canvas";
import type { CanvasNode, NodeColor } from "@/types/canvas";

function renderShape(shape: string, w: number, h: number, fill: string, stroke: string) {
  const sw = 2, hs = 1, cx = w / 2, cy = h / 2;
  const p = { fill, stroke, strokeWidth: sw };
  switch (shape) {
    case "pill":
      return <rect x={hs} y={hs} width={w - sw} height={h - sw} rx={cy - hs} ry={cy - hs} {...p} />;
    case "circle":
      return <ellipse cx={cx} cy={cy} rx={cx - hs} ry={cy - hs} {...p} />;
    case "diamond":
      return <polygon points={`${cx},${hs} ${w - hs},${cy} ${cx},${h - hs} ${hs},${cy}`} {...p} />;
    case "hexagon": {
      const pts = [0, 60, 120, 180, 240, 300]
        .map((d) => { const r = (d * Math.PI) / 180; return `${cx + (cx - hs) * Math.cos(r)},${cy + (cy - hs) * Math.sin(r)}`; })
        .join(" ");
      return <polygon points={pts} {...p} />;
    }
    case "cylinder": {
      const ey = Math.min(cy * 0.4, 15), rx = cx - hs;
      return (
        <>
          <ellipse cx={cx} cy={h - ey} rx={rx} ry={ey} fill={fill} stroke={stroke} strokeWidth={sw} />
          <rect x={hs} y={ey} width={w - sw} height={h - ey * 2} fill={fill} stroke="none" />
          <line x1={hs} y1={ey} x2={hs} y2={h - ey} stroke={stroke} strokeWidth={sw} />
          <line x1={w - hs} y1={ey} x2={w - hs} y2={h - ey} stroke={stroke} strokeWidth={sw} />
          <ellipse cx={cx} cy={ey} rx={rx} ry={ey} fill={fill} stroke={stroke} strokeWidth={sw} />
        </>
      );
    }
    default:
      return <rect x={hs} y={hs} width={w - sw} height={h - sw} rx={4} ry={4} {...p} />;
  }
}

export function CanvasNodeComponent({ id, data, selected, width, height }: NodeProps<CanvasNode>) {
  const color = data.colour ?? NODE_COLORS[0]; // actual saved color — used for active swatch check only

  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(data.label ?? "");
  const [hoveredSwatch, setHoveredSwatch] = useState<number | null>(null);
  const { updateNodeData } = useReactFlow();

  const displayColor = hoveredSwatch !== null ? NODE_COLORS[hoveredSwatch] : color;
  const w = width ?? 200;
  const h = height ?? 80;
  const fill = displayColor.fill;
  const stroke = selected ? displayColor.text : displayColor.text + "40";

  const updateColor = useCallback(
    (colour: NodeColor) => updateNodeData(id, { colour }),
    [id, updateNodeData]
  );

  useEffect(() => {
    if (!editing) setDraft(data.label ?? "");
  }, [data.label, editing]);

  const commitEdit = useCallback(() => {
    setEditing(false);
    updateNodeData(id, { label: draft });
  }, [id, draft, updateNodeData]);

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      e.stopPropagation(); // prevent ReactFlow delete/undo shortcuts
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        commitEdit();
      }
    },
    [commitEdit]
  );

  const handleStyle: React.CSSProperties = {
    opacity: hovered ? 1 : 0,
    transition: "opacity 0.15s",
    pointerEvents: hovered ? "all" : "none",
    width: 10,
    height: 10,
    background: displayColor.text,
    border: `2px solid ${displayColor.fill}`,
    borderRadius: "50%",
  };

  return (
    <div
      className="w-full h-full relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onDoubleClick={(e) => {
        if (editing) return;
        e.stopPropagation();
        setDraft(data.label ?? "");
        setEditing(true);
      }}
    >
      <NodeToolbar isVisible={!!selected} position={Position.Top} offset={8}>
        <div
          className="flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-bg-elevated border border-border-default shadow-lg"
          onMouseDown={(e) => e.stopPropagation()}
        >
          {NODE_COLORS.map((c, i) => (
            <button
              key={i}
              onClick={() => updateColor(c)}
              onMouseEnter={() => setHoveredSwatch(i)}
              onMouseLeave={() => setHoveredSwatch(null)}
              className="w-5 h-5 rounded-full transition-all"
              style={{
                background: c.fill,
                border: `2px solid ${c.fill === color.fill && c.text === color.text ? c.text : c.fill + "80"}`,
                boxShadow: hoveredSwatch === i ? `0 0 5px 2px ${c.text}60` : undefined,
                outline: c.fill === color.fill && c.text === color.text ? `2px solid ${c.text}` : undefined,
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </NodeToolbar>

      <NodeResizer
        isVisible={hovered || !!selected}
        minWidth={40}
        minHeight={40}
        color={displayColor.text}
      />

      <Handle type="source" id="top" position={Position.Top} style={handleStyle} />
      <Handle type="source" id="right" position={Position.Right} style={handleStyle} />
      <Handle type="source" id="bottom" position={Position.Bottom} style={handleStyle} />
      <Handle type="source" id="left" position={Position.Left} style={handleStyle} />

      <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} style={{ pointerEvents: "none" }}>
        {renderShape(data.shape ?? "rectangle", w, h, fill, stroke)}
      </svg>

      {editing ? (
        <div
          className="absolute inset-0 flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={onKeyDown}
            autoFocus
            rows={Math.max(1, draft.split("\n").length)}
            className="bg-transparent resize-none text-sm font-medium text-center border-none outline-none w-full px-2"
            style={{ color: displayColor.text }}
          />
        </div>
      ) : (
        data.label && (
          <div
            className="absolute inset-0 flex items-center justify-center text-sm font-medium pointer-events-none select-none text-center whitespace-pre-wrap"
            style={{ color: displayColor.text }}
          >
            {data.label}
          </div>
        )
      )}
    </div>
  );
}
