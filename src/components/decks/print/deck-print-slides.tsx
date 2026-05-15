"use client";

import type { SlideBrandTokens } from "~/components/slides/slide-layout-inner";
import { SlideLayoutInner } from "~/components/slides/slide-layout-inner";
import { SlideScaledFrame } from "~/components/slides/slide-scaled-frame";
import { cn } from "~/lib/utils";
import type { PlanSlideContent } from "~/lib/slide-plan";
import type { SlideLayoutId } from "~/lib/slide-plan";

export type DeckPrintSlideRow = {
  id: string;
  layout: SlideLayoutId;
  previewContent: PlanSlideContent;
};

type DeckPrintSlidesProps = {
  slides: DeckPrintSlideRow[];
  brand: SlideBrandTokens;
};

export function DeckPrintSlides(props: DeckPrintSlidesProps) {
  const { slides, brand } = props;
  const total = slides.length;

  return (
    <>
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "flex justify-center",
            i < total - 1 && "deck-print-page-break",
          )}
        >
          <SlideScaledFrame scale={1}>
            <SlideLayoutInner
              layout={s.layout}
              content={s.previewContent}
              brand={brand}
              slideIndex={i + 1}
              slideTotal={total}
              activeRegion={null}
              onRegionClick={() => {
                console.log("region clicked");
              }}
              interactive={false}
            />
          </SlideScaledFrame>
        </div>
      ))}
    </>
  );
}
