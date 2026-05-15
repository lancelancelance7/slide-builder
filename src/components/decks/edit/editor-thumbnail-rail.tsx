"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

import {
  SlideLayoutInner,
  type SlideBrandTokens,
} from "~/components/slides/slide-layout-inner";
import { SlideScaledFrame } from "~/components/slides/slide-scaled-frame";
import { Button } from "~/components/ui/button";
import type { PlanSlideContent } from "~/lib/slide-plan";
import type { SlideLayoutId } from "~/lib/slide-plan";
import { cn } from "~/lib/utils";

const THUMB_SCALE = 0.092;

type ThumbRow = {
  id: string;
  layout: SlideLayoutId;
  previewContent: PlanSlideContent;
};

type EditorThumbnailRailProps = {
  slides: ThumbRow[];
  selectedIndex: number;
  onSelectIndex: (index: number) => void;
  brand: SlideBrandTokens;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
};

export function EditorThumbnailRail(props: EditorThumbnailRailProps) {
  const { slides } = props;

  return (
    <aside className="flex w-[200px] shrink-0 flex-col border-r border-(--app-divider) bg-(--app-surface)">
      <div className="border-b border-(--app-divider) px-3 py-2">
        <span className="t-micro tracking-wide text-(--app-text-3) uppercase">
          Slides
        </span>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-2 pb-8">
        {slides.map((row, i) => {
          const active = i === props.selectedIndex;
          return (
            <div key={row.id} className="flex gap-2">
              <div className="flex w-6 shrink-0 flex-col items-center gap-1 pt-1">
                <span className="t-micro text-(--app-text-2) tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={i === 0}
                  aria-label="Move slide up"
                  onClick={() => {
                    props.onMoveUp(i);
                  }}
                >
                  <ChevronUp className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  disabled={i === slides.length - 1}
                  aria-label="Move slide down"
                  onClick={() => {
                    props.onMoveDown(i);
                  }}
                >
                  <ChevronDown className="size-3.5" />
                </Button>
              </div>
              <button
                type="button"
                className={cn(
                  "min-w-0 flex-1 rounded-lg p-1 text-left transition-colors",
                  active
                    ? "bg-accent/15 ring-1 ring-(--color-accent)"
                    : "hover:bg-(--app-hover)",
                )}
                onClick={() => {
                  props.onSelectIndex(i);
                }}
              >
                <SlideScaledFrame scale={THUMB_SCALE}>
                  <SlideLayoutInner
                    layout={row.layout}
                    content={row.previewContent}
                    brand={props.brand}
                    slideIndex={i + 1}
                    slideTotal={slides.length}
                    activeRegion={null}
                    onRegionClick={() => {
                      console.log("region clicked");
                    }}
                    interactive={false}
                  />
                </SlideScaledFrame>
              </button>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
