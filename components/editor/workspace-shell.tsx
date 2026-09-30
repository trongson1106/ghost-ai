"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ShareDialog } from "@/components/editor/dialogs/share-dialog";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectSummary } from "@/types/project";

interface WorkspaceShellProps {
  project: { id: string; name: string };
  isOwner: boolean;
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export function WorkspaceShell({
  project,
  isOwner,
  ownedProjects,
  sharedProjects,
}: WorkspaceShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const {
    dialog,
    targetProject,
    createName,
    setCreateName,
    roomId,
    renameName,
    setRenameName,
    isSubmitting,
    openCreate,
    openRename,
    openDelete,
    closeDialog,
    submitCreate,
    submitRename,
    submitDelete,
  } = useProjectActions();

  return (
    <div className="flex flex-col h-screen bg-bg-base">
      <EditorNavbar
        sidebarOpen={sidebarOpen}
        onSidebarToggle={() => setSidebarOpen((o) => !o)}
        projectName={project.name}
        aiSidebarOpen={aiSidebarOpen}
        onAiSidebarToggle={() => setAiSidebarOpen((o) => !o)}
        onShare={() => setShareOpen(true)}
      />

      <div className="flex flex-1 overflow-hidden">
        <ProjectSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onNewProject={openCreate}
          onRenameProject={openRename}
          onDeleteProject={openDelete}
          activeProjectId={project.id}
        />

        <main className="flex-1 flex items-center justify-center bg-bg-base">
          <p className="text-sm text-text-muted">Canvas coming soon</p>
        </main>

        {aiSidebarOpen && (
          <aside className="w-80 flex flex-col bg-bg-surface border-l border-border-default">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-border-default">
              <Bot className="h-4 w-4 text-accent-ai-text" />
              <span className="text-sm font-semibold text-text-primary">AI Assistant</span>
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-sm text-text-muted">AI chat coming soon</p>
            </div>
          </aside>
        )}
      </div>

      <ShareDialog
        open={shareOpen}
        onOpenChange={setShareOpen}
        projectId={project.id}
        projectName={project.name}
        isOwner={isOwner}
      />
      <CreateProjectDialog
        open={dialog === "create"}
        onOpenChange={(open) => !open && closeDialog()}
        name={createName}
        onNameChange={setCreateName}
        roomId={roomId}
        isSubmitting={isSubmitting}
        onSubmit={submitCreate}
      />
      <RenameProjectDialog
        open={dialog === "rename"}
        onOpenChange={(open) => !open && closeDialog()}
        project={targetProject}
        name={renameName}
        onNameChange={setRenameName}
        isSubmitting={isSubmitting}
        onSubmit={submitRename}
      />
      <DeleteProjectDialog
        open={dialog === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
        project={targetProject}
        isSubmitting={isSubmitting}
        onSubmit={submitDelete}
      />
    </div>
  );
}
