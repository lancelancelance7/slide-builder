import { asc, count, desc, eq, sql } from "drizzle-orm";

import { db } from "~/server/db";
import { brandKits, decks } from "~/server/db/schema";

export const DEFAULT_BRAND_COLORS = {
  bg: "#0c0c0d",
  fg: "#ffffff",
  accent: "#ff4500",
  highlight: "#ffb38a",
} as const;

export const DEFAULT_FONT_STACK =
  '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

export const DEFAULT_IMAGE_STYLE =
  "Bold athletic photography, dramatic lighting, high contrast, premium gym aesthetic";

export async function countDecksForKit(
  database: typeof db,
  kitId: string,
): Promise<number> {
  const [row] = await database
    .select({ n: count() })
    .from(decks)
    .where(eq(decks.brandKitId, kitId));

  return Number(row?.n ?? 0);
}

export async function listBrandKitsWithDeckCounts(database: typeof db) {
  return database
    .select({
      id: brandKits.id,
      name: brandKits.name,
      colors: brandKits.colors,
      updatedAt: brandKits.updatedAt,
      createdAt: brandKits.createdAt,
      isDefault: brandKits.isDefault,
      deckCount: sql<number>`cast(count(${decks.id}) as int)`,
    })
    .from(brandKits)
    .leftJoin(decks, eq(decks.brandKitId, brandKits.id))
    .groupBy(brandKits.id)
    .orderBy(asc(brandKits.name));
}

export type BrandKitDetail = {
  kit: typeof brandKits.$inferSelect;
  deckCount: number;
  linkedDeckTitles: string[];
};

export async function getBrandKitDetail(
  database: typeof db,
  kitId: string,
): Promise<BrandKitDetail | null> {
  const kit = await database.query.brandKits.findFirst({
    where: eq(brandKits.id, kitId),
  });
  if (!kit) {
    return null;
  }

  const deckCount = await countDecksForKit(database, kitId);

  const titleRows = await database
    .select({ title: decks.title })
    .from(decks)
    .where(eq(decks.brandKitId, kitId))
    .orderBy(desc(decks.updatedAt))
    .limit(5);

  return {
    kit,
    deckCount,
    linkedDeckTitles: titleRows.map((r) => r.title),
  };
}
