"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  sidebarOpen: boolean;
  onSidebarToggle: () => void;
}

export function EditorNavbar({ sidebarOpen, onSidebarToggle }: EditorNavbarProps) {
  return (
    <header className="h-12 shrink-0 flex items-center px-3 bg-bg-surface border-b border-border-default">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="h-8 w-8">
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div className="flex-1" />
      <div className="flex items-center" />
    </header>
  );
}
