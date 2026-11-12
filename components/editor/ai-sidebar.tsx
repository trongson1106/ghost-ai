"use client";

import { useState, useRef, useCallback } from "react";
import { Send, FileText, Download, Bot } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const STARTERS = [
  "Design an e-commerce backend",
  "Create a chat app architecture",
  "Build a CI/CD Pipeline",
];

type Message = { role: "user" | "ai"; text: string };

function ArchitectTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const send = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "72px";
    }
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <ScrollArea className="flex-1 px-3 py-3">
        {messages.length === 0 ? (
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
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
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
          </div>
        )}
      </ScrollArea>

      <div className="p-3 border-t border-border-default flex flex-col gap-2">
        <div className="flex gap-2 items-end">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Describe your system..."
            className="flex-1 resize-none rounded-lg bg-bg-elevated border border-border-default text-sm text-text-primary placeholder:text-text-faint px-3 py-2 focus:outline-none focus:border-border-subtle"
            style={{ minHeight: "72px", maxHeight: "160px" }}
            rows={1}
          />
          <Button
            onClick={send}
            size="icon"
            className="bg-accent-ai text-white hover:opacity-90 shrink-0 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SpecTab() {
  return (
    <div className="flex flex-col p-3 gap-3">
      <Button className="w-full bg-accent-ai text-white hover:opacity-90">
        Generate Spec
      </Button>
      <div className="rounded-xl bg-bg-elevated border border-border-default p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-accent-ai-text shrink-0" />
          <span className="text-sm font-medium text-text-primary">E-Commerce Backend Spec</span>
        </div>
        <p className="text-xs text-text-muted line-clamp-3">
          A microservices architecture with API gateway, product catalog, order management, and
          payment processing services. Built for high availability with event-driven communication.
        </p>
        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            disabled
            className="text-text-faint gap-1.5 opacity-50"
          >
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </div>
    </div>
  );
}

export function AiSidebar() {
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
          <ArchitectTab />
        </TabsContent>
        <TabsContent value="spec" className="flex flex-col flex-1 overflow-hidden mt-0">
          <SpecTab />
        </TabsContent>
      </Tabs>
    </aside>
  );
}
