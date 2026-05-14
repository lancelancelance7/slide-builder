import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

import { DeckPrintPageClient } from "~/components/decks/print/deck-print-page-client";
import { db } from "~/server/db";
import { decks } from "~/server/db/schema";

export default async function DeckPrintPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const deck = await db.query.decks.findFirst({
    where: eq(decks.id, id),
  });

  if (!deck) {
    redirect("/");
  }

  if (deck.status === "draft" || deck.status === "planned") {
    redirect(`/decks/${id}/plan`);
  }

  return (
    <div className="flex min-h-dvh flex-1 flex-col">
      <DeckPrintPageClient deckId={id} />
    </div>
  );
}
