import { EditorShell } from "@/components/editor/editor-shell";

export default function Home() {
  return (
    <EditorShell>
      <div className="flex h-full items-center justify-center">
        <p className="text-text-muted text-sm">Canvas area</p>
      </div>
    </EditorShell>
  );
}
