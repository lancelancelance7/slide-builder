import "server-only";

import { zodResponseFormat } from "openai/helpers/zod";
import { z } from "zod";

import { openai } from "~/lib/openai";
import type { DeckSettings } from "~/server/db/schema";
import {
  SLIDE_LAYOUT_VALUES,
  aiPlanDeckResultSchema,
  aiPlanSlideRowSchema,
  slideLayoutSchema,
  type AiPlanSlideRow,
  type SlideLayoutId,
} from "~/lib/slide-plan";

const PLAN_MODEL = process.env.OPENAI_PLAN_MODEL ?? "gpt-4o";

function clampSlideTarget(settings: DeckSettings): number {
  const min = settings.slideCountMin ?? 4;
  const max = settings.slideCountMax ?? 30;
  const target = settings.slideCount ?? 10;
  return Math.min(Math.max(target, min), max);
}

function layoutsHint(settings: DeckSettings): string {
  const allowed = settings.layoutsAllowed;
  if (!allowed?.length) {
    return SLIDE_LAYOUT_VALUES.join(", ");
  }
  return allowed.join(", ");
}

function notesHint(settings: DeckSettings): string {
  switch (settings.speakerNotesPolicy) {
    case "none":
      return "Use empty string for speakerNotes on every slide.";
    case "full":
      return "Write fuller speakerNotes (2–4 sentences) where helpful.";
    default:
      return "Keep speakerNotes short (one or two sentences) when useful; otherwise brief.";
  }
}

function imageHint(settings: DeckSettings): string {
  switch (settings.imagePolicy) {
    case "omit":
      return "Set imagePrompt to a single empty string or very short 'none' for every slide.";
    case "placeholders":
      return "imagePrompt should describe a simple placeholder visual (diagram slot, stock silhouette).";
    default:
      return "imagePrompt must be a vivid art-direction brief for each slide (no stock IDs).";
  }
}

export async function generateDeckPlanViaOpenAi(input: {
  deckTitle: string;
  deckPrompt: string;
  settings: DeckSettings;
  brandKit: {
    name: string;
    tone: string;
    imageStyle: string;
    colors: { bg: string; fg: string; accent: string; highlight: string };
  };
}) {
  const n = clampSlideTarget(input.settings);
  const allowedLayouts =
    input.settings.layoutsAllowed?.filter(
      (x): x is SlideLayoutId =>
        slideLayoutSchema.safeParse(x).success,
    ) ?? [];

  const system = [
    "You are Slideline, an expert presentation planner.",
    "Return ONLY structured JSON matching the schema (slides array).",
    "Each slide must use one layout id from this set ONLY:",
    layoutsHint(input.settings),
    "Layouts map to content fields:",
    '- title: title + optional subtitle/eyebrow; statHero uses title/stat fields; quote uses quote.text + quote.author; comparison uses comparison.columns with headings and rows.',
    `Target slide count: ${String(n)} slides (within ±1 if needed for narrative).`,
    `Brand kit "${input.brandKit.name}": tone=${input.brandKit.tone}, imageStyle=${input.brandKit.imageStyle}.`,
    `Brand palette accent=${input.brandKit.colors.accent}, highlight=${input.brandKit.colors.highlight}.`,
    notesHint(input.settings),
    imageHint(input.settings),
    allowedLayouts.length > 0
      ? `Only these layouts are allowed: ${allowedLayouts.join(", ")}.`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const user = [
    `Deck title: ${input.deckTitle}`,
    "",
    "Brief / outline:",
    input.deckPrompt,
    "",
    input.settings.audience
      ? `Audience: ${input.settings.audience}`
      : "",
    input.settings.tone
      ? `Voice tone: ${input.settings.tone}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const completion = await openai.chat.completions.parse({
    model: PLAN_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: zodResponseFormat(aiPlanDeckResultSchema, "deck_plan"),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error("Model returned no parsed deck plan.");
  }

  return sanitizePlanSlides(parsed, allowedLayouts);
}

function sanitizePlanSlides(
  plan: z.infer<typeof aiPlanDeckResultSchema>,
  allowedLayouts: SlideLayoutId[],
) {
  const fallbackLayout: SlideLayoutId =
    allowedLayouts[0] ?? "imageText";

  const slides = plan.slides.map((s) => {
    const layout =
      allowedLayouts.length === 0 || allowedLayouts.includes(s.layout)
        ? s.layout
        : fallbackLayout;
    return { ...s, layout };
  });

  return { slides };
}

export async function rewriteSlideViaOpenAi(input: {
  focus: "title" | "body" | "bullets" | "image" | "notes" | "all";
  slide: AiPlanSlideRow;
  deckTitle: string;
  deckPrompt: string;
  settings: DeckSettings;
  brandKit: {
    name: string;
    tone: string;
    imageStyle: string;
  };
}) {
  const singleSlidePlanSchema = z.object({
    slide: aiPlanSlideRowSchema,
  });

  const focusLine =
    input.focus === "all"
      ? "Improve the entire slide holistically."
      : input.focus === "title"
        ? "Improve titles/headlines and hierarchy only; keep other fields nearly identical."
        : input.focus === "body"
          ? "Improve body copy only."
          : input.focus === "bullets"
            ? "Improve bullets only (clearer, tighter)."
            : input.focus === "image"
              ? "Improve imagePrompt only (more concrete art direction)."
              : "Improve speakerNotes only.";

  const system = [
    "You rewrite a single slide plan for an upcoming presentation.",
    focusLine,
    "Preserve layout unless it is clearly wrong for the content.",
    `Brand kit ${input.brandKit.name}: tone=${input.brandKit.tone}, imagery=${input.brandKit.imageStyle}.`,
    notesHint(input.settings),
    imageHint(input.settings),
  ].join("\n");

  const user = [
    `Deck: ${input.deckTitle}`,
    `Deck brief (context): ${input.deckPrompt}`,
    "",
    "Current slide JSON:",
    JSON.stringify(input.slide),
  ].join("\n");

  const completion = await openai.chat.completions.parse({
    model: PLAN_MODEL,
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    response_format: zodResponseFormat(singleSlidePlanSchema, "rewrite_slide"),
  });

  const parsed = completion.choices[0]?.message.parsed;
  if (!parsed) {
    throw new Error("Model returned no rewritten slide.");
  }

  const allowedLayouts =
    input.settings.layoutsAllowed?.filter(
      (x): x is SlideLayoutId =>
        slideLayoutSchema.safeParse(x).success,
    ) ?? [];

  const layout =
    allowedLayouts.length === 0 || allowedLayouts.includes(parsed.slide.layout)
      ? parsed.slide.layout
      : allowedLayouts[0] ?? parsed.slide.layout;

  return { slide: { ...parsed.slide, layout } };
}
