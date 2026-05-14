"use client";

import { usePathname } from "next/navigation";

import type { DeckTabCounts } from "~/types/dashboard";
import { cn } from "~/lib/utils";

import type { SidebarBrandKit } from "./workspace-sidebar";
import { WorkspaceAppNav } from "./workspace-app-nav";
import { WorkspaceSidebar } from "./workspace-sidebar";

type WorkspaceShellProps = {
  children: React.ReactNode;
  counts: DeckTabCounts;
  brandKitsList: SidebarBrandKit[];
};

function isDeckFullscreenEditorPath(pathname: string | null) {
  if (!pathname) return false;
  return /^\/decks\/[^/]+\/(edit|template|print)$/.test(pathname);
}

export function WorkspaceShell(props: WorkspaceShellProps) {
  const pathname = usePathname();
  const fullscreenEditor = isDeckFullscreenEditorPath(pathname);

  return (
    <div className="flex min-h-dvh flex-col bg-[color:var(--app-bg)] text-[color:var(--app-text)]">
      {!fullscreenEditor && <WorkspaceAppNav />}
      <div className={cn("flex min-h-0 flex-1", fullscreenEditor && "min-h-dvh")}>
        {!fullscreenEditor && (
          <WorkspaceSidebar
            counts={props.counts}
            brandKitsList={props.brandKitsList}
          />
        )}
        <div
          className={cn(
            "min-w-0 flex-1",
            fullscreenEditor && "flex min-h-0 flex-col",
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  );
}
