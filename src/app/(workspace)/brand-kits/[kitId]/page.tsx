export default async function BrandKitDetailStubPage(props: {
  params: Promise<{ kitId: string }>;
}) {
  const { kitId } = await props.params;

  return (
    <main className="grow overflow-auto px-10 py-8">
      <h1 className="t-section">Brand kit</h1>
      <p className="mt-6 max-w-xl text-[color:var(--app-text-2)] t-caption">
        Editor for kit <span className="break-all">{kitId}</span> arrives with
        the brand kit screens from the Slideline spec.
      </p>
    </main>
  );
}
