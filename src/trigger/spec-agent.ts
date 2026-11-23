import { logger, task, metadata } from "@trigger.dev/sdk";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";
import { mutateFlow } from "@liveblocks/react-flow/node";
import { liveblocks } from "@/lib/liveblocks";
import { put } from "@vercel/blob";
import type { CanvasNode, CanvasEdge } from "@/types/canvas";

export const specAgentTask = task({
  id: "spec-agent",
  maxDuration: 120,
  run: async (payload: { projectId: string; roomId: string }) => {
    const { projectId, roomId } = payload;
    logger.log("Spec agent triggered", { projectId, roomId });

    metadata.set("status", "reading");
    metadata.set("message", "Reading canvas…");

    let nodes: CanvasNode[] = [];
    let edges: CanvasEdge[] = [];
    try {
      await mutateFlow<CanvasNode, CanvasEdge>({ client: liveblocks, roomId }, (flow) => {
        nodes = [...flow.nodes];
        edges = [...flow.edges];
      });
    } catch {
      // empty room is OK
    }

    if (nodes.length === 0) {
      metadata.set("status", "error");
      metadata.set("message", "Canvas is empty. Add some nodes before generating a spec.");
      return;
    }

    metadata.set("status", "generating");
    metadata.set("message", "Generating spec…");

    const nodesDesc = nodes
      .map((n) => `- **${n.data?.label ?? n.id}** (${n.data?.shape ?? "rectangle"})`)
      .join("\n");

    const edgesDesc = edges.length
      ? edges
          .map((e) => {
            const srcLabel = nodes.find((n) => n.id === e.source)?.data?.label ?? e.source;
            const tgtLabel = nodes.find((n) => n.id === e.target)?.data?.label ?? e.target;
            return `- ${srcLabel} → ${tgtLabel}`;
          })
          .join("\n")
      : "No connections defined.";

    let markdown: string;
    try {
      const { text } = await generateText({
        model: google("gemini-3.5-flash-lite"),
        system:
          "You are a technical writer. Generate a clear, human-readable Markdown specification document for a system architecture diagram. Use proper Markdown headings, bullet points, and formatting.",
        prompt: `Generate a spec for this architecture:

Components:
${nodesDesc}

Connections:
${edgesDesc}

Write a spec document with:
1. A fitting project title as # heading
2. A brief overview paragraph
3. ## Components section — describe each component and its role
4. ## Architecture Flow section — describe how data/requests flow through the system
Keep it concise and professional (under 500 words).`,
      });
      markdown = text;
    } catch (err) {
      logger.error("Spec generation failed", { err });
      metadata.set("status", "error");
      metadata.set("message", "Spec generation failed. Please try again.");
      throw err;
    }

    try {
      await put(`specs/${projectId}/${Date.now()}.md`, markdown, {
        access: "public",
        contentType: "text/markdown",
      });
    } catch (err) {
      logger.warn("Blob upload failed; spec still available via metadata", { err });
    }

    metadata.set("status", "done");
    metadata.set("message", "Spec generated.");
    metadata.set("markdown", markdown);

    return { markdown };
  },
});
