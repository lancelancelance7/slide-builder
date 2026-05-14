import { DashboardClient } from "~/components/dashboard/dashboard-client";
import { api, HydrateClient } from "~/trpc/server";

export default async function DashboardPage() {
  await api.deck.dashboard.prefetch({ tab: "all", sort: "updatedAt" });

  return (
    <HydrateClient>
      <DashboardClient />
    </HydrateClient>
  );
}
