"use client";

import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TEMPLATES, type Template } from "@/lib/templates";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

const PAD = 24;

function TemplatePreview({ nodes, edges }: { nodes: CanvasNode[]; edges: CanvasEdge[] }) {
  if (nodes.length === 0) {
    return (
      <div
        className="flex items-center justify-center bg-bg-subtle rounded-t-xl"
        style={{ aspectRatio: "8/5" }}
      >
        <Plus className="h-8 w-8 text-text-faint" />
      </div>
    );
  }

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const node of nodes) {
    minX = Math.min(minX, node.position.x);
    minY = Math.min(minY, node.position.y);
    maxX = Math.max(maxX, node.position.x + (node.width ?? 160));
    maxY = Math.max(maxY, node.position.y + (node.height ?? 80));
  }
  const vw = maxX - minX + PAD * 2;
  const vh = maxY - minY + PAD * 2;

  return (
    <svg
      viewBox={`0 0 ${vw} ${vh}`}
      style={{ aspectRatio: "8/5", display: "block" }}
      className="w-full bg-bg-subtle rounded-t-xl"
      preserveAspectRatio="xMidYMid meet"
    >
      {edges.map((edge) => {
        const src = nodes.find((nd) => nd.id === edge.source);
        const tgt = nodes.find((nd) => nd.id === edge.target);
        if (!src || !tgt) return null;
        const sw = src.width ?? 160, sh = src.height ?? 80;
        const tw = tgt.width ?? 160, th = tgt.height ?? 80;
        const scx = src.position.x + sw / 2 - minX + PAD;
        const scy = src.position.y + sh / 2 - minY + PAD;
        const tcx = tgt.position.x + tw / 2 - minX + PAD;
        const tcy = tgt.position.y + th / 2 - minY + PAD;
        const dx = tcx - scx, dy = tcy - scy;
        let x1, y1, x2, y2;
        if (Math.abs(dx) >= Math.abs(dy)) {
          y1 = scy; y2 = tcy;
          if (dx > 0) { x1 = scx + sw / 2; x2 = tcx - tw / 2; }
          else        { x1 = scx - sw / 2; x2 = tcx + tw / 2; }
        } else {
          x1 = scx; x2 = tcx;
          if (dy > 0) { y1 = scy + sh / 2; y2 = tcy - th / 2; }
          else        { y1 = scy - sh / 2; y2 = tcy + th / 2; }
        }
        return (
          <line key={edge.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a3a42" strokeWidth={2} />
        );
      })}
      {nodes.map((node) => {
        const w = node.width ?? 160;
        const h = node.height ?? 80;
        const x = node.position.x - minX + PAD;
        const y = node.position.y - minY + PAD;
        const fill = node.data.colour?.fill ?? "#1F1F1F";
        const stroke = node.data.colour?.text ?? "#EDEDED";
        const isRound = node.data.shape === "pill" || node.data.shape === "circle";
        const rx = isRound ? Math.min(w, h) / 2 : 6;
        return (
          <g key={node.id}>
            <rect x={x} y={y} width={w} height={h} rx={rx} fill={fill} stroke={stroke} strokeWidth={1.5} />
            {node.data.label && (
              <text
                x={x + w / 2}
                y={y + h / 2}
                textAnchor="middle"
                dominantBaseline="central"
                fill={stroke}
                fontSize={11}
                fontFamily="sans-serif"
              >
                {node.data.label}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

function TemplateCard({
  template,
  onImport,
}: {
  template: Template;
  onImport: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
}) {
  return (
    <div className="group relative rounded-xl border border-border-default bg-bg-elevated overflow-hidden">
      <TemplatePreview nodes={template.nodes} edges={template.edges} />
      <div className="p-3">
        <p className="text-sm font-medium text-text-primary">{template.name}</p>
        <p className="text-xs text-text-muted mt-0.5">{template.description}</p>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-bg-elevated to-transparent">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onImport(template.nodes, template.edges)}
        >
          Import
        </Button>
      </div>
    </div>
  );
}

interface TemplateLibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (nodes: CanvasNode[], edges: CanvasEdge[]) => void;
}

export function TemplateLibraryDialog({
  open,
  onOpenChange,
  onImport,
}: TemplateLibraryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Start with a template</DialogTitle>
          <DialogDescription>
            Pick a starting point for your canvas.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="grid grid-cols-2 gap-3 p-0.5">
            {TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onImport={onImport}
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
