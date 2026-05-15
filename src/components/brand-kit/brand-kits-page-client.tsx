"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import { formatRelativeUpdatedAt } from "~/lib/format-relative-updated-at";
import { cn } from "~/lib/utils";
import { api } from "~/trpc/react";

export function BrandKitsPageClient() {
  const listQuery = api.brandKit.list.useQuery();

  return (
    <main className="grow overflow-auto px-10 py-8">
      <div className="mb-10 flex flex-wrap items-end gap-6">
        <div className="min-w-[200px] flex-1">
          <h1 className="t-section text-[color:var(--app-text)]">Brand kits</h1>
          <p className="t-caption mt-4 max-w-xl text-[color:var(--app-text-2)]">
            Reusable palettes, typography, tone, and imagery guides feed deck
            planning and slide rendering.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/brand-kits/new">
            <Plus aria-hidden /> New brand kit
          </Link>
        </Button>
      </div>

      {!listQuery.data && listQuery.isPending && (
        <div className="flex justify-center pt-28">
          <Spinner className="size-10" />
        </div>
      )}

      {listQuery.data?.length === 0 && (
        <div className="rounded-xl border border-dashed border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-8 py-16 text-center">
          <p className="t-body text-[color:var(--app-text-2)]">
            No kits yet — create one to anchor decks visually.
          </p>
          <Button asChild className="mt-6" size="sm">
            <Link href="/brand-kits/new">Create kit</Link>
          </Button>
        </div>
      )}

      {listQuery.data && listQuery.data.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {listQuery.data.map((row) => (
            <li key={row.id}>
              <Link
                href={`/brand-kits/${row.id}`}
                className={cn(
                  "flex flex-col gap-3 rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-5 shadow-[var(--app-shadow-soft)] transition-colors hover:bg-[color:var(--app-hover)]",
                  row.isDefault &&
                    "ring-1 ring-[color:var(--color-accent)] ring-inset",
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-1 size-4 shrink-0 rounded-full ring-2 ring-[color:var(--app-border)]"
                    style={{ backgroundColor: row.accentHex }}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="t-card truncate text-[color:var(--app-text)]">
                      {row.name}
                    </p>
                    <p className="t-caption mt-1 text-[color:var(--app-text-2)]">
                      {row.deckCount} {row.deckCount === 1 ? "deck" : "decks"}
                      {row.updatedAt != null && (
                        <> · Updated {formatRelativeUpdatedAt(row.updatedAt)}</>
                      )}
                    </p>
                  </div>
                  {row.isDefault && (
                    <span className="t-micro shrink-0 rounded-full bg-[color:var(--app-selected)] px-2 py-px text-[color:var(--app-text)]">
                      Default
                    </span>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
