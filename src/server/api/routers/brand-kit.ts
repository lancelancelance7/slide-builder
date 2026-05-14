import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { brandKits } from "~/server/db/schema";
import {
  DEFAULT_BRAND_COLORS,
  DEFAULT_FONT_STACK,
  DEFAULT_IMAGE_STYLE,
  countDecksForKit,
  getBrandKitDetail,
  listBrandKitsWithDeckCounts,
} from "~/server/queries/brand-kit";

const colorsSchema = z.object({
  bg: z.string().min(1).max(32),
  fg: z.string().min(1).max(32),
  accent: z.string().min(1).max(32),
  highlight: z.string().min(1).max(32),
});

const toneSchema = z.enum(["direct", "warm", "technical"]);

const uuidSchema = z.string().uuid();

export const brandKitRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    const rows = await listBrandKitsWithDeckCounts(ctx.db);
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      accentHex: r.colors.accent,
      updatedAt: r.updatedAt,
      createdAt: r.createdAt,
      isDefault: r.isDefault,
      deckCount: r.deckCount,
    }));
  }),

  byId: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .query(async ({ ctx, input }) => {
      return getBrandKitDetail(ctx.db, input.id);
    }),

  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1).max(200).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const name = input.name ?? "Untitled brand kit";
      const [row] = await ctx.db
        .insert(brandKits)
        .values({
          name,
          logoUrl: null,
          colors: { ...DEFAULT_BRAND_COLORS },
          fontDisplay: DEFAULT_FONT_STACK,
          fontText: DEFAULT_FONT_STACK,
          tone: "direct",
          imageStyle: DEFAULT_IMAGE_STYLE,
          isDefault: false,
        })
        .returning({ id: brandKits.id });

      if (!row) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create brand kit",
        });
      }

      return row;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: uuidSchema,
        name: z.string().min(1).max(200).optional(),
        logoUrl: z.string().max(4096).nullable().optional(),
        colors: colorsSchema.optional(),
        fontDisplay: z.string().min(1).max(512).optional(),
        fontText: z.string().min(1).max(512).optional(),
        tone: toneSchema.optional(),
        imageStyle: z.string().min(1).max(4000).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updates: Partial<typeof brandKits.$inferInsert> = {};

      if (input.name !== undefined) {
        updates.name = input.name;
      }
      if (input.colors !== undefined) {
        updates.colors = input.colors;
      }
      if (input.fontDisplay !== undefined) {
        updates.fontDisplay = input.fontDisplay;
      }
      if (input.fontText !== undefined) {
        updates.fontText = input.fontText;
      }
      if (input.tone !== undefined) {
        updates.tone = input.tone;
      }
      if (input.imageStyle !== undefined) {
        updates.imageStyle = input.imageStyle;
      }
      if (input.logoUrl !== undefined) {
        updates.logoUrl =
          input.logoUrl === null || input.logoUrl.trim() === ""
            ? null
            : input.logoUrl;
      }

      if (Object.keys(updates).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No fields to update",
        });
      }

      const [row] = await ctx.db
        .update(brandKits)
        .set(updates)
        .where(eq(brandKits.id, input.id))
        .returning({ id: brandKits.id });

      if (!row) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand kit not found",
        });
      }

      return row;
    }),

  duplicate: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const original = await ctx.db.query.brandKits.findFirst({
        where: eq(brandKits.id, input.id),
      });
      if (!original) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand kit not found",
        });
      }

      const copyName = `Copy of ${original.name}`;
      const [row] = await ctx.db
        .insert(brandKits)
        .values({
          name: copyName,
          logoUrl: original.logoUrl,
          colors: original.colors,
          fontDisplay: original.fontDisplay,
          fontText: original.fontText,
          tone: original.tone,
          imageStyle: original.imageStyle,
          isDefault: false,
        })
        .returning({ id: brandKits.id });

      if (!row) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to duplicate brand kit",
        });
      }

      return row;
    }),

  delete: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const n = await countDecksForKit(ctx.db, input.id);
      if (n > 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This brand kit is still linked to decks. Reassign decks before deleting.",
        });
      }

      const deleted = await ctx.db
        .delete(brandKits)
        .where(eq(brandKits.id, input.id))
        .returning({ id: brandKits.id });

      if (deleted.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand kit not found",
        });
      }

      return { ok: true as const };
    }),

  setDefault: publicProcedure
    .input(z.object({ id: uuidSchema }))
    .mutation(async ({ ctx, input }) => {
      const exists = await ctx.db.query.brandKits.findFirst({
        columns: { id: true },
        where: eq(brandKits.id, input.id),
      });
      if (!exists) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Brand kit not found",
        });
      }

      await ctx.db.transaction(async (tx) => {
        await tx.update(brandKits).set({ isDefault: false });
        await tx
          .update(brandKits)
          .set({ isDefault: true })
          .where(eq(brandKits.id, input.id));
      });

      return { ok: true as const };
    }),
});
