"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Send, FileText, Download, Bot, Loader2 } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import {
  useStorage,
  useMutation,
  useSelf,
  useOthersMapped,
  useUpdateMyPresence,
  useEventListener,
} from "@liveblocks/react";
import { LiveList } from "@liveblocks/client";
import type { ChatMessage } from "@/liveblocks.config";

const STARTERS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD Pipeline",
];

type RunHandle = { runId: string; token: string } | null;

const MAX_CONTEXT_MESSAGES = 6;

function buildPromptWithHistory(messages: readonly ChatMessage[], userText: string): string {
  const recent = messages.slice(-MAX_CONTEXT_MESSAGES);
  if (recent.length === 0) return userText;
  const history = recent
    .map((m) => `${m.role === "user" ? m.userName : "AI"}: ${m.text}`)
    .join("\n");
  return `Previous conversation:\n${history}\n\nNew request: ${userText}`;
}

interface ArchitectTabProps {
  projectId: string;
}

function ArchitectTab({ projectId }: ArchitectTabProps) {
  const self = useSelf();
  const rawMessages = useStorage((root) => root.chat);
  const chatMessages = rawMessages ?? [];

  const addMessage = useMutation(({ storage }, message: ChatMessage) => {
    const chat = storage.get("chat");
    if (chat) {
      chat.push(message);
    } else {
      storage.set("chat", new LiveList([message]));
    }
  }, []);

  const updateMyPresence = useUpdateMyPresence();
  const typingOthers = useOthersMapped((other) => ({
    isTyping: other.presence.isTyping,
    name: other.info?.name ?? "Someone",
  }));

  const [input, setInput] = useState("");
  const [runHandle, setRunHandle] = useState<RunHandle>(null);
  const [aiLocked, setAiLocked] = useState(false);
  const [aiStatusMessage, setAiStatusMessage] = useState("");
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // AI lock/status from broadcasts — received by ALL collaborators
  useEventListener(({ event }) => {
    if (event.type === "AI_STATUS") {
      setAiLocked(event.thinking);
      setAiStatusMessage(event.message);
    }
  });

  const { run } = useRealtimeRun(runHandle?.runId ?? "", {
    accessToken: runHandle?.token ?? "",
    enabled: !!runHandle,
    skipColumns: ["payload", "output"],
  });

  // Only the triggering user watches the run and writes the AI reply to storage
  const prevStatus = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (!run) return;
    const status = run.metadata?.status as string | undefined;
    const message = run.metadata?.message as string | undefined;

    if (status === "done" && prevStatus.current !== "done" && message) {
      addMessage({ id: `ai-${Date.now()}`, role: "ai", text: message, userName: "AI", timestamp: Date.now() });
      setRunHandle(null);
    } else if (status === "error" && prevStatus.current !== "error" && message) {
      addMessage({ id: `ai-err-${Date.now()}`, role: "ai", text: message, userName: "AI", timestamp: Date.now() });
      setRunHandle(null);
    }

    if (run.status === "COMPLETED" && status !== "done") {
      setRunHandle(null);
    }

    prevStatus.current = status;
  }, [run, addMessage]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length, aiLocked]);

  // Clear typing on unmount
  useEffect(() => {
    return () => {
      updateMyPresence({ isTyping: false });
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    };
  }, [updateMyPresence]);

  const send = useCallback(async () => {
    const text = input.trim();
    if (!text || aiLocked) return;

    const myName = self?.info?.name ?? "You";
    addMessage({ id: `user-${Date.now()}`, role: "user", text, userName: myName, timestamp: Date.now() });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "72px";
    updateMyPresence({ isTyping: false });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setAiLocked(true); // optimistic lock before broadcast arrives

    const prompt = buildPromptWithHistory(chatMessages, text);

    try {
      const res = await fetch("/api/ai/design", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, roomId: projectId, projectId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { runId } = await res.json();

      const tokenRes = await fetch("/api/ai/design/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId }),
      });
      if (!tokenRes.ok) throw new Error(await tokenRes.text());
      const { token } = await tokenRes.json();

      setRunHandle({ runId, token });
    } catch {
      setAiLocked(false);
      addMessage({ id: `ai-err-${Date.now()}`, role: "ai", text: "Failed to start design agent. Please try again.", userName: "AI", timestamp: Date.now() });
    }
  }, [input, aiLocked, projectId, chatMessages, addMessage, updateMyPresence, self]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;

    updateMyPresence({ isTyping: val.length > 0 });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (val.length > 0) {
      typingTimeoutRef.current = setTimeout(() => updateMyPresence({ isTyping: false }), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const whoIsTyping = typingOthers
    .filter(([, t]) => t.isTyping)
    .map(([, t]) => t.name);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ScrollArea className="flex-1 px-3 py-3">
        {chatMessages.length === 0 && !aiLocked ? (
          <div className="flex flex-col gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => setInput(s)}
                className="text-left text-xs px-3 py-2 rounded-lg bg-bg-elevated border border-border-default text-text-secondary hover:border-border-subtle hover:text-text-primary transition-colors cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {chatMessages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}>
                <span className="text-[10px] text-text-faint mb-0.5 px-1">
                  {m.role === "user" ? m.userName : "AI Architect"}
                </span>
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-accent-ai text-white"
                      : "bg-bg-elevated text-text-primary border border-border-default"
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
            {aiLocked && (
              <div className="flex flex-col items-start">
                <span className="text-[10px] text-text-faint mb-0.5 px-1">AI Architect</span>
                <div className="flex items-center gap-2 max-w-[85%] rounded-xl px-3 py-2 text-sm bg-bg-elevated text-text-muted border border-border-default">
                  <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                  <span>{aiStatusMessage || (run?.metadata?.message as string | undefined) || "Thinking…"}</span>
                </div>
              </div>
            )}
            {whoIsTyping.length > 0 && !aiLocked && (
              <p className="text-[10px] text-text-faint px-1">
                {whoIsTyping.length === 1
                  ? `${whoIsTyping[0]} is typing…`
                  : "Multiple people are typing…"}
              </p>
            )}
            <div ref={scrollRef} />
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border-default flex flex-col gap-2">
        {aiLocked && (
          <p className="text-[10px] text-text-faint text-center">AI is generating — chat locked for everyone</p>
        )}
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={aiLocked}
            placeholder="Describe your system…"
            className="flex-1 resize-none rounded-lg bg-bg-elevated border border-border-default text-sm text-text-primary placeholder:text-text-faint px-3 py-2 focus:outline-none focus:border-border-subtle disabled:opacity-50"
            style={{ minHeight: "72px", maxHeight: "160px" }}
            rows={1}
          />
          <Button
            onClick={send}
            disabled={aiLocked || !input.trim()}
            size="icon"
            className="bg-accent-ai text-white hover:opacity-90 shrink-0 self-end disabled:opacity-40"
          >
            {aiLocked ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SpecTab({ projectId }: { projectId: string }) {
  const [runHandle, setRunHandle] = useState<RunHandle>(null);
  const [generating, setGenerating] = useState(false);
  const [specMarkdown, setSpecMarkdown] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const prevSpecStatus = useRef<string | undefined>(undefined);

  const { run: specRun } = useRealtimeRun(runHandle?.runId ?? "", {
    accessToken: runHandle?.token ?? "",
    enabled: !!runHandle,
    skipColumns: ["payload", "output"],
  });

  useEffect(() => {
    if (!specRun) return;
    const status = specRun.metadata?.status as string | undefined;
    const message = specRun.metadata?.message as string | undefined;
    if (message) setStatusMessage(message);

    if (status === "done" && prevSpecStatus.current !== "done") {
      const md = specRun.metadata?.markdown as string | undefined;
      if (md) setSpecMarkdown(md);
      setGenerating(false);
      setRunHandle(null);
    } else if (status === "error" && prevSpecStatus.current !== "error") {
      setGenerating(false);
      setRunHandle(null);
    }
    if (specRun.status === "COMPLETED" && status !== "done") {
      setGenerating(false);
      setRunHandle(null);
    }
    prevSpecStatus.current = status;
  }, [specRun]);

  const generate = async () => {
    setGenerating(true);
    setStatusMessage("Starting…");
    try {
      const res = await fetch("/api/ai/spec", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, roomId: projectId }),
      });
      if (!res.ok) throw new Error(await res.text());
      const { runId } = await res.json();

      const tokenRes = await fetch("/api/ai/spec/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runId }),
      });
      if (!tokenRes.ok) throw new Error(await tokenRes.text());
      const { token } = await tokenRes.json();

      setRunHandle({ runId, token });
    } catch {
      setGenerating(false);
      setStatusMessage("Failed to start. Please try again.");
    }
  };

  const download = () => {
    if (!specMarkdown) return;
    const blob = new Blob([specMarkdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spec.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden p-3 gap-3">
      <Button
        onClick={generate}
        disabled={generating}
        className="w-full bg-accent-ai text-white hover:opacity-90 disabled:opacity-50 shrink-0"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {statusMessage || "Generating…"}
          </>
        ) : (
          "Generate Spec"
        )}
      </Button>

      {specMarkdown && (
        <div className="rounded-xl bg-bg-elevated border border-border-default p-4 flex flex-col gap-3">
          <p className="text-xs text-text-muted">Spec generated successfully.</p>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <FileText className="h-4 w-4 text-accent-ai-text shrink-0" />
              <span className="text-sm font-medium text-text-primary truncate">spec.md</span>
            </div>
            <Button
              onClick={download}
              variant="ghost"
              size="sm"
              className="text-text-secondary gap-1.5 shrink-0"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface AiSidebarProps {
  projectId: string;
}

export function AiSidebar({ projectId }: AiSidebarProps) {
  return (
    <aside className="w-80 h-full flex flex-col bg-bg-surface border-l border-border-default">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default shrink-0">
        <Bot className="h-4 w-4 text-accent-ai-text" />
        <span className="text-sm font-semibold text-text-primary">AI Assistant</span>
      </div>

      <Tabs defaultValue="architect" className="flex flex-col flex-1 overflow-hidden">
        <div className="px-3 pt-3 pb-0 shrink-0">
          <TabsList className="w-full bg-bg-elevated border border-border-default">
            <TabsTrigger
              value="architect"
              className="flex-1 data-active:bg-accent-ai data-active:text-white data-active:border-transparent"
            >
              AI Architect
            </TabsTrigger>
            <TabsTrigger
              value="spec"
              className="flex-1 data-active:bg-accent-ai data-active:text-white data-active:border-transparent"
            >
              Spec
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="architect" className="flex flex-col flex-1 overflow-hidden mt-0">
          <ArchitectTab projectId={projectId} />
        </TabsContent>
        <TabsContent value="spec" className="flex flex-col flex-1 overflow-hidden mt-0">
          <SpecTab projectId={projectId} />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
