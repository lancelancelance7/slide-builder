"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Sparkles,
  Trash2,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import {
  SLIDE_LAYOUT_LABEL,
  SLIDE_LAYOUT_VALUES,
  comparisonBulletsBlocksToText,
  comparisonTextToBulletsBlocks,
  contentToFormFields,
  formFieldsToContent,
  slideLayoutSchema,
  type PlanFormFields,
  type SlideLayoutId,
} from "~/lib/slide-plan";
import { cn } from "~/lib/utils";

export type PlanSlideRow = {
  id: string;
  position: number;
  layout: string;
  content: Record<string, unknown>;
  imagePrompt: string;
  speakerNotes: string;
};

type PlanSlideCardProps = {
  slide: PlanSlideRow;
  displayIndex: number;
  allowedLayouts: SlideLayoutId[];
  isFirst: boolean;
  isLast: boolean;
  rewritePending: boolean;
  onSave: (patch: {
    layout: SlideLayoutId;
    content: Record<string, unknown>;
    imagePrompt: string;
    speakerNotes: string;
  }) => void;
  onRewrite: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onRemove: () => void;
};

function layoutOptions(allowed: SlideLayoutId[]): SlideLayoutId[] {
  if (allowed.length > 0) return allowed;
  return [...SLIDE_LAYOUT_VALUES];
}

export function PlanSlideCard(props: PlanSlideCardProps) {
  const parsedLayout = slideLayoutSchema.safeParse(props.slide.layout);
  const initialLayout: SlideLayoutId = parsedLayout.success
    ? parsedLayout.data
    : "imageText";

  const [layout, setLayout] = useState<SlideLayoutId>(initialLayout);
  const [fields, setFields] = useState<PlanFormFields>(() =>
    contentToFormFields(initialLayout, props.slide.content),
  );
  const [imagePrompt, setImagePrompt] = useState(props.slide.imagePrompt);
  const [speakerNotes, setSpeakerNotes] = useState(props.slide.speakerNotes);
  const [focused, setFocused] = useState(false);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const contentKey = JSON.stringify(props.slide.content);

  useEffect(() => {
    const pl = slideLayoutSchema.safeParse(props.slide.layout);
    const lo = pl.success ? pl.data : "imageText";
    setLayout(lo);
    setFields(contentToFormFields(lo, props.slide.content));
    setImagePrompt(props.slide.imagePrompt);
    setSpeakerNotes(props.slide.speakerNotes);
  }, [
    props.slide.id,
    contentKey,
    props.slide.imagePrompt,
    props.slide.speakerNotes,
    props.slide.layout,
  ]);

  useEffect(
    () => () => {
      if (saveTimer.current !== undefined) {
        clearTimeout(saveTimer.current);
      }
    },
    [],
  );

  function queueSave(next: {
    layout: SlideLayoutId;
    fields: PlanFormFields;
    imagePrompt: string;
    speakerNotes: string;
  }) {
    if (saveTimer.current !== undefined) {
      clearTimeout(saveTimer.current);
    }
    saveTimer.current = setTimeout(() => {
      props.onSave({
        layout: next.layout,
        content: formFieldsToContent(next.layout, next.fields),
        imagePrompt: next.imagePrompt,
        speakerNotes: next.speakerNotes,
      });
    }, 520);
  }

  function patchFields(patch: Partial<PlanFormFields>) {
    setFields((prev) => {
      const merged = { ...prev, ...patch };
      queueSave({ layout, fields: merged, imagePrompt, speakerNotes });
      return merged;
    });
  }

  function onLayoutSelect(next: SlideLayoutId) {
    const prevContent = formFieldsToContent(layout, fields);
    setLayout(next);
    const nf = contentToFormFields(next, prevContent);
    setFields(nf);
    props.onSave({
      layout: next,
      content: formFieldsToContent(next, nf),
      imagePrompt,
      speakerNotes,
    });
  }

  const opts = layoutOptions(props.allowedLayouts);

  const showBulletsBlock =
    layout === "section" || layout === "comparison" || layout === "imageText";

  const bulletsJoined =
    layout === "comparison"
      ? comparisonBulletsBlocksToText(fields.bullets)
      : fields.bullets.join("\n");

  const headlineLabel =
    layout === "quote"
      ? "Quote"
      : layout === "statHero"
        ? "Hero number"
        : "Headline";

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[length:var(--radius-comfortable)] border bg-[color:var(--app-surface)] shadow-[var(--app-shadow-soft)]",
        focused &&
          "border-[color:var(--color-accent)] ring-1 ring-[color:var(--color-accent)]",
        !focused && "border-[color:var(--app-border)]",
      )}
    >
      <div className="flex min-h-[148px] items-stretch">
        <div className="flex w-14 shrink-0 flex-col items-center gap-2 border-r border-[color:var(--app-divider)] bg-[color:var(--app-surface-2)] py-3">
          <div className="t-micro flex size-7 items-center justify-center rounded-md bg-[color:var(--app-surface)] font-semibold text-[color:var(--app-text)] tabular-nums">
            {String(props.displayIndex).padStart(2, "0")}
          </div>
          <div className="text-[color:var(--app-text-3)]" aria-hidden>
            <GripVertical className="size-4" />
          </div>
          <div className="mt-auto flex flex-col gap-0.5">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={props.isFirst}
              aria-label="Move slide up"
              onClick={props.onMoveUp}
            >
              <ChevronUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={props.isLast}
              aria-label="Move slide down"
              onClick={props.onMoveDown}
            >
              <ChevronDown className="size-4" />
            </Button>
          </div>
        </div>

        <div className="min-w-0 flex-1 border-r border-[color:var(--app-divider)] p-4">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <Select
              value={layout}
              onValueChange={(v) => onLayoutSelect(slideLayoutSchema.parse(v))}
            >
              <SelectTrigger size="sm" className="w-[min(100%,180px)]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {opts.map((id) => (
                  <SelectItem key={id} value={id}>
                    {SLIDE_LAYOUT_LABEL[id]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {focused && (
              <span className="t-micro rounded-md bg-[color:var(--destructive)]/10 px-2 py-0.5 text-[color:var(--destructive)]">
                Editing
              </span>
            )}
            <span className="flex-1" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="gap-1"
              disabled={props.rewritePending}
              onClick={props.onRewrite}
            >
              {props.rewritePending && (
                <span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
              )}
              {!props.rewritePending && <Sparkles className="size-3.5" />}
              Rewrite
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-8 text-[color:var(--destructive)]"
              aria-label="Remove slide"
              onClick={props.onRemove}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>

          <label className="block">
            <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
              {headlineLabel}
            </span>
            <Textarea
              value={fields.title}
              onChange={(e) => patchFields({ title: e.target.value })}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={layout === "title" ? 2 : 1}
              className="min-h-0 resize-none border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
            />
          </label>

          {(layout === "imageText" ||
            layout === "closing" ||
            layout === "title") && (
            <label className="mt-3 block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                Body
              </span>
              <Textarea
                value={fields.body}
                onChange={(e) => patchFields({ body: e.target.value })}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={3}
                className="resize-y"
              />
            </label>
          )}

          {layout === "quote" && (
            <label className="mt-3 block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                Attribution
              </span>
              <Textarea
                value={fields.body}
                onChange={(e) => patchFields({ body: e.target.value })}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={2}
                className="resize-y"
              />
            </label>
          )}

          {layout === "statHero" && (
            <label className="mt-3 block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                Metric label
              </span>
              <Textarea
                value={fields.body}
                onChange={(e) => patchFields({ body: e.target.value })}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={2}
                className="resize-y"
              />
            </label>
          )}

          {showBulletsBlock && (
            <label className="mt-3 block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                {layout === "comparison"
                  ? "Columns — heading, then · rows; blank line + next heading = new column."
                  : "Bullets (one per line)"}
              </span>
              <Textarea
                value={bulletsJoined}
                onChange={(e) => {
                  const raw = e.target.value;
                  patchFields({
                    bullets:
                      layout === "comparison"
                        ? comparisonTextToBulletsBlocks(raw)
                        : raw.split("\n"),
                  });
                }}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={layout === "comparison" ? 6 : 4}
                className="t-caption resize-y font-mono"
              />
            </label>
          )}
        </div>

        <div className="flex w-[min(100%,280px)] shrink-0 flex-col gap-3 p-4">
          <div>
            <div className="t-micro mb-1 font-medium tracking-wide text-(--color-accent) uppercase">
              Image brief
            </div>
            <Textarea
              value={imagePrompt}
              onChange={(e) => {
                const v = e.target.value;
                setImagePrompt(v);
                queueSave({ layout, fields, imagePrompt: v, speakerNotes });
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={5}
              className="t-caption resize-y"
              placeholder="Art direction for this slide…"
            />
          </div>
          <div>
            <div className="t-micro mb-1 font-medium tracking-wide text-(--app-text-3) uppercase">
              Speaker notes
            </div>
            <Textarea
              value={speakerNotes}
              onChange={(e) => {
                const v = e.target.value;
                setSpeakerNotes(v);
                queueSave({ layout, fields, imagePrompt, speakerNotes: v });
              }}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={4}
              className="t-caption resize-y"
              placeholder="Delivery cues…"
            />
          </div>
        </div>
      </div>
    </article>
  );
}
