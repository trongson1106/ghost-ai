import { logger, task, metadata } from "@trigger.dev/sdk";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { mutateFlow } from "@liveblocks/react-flow/node";
import { liveblocks } from "@/lib/liveblocks";
import { NODE_COLORS } from "@/types/canvas";
import type { CanvasNode, CanvasEdge, NodeColor } from "@/types/canvas";

const DEFAULT_SIZES: Record<string, { width: number; height: number }> = {
  rectangle: { width: 200, height: 80 },
  circle: { width: 100, height: 100 },
  diamond: { width: 160, height: 160 },
  pill: { width: 200, height: 80 },
  cylinder: { width: 120, height: 100 },
  hexagon: { width: 140, height: 120 },
};

const shapeEnum = z.enum(["rectangle", "circle", "diamond", "pill", "cylinder", "hexagon"]);

const opSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("addNode"),
    id: z.string().describe("Short kebab-case ID like 'node-api', 'node-db'"),
    label: z.string(),
    shape: shapeEnum,
    colorIndex: z.number().int().min(0).max(7),
    x: z.number(),
    y: z.number(),
    width: z.number().optional(),
    height: z.number().optional(),
  }),
  z.object({
    type: z.literal("updateNode"),
    id: z.string(),
    label: z.string().optional(),
    shape: shapeEnum.optional(),
    colorIndex: z.number().int().min(0).max(7).optional(),
  }),
  z.object({
    type: z.literal("moveNode"),
    id: z.string(),
    x: z.number(),
    y: z.number(),
  }),
  z.object({
    type: z.literal("resizeNode"),
    id: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  z.object({ type: z.literal("deleteNode"), id: z.string() }),
  z.object({
    type: z.literal("addEdge"),
    id: z.string(),
    source: z.string(),
    target: z.string(),
  }),
  z.object({ type: z.literal("deleteEdge"), id: z.string() }),
]);

const responseSchema = z.object({
  operations: z.array(opSchema).describe("Ordered list of canvas operations to apply"),
  message: z.string().describe("One sentence summarising what was designed"),
});

async function broadcastStatus(roomId: string, thinking: boolean, message: string) {
  try {
    await liveblocks.broadcastEvent(roomId, { type: "AI_STATUS", thinking, message });
  } catch {
    // Non-fatal if no one is in the room
  }
}

export const designAgentTask = task({
  id: "design-agent",
  maxDuration: 300,
  run: async (payload: { prompt: string; roomId: string }) => {
    const { prompt, roomId } = payload;
    logger.log("Design agent triggered", { prompt, roomId });

    await broadcastStatus(roomId, true, "Analyzing your request…");
    metadata.set("status", "thinking");
    metadata.set("message", "Analyzing your request…");

    // Read current canvas state so the AI can extend or refine it
    let currentNodes: CanvasNode[] = [];
    let currentEdges: CanvasEdge[] = [];
    try {
      await mutateFlow<CanvasNode, CanvasEdge>({ client: liveblocks, roomId }, (flow) => {
        currentNodes = [...flow.nodes];
        currentEdges = [...flow.edges];
      });
    } catch {
      // Room may be empty / not yet initialised
    }

    const colorDesc = NODE_COLORS.map(
      (c, i) => `${i}:${i === 0 ? "neutral" : i === 1 ? "blue" : i === 2 ? "purple" : i === 3 ? "orange" : i === 4 ? "red" : i === 5 ? "pink" : i === 6 ? "green" : "teal"}`
    ).join(", ");

    const systemPrompt = `You are a system architecture diagram generator for a collaborative canvas.

SHAPES (choose the best fit):
- rectangle/pill: services, APIs, backends, functions
- cylinder: databases, caches, queues, storage
- circle: users, clients, actors, external actors
- diamond: load balancers, gateways, decision points, routers
- hexagon: external systems, third-party services, clouds

COLORS (colorIndex 0-7): ${colorDesc}
  Assign colors by component role: blue for APIs/services, green for databases, purple for messaging, teal for external, orange for queues, red for critical paths.

LAYOUT RULES:
- Arrange left-to-right for request flows, top-to-bottom for data flows
- Space nodes ≥240px apart (use multiples of 240 for x/y alignment)
- Keep the design compact — no node beyond ±1500px from origin
- Sources left/top, sinks right/bottom
- Align nodes on a grid (x and y multiples of 240)

ID RULES: Use short kebab IDs (e.g. "node-api", "node-db-1"). Never reuse existing IDs.

EXISTING CANVAS:
Nodes: ${JSON.stringify(currentNodes.map((n) => ({ id: n.id, label: n.data?.label, shape: n.data?.shape, x: n.position?.x, y: n.position?.y })))}
Edges: ${JSON.stringify(currentEdges.map((e) => ({ id: e.id, source: e.source, target: e.target })))}

If the canvas already has nodes, extend or refine it rather than rebuilding from scratch. Never duplicate existing IDs.`;

    await broadcastStatus(roomId, true, "Generating design…");
    metadata.set("message", "Generating design…");

    let result: z.infer<typeof responseSchema>;
    try {
      const { object } = await generateObject({
        model: google("gemini-3.5-flash-lite"),
        schema: responseSchema,
        system: systemPrompt,
        prompt,
      });
      result = object;
    } catch (err) {
      logger.error("Gemini generation failed", { err });
      await broadcastStatus(roomId, false, "Design generation failed. Please try again.");
      metadata.set("status", "error");
      metadata.set("message", "Design generation failed. Please try again.");
      throw err;
    }

    logger.log("AI generated operations", { count: result.operations.length, message: result.message });

    await broadcastStatus(roomId, true, "Applying to canvas…");
    metadata.set("message", "Applying to canvas…");

    try {
      await mutateFlow<CanvasNode, CanvasEdge>({ client: liveblocks, roomId }, (flow) => {
        for (const op of result.operations) {
          switch (op.type) {
            case "addNode": {
              const colour = NODE_COLORS[op.colorIndex] as NodeColor;
              const size = DEFAULT_SIZES[op.shape] ?? { width: 200, height: 80 };
              flow.addNode({
                id: op.id,
                type: "canvasNode",
                position: { x: op.x, y: op.y },
                data: { label: op.label, colour, shape: op.shape },
                width: op.width ?? size.width,
                height: op.height ?? size.height,
              });
              break;
            }
            case "updateNode": {
              flow.updateNode(op.id, (node) => ({
                ...node,
                data: {
                  ...node.data,
                  ...(op.label !== undefined ? { label: op.label } : {}),
                  ...(op.shape !== undefined ? { shape: op.shape } : {}),
                  ...(op.colorIndex !== undefined
                    ? { colour: NODE_COLORS[op.colorIndex] as NodeColor }
                    : {}),
                },
              }));
              break;
            }
            case "moveNode":
              flow.updateNode(op.id, { position: { x: op.x, y: op.y } });
              break;
            case "resizeNode":
              flow.updateNode(op.id, { width: op.width, height: op.height });
              break;
            case "deleteNode":
              flow.removeNode(op.id);
              break;
            case "addEdge":
              flow.addEdge({
                id: op.id,
                type: "canvasEdge",
                source: op.source,
                target: op.target,
                data: {},
              });
              break;
            case "deleteEdge":
              flow.removeEdge(op.id);
              break;
          }
        }
      });
    } catch (err) {
      logger.error("Canvas mutation failed", { err });
      await broadcastStatus(roomId, false, "Failed to apply changes to canvas.");
      metadata.set("status", "error");
      metadata.set("message", "Failed to apply changes to canvas.");
      throw err;
    }

    await broadcastStatus(roomId, false, result.message);
    metadata.set("status", "done");
    metadata.set("message", result.message);

    return { message: result.message, operationCount: result.operations.length };
  },
});
