"use client";

import { useEffect, useMemo, useRef } from "react";

import type { SlideBrandTokens } from "~/components/slides/slide-layout-inner";
import { Button } from "~/components/ui/button";
import { Spinner } from "~/components/ui/spinner";
import {
  normalizeContentForPersist,
  slideLayoutSchema,
  type PlanSlideContent,
} from "~/lib/slide-plan";
import { api } from "~/trpc/react";

import {
  DeckPrintSlides,
  type DeckPrintSlideRow,
} from "./deck-print-slides";

export function DeckPrintPageClient(props: { deckId: string }) {
  const deckId = props.deckId;
  const bundleQuery = api.slide.planBundle.useQuery({ deckId });
  const autoPrintStarted = useRef(false);

  const orderedSlides = useMemo(() => {
    const slides = bundleQuery.data?.slides;
    if (!slides) return [];
    return [...slides].sort((a, b) => a.position - b.position);
  }, [bundleQuery.data?.slides]);

  const brand: SlideBrandTokens | null = bundleQuery.data
    ? {
        colors: bundleQuery.data.brandKit.colors,
        fontDisplay: bundleQuery.data.brandKit.fontDisplay,
        fontText: bundleQuery.data.brandKit.fontText,
        logoUrl: bundleQuery.data.brandKit.logoUrl ?? null,
        kitName: bundleQuery.data.brandKit.name,
      }
    : null;

  const rows: DeckPrintSlideRow[] = useMemo(() => {
    return orderedSlides.map((s) => {
      const pl = slideLayoutSchema.safeParse(s.layout);
      const lo = pl.success ? pl.data : "imageText";
      return {
        id: s.id,
        layout: lo,
        previewContent: normalizeContentForPersist(
          lo,
          s.content,
        ) as PlanSlideContent,
      };
    });
  }, [orderedSlides]);

  useEffect(() => {
    if (!bundleQuery.isSuccess || rows.length === 0) return;
    if (autoPrintStarted.current) return;
    autoPrintStarted.current = true;

    let cancelled = false;

    const run = async () => {
      try {
        await document.fonts.ready;
      } catch {
        /* ignore */
      }
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => resolve());
      });
      if (cancelled) return;
      const imgs = Array.from(
        document.querySelectorAll<HTMLImageElement>(".deck-print-root img"),
      );
      await Promise.all(
        imgs.map(
          (img) =>
            new Promise<void>((resolve) => {
              if (img.complete) {
                resolve();
                return;
              }
              img.addEventListener("load", () => resolve(), { once: true });
              img.addEventListener("error", () => resolve(), { once: true });
            }),
        ),
      );
      if (cancelled) return;
      window.print();
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [bundleQuery.isSuccess, rows.length, deckId]);

  if (bundleQuery.isLoading || !bundleQuery.data) {
    return (
      <div className="flex flex-1 items-center justify-center gap-3 py-24">
        <Spinner />
        <span className="t-caption text-(--app-text-2)">
          Preparing deck for print…
        </span>
      </div>
    );
  }

  if (bundleQuery.isError) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8">
        <p className="t-caption text-destructive">Could not load this deck.</p>
      </div>
    );
  }

  if (!brand) {
    return null;
  }

  if (rows.length === 0) {
    return (
      <div className="deck-print-root flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="t-body text-(--app-text-2)">This deck has no slides.</p>
      </div>
    );
  }

  const title = bundleQuery.data.deck.title;

  return (
    <div className="deck-print-root flex min-h-0 flex-1 flex-col bg-(--app-bg)">
      <div className="flex shrink-0 items-center justify-between gap-4 border-b border-(--app-divider) bg-(--app-surface) px-4 py-3 print:hidden">
        <span className="t-caption truncate text-(--app-text)">{title}</span>
        <Button
          type="button"
          size="sm"
          className="shrink-0 gap-1"
          onClick={() => {
            window.print();
          }}
        >
          Print / Save as PDF
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col items-center gap-0 overflow-auto p-6 print:p-0">
        <DeckPrintSlides slides={rows} brand={brand} />
      </div>
    </div>
  );
}
