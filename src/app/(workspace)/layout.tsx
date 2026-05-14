import { asc } from "drizzle-orm";

import { WorkspaceShell } from "~/components/workspace/workspace-shell";
import { db } from "~/server/db";
import { brandKits } from "~/server/db/schema";
import { getDeckTabCounts } from "~/server/queries/deck-dashboard";

export default async function WorkspaceLayout(props: {
  children: React.ReactNode;
}) {
  const [counts, kitRows] = await Promise.all([
    getDeckTabCounts(db),
    db
      .select({
        id: brandKits.id,
        name: brandKits.name,
        colors: brandKits.colors,
      })
      .from(brandKits)
      .orderBy(asc(brandKits.name)),
  ]);

  const brandKitsList = kitRows.map((k) => ({
    id: k.id,
    name: k.name,
    accentHex: k.colors.accent,
  }));

  return (
    <WorkspaceShell counts={counts} brandKitsList={brandKitsList}>
      {props.children}
    </WorkspaceShell>
  );
}
