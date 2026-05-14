"use client";

import type { DeckTabCounts } from "~/types/dashboard";

import type { SidebarBrandKit } from "./workspace-sidebar";
import { WorkspaceAppNav } from "./workspace-app-nav";
import { WorkspaceSidebar } from "./workspace-sidebar";

type WorkspaceShellProps = {
  children: React.ReactNode;
  counts: DeckTabCounts;
  brandKitsList: SidebarBrandKit[];
};

export function WorkspaceShell(props: WorkspaceShellProps) {
  return (
    <div className="flex min-h-dvh flex-col bg-[color:var(--app-bg)] text-[color:var(--app-text)]">
      <WorkspaceAppNav />
      <div className="flex min-h-0 flex-1">
        <WorkspaceSidebar
          counts={props.counts}
          brandKitsList={props.brandKitsList}
        />
        <div className="min-w-0 flex-1">{props.children}</div>
      </div>
    </div>
  );
}
