"use client";

import { cn } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/react";

type DeckRow = RouterOutputs["deck"]["dashboard"]["decks"][number]["deck"];
type DeckStatus = DeckRow["status"];

const STATUS_META: Record<
  DeckStatus,
  { label: string; className?: string }
> = {
  draft: {
    label: "AI plan ready",
    className: "text-[color:var(--color-accent)]",
  },
  planned: {
    label: "AI plan ready",
    className: "text-[color:var(--color-accent)]",
  },
  generated: { label: "Generated" },
  edited: { label: "Edited" },
  exported: {
    label: "PDF exported",
    className: "text-[#0a6f3c]",
  },
};

export function DeckStatusBadge(props: { status: DeckStatus }) {
  const meta = STATUS_META[props.status];
  return (
    <span
      className={cn(
        "t-micro-b text-[color:var(--app-text)]",
        meta.className,
      )}
    >
      {meta.label}
    </span>
  );
}
