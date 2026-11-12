"use client";

import { useCallback, useRef, useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { ShareDialog } from "@/components/editor/dialogs/share-dialog";
import { CanvasRoom } from "@/components/editor/canvas/canvas-room";
import { AiSidebar } from "@/components/editor/ai-sidebar";
import { useProjectActions } from "@/hooks/use-project-actions";
import { type SaveStatus } from "@/hooks/use-autosave";
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
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveFnRef = useRef<(() => Promise<void>) | null>(null);
  const handleSaveReady = useCallback((fn: () => Promise<void>) => { saveFnRef.current = fn; }, []);
  const handleManualSave = useCallback(() => { saveFnRef.current?.(); }, []);

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
        saveStatus={saveStatus}
        onSave={handleManualSave}
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

        <main className="flex-1 overflow-hidden bg-bg-base">
          <CanvasRoom roomId={project.id} onSaveStatusChange={setSaveStatus} onSaveReady={handleSaveReady} />
        </main>

        <div
          className="overflow-hidden transition-[max-width] duration-300 ease-in-out"
          style={{ maxWidth: aiSidebarOpen ? "320px" : "0px" }}
        >
          <AiSidebar />
        </div>
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
