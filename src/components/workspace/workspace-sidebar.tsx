"use client";

import Link from "next/link";
import {
  LayoutTemplate,
  Palette,
  Plus,
  Presentation,
  Sparkles,
  Trash2,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "~/lib/utils";
import type { DeckTabCounts } from "~/types/dashboard";

export type SidebarBrandKit = {
  id: string;
  name: string;
  accentHex: string;
};

type WorkspaceSidebarProps = {
  counts: DeckTabCounts;
  brandKitsList: SidebarBrandKit[];
};

function SidebarRow(props: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
  count?: number;
  trailingDotColor?: string;
}) {
  return (
    <Link
      href={props.href}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[color:var(--app-hover)]",
        props.active &&
          "bg-[color:var(--app-selected)] ring-1 ring-[color:var(--app-selected-stroke)] ring-inset",
      )}
    >
      <span className="flex size-[18px] items-center justify-center text-[color:var(--app-text-2)]">
        {props.icon}
      </span>
      <span className="t-caption grow truncate text-[color:var(--app-text)]">
        {props.label}
      </span>
      {props.count !== undefined && (
        <span className="rounded-md bg-[color:var(--app-surface)] px-1.5 py-px font-mono t-micro text-[color:var(--app-text-3)]">
          {props.count}
        </span>
      )}
      {props.trailingDotColor !== undefined && (
        <span
          className="size-3 shrink-0 rounded-full ring-2 ring-[color:var(--app-border)]"
          style={{
            background: props.trailingDotColor,
          }}
        />
      )}
    </Link>
  );
}

export function WorkspaceSidebar(props: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const decksActive = pathname === "/" || pathname.startsWith("/decks/");

  return (
    <aside className="flex w-[220px] shrink-0 flex-col gap-1 border-[color:var(--app-divider)] border-r bg-[color:var(--app-surface-2)] py-5 pr-5 pl-4">
      <SidebarRow
        href="/"
        icon={<Presentation className="size-4" aria-hidden />}
        label="Recent"
        active={decksActive}
        count={props.counts.all}
      />
      <SidebarRow
        href="/#ai-plans"
        icon={<Sparkles className="size-4" aria-hidden />}
        label="AI plans"
        active={false}
        count={props.counts.aiPlans}
      />
      <SidebarRow
        href="/#templates"
        icon={<LayoutTemplate className="size-4" aria-hidden />}
        label="Templates"
        active={false}
      />
      <SidebarRow
        href="/#trash"
        icon={<Trash2 className="size-4" aria-hidden />}
        label="Trash"
        active={false}
      />

      <div className="pb-3 pt-5 t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
        Brand kits
      </div>
      <SidebarRow
        href="/brand-kits"
        icon={<Palette className="size-4" aria-hidden />}
        label="All kits"
        active={pathname === "/brand-kits"}
      />
      {props.brandKitsList.map((kit) => {
        const kitPath = `/brand-kits/${kit.id}`;
        return (
          <SidebarRow
            key={kit.id}
            href={kitPath}
            icon={<Presentation className="size-4 opacity-70" aria-hidden />}
            label={kit.name}
            active={pathname === kitPath}
            trailingDotColor={kit.accentHex}
          />
        );
      })}
      <Link
        href="/brand-kits/new"
        className="flex items-center gap-2 rounded-md px-3 py-2 transition-colors hover:bg-[color:var(--app-hover)]"
      >
        <Plus className="size-4 text-[color:var(--app-text-2)]" aria-hidden />
        <span className="t-caption truncate text-[color:var(--app-text)]">
          New brand kit
        </span>
      </Link>

      <div className="flex-1 min-h-[24px]" />
      <div className="rounded-md px-3 py-2 t-micro text-[color:var(--app-text-3)]">
        Slideline 0.8 · by CubDigital
      </div>
    </aside>
  );
}
