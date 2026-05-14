import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { decks, type DeckSettings } from "~/server/db/schema";
import { resolveBrandKitForNewDeck } from "~/server/queries/deck-create";
import {
  getDeckTabCounts,
  listDecksForDashboard,
} from "~/server/queries/deck-dashboard";

const dashboardTabSchema = z.enum(["all", "aiPlans", "generated", "exported"]);
const dashboardSortSchema = z.enum(["updatedAt", "createdAt", "title"]);

const slideLayoutIdSchema = z.enum([
  "title",
  "section",
  "imageText",
  "quote",
  "comparison",
  "statHero",
  "closing",
]);

const deckSettingsInputSchema = z
  .object({
    slideCount: z.number().int().min(4).max(30),
    slideCountMin: z.number().int().min(4).max(30),
    slideCountMax: z.number().int().min(4).max(30),
    audience: z.string().max(500),
    tone: z.enum(["direct", "warm", "technical"]),
    layoutsAllowed: z.array(slideLayoutIdSchema).min(1),
    imagePolicy: z.enum(["generatePrompts", "omit", "placeholders"]),
    speakerNotesPolicy: z.enum(["none", "short", "full"]),
    requirePlanReview: z.boolean(),
  })
  .refine((s) => s.slideCountMin <= s.slideCountMax, {
    message: "Slide count minimum cannot exceed maximum.",
    path: ["slideCountMin"],
  })
  .refine(
    (s) =>
      s.slideCount >= s.slideCountMin && s.slideCount <= s.slideCountMax,
    { message: "Target slide count must fall within the min–max range.", path: ["slideCount"] },
  );

export const deckRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        title: z.string().trim().min(1).max(200),
        prompt: z.string().trim().min(1).max(1200),
        brandKitId: z.string().uuid().optional(),
        settings: deckSettingsInputSchema,
        afterCreate: z.enum(["dashboard", "plan"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let kitId: string;
      try {
        ({ id: kitId } = await resolveBrandKitForNewDeck(
          ctx.db,
          input.brandKitId,
        ));
      } catch (e) {
        const code = e instanceof Error ? e.message : "";
        if (code === "INVALID_BRAND_KIT") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "That brand kit was not found.",
          });
        }
        if (code === "NO_BRAND_KITS") {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: "Create a brand kit before adding decks.",
          });
        }
        throw e;
      }

      const settingsPayload: DeckSettings = {
        slideCount: input.settings.slideCount,
        slideCountMin: input.settings.slideCountMin,
        slideCountMax: input.settings.slideCountMax,
        audience: input.settings.audience.trim() || undefined,
        tone: input.settings.tone,
        layoutsAllowed: input.settings.layoutsAllowed,
        imagePolicy: input.settings.imagePolicy,
        speakerNotesPolicy: input.settings.speakerNotesPolicy,
        requirePlanReview: input.settings.requirePlanReview,
      };

      const [row] = await ctx.db
        .insert(decks)
        .values({
          brandKitId: kitId,
          title: input.title,
          prompt: input.prompt,
          status: input.afterCreate === "plan" ? "planned" : "draft",
          settings: settingsPayload,
          templateConfig: {},
        })
        .returning({ id: decks.id });

      if (!row) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not create deck.",
        });
      }

      return { id: row.id };
    }),

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
