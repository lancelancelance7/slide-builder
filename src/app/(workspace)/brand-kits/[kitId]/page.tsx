import { notFound } from "next/navigation";

import { BrandKitEditorClient } from "~/components/brand-kit/brand-kit-editor-client";
import { db } from "~/server/db";
import { getBrandKitDetail } from "~/server/queries/brand-kit";
import { api, HydrateClient } from "~/trpc/server";

export default async function BrandKitDetailPage(props: {
  params: Promise<{ kitId: string }>;
}) {
  const { kitId } = await props.params;

  const detail = await getBrandKitDetail(db, kitId);
  if (!detail) {
    notFound();
  }

  await api.brandKit.byId.prefetch({ id: kitId });

  return (
    <HydrateClient>
      <BrandKitEditorClient kitId={kitId} />
    </HydrateClient>
  );
}
