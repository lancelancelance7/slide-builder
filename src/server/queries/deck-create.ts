import { asc, eq } from "drizzle-orm";

import { db } from "~/server/db";
import { brandKits } from "~/server/db/schema";

export async function resolveBrandKitForNewDeck(
  database: typeof db,
  preferredId?: string,
): Promise<{ id: string }> {
  if (preferredId) {
    const [row] = await database
      .select({ id: brandKits.id })
      .from(brandKits)
      .where(eq(brandKits.id, preferredId))
      .limit(1);
    if (!row) {
      throw new Error("INVALID_BRAND_KIT");
    }
    return row;
  }

  const [defaults] = await database
    .select({ id: brandKits.id })
    .from(brandKits)
    .where(eq(brandKits.isDefault, true))
    .limit(1);

  if (defaults) {
    return defaults;
  }

  const [anyKit] = await database
    .select({ id: brandKits.id })
    .from(brandKits)
    .orderBy(asc(brandKits.name))
    .limit(1);

  if (!anyKit) {
    throw new Error("NO_BRAND_KITS");
  }
  return anyKit;
}
