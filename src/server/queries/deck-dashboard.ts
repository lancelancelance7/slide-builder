import type {
  DashboardSort,
  DashboardTab,
  DeckTabCounts,
} from "~/types/dashboard";

import {
  asc,
  desc,
  eq,
  inArray,
  or,
  sql,
  type SQL,
} from "drizzle-orm";

import { db } from "~/server/db";
import { brandKits, decks, slides } from "~/server/db/schema";

export async function getDeckTabCounts(database: typeof db): Promise<DeckTabCounts> {
  async function filteredCount(where?: SQL) {
    const q = database
      .select({ n: sql<number>`cast(count(*) as int)` })
      .from(decks);
    const [row] =
      where === undefined ? await q : await q.where(where);

    const value = Number(row?.n ?? 0);
    return Number.isFinite(value) ? value : 0;
  }

  const [all, aiPlans, generated, exported] = await Promise.all([
    filteredCount(),
    filteredCount(
      or(eq(decks.status, "draft"), eq(decks.status, "planned")),
    ),
    filteredCount(eq(decks.status, "generated")),
    filteredCount(eq(decks.status, "exported")),
  ]);

  return { all, aiPlans, generated, exported };
}

export type DeckDashboardRow = {
  deck: (typeof decks.$inferSelect);
  brandKit: (typeof brandKits.$inferSelect);
  slideCount: number;
};

export async function listDecksForDashboard(
  database: typeof db,
  opts: { tab: DashboardTab; sort: DashboardSort },
): Promise<DeckDashboardRow[]> {
  const filter: SQL | undefined =
    opts.tab === "all"
      ? undefined
      : opts.tab === "aiPlans"
        ? or(eq(decks.status, "draft"), eq(decks.status, "planned"))
        : opts.tab === "generated"
          ? eq(decks.status, "generated")
          : eq(decks.status, "exported");

  const baseQuery = database
    .select({
      deck: decks,
      brandKit: brandKits,
    })
    .from(decks)
    .innerJoin(brandKits, eq(decks.brandKitId, brandKits.id));

  const filtered =
    filter === undefined ? baseQuery : baseQuery.where(filter);

  const rows =
    opts.sort === "title"
      ? await filtered.orderBy(asc(decks.title))
      : opts.sort === "createdAt"
        ? await filtered.orderBy(desc(decks.createdAt))
        : await filtered.orderBy(desc(decks.updatedAt));

  if (rows.length === 0) {
    return [];
  }

  const deckIds = rows.map((r) => r.deck.id);

  const countRows = await database
    .select({
      deckId: slides.deckId,
      c: sql<number>`cast(count(*) as int)`,
    })
    .from(slides)
    .where(inArray(slides.deckId, deckIds))
    .groupBy(slides.deckId);

  const countMap = new Map(
    countRows.map((r) => [r.deckId, Number(r.c)]),
  );

  return rows.map((r) => ({
    ...r,
    slideCount: countMap.get(r.deck.id) ?? 0,
  }));
}
