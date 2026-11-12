"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
import { CanvasCursor } from "./canvas-cursor";
import { CanvasPresence } from "./canvas-presence";
import { TemplateLibraryDialog } from "../dialogs/template-library-dialog";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useAutosave, type SaveStatus } from "@/hooks/use-autosave";
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

interface CanvasFlowInnerProps {
  projectId: string;
  onSaveStatusChange?: (s: SaveStatus) => void;
  onSaveReady?: (saveFn: () => Promise<void>) => void;
}

type CtxMenu = { x: number; y: number; type: "node" | "edge"; id: string };

function CanvasFlowInner({ projectId, onSaveStatusChange, onSaveReady }: CanvasFlowInnerProps) {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow<CanvasNode, CanvasEdge>({ suspense: true, nodes: { initial: [] }, edges: { initial: [] } });

  const flow = useReactFlow();
  const { undo, redo, canUndo, canRedo } = useHistory();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [templateOpen, setTemplateOpen] = useState(() => searchParams.get("new") === "1");
  const [ctxMenu, setCtxMenu] = useState<CtxMenu | null>(null);

  useKeyboardShortcuts({ flow, undo, redo });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "Delete" && e.key !== "Backspace") return;
      const t = e.target as HTMLElement;
      if (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable) return;
      const selNodes = flow.getNodes().filter((n) => n.selected);
      const selEdges = flow.getEdges().filter((eg) => eg.selected);
      if (selNodes.length) onNodesChange(selNodes.map((n) => ({ type: "remove" as const, id: n.id })));
      if (selEdges.length) onEdgesChange(selEdges.map((eg) => ({ type: "remove" as const, id: eg.id })));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flow, onNodesChange, onEdgesChange]);

  const onNodeContextMenu = useCallback((e: React.MouseEvent, node: CanvasNode) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, type: "node", id: node.id });
  }, []);

  const onEdgeContextMenu = useCallback((e: React.MouseEvent, edge: CanvasEdge) => {
    e.preventDefault();
    setCtxMenu({ x: e.clientX, y: e.clientY, type: "edge", id: edge.id });
  }, []);

  const deleteCtxTarget = useCallback(() => {
    if (!ctxMenu) return;
    if (ctxMenu.type === "node") flow.deleteElements({ nodes: [{ id: ctxMenu.id }], edges: [] });
    else flow.deleteElements({ nodes: [], edges: [{ id: ctxMenu.id }] });
    setCtxMenu(null);
  }, [ctxMenu, flow]);

  const { save } = useAutosave(projectId, nodes, edges, onSaveStatusChange);
  const onSaveReadyRef = useRef(onSaveReady);
  onSaveReadyRef.current = onSaveReady;
  useEffect(() => { onSaveReadyRef.current?.(save); }, [save]);

  // Load persisted canvas once on mount if the room is empty
  const loadedRef = useRef(false);
  useEffect(() => {
    if (loadedRef.current || nodes.length > 0 || edges.length > 0) return;
    loadedRef.current = true;
    fetch(`/api/projects/${projectId}/canvas`)
      .then((r) => r.json())
      .then((data: { nodes: CanvasNode[]; edges: CanvasEdge[] }) => {
        if (data.nodes?.length) {
          onNodesChange(data.nodes.map((nd) => ({ type: "add" as const, item: nd })));
        }
        if (data.edges?.length) {
          onEdgesChange(data.edges.map((eg) => ({ type: "add" as const, item: eg })));
        }
      })
      .catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    <div className="w-full h-full" onClick={() => setCtxMenu(null)}>
      {ctxMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setCtxMenu(null)} />
          <div
            className="fixed z-50 bg-bg-elevated border border-border-default shadow-lg rounded-md py-1 min-w-[120px]"
            style={{ left: ctxMenu.x, top: ctxMenu.y }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="flex w-full items-center px-3 py-1.5 text-sm text-red-400 hover:bg-white/5 transition-colors"
              onClick={deleteCtxTarget}
            >
              Delete
            </button>
          </div>
        </>
      )}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeContextMenu={onNodeContextMenu}
        onEdgeContextMenu={onEdgeContextMenu}
        onPaneClick={() => setCtxMenu(null)}
        onMove={() => setCtxMenu(null)}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        fitView
      >
        <Background variant={BackgroundVariant.Dots} />
        <Cursors components={{ Cursor: CanvasCursor }} />
        <Panel position="top-right">
          <CanvasPresence />
        </Panel>
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

interface CanvasFlowProps {
  projectId: string;
  onSaveStatusChange?: (s: SaveStatus) => void;
  onSaveReady?: (saveFn: () => Promise<void>) => void;
}

export function CanvasFlow({ projectId, onSaveStatusChange, onSaveReady }: CanvasFlowProps) {
  return (
    <ReactFlowProvider>
      <CanvasFlowInner projectId={projectId} onSaveStatusChange={onSaveStatusChange} onSaveReady={onSaveReady} />
    </ReactFlowProvider>
  );
}
