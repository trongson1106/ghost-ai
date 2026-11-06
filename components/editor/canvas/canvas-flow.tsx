"use client";

import { useCallback, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  ConnectionMode,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { useHistory } from "@liveblocks/react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { NODE_COLORS } from "@/types/canvas";
import type { CanvasNode, CanvasNodeData, CanvasEdge } from "@/types/canvas";
import { CanvasNodeComponent } from "./canvas-node";
import { ShadePanel } from "./shade-panel";
import { CanvasControls } from "./canvas-controls";
import { TemplateLibraryDialog } from "../dialogs/template-library-dialog";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import "@xyflow/react/dist/style.css";
import "@liveblocks/react-ui/styles.css";
import "@liveblocks/react-flow/styles.css";

const nodeTypes = { canvasNode: CanvasNodeComponent };

let nodeCounter = 0;

type ShapePayload = {
  shape: CanvasNodeData["shape"];
  width: number;
  height: number;
};

function CanvasFlowInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true, nodes: { initial: [] }, edges: { initial: [] } });

  const flow = useReactFlow();
  const { undo, redo, canUndo, canRedo } = useHistory();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [templateOpen, setTemplateOpen] = useState(() => searchParams.get("new") === "1");

  useKeyboardShortcuts({ flow, undo, redo });

  const closeTemplate = useCallback(() => {
    setTemplateOpen(false);
    router.replace(pathname);
  }, [router, pathname]);

  const handleTemplateImport = useCallback(
    (templateNodes: CanvasNode[], templateEdges: CanvasEdge[]) => {
      if (templateNodes.length > 0) {
        const ts = Date.now();
        const idMap: Record<string, string> = {};
        templateNodes.forEach((nd, i) => { idMap[nd.id] = `${nd.id}-${ts}-${i}`; });
        onNodesChange(templateNodes.map((nd) => ({ type: "add" as const, item: { ...nd, id: idMap[nd.id] } })));
        onEdgesChange(templateEdges.map((eg, i) => ({
          type: "add" as const,
          item: { ...eg, id: `${eg.id}-${ts}-${i}`, source: idMap[eg.source] ?? eg.source, target: idMap[eg.target] ?? eg.target },
        })));
      }
      closeTemplate();
    },
    [onNodesChange, onEdgesChange, closeTemplate]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const raw = e.dataTransfer.getData("application/canvas-shape");
      if (!raw) return;
      const payload = JSON.parse(raw) as ShapePayload;
      const position = flow.screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const id = `${payload.shape}-${Date.now()}-${++nodeCounter}`;
      onNodesChange([
        {
          type: "add",
          item: {
            id,
            type: "canvasNode",
            position,
            data: { label: "", colour: NODE_COLORS[0], shape: payload.shape },
            width: payload.width,
            height: payload.height,
          },
        },
      ]);
    },
    [flow, onNodesChange]
  );

  return (
    <div className="w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Cursors />
        <Panel position="bottom-left">
          <CanvasControls
            flow={flow}
            canUndo={canUndo()}
            canRedo={canRedo()}
            undo={undo}
            redo={redo}
          />
        </Panel>
        <Panel position="bottom-center">
          <ShadePanel />
        </Panel>
      </ReactFlow>
      <TemplateLibraryDialog
        open={templateOpen}
        onOpenChange={(v) => { if (!v) closeTemplate(); }}
        onImport={handleTemplateImport}
      />
    </div>
  );
}

export function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner />
    </ReactFlowProvider>
  );
}
