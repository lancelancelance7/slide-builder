import { BrandKitsPageClient } from "~/components/brand-kit/brand-kits-page-client";
import { api, HydrateClient } from "~/trpc/server";

export default async function BrandKitsOverviewPage() {
  await api.brandKit.list.prefetch();

  return (
    <HydrateClient>
      <BrandKitsPageClient />
    </HydrateClient>
  );
}
