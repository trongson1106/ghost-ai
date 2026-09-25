"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { ProjectSummary } from "@/types/project";

type DialogType = "create" | "rename" | "delete" | null;

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function useProjectActions() {
  const router = useRouter();
  const [dialog, setDialog] = useState<DialogType>(null);
  const [targetProject, setTargetProject] = useState<ProjectSummary | null>(null);
  const [createName, setCreateName] = useState("");
  const [createSuffix, setCreateSuffix] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const slug = toSlug(createName);
  const roomId = slug ? `${slug}-${createSuffix}` : createSuffix;

  const openCreate = useCallback(() => {
    setCreateName("");
    setCreateSuffix(Math.random().toString(36).slice(2, 6));
    setDialog("create");
  }, []);

  const openRename = useCallback((project: ProjectSummary) => {
    setTargetProject(project);
    setRenameName(project.name);
    setDialog("rename");
  }, []);

  const openDelete = useCallback((project: ProjectSummary) => {
    setTargetProject(project);
    setDialog("delete");
  }, []);

  const closeDialog = useCallback(() => {
    setDialog(null);
    setTargetProject(null);
  }, []);

  const submitCreate = useCallback(async () => {
    if (!createName.trim()) return;
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: createName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create project");
      closeDialog();
      router.push(`/editor/${data.project.id}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [createName, closeDialog, router]);

  const submitRename = useCallback(async () => {
    if (!renameName.trim() || !targetProject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: renameName.trim() }),
      });
      if (!res.ok) throw new Error("Failed to rename project");
      closeDialog();
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }, [renameName, targetProject, closeDialog, router]);

  const submitDelete = useCallback(async () => {
    if (!targetProject) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/projects/${targetProject.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      closeDialog();
      const segments = window.location.pathname.split("/");
      if (segments[2] === targetProject.id) {
        router.push("/editor");
      } else {
        router.refresh();
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [targetProject, closeDialog, router]);

  return {
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
  };
}
