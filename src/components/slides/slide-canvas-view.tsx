"use client";

import { Loader2, Minus, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import type { PlanSlideContent } from "~/lib/slide-plan";
import type { SlideLayoutId } from "~/lib/slide-plan";

import {
  type EditorRegionId,
  SlideLayoutInner,
  type SlideBrandTokens,
} from "./slide-layout-inner";
import { SlideScaledFrame } from "./slide-scaled-frame";

type SlideCanvasViewProps = {
  scale: number;
  onScaleChange: (next: number) => void;
  layout: SlideLayoutId;
  previewContent: PlanSlideContent;
  brand: SlideBrandTokens;
  slideIndex: number;
  slideTotal: number;
  activeRegion: EditorRegionId | null;
  onRegionClick: (region: EditorRegionId) => void;
  onSaveSlide?: () => void;
  saveSlidePending?: boolean;
  saveSlideDisabled?: boolean;
};

export function SlideCanvasView(props: SlideCanvasViewProps) {
  const { scale } = props;
  const lo = Math.min(1.1, Math.max(0.22, scale));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center gap-2 border-b border-[color:var(--app-divider)] bg-[color:var(--app-surface-2)] px-4 py-2">
        <span className="t-micro tracking-wide text-[color:var(--app-text-3)] uppercase">
          Zoom
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Zoom out"
          onClick={() => {
            props.onScaleChange(lo - 0.06);
          }}
        >
          <Minus className="size-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label="Zoom in"
          onClick={() => {
            props.onScaleChange(lo + 0.06);
          }}
        >
          <Plus className="size-4" />
        </Button>
        <span className="flex-1" aria-hidden />
        {props.onSaveSlide && (
          <Button
            type="button"
            size="sm"
            disabled={!!props.saveSlideDisabled || props.saveSlidePending}
            className={props.saveSlidePending ? "cursor-wait gap-2" : "gap-2"}
            onClick={() => {
              props.onSaveSlide?.();
            }}
          >
            {props.saveSlidePending && (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            )}
            {props.saveSlidePending ? "Saving…" : "Save slide"}
          </Button>
        )}
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto bg-(--app-bg) p-6">
        <SlideScaledFrame scale={lo}>
          <SlideLayoutInner
            layout={props.layout}
            content={props.previewContent}
            brand={props.brand}
            slideIndex={props.slideIndex}
            slideTotal={props.slideTotal}
            activeRegion={props.activeRegion}
            onRegionClick={props.onRegionClick}
          />
        </SlideScaledFrame>
      </div>
    </div>
  );
}
