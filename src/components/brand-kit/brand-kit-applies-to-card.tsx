"use client";

import Link from "next/link";

export function BrandKitAppliesToCard(props: {
  kitName: string;
  deckCount: number;
  linkedDeckTitles: string[];
}) {
  const preview =
    props.linkedDeckTitles.length > 0
      ? `${props.linkedDeckTitles.slice(0, 3).join(", ")}${props.deckCount > 3 ? ` and ${props.deckCount - 3} more` : ""}.`
      : "No decks reference this kit yet.";

  return (
    <div className="rounded-[10px] border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-3">
      <div className="mb-1 flex items-center gap-2">
        <span className="t-caption-b text-[color:var(--app-text)]">
          Applies to
        </span>
        <span className="flex-1" />
        <Link href="/" className="t-caption text-[color:var(--color-accent)] hover:underline">
          Open decks
        </Link>
      </div>
      <p className="text-[color:var(--app-text-2)] t-caption">
        {props.kitName} · {props.deckCount}{" "}
        {props.deckCount === 1 ? "deck" : "decks"}.
      </p>
      <p className="mt-2 text-[color:var(--app-text-2)] t-caption">{preview}</p>
    </div>
  );
}
