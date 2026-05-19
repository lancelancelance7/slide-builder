import { TRPCError } from "@trpc/server";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  generateDeckPlanViaOpenAi,
  rewriteSlideViaOpenAi,
} from "~/server/ai/deck-plan-openai";
import { generateAndPersistSlideImage } from "~/server/ai/slide-image-openai";
import { db } from "~/server/db";
import { decks, slides } from "~/server/db/schema";
import {
  OPENAI_CHAT_MODEL_DEFAULT,
  openAiChatModelSchema,
  type OpenAiChatModel,
} from "~/lib/openai-chat-model";
import {
  OPENAI_IMAGE_MODEL_DEFAULT,
  openAiImageModelSchema,
} from "~/lib/openai-image-model";
import {
  aiRowToStoredContent,
  slideLayoutSchema,
  type AiPlanSlideRow,
} from "~/lib/slide-plan";

const uuid = z.string().uuid();

type Database = typeof db;

const comparisonContentSchema = z.object({
  columns: z.array(
    z.object({
      heading: z.string(),
      rows: z.array(z.string()),
    }),
  ),
});

const quoteContentSchema = z.object({
  text: z.string(),
  author: z.string().optional(),
});

const statContentSchema = z.object({
  number: z.string(),
  label: z.string(),
});

function slideRowToAiPlanRow(row: typeof slides.$inferSelect): AiPlanSlideRow {
  const layout = slideLayoutSchema.parse(row.layout);
  const c = row.content;

  const quoteParsed = quoteContentSchema.safeParse(c.quote);
  const comparisonParsed = comparisonContentSchema.safeParse(c.comparison);
  const statParsed = statContentSchema.safeParse(c.stat);

  return {
    layout,
    title: typeof c.title === "string" ? c.title : "",
    body: typeof c.body === "string" ? c.body : null,
    bullets: Array.isArray(c.bullets)
      ? c.bullets.filter((x): x is string => typeof x === "string")
      : null,
    quote: quoteParsed.success
      ? {
          text: quoteParsed.data.text,
          author: quoteParsed.data.author ?? null,
        }
      : null,
    comparison: comparisonParsed.success ? comparisonParsed.data : null,
    stat: statParsed.success ? statParsed.data : null,
    imagePrompt: row.imagePrompt,
    speakerNotes: row.speakerNotes.length > 0 ? row.speakerNotes : null,
  };
}

async function persistPlanSlides(
  db: Database,
  deckId: string,
  planSlides: AiPlanSlideRow[],
) {
  await db.delete(slides).where(eq(slides.deckId, deckId));

  for (let i = 0; i < planSlides.length; i++) {
    const s = planSlides[i]!;
    await db.insert(slides).values({
      deckId,
      position: i,
      layout: s.layout,
      content: aiRowToStoredContent(s),
      imagePrompt: s.imagePrompt,
      speakerNotes: s.speakerNotes ?? "",
      templateOverrides: {},
    });
  }
}

async function executePlanDeck(
  database: Database,
  deckId: string,
  model: OpenAiChatModel,
) {
  const deck = await database.query.decks.findFirst({
    where: eq(decks.id, deckId),
    with: { brandKit: true },
  });

  if (!deck) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Deck not found.",
    });
  }

  try {
    const plan = await generateDeckPlanViaOpenAi({
      model,
      deckTitle: deck.title,
      deckPrompt: deck.prompt,
      settings: deck.settings,
      brandKit: {
        name: deck.brandKit.name,
        tone: deck.brandKit.tone,
        imageStyle: deck.brandKit.imageStyle,
        colors: deck.brandKit.colors,
      },
    });

    await persistPlanSlides(database, deck.id, plan.slides);

    await database
      .update(decks)
      .set({ status: "planned" })
      .where(eq(decks.id, deck.id));
  } catch (e) {
    if (e instanceof TRPCError) throw e;
    const msg = e instanceof Error ? e.message : "Planning failed.";
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: msg,
    });
  }
}

export const aiRouter = createTRPCRouter({
  planDeck: publicProcedure
    .input(
      z.object({
        deckId: uuid,
        model: openAiChatModelSchema.default(OPENAI_CHAT_MODEL_DEFAULT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await executePlanDeck(ctx.db, input.deckId, input.model);
    }),

  regeneratePlan: publicProcedure
    .input(
      z.object({
        deckId: uuid,
        model: openAiChatModelSchema.default(OPENAI_CHAT_MODEL_DEFAULT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await executePlanDeck(ctx.db, input.deckId, input.model);
    }),

  rewriteSlide: publicProcedure
    .input(
      z.object({
        slideId: uuid,
        model: openAiChatModelSchema.default(OPENAI_CHAT_MODEL_DEFAULT),
        focus: z
          .enum(["title", "body", "bullets", "image", "notes", "all"])
          .default("all"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.query.slides.findFirst({
        where: eq(slides.id, input.slideId),
        with: {
          deck: {
            with: { brandKit: true },
          },
        },
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slide not found.",
        });
      }

      const current = slideRowToAiPlanRow(row);

      try {
        const { slide } = await rewriteSlideViaOpenAi({
          model: input.model,
          focus: input.focus,
          slide: current,
          deckTitle: row.deck.title,
          deckPrompt: row.deck.prompt,
          settings: row.deck.settings,
          brandKit: {
            name: row.deck.brandKit.name,
            tone: row.deck.brandKit.tone,
            imageStyle: row.deck.brandKit.imageStyle,
          },
        });

        await ctx.db
          .update(slides)
          .set({
            layout: slide.layout,
            content: aiRowToStoredContent(slide),
            imagePrompt: slide.imagePrompt,
            speakerNotes: slide.speakerNotes ?? "",
          })
          .where(eq(slides.id, row.id));
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        const msg = e instanceof Error ? e.message : "Rewrite failed.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: msg,
        });
      }
    }),

  generateSlideImage: publicProcedure
    .input(
      z.object({
        slideId: uuid,
        prompt: z.string().min(1).max(4000),
        model: openAiImageModelSchema.default(OPENAI_IMAGE_MODEL_DEFAULT),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const row = await ctx.db.query.slides.findFirst({
        where: eq(slides.id, input.slideId),
        with: {
          deck: {
            with: { brandKit: true },
          },
        },
      });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Slide not found.",
        });
      }

      try {
        return await generateAndPersistSlideImage({
          slideId: row.id,
          model: input.model,
          prompt: input.prompt,
          imageStyle: row.deck.brandKit.imageStyle,
        });
      } catch (e) {
        if (e instanceof TRPCError) throw e;
        const msg =
          e instanceof Error ? e.message : "Image generation failed.";
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: msg,
        });
      }
    }),

  generateSlides: publicProcedure
    .input(z.object({ deckId: uuid }))
    .mutation(async ({ ctx, input }) => {
      const [agg] = await ctx.db
        .select({ c: sql<number>`cast(count(*) as int)` })
        .from(slides)
        .where(eq(slides.deckId, input.deckId));

      const n = Number(agg?.c ?? 0);
      if (!Number.isFinite(n) || n < 1) {
        throw new TRPCError({
          code: "PRECONDITION_FAILED",
          message: "Add at least one slide before generating.",
        });
      }

      const deck = await ctx.db.query.decks.findFirst({
        where: eq(decks.id, input.deckId),
      });

      if (!deck) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Deck not found.",
        });
      }

      await ctx.db
        .update(decks)
        .set({ status: "generated" })
        .where(eq(decks.id, input.deckId));
    }),
});
