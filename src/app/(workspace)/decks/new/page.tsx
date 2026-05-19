import { asc } from "drizzle-orm";
import Link from "next/link";

import { NewDeckPageClient } from "~/components/decks/new/new-deck-page-client";
import { Button } from "~/components/ui/button";
import { db } from "~/server/db";
import { brandKits } from "~/server/db/schema";

type PageProps = {
  searchParams: Promise<{ mode?: string }>;
};

export default async function NewDeckPage(props: PageProps) {
  const sp = await props.searchParams;

  const kitRows = await db
    .select({
      id: brandKits.id,
      name: brandKits.name,
      colors: brandKits.colors,
      isDefault: brandKits.isDefault,
    })
    .from(brandKits)
    .orderBy(asc(brandKits.name));

  if (kitRows.length === 0) {
    return (
      <main className="grow overflow-auto px-10 py-8">
        <div className="mx-auto max-w-[520px]">
          <h1 className="t-section text-(--app-text)">New deck</h1>
          <p className="t-body mt-4 text-(--app-text-2)">
            Link a brand kit before you can describe a deck — Slideline needs
            palettes, type, and imagery guidance to plan slides.
          </p>
          <Button asChild className="mt-6">
            <Link href="/brand-kits/new">Create a brand kit</Link>
          </Button>
        </div>
      </main>
    );
  }

  const brandKitsOpts = kitRows.map((k) => ({
    id: k.id,
    name: k.name,
    accentHex: k.colors.accent,
    isDefault: k.isDefault,
  }));

  const defaultBrandKitId =
    brandKitsOpts.find((k) => k.isDefault)?.id ?? brandKitsOpts[0]!.id;

  return (
    <NewDeckPageClient
      brandKits={brandKitsOpts}
      defaultBrandKitId={defaultBrandKitId}
      templateMode={sp.mode === "template"}
    />
  );
}
