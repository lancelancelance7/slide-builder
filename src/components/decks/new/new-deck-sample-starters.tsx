"use client";

import { LayoutTemplate, ChevronRight } from "lucide-react";

import { Button } from "~/components/ui/button";

const SAMPLES: { title: string; body: string }[] = [
  {
    title: "Sales proposal",
    body: "For a local business, 8–12 slides, ends with an ask.",
  },
  {
    title: "Board update",
    body: "Quarterly, 5 financial slides + roadmap, sober tone.",
  },
  {
    title: "Customer story",
    body: "6 slides, problem → solution → result with quotes.",
  },
  {
    title: "Product launch",
    body: "Internal kickoff, 14 slides with positioning & timeline.",
  },
];

type NewDeckSampleStartersProps = {
  onPick: (sample: { deckTitle: string; prompt: string }) => void;
};

export function NewDeckSampleStarters(props: NewDeckSampleStartersProps) {
  return (
    <section className="min-w-0 flex-1">
      <p className="mb-2 block t-caption-b text-[color:var(--app-text)]">
        Start from a sample
      </p>
      <div className="flex flex-col gap-2">
        {SAMPLES.map((s) => (
          <Button
            key={s.title}
            type="button"
            variant="outline"
            className="h-auto min-h-14 w-full justify-between gap-3 border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-3 py-3 text-left whitespace-normal"
            onClick={() =>
              props.onPick({
                deckTitle: s.title,
                prompt: s.body,
              })
            }
          >
            <span className="flex min-w-0 items-start gap-2.5">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-[color:color-mix(in_oklab,var(--color-accent)_12%,transparent)] text-[color:var(--color-accent)]">
                <LayoutTemplate className="size-4" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block t-caption-b text-[color:var(--app-text)]">
                  {s.title}
                </span>
                <span className="mt-0.5 block t-micro text-[color:var(--app-text-2)]">
                  {s.body}
                </span>
              </span>
            </span>
            <ChevronRight
              className="size-4 shrink-0 text-[color:var(--app-text-3)]"
              aria-hidden
            />
          </Button>
        ))}
      </div>
    </section>
  );
}
