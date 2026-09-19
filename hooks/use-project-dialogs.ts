"use client";

import { useState, useCallback } from "react";
import { Project } from "@/types/project";

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

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "My Architecture", slug: "my-architecture", owned: true },
  { id: "2", name: "Shared Design", slug: "shared-design", owned: false },
];

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(MOCK_PROJECTS);
  const [dialog, setDialog] = useState<DialogType>(null);
  const [targetProject, setTargetProject] = useState<Project | null>(null);
  const [createName, setCreateName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createSlug = toSlug(createName);

  const openCreate = useCallback(() => {
    setCreateName("");
    setDialog("create");
  }, []);

  const openRename = useCallback((project: Project) => {
    setTargetProject(project);
    setRenameName(project.name);
    setDialog("rename");
  }, []);

  const openDelete = useCallback((project: Project) => {
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
    await new Promise((r) => setTimeout(r, 300));
    const newProject: Project = {
      id: crypto.randomUUID(),
      name: createName.trim(),
      slug: toSlug(createName.trim()),
      owned: true,
    };
    setProjects((prev) => [...prev, newProject]);
    setIsSubmitting(false);
    closeDialog();
  }, [createName, closeDialog]);

  const submitRename = useCallback(async () => {
    if (!renameName.trim() || !targetProject) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    setProjects((prev) =>
      prev.map((p) =>
        p.id === targetProject.id
          ? { ...p, name: renameName.trim(), slug: toSlug(renameName.trim()) }
          : p
      )
    );
    setIsSubmitting(false);
    closeDialog();
  }, [renameName, targetProject, closeDialog]);

  const submitDelete = useCallback(async () => {
    if (!targetProject) return;
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 300));
    setProjects((prev) => prev.filter((p) => p.id !== targetProject.id));
    setIsSubmitting(false);
    closeDialog();
  }, [targetProject, closeDialog]);

  return {
    projects,
    dialog,
    targetProject,
    createName,
    setCreateName,
    createSlug,
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
