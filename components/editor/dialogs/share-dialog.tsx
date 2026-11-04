"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "cn";
import { Copy, Check, X, UserPlus, Link2, Users, Crown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { CollaboratorProfile, OwnerProfile } from "@/types/collaborator";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  isOwner: boolean;
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorProfile[]>([]);
  const [owner, setOwner] = useState<OwnerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<CollaboratorProfile | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);
  const suggestTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCollaborators = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`);
      const data = await res.json();
      if (res.ok) {
        setCollaborators(data.collaborators);
        setOwner(data.owner ?? null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    if (open) {
      setInviteEmail("");
      setError(null);
      setSuggestions([]);
      setShowSuggestions(false);
      fetchCollaborators();
    }
  }, [open, fetchCollaborators]);

  const handleEmailChange = (value: string) => {
    setInviteEmail(value);
    setError(null);

    if (suggestTimerRef.current) clearTimeout(suggestTimerRef.current);

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    suggestTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/users/search?q=${encodeURIComponent(value)}`);
        if (res.ok) {
          const data = await res.json();
          const emails: string[] = data.emails ?? [];
          setSuggestions(emails);
          setShowSuggestions(emails.length > 0);
        }
      } catch {
        // ignore suggestion failures
      }
    }, 300);
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;
    setIsInviting(true);
    setError(null);
    setShowSuggestions(false);
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to invite");
        return;
      }
      setCollaborators((prev) => [...prev, data.collaborator]);
      setInviteEmail("");
    } finally {
      setIsInviting(false);
    }
  };

  const confirmRemove = async () => {
    if (!pendingRemove) return;
    setIsRemoving(true);
    try {
      const res = await fetch(
        `/api/projects/${projectId}/collaborators/${pendingRemove.id}`,
        { method: "DELETE" },
      );
      if (res.ok) {
        setCollaborators((prev) => prev.filter((c) => c.id !== pendingRemove.id));
        setPendingRemove(null);
      }
    } finally {
      setIsRemoving(false);
    }
  };

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/editor/${projectId}`;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/editor/${projectId}`
      : `/editor/${projectId}`;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent showCloseButton={false} className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share project</DialogTitle>
            <DialogDescription className="truncate">{projectName}</DialogDescription>
          </DialogHeader>

          {isOwner && (
            <div className="flex flex-col gap-4 min-w-0">
              {/* Invite by email */}
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <UserPlus className="h-3.5 w-3.5 text-accent-primary" />
                  <p className="text-xs font-semibold text-accent-primary tracking-wide uppercase">
                    Invite by email
                  </p>
                </div>
                <div className="flex gap-2 min-w-0">
                  <div className="relative flex-1 min-w-0">
                    <Input
                      type="email"
                      placeholder="colleague@example.com"
                      value={inviteEmail}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleInvite();
                        if (e.key === "Escape") setShowSuggestions(false);
                      }}
                      onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                      onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
                      className={cn(
                        "w-full",
                        error && "border-state-error focus-visible:ring-state-error",
                      )}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                      <div className="absolute top-full left-0 right-0 z-10 mt-1 overflow-hidden rounded-lg border border-border-default bg-bg-surface shadow-md">
                        {suggestions.map((email) => (
                          <button
                            key={email}
                            type="button"
                            className="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-elevated"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setInviteEmail(email);
                              setSuggestions([]);
                              setShowSuggestions(false);
                              setError(null);
                            }}
                          >
                            {email}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleInvite}
                    disabled={!inviteEmail.trim() || isInviting}
                    size="icon"
                    className="shrink-0"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="sr-only">Invite</span>
                  </Button>
                </div>
                {error && <p className="text-xs text-state-error">{error}</p>}
              </div>

              {/* Shareable link */}
              <div className="flex flex-col gap-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5 text-accent-primary" />
                  <p className="text-xs font-semibold text-accent-primary tracking-wide uppercase">
                    Shareable link
                  </p>
                </div>
                <div className="flex items-center gap-2 rounded-lg border border-border-default bg-bg-elevated px-3 py-2 min-w-0 overflow-hidden">
                  <span className="flex-1 truncate text-xs font-mono text-text-muted min-w-0">
                    {shareLink}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={`h-6 w-6 shrink-0 ${copied ? "text-state-success" : "text-text-muted hover:text-text-primary"}`}
                    onClick={handleCopyLink}
                  >
                    {copied ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Owner row — visible to collaborators only */}
          {!isOwner && owner && (
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-1.5">
                <Crown className="h-3.5 w-3.5 text-accent-primary" />
                <p className="text-xs font-semibold text-accent-primary tracking-wide uppercase">
                  Owner
                </p>
              </div>
              <div className="flex items-center gap-2.5 rounded-lg px-2 py-1.5">
                <CollaboratorAvatar
                  email={owner.email}
                  name={owner.name}
                  imageUrl={owner.imageUrl}
                />
                <div className="flex flex-col flex-1 min-w-0">
                  {owner.name && (
                    <span className="text-sm text-text-primary truncate">{owner.name}</span>
                  )}
                  <span className="text-xs text-text-muted truncate">{owner.email}</span>
                </div>
              </div>
            </div>
          )}

          {/* Collaborators list */}
          <div className="flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-accent-primary" />
              <p className="text-xs font-semibold text-accent-primary tracking-wide uppercase">
                Collaborators
              </p>
            </div>
            {isLoading ? (
              <p className="text-xs text-text-muted py-2">Loading…</p>
            ) : collaborators.length === 0 ? (
              <p className="text-xs text-text-muted py-2">No collaborators yet.</p>
            ) : (
              <ul className="flex flex-col gap-0.5">
                {collaborators.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-bg-elevated"
                  >
                    <CollaboratorAvatar email={c.email} name={c.name} imageUrl={c.imageUrl} />
                    <div className="flex flex-col flex-1 min-w-0">
                      {c.name && (
                        <span className="text-sm text-text-primary truncate">{c.name}</span>
                      )}
                      <span className="text-xs text-text-muted truncate">{c.email}</span>
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="h-6 w-6 shrink-0 text-text-faint hover:text-state-error"
                        onClick={() => setPendingRemove(c)}
                      >
                        <X className="h-3.5 w-3.5" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <DialogFooter showCloseButton />
        </DialogContent>
      </Dialog>

      {/* Remove confirmation */}
      <Dialog
        open={pendingRemove !== null}
        onOpenChange={(open) => !open && setPendingRemove(null)}
      >
        <DialogContent showCloseButton={false} className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-state-error">Remove collaborator</DialogTitle>
            <DialogDescription>
              {pendingRemove?.name
                ? `${pendingRemove.name} (${pendingRemove.email})`
                : pendingRemove?.email}{" "}
              will lose access to this project.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPendingRemove(null)}
              disabled={isRemoving}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmRemove} disabled={isRemoving}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface CollaboratorAvatarProps {
  email: string;
  name: string | null;
  imageUrl: string | null;
}

function CollaboratorAvatar({ email, name, imageUrl }: CollaboratorAvatarProps) {
  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : email[0].toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name ?? email}
        className="h-7 w-7 rounded-full object-cover shrink-0"
      />
    );
  }

  return (
    <div className="h-7 w-7 rounded-full bg-bg-subtle border border-border-default flex items-center justify-center shrink-0">
      <span className="text-xs font-medium text-text-secondary">{initials}</span>
    </div>
  );
}
