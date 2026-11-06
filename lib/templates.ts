import type { CanvasNode, CanvasEdge } from "@/types/canvas";
import { NODE_COLORS } from "@/types/canvas";

export type Template = {
  id: string;
  name: string;
  description: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
};

function n(
  id: string,
  label: string,
  x: number,
  y: number,
  w: number,
  h: number,
  colorIdx: number,
  shape: CanvasNode["data"]["shape"] = "rectangle"
): CanvasNode {
  return {
    id,
    type: "canvasNode",
    position: { x, y },
    data: { label, colour: NODE_COLORS[colorIdx], shape },
    width: w,
    height: h,
  };
}

function handles(nodes: CanvasNode[], source: string, target: string) {
  const src = nodes.find((nd) => nd.id === source)!;
  const tgt = nodes.find((nd) => nd.id === target)!;
  const dx = (tgt.position.x + (tgt.width ?? 160) / 2) - (src.position.x + (src.width ?? 160) / 2);
  const dy = (tgt.position.y + (tgt.height ?? 80) / 2) - (src.position.y + (src.height ?? 80) / 2);
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx > 0
      ? { sourceHandle: "right", targetHandle: "left" }
      : { sourceHandle: "left",  targetHandle: "right" };
  }
  return dy > 0
    ? { sourceHandle: "bottom", targetHandle: "top" }
    : { sourceHandle: "top",    targetHandle: "bottom" };
}

function e(nodes: CanvasNode[], id: string, source: string, target: string): CanvasEdge {
  return { id, source, target, ...handles(nodes, source, target) };
}

export const TEMPLATES: Template[] = [
  {
    id: "scratch",
    name: "Start from Scratch",
    description: "Begin with an empty canvas.",
    nodes: [],
    edges: [],
  },
  (() => {
    const nodes = [
      n("gw",        "API Gateway",  200,  20, 200, 80, 1),
      n("user-svc",  "User Service",   0, 200, 160, 70, 6),
      n("order-svc", "Order Service", 220, 200, 160, 70, 2),
      n("inv-svc",   "Inventory",     440, 200, 160, 70, 3),
      n("user-db",   "User DB",        20, 370, 120, 90, 7, "cylinder"),
      n("order-db",  "Order DB",      240, 370, 120, 90, 7, "cylinder"),
    ];
    return {
      id: "microservices",
      name: "Microservices",
      description: "API gateway routing to independent services and databases.",
      nodes,
      edges: [
        e(nodes, "gw-user",   "gw",        "user-svc"),
        e(nodes, "gw-order",  "gw",        "order-svc"),
        e(nodes, "gw-inv",    "gw",        "inv-svc"),
        e(nodes, "user-db-e", "user-svc",  "user-db"),
        e(nodes, "ord-db-e",  "order-svc", "order-db"),
      ],
    };
  })(),
  (() => {
    const nodes = [
      n("source",  "Source",     0,   60, 140, 70, 1),
      n("build",   "Build",      200, 60, 140, 70, 3),
      n("test",    "Test",       400, 60, 140, 70, 6),
      n("staging", "Staging",    600, 60, 140, 70, 2),
      n("prod",    "Production", 800, 60, 160, 70, 7),
    ];
    return {
      id: "cicd",
      name: "CI/CD Pipeline",
      description: "Automated build, test, and deployment pipeline.",
      nodes,
      edges: [
        e(nodes, "s-b", "source",  "build"),
        e(nodes, "b-t", "build",   "test"),
        e(nodes, "t-s", "test",    "staging"),
        e(nodes, "s-p", "staging", "prod"),
      ],
    };
  })(),
  (() => {
    const nodes = [
      n("producer",   "Producer",   0,   120, 160, 70, 1),
      n("bus",        "Event Bus",  240, 120, 200, 70, 3, "pill"),
      n("consumer-a", "Consumer A", 530,  20, 160, 70, 6),
      n("consumer-b", "Consumer B", 530, 120, 160, 70, 2),
      n("consumer-c", "Consumer C", 530, 220, 160, 70, 5),
    ];
    return {
      id: "event-driven",
      name: "Event-Driven",
      description: "Event producer, broker, and multiple consumers.",
      nodes,
      edges: [
        e(nodes, "p-b",  "producer", "bus"),
        e(nodes, "b-ca", "bus", "consumer-a"),
        e(nodes, "b-cb", "bus", "consumer-b"),
        e(nodes, "b-cc", "bus", "consumer-c"),
      ],
    };
  })(),
];
