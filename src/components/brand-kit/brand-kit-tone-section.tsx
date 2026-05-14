"use client";

import { Check } from "lucide-react";

import { cn } from "~/lib/utils";

export type BrandToneId = "direct" | "warm" | "technical";

const DEFINITIONS: {
  id: BrandToneId;
  label: string;
  sample: string;
}[] = [
  {
    id: "direct",
    label: "Direct",
    sample: "Train hard. Sell harder.",
  },
  {
    id: "warm",
    label: "Warm",
    sample: "A gym that knows your name.",
  },
  {
    id: "technical",
    label: "Technical",
    sample: "Cohort retention up 31% YoY.",
  },
];

export function BrandKitToneSection(props: {
  tone: BrandToneId;
  onToneChange: (tone: BrandToneId) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
        Tone of voice
      </span>
      <div className="flex flex-wrap gap-2">
        {DEFINITIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={cn(
              "flex min-w-[120px] flex-1 flex-col gap-2 rounded-lg border p-3 text-left transition-colors",
              props.tone === item.id
                ? "border-[color:var(--color-accent)] bg-[color:var(--app-selected)]"
                : "border-[color:var(--app-border)] bg-[color:var(--app-surface)] hover:bg-[color:var(--app-hover)]",
            )}
            onClick={() => {
              props.onToneChange(item.id);
            }}
          >
            <span className="flex items-center gap-2">
              <span className="t-caption-b text-[color:var(--app-text)]">
                {item.label}
              </span>
              <span className="flex-1" />
              {props.tone === item.id && (
                <Check
                  aria-hidden
                  className="size-4 text-[color:var(--color-accent)]"
                />
              )}
            </span>
            <span className="italic text-[color:var(--app-text-2)] t-caption">
              “{item.sample}”
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
