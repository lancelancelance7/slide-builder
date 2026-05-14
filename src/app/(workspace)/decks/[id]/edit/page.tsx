export default async function DeckEditStubPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  return (
    <main className="grow overflow-auto px-10 py-8">
      <h1 className="t-section">Slide editor</h1>
      <p className="mt-6 max-w-xl text-[color:var(--app-text-2)] t-caption">
        Editing surface for deck <span className="break-all">{id}</span> will
        load here once the slide canvas ships.
      </p>
    </main>
  );
}
