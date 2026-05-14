"use client";

import type { RouterOutputs } from "~/trpc/react";

type DashboardDeck = RouterOutputs["deck"]["dashboard"]["decks"][number];

export function DeckThumbnail(props: { row: DashboardDeck }) {
  const accent = props.row.brandKit.colors.accent;
  const excerpt = props.row.deck.title.replace(/^.*? — /, "").slice(0, 42);
  const displayTitle = excerpt || props.row.deck.title.slice(0, 42);

  return (
    <div className="relative flex aspect-[248/140] flex-col overflow-hidden rounded-md border-[color:var(--app-border)] border bg-[color:var(--bg-card-light)] px-4 py-[14px] text-[color:var(--app-text)]">
      <div>
        <div
          className="t-micro-b uppercase opacity-90"
          style={{
            letterSpacing: "1.2px",
            color: accent,
          }}
        >
          {props.row.brandKit.name}
        </div>
        <div className="mt-2 truncate t-card">{displayTitle}</div>
      </div>
      <div className="mt-auto flex items-end gap-1 pb-6">
        <span className="h-1.5 w-[52px] rounded-sm bg-black/10" />
        <span className="h-1.5 w-[30px] rounded-sm bg-black/10" />
        <span
          className="h-1.5 w-[22px] rounded-sm"
          style={{ backgroundColor: accent }}
        />
      </div>
      <span className="absolute right-4 bottom-1.5 t-nano text-[color:var(--fg3)]">
        01 / {props.row.slideCount}
      </span>
    </div>
  );
}
