"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { CreateProjectDialog } from "@/components/editor/dialogs/create-project-dialog";
import { RenameProjectDialog } from "@/components/editor/dialogs/rename-project-dialog";
import { DeleteProjectDialog } from "@/components/editor/dialogs/delete-project-dialog";
import { Button } from "@/components/ui/button";
import { useProjectActions } from "@/hooks/use-project-actions";
import type { ProjectSummary } from "@/types/project";

interface EditorHomeProps {
  ownedProjects: ProjectSummary[];
  sharedProjects: ProjectSummary[];
}

export function EditorHome({ ownedProjects, sharedProjects }: EditorHomeProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
      />
      <ProjectSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        ownedProjects={ownedProjects}
        sharedProjects={sharedProjects}
        onNewProject={openCreate}
        onRenameProject={openRename}
        onDeleteProject={openDelete}
      />

      <main className="flex-1 flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-semibold text-text-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-text-muted">
          Start a new architecture workspace, or choose a project from the sidebar
        </p>
        <Button className="gap-2 mt-2" onClick={openCreate}>
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </main>

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
