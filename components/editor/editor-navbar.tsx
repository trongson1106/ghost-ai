"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Bot, Check, AlertCircle, Loader2, CloudUpload } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import type { SaveStatus } from "@/hooks/use-autosave";

interface EditorNavbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  saveStatus?: SaveStatus;
  onSave?: () => void;
  aiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
  onShare?: () => void;
}

const saveLabel: Record<SaveStatus, string> = {
  idle: "Save",
  saving: "Saving…",
  saved: "Saved",
  error: "Save failed",
};

export function EditorNavbar({
  sidebarOpen,
  onSidebarToggle,
  projectName,
  saveStatus,
  onSave,
  aiSidebarOpen,
  onAiSidebarToggle,
  onShare,
}: EditorNavbarProps) {
  return (
    <header className="h-12 shrink-0 flex items-center px-3 bg-bg-surface border-b border-border-default">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="h-8 w-8">
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        {projectName && (
          <span className="text-sm font-medium text-text-primary truncate max-w-xs">
            {projectName}
          </span>
        )}
      </div>
      <div className="flex-1" />
      <div className="flex items-center gap-1">
        {onSave && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            disabled={saveStatus === "saving"}
            className={`gap-1.5 h-8 ${saveStatus === "error" ? "text-state-error" : "text-text-muted"}`}
          >
            {saveStatus === "saving" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {saveStatus === "saved" && <Check className="h-3.5 w-3.5" />}
            {saveStatus === "error" && <AlertCircle className="h-3.5 w-3.5" />}
            {(!saveStatus || saveStatus === "idle") && <CloudUpload className="h-3.5 w-3.5" />}
            {saveLabel[saveStatus ?? "idle"]}
          </Button>
        )}
        {onShare && (
          <Button variant="ghost" size="sm" onClick={onShare} className="gap-1.5 h-8">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
        {onAiSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onAiSidebarToggle}
            className={`h-8 w-8 ${aiSidebarOpen ? "text-accent-ai-text" : ""}`}
          >
            <Bot className="h-4 w-4" />
          </Button>
        )}
        <UserButton />
      </div>
    </header>
  );
}
