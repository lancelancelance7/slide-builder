export default async function DeckPlanStubPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <main className="grow overflow-auto px-10 py-8">
      <h1 className="t-section">Plan review</h1>
      <p className="mt-6 max-w-xl text-[color:var(--app-text-2)] t-caption">
        AI plan preview for deck <span className="break-all">{id}</span>. This is
        a placeholder route — preprocess UI comes next (step 2 of 3).
      </p>
    </main>
  );
}
