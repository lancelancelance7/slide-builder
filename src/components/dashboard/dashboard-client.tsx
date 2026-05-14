"use client";

import { useState } from "react";
import { ChevronDown, LayoutGrid } from "lucide-react";

import { DeckCard } from "~/components/dashboard/deck-card";
import { NewDeckHero } from "~/components/dashboard/new-deck-hero";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Spinner } from "~/components/ui/spinner";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";
import type { DashboardSort, DashboardTab } from "~/types/dashboard";

const TAB_DEFS: { id: DashboardTab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "aiPlans", label: "AI plans" },
  { id: "generated", label: "Generated" },
  { id: "exported", label: "PDF exported" },
];

const SORT_LABELS: Record<DashboardSort, string> = {
  updatedAt: "Last edited",
  createdAt: "Created",
  title: "Title",
};

export function DashboardClient() {
  const [tab, setTab] = useState<DashboardTab>("all");
  const [sort, setSort] = useState<DashboardSort>("updatedAt");

  const dashboard = api.deck.dashboard.useQuery({ tab, sort });
  const data = dashboard.data;

  return (
    <main className="grow overflow-auto px-10 pb-10 pt-8">
      <div className="mb-4 flex flex-wrap items-baseline gap-6">
        <h1 className="t-nav">Recent decks</h1>
        <div className="flex-1" />
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" size="sm" type="button">
            <LayoutGrid aria-hidden />
            Grid
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" type="button">
                Sort: {SORT_LABELS[sort]}
                <ChevronDown aria-hidden className="size-4 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {(Object.entries(SORT_LABELS) as [DashboardSort, string][]).map(
                ([key, label]) => (
                  <DropdownMenuItem key={key} onSelect={() => setSort(key)}>
                    {label}
                  </DropdownMenuItem>
                ),
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {data && (
        <p className="mb-16 max-w-[580px] text-[color:var(--app-text-2)] t-caption">
          {data.counts.all}{" "}
          {data.counts.all === 1 ? "deck" : "decks"} in your workspace. Drafts
          hold the AI plan; generated decks keep their version history.
        </p>
      )}

      {!data && dashboard.isPending && (
        <div className="flex justify-center pt-28">
          <Spinner className="size-10" />
        </div>
      )}

      {data && (
        <>
          <nav className="mt-8 flex gap-14 border-[color:var(--app-divider)] border-b">
            {TAB_DEFS.map((t) => {
              const active = tab === t.id;
              const countBadge = data.counts[t.id];
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "relative flex cursor-pointer items-center gap-6 pb-[10px] transition-colors hover:text-[color:var(--app-text)] t-caption",
                    active &&
                      "font-medium text-[color:var(--app-text)] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:rounded-[1px] after:bg-[color:var(--color-accent)]",
                    !active &&
                      "font-normal text-[color:var(--app-text-2)]",
                  )}
                >
                  {t.label}
                  <span className="rounded-md bg-[color:var(--app-surface)] px-[6px] py-px font-mono t-micro text-[color:var(--app-text-3)]">
                    {countBadge}
                  </span>
                </button>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4",
              dashboard.isFetching && "opacity-70 transition-opacity duration-150",
            )}
          >
            <NewDeckHero />
            {data.decks.map((row) => (
              <DeckCard key={row.deck.id} row={row} />
            ))}
            {data.decks.length === 0 && (
              <div className="col-span-full rounded-[length:var(--radius-standard)] border-[color:var(--app-border)] border border-dashed bg-[color:var(--app-surface)] px-12 py-10 text-center shadow-[var(--app-shadow-soft)]">
                <p className="t-body text-[color:var(--app-text-2)]">
                  No decks in this filter yet.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </main>
  );
}
