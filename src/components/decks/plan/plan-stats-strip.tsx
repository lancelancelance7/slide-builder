import {
  SLIDE_LAYOUT_LABEL,
  slideLayoutSchema,
} from "~/lib/slide-plan";

import type { PlanSlideRow } from "./plan-slide-card";

type PlanStatsStripProps = {
  slides: PlanSlideRow[];
  brandKitName: string;
};

function formatEstRuntime(slideCount: number): string {
  const seconds = slideCount * 45;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m)}:${String(s).padStart(2, "0")}`;
}

export function PlanStatsStrip(props: PlanStatsStripProps) {
  const { slides } = props;
  const n = slides.length;
  const layoutsCount = new Map<string, number>();
  let imageBriefs = 0;
  let notes = 0;

  for (const s of slides) {
    layoutsCount.set(s.layout, (layoutsCount.get(s.layout) ?? 0) + 1);
    if (s.imagePrompt.trim().length > 0) imageBriefs += 1;
    if (s.speakerNotes.trim().length > 0) notes += 1;
  }

  const layoutParts = [...layoutsCount.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([id, c]) => {
      const parsed = slideLayoutSchema.safeParse(id);
      const label = parsed.success ? SLIDE_LAYOUT_LABEL[parsed.data] : id;
      return `${label} ×${String(c)}`;
    });

  const notesPct =
    n === 0 ? 0 : Math.round((notes / n) * 100);

  return (
    <div className="mb-8 flex flex-wrap gap-x-10 gap-y-3 border-b border-[color:var(--app-border)] pb-6 t-caption text-[color:var(--app-text-2)]">
      <div>
        <span className="text-[color:var(--app-text-3)]">Slides </span>
        <span className="font-medium text-[color:var(--app-text)]">
          {String(n)}
        </span>
      </div>
      <div className="max-w-xl">
        <span className="text-[color:var(--app-text-3)]">Layouts </span>
        <span className="font-medium text-[color:var(--app-text)]">
          {layoutParts.length > 0 ? layoutParts.join(" · ") : "—"}
        </span>
      </div>
      <div>
        <span className="text-[color:var(--app-text-3)]">Image briefs </span>
        <span className="font-medium text-[color:var(--app-text)]">
          {String(imageBriefs)}
        </span>
      </div>
      <div>
        <span className="text-[color:var(--app-text-3)]">Notes coverage </span>
        <span className="font-medium text-[color:var(--app-text)]">
          {notesPct}%
        </span>
      </div>
      <div>
        <span className="text-[color:var(--app-text-3)]">Brand kit </span>
        <span className="font-medium text-[color:var(--app-text)]">
          {props.brandKitName}
        </span>
      </div>
      <div>
        <span className="text-[color:var(--app-text-3)]">Template </span>
        <span className="font-medium text-[color:var(--app-text)]">
          Deck default
        </span>
      </div>
      <div>
        <span className="text-[color:var(--app-text-3)]">Est. talk time </span>
        <span className="font-medium text-[color:var(--app-text)]">
          ~{formatEstRuntime(n)} at 45s/slide
        </span>
      </div>
    </div>
  );
}
