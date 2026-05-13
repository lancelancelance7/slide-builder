import { relations } from "drizzle-orm";
import { index, pgEnum, pgTableCreator } from "drizzle-orm/pg-core";

/**
 * Multi-project schema prefix
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `sb_${name}`);

export const slideLayoutEnum = pgEnum("slide_builder_slide_layout", [
  "title",
  "section",
  "imageText",
  "quote",
  "comparison",
  "statHero",
  "closing",
]);

export const deckStatusEnum = pgEnum("slide_builder_deck_status", [
  "draft",
  "planned",
  "generated",
  "edited",
  "exported",
]);

export const brandToneEnum = pgEnum("slide_builder_brand_tone", [
  "direct",
  "warm",
  "technical",
]);

export const brandKits = createTable(
  "brand_kit",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    name: d.text().notNull(),
    logoUrl: d.text(),
    colors: d
      .jsonb()
      .notNull()
      .$type<{ bg: string; fg: string; accent: string; highlight: string }>(),
    fontDisplay: d.text().notNull(),
    fontText: d.text().notNull(),
    tone: brandToneEnum("tone").notNull(),
    imageStyle: d.text().notNull(),
    isDefault: d.boolean().notNull().default(false),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("brand_kit_name_idx").on(t.name)],
);

export const decks = createTable(
  "deck",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    brandKitId: d
      .uuid()
      .notNull()
      .references(() => brandKits.id, { onDelete: "restrict" }),
    title: d.text().notNull(),
    prompt: d.text().notNull(),
    status: deckStatusEnum("status").notNull().default("draft"),
    settings: d.jsonb().notNull().$type<{
      slideCount?: number;
      audience?: string;
      tone?: string;
      layoutsAllowed?: string[];
    }>(),
    templateConfig: d.jsonb().notNull().$type<{
      pageNumber?: Record<string, unknown>;
      topRightTitle?: Record<string, unknown>;
      logo?: Record<string, unknown>;
    }>(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("deck_brand_kit_id_idx").on(t.brandKitId)],
);

export const slides = createTable(
  "slide",
  (d) => ({
    id: d.uuid().primaryKey().defaultRandom(),
    deckId: d
      .uuid()
      .notNull()
      .references(() => decks.id, { onDelete: "cascade" }),
    position: d.integer().notNull(),
    layout: slideLayoutEnum("layout").notNull(),
    content: d.jsonb().notNull().$type<Record<string, unknown>>(),
    imagePrompt: d.text().notNull(),
    speakerNotes: d.text().notNull(),
    templateOverrides: d.jsonb().notNull().$type<Record<string, unknown>>(),
    createdAt: d
      .timestamp({ withTimezone: true })
      .$defaultFn(() => /* @__PURE__ */ new Date())
      .notNull(),
    updatedAt: d.timestamp({ withTimezone: true }).$onUpdate(() => new Date()),
  }),
  (t) => [index("slide_deck_id_position_idx").on(t.deckId, t.position)],
);

export const brandKitsRelations = relations(brandKits, ({ many }) => ({
  decks: many(decks),
}));

export const decksRelations = relations(decks, ({ one, many }) => ({
  brandKit: one(brandKits, {
    fields: [decks.brandKitId],
    references: [brandKits.id],
  }),
  slides: many(slides),
}));

export const slidesRelations = relations(slides, ({ one }) => ({
  deck: one(decks, {
    fields: [slides.deckId],
    references: [decks.id],
  }),
}));
