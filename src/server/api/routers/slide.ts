import { TRPCError } from "@trpc/server";
import { and, asc, eq, max } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { decks, slides } from "~/server/db/schema";
import {
  defaultContentForLayout,
  normalizeContentForPersist,
  slideLayoutSchema,
  type SlideLayoutId,
} from "~/lib/slide-plan";

const uuid = z.string().uuid();

function pickLayout(
  requested: SlideLayoutId | undefined,
  allowed: string[] | undefined,
): SlideLayoutId {
  if (
    requested &&
    (!allowed || allowed.length === 0 || allowed.includes(requested))
  ) {
    return requested;
  }
  if (allowed && allowed.length > 0) {
    const first = allowed[0];
    const parsed = slideLayoutSchema.safeParse(first);
    if (parsed.success) return parsed.data;
  }
  return "imageText";
}

export const slideRouter = createTRPCRouter({
  planBundle: publicProcedure
    .input(z.object({ deckId: uuid }))
    .query(async ({ ctx, input }) => {
      const deck = await ctx.db.query.decks.findFirst({
        where: eq(decks.id, input.deckId),
        with: { brandKit: true },
      });

      if (!deck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deck not found.",
        });
      }

      const slideRows = await ctx.db
        .select()
        .from(slides)
        .where(eq(slides.deckId, input.deckId))
        .orderBy(asc(slides.position));

      return {
        deck: {
          id: deck.id,
          title: deck.title,
          status: deck.status,
          settings: deck.settings,
          prompt: deck.prompt,
        },
        brandKit: {
          id: deck.brandKit.id,
          name: deck.brandKit.name,
          imageStyle: deck.brandKit.imageStyle,
          tone: deck.brandKit.tone,
        },
        slides: slideRows.map((s) => ({
          id: s.id,
          position: s.position,
          layout: s.layout,
          content: s.content,
          imagePrompt: s.imagePrompt,
          speakerNotes: s.speakerNotes,
        })),
      };
    }),

  update: publicProcedure
    .input(
      z.object({
        slideId: uuid,
        layout: slideLayoutSchema.optional(),
        content: z.record(z.unknown()).optional(),
        imagePrompt: z.string().max(12000).optional(),
        speakerNotes: z.string().max(12000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.query.slides.findFirst({
        where: eq(slides.id, input.slideId),
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slide not found.",
        });
      }

      const layout = input.layout ?? row.layout;
      const layoutParsed = slideLayoutSchema.safeParse(layout);
      if (!layoutParsed.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid slide layout.",
        });
      }

      let nextContent: Record<string, unknown> = row.content;
      if (input.content !== undefined) {
        nextContent = normalizeContentForPersist(
          layoutParsed.data,
          input.content,
        );
      }

      await ctx.db
        .update(slides)
        .set({
          layout: layoutParsed.data,
          content: nextContent,
          ...(input.imagePrompt !== undefined && {
            imagePrompt: input.imagePrompt,
          }),
          ...(input.speakerNotes !== undefined && {
            speakerNotes: input.speakerNotes,
          }),
        })
        .where(eq(slides.id, input.slideId));
    }),

  reorder: publicProcedure
    .input(
      z.object({
        deckId: uuid,
        orderedSlideIds: z.array(uuid),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deckRows = await ctx.db
        .select({ id: slides.id })
        .from(slides)
        .where(eq(slides.deckId, input.deckId));

      const idSet = new Set(deckRows.map((s) => s.id));

      if (input.orderedSlideIds.length !== idSet.size) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Reorder must include every slide once.",
        });
      }

      for (const id of input.orderedSlideIds) {
        if (!idSet.has(id)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid slide id for this deck.",
          });
        }
      }

      await ctx.db.transaction(async (tx) => {
        for (let i = 0; i < input.orderedSlideIds.length; i++) {
          const sid = input.orderedSlideIds[i]!;
          await tx
            .update(slides)
            .set({ position: i })
            .where(and(eq(slides.id, sid), eq(slides.deckId, input.deckId)));
        }
      });
    }),

  add: publicProcedure
    .input(
      z.object({
        deckId: uuid,
        layout: slideLayoutSchema.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const deck = await ctx.db.query.decks.findFirst({
        where: eq(decks.id, input.deckId),
      });

      if (!deck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deck not found.",
        });
      }

      const allowed = deck.settings.layoutsAllowed;
      const layout = pickLayout(input.layout, allowed);

      const [agg] = await ctx.db
        .select({ m: max(slides.position) })
        .from(slides)
        .where(eq(slides.deckId, input.deckId));

      const nextPos = (agg?.m ?? -1) + 1;
      const defaults = defaultContentForLayout(layout);

      const [inserted] = await ctx.db
        .insert(slides)
        .values({
          deckId: input.deckId,
          position: nextPos,
          layout,
          content: defaults as Record<string, unknown>,
          imagePrompt: "",
          speakerNotes: "",
          templateOverrides: {},
        })
        .returning({ id: slides.id });

      if (!inserted) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Could not add slide.",
        });
      }

      return inserted;
    }),

  remove: publicProcedure
    .input(z.object({ slideId: uuid }))
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.query.slides.findFirst({
        where: eq(slides.id, input.slideId),
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slide not found.",
        });
      }

      const deckId = row.deckId;

      await ctx.db.delete(slides).where(eq(slides.id, input.slideId));

      const rest = await ctx.db
        .select({ id: slides.id })
        .from(slides)
        .where(eq(slides.deckId, deckId))
        .orderBy(asc(slides.position));

      await ctx.db.transaction(async (tx) => {
        for (let i = 0; i < rest.length; i++) {
          await tx
            .update(slides)
            .set({ position: i })
            .where(eq(slides.id, rest[i]!.id));
        }
      });
    }),
});
