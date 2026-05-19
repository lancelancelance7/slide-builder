"use client";

import { Trash2 } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import type { EditorRegionId } from "~/components/slides/slide-layout-inner";
import {
  SLIDE_LAYOUT_LABEL,
  SLIDE_LAYOUT_VALUES,
  comparisonBulletsBlocksToText,
  comparisonTextToBulletsBlocks,
  slideLayoutSchema,
  type PlanFormFields,
  type SlideLayoutId,
} from "~/lib/slide-plan";
import { SlideImageBriefSection } from "./slide-image-brief-section";
import { SlideImageUploader } from "~/components/upload/slide-image-uploader";
import { cn } from "~/lib/utils";

export type InspectorTabId = "slide" | "element" | "template" | "notes";

function layoutOptions(allowed: SlideLayoutId[]): SlideLayoutId[] {
  if (allowed.length > 0) return allowed;
  return [...SLIDE_LAYOUT_VALUES];
}

type EditorInspectorProps = {
  tab: InspectorTabId;
  onTabChange: (tab: InspectorTabId) => void;
  layout: SlideLayoutId;
  allowedLayouts: SlideLayoutId[];
  onLayoutSelect: (layout: SlideLayoutId) => void;
  fields: PlanFormFields;
  onPatchFields: (patch: Partial<PlanFormFields>) => void;
  eyebrow: string;
  onEyebrowChange: (v: string) => void;
  slideId: string;
  imageUrl: string | null;
  onSlideImageUploaded: (payload: { url: string; key?: string }) => void;
  onSlideImageGenerated: (payload: { url: string; key?: string }) => void;
  onSlideImageClear: () => void;
  imagePrompt: string;
  onImagePromptChange: (v: string) => void;
  speakerNotes: string;
  onSpeakerNotesChange: (v: string) => void;
  templateConfig: Record<string, unknown>;
  activeRegion: EditorRegionId | null;
  onRemoveSlide: () => void;
};

function regionHint(region: EditorRegionId | null) {
  if (!region) return null;
  const labels: Record<EditorRegionId, string> = {
    eyebrow: "Eyebrow",
    headline: "Headline",
    supporting: "Supporting text",
    bullets: "Bullets",
    columns: "Columns",
  };
  return (
    <p className="t-micro rounded-md bg-(--app-surface-2) px-2 py-1 text-(--app-text-2)">
      Canvas selection:{" "}
      <span className="font-medium text-(--app-text)">{labels[region]}</span>
    </p>
  );
}

export function EditorInspector(props: EditorInspectorProps) {
  const layout = props.layout;
  const opts = layoutOptions(props.allowedLayouts);

  const headlineLabel =
    layout === "quote"
      ? "Quote"
      : layout === "statHero"
        ? "Hero number"
        : "Headline";

  const showBulletsBlock =
    layout === "section" || layout === "comparison" || layout === "imageText";

  const bulletsJoined =
    layout === "comparison"
      ? comparisonBulletsBlocksToText(props.fields.bullets)
      : props.fields.bullets.join("\n");

  const tabProps = {
    value: props.tab,
    onValueChange: (v: string) => {
      props.onTabChange(v as InspectorTabId);
    },
  };

  return (
    <aside className="flex w-[min(100%,360px)] shrink-0 flex-col border-l border-(--app-divider) bg-(--app-surface)">
      <div className="border-b border-(--app-divider) px-4 py-3">
        <span className="t-micro-b tracking-wide text-(--app-text-3) uppercase">
          Inspector
        </span>
      </div>
      <Tabs className="flex min-h-0 flex-1 flex-col p-3" {...tabProps}>
        <TabsList
          variant="line"
          className="mb-3 w-full shrink-0 flex-wrap gap-1"
        >
          <TabsTrigger value="slide" className="text-xs">
            Slide
          </TabsTrigger>
          <TabsTrigger value="element" className="text-xs">
            Element
          </TabsTrigger>
          <TabsTrigger value="template" className="text-xs">
            Template
          </TabsTrigger>
          <TabsTrigger value="notes" className="text-xs">
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="slide"
          className="flex min-h-0 flex-1 flex-col gap-4"
        >
          <label className="block">
            <span className="t-caption mb-1 block text-(--app-text-2)">
              Layout
            </span>
            <Select
              value={layout}
              onValueChange={(v) => {
                props.onLayoutSelect(slideLayoutSchema.parse(v));
              }}
            >
              <SelectTrigger className="w-full">
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
          </label>
          {layout === "imageText" && (
            <>
              <SlideImageUploader
                slideId={props.slideId}
                imageUrl={props.imageUrl}
                onUploaded={props.onSlideImageUploaded}
                onClear={props.onSlideImageClear}
              />
              <SlideImageBriefSection
                slideId={props.slideId}
                imagePrompt={props.imagePrompt}
                onImagePromptChange={props.onImagePromptChange}
                onImageGenerated={props.onSlideImageGenerated}
              />
            </>
          )}
          <Button
            type="button"
            variant="outline"
            className="text-destructive w-full gap-2"
            onClick={() => {
              props.onRemoveSlide();
            }}
          >
            <Trash2 className="size-4" />
            Remove slide
          </Button>
        </TabsContent>

        <TabsContent
          value="element"
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto"
        >
          {regionHint(props.activeRegion)}
          {layout === "title" && (
            <label className="block">
              <span className="t-caption mb-1 block text-(--app-text-2)">
                Eyebrow
              </span>
              <Textarea
                value={props.eyebrow}
                onChange={(e) => {
                  props.onEyebrowChange(e.target.value);
                }}
                rows={2}
                className={cn(
                  "resize-none",
                  props.activeRegion === "eyebrow" &&
                    "ring-2 ring-(--color-accent)",
                )}
              />
            </label>
          )}
          <label className="block">
            <span className="t-caption mb-1 block text-(--app-text-2)">
              {headlineLabel}
            </span>
            <Textarea
              value={props.fields.title}
              onChange={(e) => {
                props.onPatchFields({ title: e.target.value });
              }}
              rows={layout === "title" ? 2 : 1}
              className={cn(
                "min-h-0 resize-none",
                props.activeRegion === "headline" &&
                  "ring-2 ring-(--color-accent)",
              )}
            />
          </label>

          {(layout === "imageText" ||
            layout === "closing" ||
            layout === "title") && (
            <label className="block">
              <span className="t-caption mb-1 block text-(--app-text-2)">
                {layout === "title" ? "Subtitle" : "Body"}
              </span>
              <Textarea
                value={props.fields.body}
                onChange={(e) => {
                  props.onPatchFields({ body: e.target.value });
                }}
                rows={3}
                className={cn(
                  "resize-y",
                  props.activeRegion === "supporting" &&
                    "ring-2 ring-(--color-accent)",
                )}
              />
            </label>
          )}

          {layout === "quote" && (
            <label className="block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                Attribution
              </span>
              <Textarea
                value={props.fields.body}
                onChange={(e) => {
                  props.onPatchFields({ body: e.target.value });
                }}
                rows={2}
                className={cn(
                  "resize-y",
                  props.activeRegion === "supporting" &&
                    "ring-2 ring-[color:var(--color-accent)]",
                )}
              />
            </label>
          )}

          {layout === "statHero" && (
            <label className="block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                Metric label
              </span>
              <Textarea
                value={props.fields.body}
                onChange={(e) => {
                  props.onPatchFields({ body: e.target.value });
                }}
                rows={2}
                className={cn(
                  "resize-y",
                  props.activeRegion === "supporting" &&
                    "ring-2 ring-[color:var(--color-accent)]",
                )}
              />
            </label>
          )}

          {showBulletsBlock && (
            <label className="block">
              <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
                {layout === "comparison"
                  ? "Columns — heading, then · rows; blank line + next heading = new column."
                  : "Bullets (one per line)"}
              </span>
              <Textarea
                value={bulletsJoined}
                onChange={(e) => {
                  const raw = e.target.value;
                  props.onPatchFields({
                    bullets:
                      layout === "comparison"
                        ? comparisonTextToBulletsBlocks(raw)
                        : raw.split("\n"),
                  });
                }}
                rows={layout === "comparison" ? 6 : 4}
                className={cn(
                  "t-caption resize-y font-mono",
                  (props.activeRegion === "bullets" ||
                    props.activeRegion === "columns") &&
                    "ring-2 ring-[color:var(--color-accent)]",
                )}
              />
            </label>
          )}
        </TabsContent>

        <TabsContent value="template" className="flex flex-col gap-2">
          <p className="t-caption text-[color:var(--app-text-2)]">
            Deck-wide chrome (page numbers, running titles, footer logo) will be
            editable in Template mode. Summary below is read-only for now.
          </p>
          <pre className="t-micro max-h-[320px] overflow-auto rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-2)] p-3 font-mono whitespace-pre-wrap">
            {JSON.stringify(props.templateConfig, null, 2)}
          </pre>
        </TabsContent>

        <TabsContent value="notes" className="flex flex-col gap-2">
          <label className="block">
            <span className="t-caption mb-1 block text-[color:var(--app-text-2)]">
              Speaker notes
            </span>
            <Textarea
              value={props.speakerNotes}
              onChange={(e) => {
                props.onSpeakerNotesChange(e.target.value);
              }}
              rows={12}
              className="t-caption resize-y"
              placeholder="Delivery cues…"
            />
          </label>
        </TabsContent>
      </Tabs>
    </aside>
  );
}
