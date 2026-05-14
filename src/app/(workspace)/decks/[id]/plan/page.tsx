import { DeckPlanPageClient } from "~/components/decks/plan/deck-plan-page-client";

export default async function DeckPlanPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return <DeckPlanPageClient deckId={id} />;
}
