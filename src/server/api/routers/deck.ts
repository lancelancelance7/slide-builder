import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  getDeckTabCounts,
  listDecksForDashboard,
} from "~/server/queries/deck-dashboard";

const dashboardTabSchema = z.enum(["all", "aiPlans", "generated", "exported"]);
const dashboardSortSchema = z.enum(["updatedAt", "createdAt", "title"]);

export const deckRouter = createTRPCRouter({
  dashboard: publicProcedure
    .input(
      z.object({
        tab: dashboardTabSchema.default("all"),
        sort: dashboardSortSchema.default("updatedAt"),
      }),
    )
    .query(async ({ ctx, input }) => {
      const counts = await getDeckTabCounts(ctx.db);
      const decksList = await listDecksForDashboard(ctx.db, {
        tab: input.tab,
        sort: input.sort,
      });

      return { counts, decks: decksList };
    }),
});
