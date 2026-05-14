"use client";

import Link from "next/link";
import { MoreHorizontal } from "lucide-react";

import { DeckStatusBadge } from "~/components/dashboard/deck-status-badge";
import { DeckThumbnail } from "~/components/dashboard/deck-thumbnail";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { formatRelativeUpdatedAt } from "~/lib/format-relative-updated-at";
import { cn } from "~/lib/utils";
import type { RouterOutputs } from "~/trpc/react";

type DashboardDeck = RouterOutputs["deck"]["dashboard"]["decks"][number];

function subtitleForRow(row: DashboardDeck) {
  const slideLabel = `${row.slideCount} ${row.slideCount === 1 ? "slide" : "slides"}`;
  const audience = row.deck.settings.audience?.trim();
  if (audience) {
    return `${slideLabel} · ${audience}`;
  }
  return slideLabel;
}

function hrefForDeck(status: DashboardDeck["deck"]["status"], id: string) {
  if (status === "draft" || status === "planned") {
    return `/decks/${id}/plan`;
  }
  return `/decks/${id}/edit`;
}

export function DeckCard(props: { row: DashboardDeck }) {
  const href = hrefForDeck(props.row.deck.status, props.row.deck.id);
  const rawUpdated = props.row.deck.updatedAt;
  const updatedAt =
    rawUpdated !== null && rawUpdated !== undefined
      ? rawUpdated instanceof Date
        ? rawUpdated
        : new Date(rawUpdated)
      : props.row.deck.createdAt;

  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[10px] border-[color:var(--app-border)] border bg-[color:var(--app-surface)] shadow-[var(--app-shadow-soft)]",
      )}
    >
      <Link
        href={href}
        className="flex flex-col gap-3 p-3 transition-shadow hover:shadow-[var(--app-shadow-pop)]"
      >
        <DeckThumbnail row={props.row} />
        <div>
          <div className="truncate t-caption-b text-[color:var(--app-text)]">
            {props.row.deck.title}
          </div>
          <div className="mt-0.5 truncate t-caption text-[color:var(--app-text-2)]">
            {subtitleForRow(props.row)}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex max-w-[min(140px,55%)] items-center gap-1.5 truncate rounded-md border-[color:var(--app-border)] border bg-transparent px-2 py-0.5 shadow-[inset_0_0_0_1px_var(--app-border)]">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{
                backgroundColor: props.row.brandKit.colors.accent,
              }}
            />
            <span className="truncate t-caption text-[color:var(--app-text)]">
              {props.row.brandKit.name}
            </span>
          </span>
          <span className="flex-1" />
          <DeckStatusBadge status={props.row.deck.status} />
        </div>
      </Link>
      <div className="flex items-center gap-2 border-[color:var(--app-divider)] border-t px-3 pb-2 pt-2.5">
        <span className="t-micro text-[color:var(--app-text-2)]">
          {formatRelativeUpdatedAt(updatedAt)}
        </span>
        <span className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon-xs"
              className="text-[color:var(--app-text-3)]"
              aria-label="Deck actions"
              type="button"
            >
              <MoreHorizontal aria-hidden className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem disabled>Rename…</DropdownMenuItem>
            <DropdownMenuItem disabled>Duplicate…</DropdownMenuItem>
            <DropdownMenuItem disabled variant="destructive">
              Delete…
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
