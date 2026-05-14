import { z } from "zod";

export const SLIDE_LAYOUT_VALUES = [
  "title",
  "section",
  "imageText",
  "quote",
  "comparison",
  "statHero",
  "closing",
] as const;

export type SlideLayoutId = (typeof SLIDE_LAYOUT_VALUES)[number];

export const slideLayoutSchema = z.enum(SLIDE_LAYOUT_VALUES);

export const SLIDE_LAYOUT_LABEL: Record<SlideLayoutId, string> = {
  title: "Title",
  section: "Section",
  imageText: "Image + text",
  quote: "Quote",
  comparison: "Comparison",
  statHero: "Stat hero",
  closing: "Closing",
};

export const planSlideContentSchema = z.object({
  title: z.string().default(""),
  body: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  subtitle: z.string().optional(),
  eyebrow: z.string().optional(),
  quote: z
    .object({ text: z.string(), author: z.string().optional() })
    .optional(),
  comparison: z
    .object({
      columns: z.array(
        z.object({
          heading: z.string(),
          rows: z.array(z.string()),
        }),
      ),
    })
    .optional(),
  stat: z.object({ number: z.string(), label: z.string() }).optional(),
});

export type PlanSlideContent = z.infer<typeof planSlideContentSchema>;

/** OpenAI structured outputs: all object keys must be required; use nullable instead of optional. */
export const aiPlanSlideRowSchema = z.object({
  layout: slideLayoutSchema,
  title: z.string(),
  body: z.string().nullable(),
  bullets: z.array(z.string()).nullable(),
  quote: z
    .object({ text: z.string(), author: z.string().nullable() })
    .nullable(),
  comparison: z
    .object({
      columns: z.array(
        z.object({
          heading: z.string(),
          rows: z.array(z.string()),
        }),
      ),
    })
    .nullable(),
  stat: z.object({ number: z.string(), label: z.string() }).nullable(),
  imagePrompt: z.string(),
  speakerNotes: z.string().nullable(),
});

export const aiPlanDeckResultSchema = z.object({
  slides: z.array(aiPlanSlideRowSchema).min(1).max(35),
});

export type AiPlanSlideRow = z.infer<typeof aiPlanSlideRowSchema>;

export function defaultContentForLayout(
  layout: SlideLayoutId,
): PlanSlideContent {
  switch (layout) {
    case "title":
      return { title: "Slide title", subtitle: "", eyebrow: "" };
    case "section":
      return { title: "Section", bullets: [] };
    case "imageText":
      return { title: "Slide title", body: "" };
    case "quote":
      return { title: "", quote: { text: "Quote text", author: "" } };
    case "comparison":
      return {
        title: "Comparison",
        comparison: {
          columns: [
            { heading: "Option A", rows: ["Point 1"] },
            { heading: "Option B", rows: ["Point 1"] },
          ],
        },
      };
    case "statHero":
      return { title: "", stat: { number: "0", label: "Label" } };
    case "closing":
      return { title: "Thank you", body: "" };
  }
}

export function normalizeContentForPersist(
  layout: SlideLayoutId,
  raw: unknown,
): Record<string, unknown> {
  const defaults = defaultContentForLayout(layout);
  const patch =
    typeof raw === "object" && raw !== null && !Array.isArray(raw)
      ? (raw as Record<string, unknown>)
      : {};
  const merged: Record<string, unknown> = { ...defaults, ...patch };
  const parsed = planSlideContentSchema.safeParse(merged);
  const data = parsed.success ? parsed.data : defaults;
  const title =
    typeof data.title === "string" && data.title.trim().length > 0
      ? data.title.trim()
      : "Untitled slide";
  return { ...data, title };
}

export function aiRowToStoredContent(
  row: AiPlanSlideRow,
): Record<string, unknown> {
  return normalizeContentForPersist(row.layout, {
    title: row.title,
    body: row.body ?? undefined,
    bullets: row.bullets ?? undefined,
    quote:
      row.quote == null
        ? undefined
        : {
            text: row.quote.text,
            author: row.quote.author ?? undefined,
          },
    comparison: row.comparison ?? undefined,
    stat: row.stat ?? undefined,
  });
}

/** Inline form fields for the plan review card (layout-aware mapping). */
export type PlanFormFields = {
  title: string;
  body: string;
  bullets: string[];
};

/** Between column blocks shown in textarea (two newlines = one blank line). */
const COMPARISON_COLUMN_BLOCK_SEP = "\n\n";

/** Earlier builds used zero-width-space between columns; still honored on parse. */
const COMPARISON_COLUMN_BLOCK_LEGACY_SEP = "\n\u200b\n";

export function comparisonBulletsBlocksToText(blocks: string[]): string {
  return blocks.join(COMPARISON_COLUMN_BLOCK_SEP);
}

function normalizedNewlines(text: string): string {
  return text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
}

/** Heading line vs · row uses the same middot (·) convention as persisted rows. */
function lineStartsWithBulletMiddot(trimmedLine: string): boolean {
  return trimmedLine.startsWith("·");
}

/** Split pasted/edited textarea when columns are separated only by blank lines. */
function splitImplicitComparisonSegments(segment: string): string[] {
  if (segment.trim().length === 0) return [];

  const lines = segment.split("\n");
  const blocks: string[] = [];
  let buf: string[] = [];

  function flush(): void {
    const joined = buf.join("\n").trim();
    if (joined.length > 0) blocks.push(joined);
    buf = [];
  }

  let i = 0;
  while (i < lines.length) {
    const line = lines[i]!;
    const isBlank = line.trim().length === 0;

    if (isBlank) {
      let j = i + 1;
      while (j < lines.length && lines[j]!.trim().length === 0) j++;

      const nextNonEmptyTrim = lines[j]?.trim() ?? "";
      const hasPendingContent = buf.some((ln) => ln.trim().length > 0);

      const nextIsBulletRow = lineStartsWithBulletMiddot(nextNonEmptyTrim);

      if (
        nextNonEmptyTrim.length > 0 &&
        !nextIsBulletRow &&
        hasPendingContent
      ) {
        flush();
        i = j;
        continue;
      }

      buf.push(line);
      i++;
      continue;
    }

    buf.push(line);
    i++;
  }

  flush();
  return blocks;
}

export function comparisonTextToBulletsBlocks(text: string): string[] {
  const normalized = normalizedNewlines(text).trim();
  if (normalized.length === 0) return [];

  return normalized
    .split(COMPARISON_COLUMN_BLOCK_LEGACY_SEP)
    .flatMap((segment) => splitImplicitComparisonSegments(segment))
    .filter((b) => b.length > 0);
}

export function contentToFormFields(
  layout: SlideLayoutId,
  content: Record<string, unknown>,
): PlanFormFields {
  const norm = normalizeContentForPersist(layout, content) as PlanSlideContent;
  if (layout === "quote") {
    const text = norm.quote?.text ?? norm.title ?? "";
    const author = norm.quote?.author ?? norm.body ?? "";
    return { title: text, body: author, bullets: [] };
  }
  if (layout === "statHero") {
    const num = norm.stat?.number ?? norm.title ?? "";
    const label = norm.stat?.label ?? norm.body ?? "";
    return { title: num, body: label, bullets: [] };
  }
  if (layout === "comparison") {
    const bullets =
      norm.comparison?.columns.map(
        (col) => `${col.heading}\n${col.rows.map((r) => `· ${r}`).join("\n")}`,
      ) ?? [];
    return { title: norm.title, body: norm.body ?? "", bullets };
  }
  return {
    title: norm.title,
    body: norm.body ?? "",
    bullets: norm.bullets ?? [],
  };
}

export function formFieldsToContent(
  layout: SlideLayoutId,
  fields: PlanFormFields,
): Record<string, unknown> {
  const titleRaw = fields.title.trim();
  const bodyRaw = fields.body.trim();
  const cleanBullets = fields.bullets
    .map((b) => b.trim())
    .filter((b) => b.length > 0);

  if (layout === "quote") {
    return normalizeContentForPersist("quote", {
      title: "",
      quote: {
        text: titleRaw || "Quote",
        author: bodyRaw || undefined,
      },
    });
  }
  if (layout === "statHero") {
    return normalizeContentForPersist("statHero", {
      title: "",
      stat: {
        number: titleRaw || "0",
        label: bodyRaw || "Metric",
      },
    });
  }
  if (layout === "comparison") {
    const columns =
      fields.bullets.length === 0
        ? [
            { heading: "A", rows: [""] },
            { heading: "B", rows: [""] },
          ]
        : fields.bullets.map((block, i) => {
            const lines = block.split("\n").map((l) => l.trim());
            const heading = (lines[0] ?? `Column ${i + 1}`).replace(
              /^·\s*/,
              "",
            );
            const rows = lines
              .slice(1)
              .map((l) => l.replace(/^·\s*/, ""))
              .filter((l) => l.length > 0);
            return { heading, rows: rows.length > 0 ? rows : [""] };
          });
    return normalizeContentForPersist("comparison", {
      title: titleRaw || "Comparison",
      comparison: { columns },
    });
  }
  return normalizeContentForPersist(layout, {
    title: titleRaw || "Untitled slide",
    body: bodyRaw || undefined,
    bullets:
      layout === "section" || cleanBullets.length > 0
        ? cleanBullets
        : undefined,
  });
}
