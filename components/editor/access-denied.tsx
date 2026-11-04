import Link from "next/link";
import { Lock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function AccessDenied() {
  return (
    <div className="flex flex-col h-screen items-center justify-center gap-4 bg-bg-base">
      <Lock className="h-10 w-10 text-text-muted" />
      <h1 className="text-lg font-semibold text-text-primary">Access denied</h1>
      <p className="text-sm text-text-muted text-center max-w-xs">
        This project doesn&apos;t exist or you don&apos;t have permission to view it.
      </p>
      <Link href="/editor" className={buttonVariants({ variant: "outline" })}>
        Back to projects
      </Link>
    </div>
  );
}
