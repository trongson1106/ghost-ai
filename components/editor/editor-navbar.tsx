"use client";

import { PanelLeftClose, PanelLeftOpen, Share2, Bot } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
  projectName?: string;
  aiSidebarOpen?: boolean;
  onAiSidebarToggle?: () => void;
  onShare?: () => void;
}

export function EditorNavbar({
  sidebarOpen,
  onSidebarToggle,
  projectName,
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
