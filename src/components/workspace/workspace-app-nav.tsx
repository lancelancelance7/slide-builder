"use client";

import Link from "next/link";
import { Plus, Search } from "lucide-react";

import { Button } from "~/components/ui/button";

export function WorkspaceAppNav() {
  return (
    <header className="flex h-[length:var(--nav-height)] shrink-0 items-center gap-3 border-[color:var(--app-divider)] border-b px-6 bg-[color:var(--app-surface)] shadow-[var(--app-shadow-soft)]">
      <div className="flex items-center gap-2">
        <div className="flex size-7 items-center justify-center rounded-md bg-[color:var(--color-near-black)] font-medium text-[color:var(--color-white)]">
          S
        </div>
        <span className="t-caption-b text-[color:var(--app-text)]">
          Slideline
        </span>
      </div>
      <span className="text-[color:var(--app-text-3)]">/</span>
      <nav className="t-caption flex items-center gap-1">
        <span className="text-[color:var(--app-text)]">Decks</span>
      </nav>
      <div className="flex-1" />
      <div className="hidden max-w-[min(520px,calc(100vw-560px))] flex-1 items-center gap-2 rounded-lg border-[color:var(--app-border)] border bg-[color:var(--app-surface-2)] px-3 py-2 text-[color:var(--app-text-3)] md:flex lg:mr-16">
        <Search className="size-4 shrink-0" aria-hidden />
        <span className="t-caption grow text-[color:var(--app-text-3)]">
          Search decks &amp; kits
        </span>
        <kbd className="rounded border-[color:var(--app-border)] border bg-[color:var(--app-surface)] px-1 py-px t-micro text-[color:var(--app-text-3)]">
          ⌘K
        </kbd>
      </div>
      <div className="flex items-center gap-2">
        <Button asChild size="sm">
          <Link href="/decks/new">
            <Plus aria-hidden /> New deck
          </Link>
        </Button>
        <div className="flex size-9 items-center justify-center rounded-full bg-[color:var(--app-surface-2)] t-micro-b border-[color:var(--app-border)] border">
          CD
        </div>
      </div>
    </header>
  );
}
