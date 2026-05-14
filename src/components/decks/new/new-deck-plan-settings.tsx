"use client";

import { Check } from "lucide-react";

import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Slider } from "~/components/ui/slider";
import { Switch } from "~/components/ui/switch";
import { cn } from "~/lib/utils";

export type PlanLayoutId =
  | "title"
  | "section"
  | "imageText"
  | "quote"
  | "comparison"
  | "statHero"
  | "closing";

const LAYOUT_CHIPS: { id: PlanLayoutId; label: string }[] = [
  { id: "title", label: "Title" },
  { id: "section", label: "Section" },
  { id: "imageText", label: "Image + text" },
  { id: "quote", label: "Quote" },
  { id: "comparison", label: "Comparison" },
  { id: "statHero", label: "Stat hero" },
  { id: "closing", label: "Closing" },
];

/** Stable order matching the layout toolbar. */
export const PLAN_LAYOUT_IDS_IN_ORDER: PlanLayoutId[] = LAYOUT_CHIPS.map(
  (l) => l.id,
);

export function sortPlanLayouts(ids: PlanLayoutId[]) {
  return PLAN_LAYOUT_IDS_IN_ORDER.filter((id) => ids.includes(id));
}

export const DEFAULT_NEW_DECK_LAYOUTS: PlanLayoutId[] = LAYOUT_CHIPS.filter(
  (l) => l.id !== "statHero",
).map((l) => l.id);

type NewDeckPlanSettingsProps = {
  slideCount: number;
  onSlideCountChange: (n: number) => void;
  layoutsAllowed: PlanLayoutId[];
  onToggleLayout: (id: PlanLayoutId, allowed: boolean) => void;
  imagePolicy: "generatePrompts" | "omit" | "placeholders";
  onImagePolicyChange: (p: "generatePrompts" | "omit" | "placeholders") => void;
  speakerNotesPolicy: "none" | "short" | "full";
  onSpeakerNotesPolicyChange: (
    p: "none" | "short" | "full",
  ) => void;
  requirePlanReview: boolean;
  onRequirePlanReviewChange: (v: boolean) => void;
};

export function NewDeckPlanSettings(props: NewDeckPlanSettingsProps) {
  return (
    <section className="min-w-0 flex-1">
      <p className="mb-2 block t-caption-b text-[color:var(--app-text)]">
        Plan settings
      </p>
      <div className="flex flex-col gap-3">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="t-caption text-[color:var(--app-text)]">
              Slide count
            </span>
            <span className="grow" />
            <span className="t-micro text-[color:var(--app-text)]">
              {props.slideCount} slides
            </span>
          </div>
          <Slider
            min={4}
            max={30}
            step={1}
            value={[props.slideCount]}
            onValueChange={(v) => {
              const n = v[0];
              if (n !== undefined) props.onSlideCountChange(n);
            }}
            className="py-1"
          />
          <div className="mt-1 flex t-micro text-[color:var(--app-text-3)]">
            <span>4</span>
            <span className="grow" />
            <span>30</span>
          </div>
        </div>

        <div>
          <p className="mb-1.5 t-caption text-[color:var(--app-text-2)] font-medium">
            Layouts to include
          </p>
          <div className="flex flex-wrap gap-1.5">
            {LAYOUT_CHIPS.map((layout) => {
              const on = props.layoutsAllowed.includes(layout.id);
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => props.onToggleLayout(layout.id, !on)}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border border-transparent px-2.5 py-1 t-micro transition-colors",
                    on &&
                      "border-transparent bg-[color:color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[color:var(--color-accent)]",
                    !on &&
                      "border-[color:var(--app-border)] text-[color:var(--app-text-2)] bg-[color:var(--app-surface)] shadow-[inset_0_0_0_1px_var(--app-border)]",
                  )}
                >
                  {on && <Check className="size-3.5 shrink-0" aria-hidden />}
                  {layout.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="min-w-[140px] grow">
            <Label
              htmlFor="deck-image-policy"
              className="mb-1.5 t-caption text-[color:var(--app-text-2)] font-medium"
            >
              Images
            </Label>
            <Select
              value={props.imagePolicy}
              onValueChange={(v) =>
                props.onImagePolicyChange(
                  v as "generatePrompts" | "omit" | "placeholders",
                )
              }
            >
              <SelectTrigger
                id="deck-image-policy"
                className="w-full border-[color:var(--app-border)] bg-[color:var(--app-surface)]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generatePrompts">Generate prompts</SelectItem>
                <SelectItem value="omit">Omit images</SelectItem>
                <SelectItem value="placeholders">Placeholders only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="min-w-[140px] grow">
            <Label
              htmlFor="deck-speaker-policy"
              className="mb-1.5 t-caption text-[color:var(--app-text-2)] font-medium"
            >
              Speaker notes
            </Label>
            <Select
              value={props.speakerNotesPolicy}
              onValueChange={(v) =>
                props.onSpeakerNotesPolicyChange(v as "none" | "short" | "full")
              }
            >
              <SelectTrigger
                id="deck-speaker-policy"
                className="w-full border-[color:var(--app-border)] bg-[color:var(--app-surface)]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="short">Yes — short</SelectItem>
                <SelectItem value="full">Yes — full</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <Switch
            checked={props.requirePlanReview}
            onCheckedChange={props.onRequirePlanReviewChange}
            className="mt-0.5"
            aria-label="Preview plan before generating"
          />
          <div>
            <p className="t-caption font-medium text-[color:var(--app-text)]">
              Preview plan before generating
            </p>
            <p className="mt-0.5 t-micro text-[color:var(--app-text-2)]">
              Review and edit slide titles, content, and image briefs.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
