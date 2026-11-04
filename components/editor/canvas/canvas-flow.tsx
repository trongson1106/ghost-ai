"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  ConnectionMode,
  Panel,
  useReactFlow,
} from "@xyflow/react";
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow";
import { NODE_COLORS } from "@/types/canvas";
import type { CanvasNode, CanvasNodeData } from "@/types/canvas";
import { CanvasNodeComponent } from "./canvas-node";
import { ShadePanel } from "./shade-panel";
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
    useLiveblocksFlow<CanvasNode>({ suspense: true, nodes: { initial: [] }, edges: { initial: [] } });

  const { screenToFlowPosition } = useReactFlow();

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
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
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
    [screenToFlowPosition, onNodesChange]
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
        <MiniMap
          style={{ backgroundColor: "#111" }}
          maskColor="rgba(0, 0, 0, 0.6)"
        />
        <Cursors />
        <Panel position="bottom-center">
          <ShadePanel />
        </Panel>
      </ReactFlow>
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
