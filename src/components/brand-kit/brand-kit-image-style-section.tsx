"use client";

import { cn } from "~/lib/utils";

import { IMAGE_STYLE_PRESETS } from "~/components/brand-kit/image-style-presets";
import { Textarea } from "~/components/ui/textarea";

export function BrandKitImageStyleSection(props: {
  imageStyle: string;
  onImageStyleChange: (value: string) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
          Image style
        </span>
        <span className="flex-1" />
        <span className="text-[color:var(--app-text-3)] t-micro">
          Guides AI imagery prompts
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        {IMAGE_STYLE_PRESETS.map((preset) => {
          const active = props.imageStyle.trim() === preset.value.trim();
          return (
            <button
              key={preset.label}
              type="button"
              className={cn(
                "flex flex-col gap-2 rounded-lg border p-2 text-left transition-colors",
                active
                  ? "border-[color:var(--color-accent)] bg-[color:var(--app-selected)]"
                  : "border-[color:var(--app-border)] bg-[color:var(--app-surface)] hover:bg-[color:var(--app-hover)]",
              )}
              onClick={() => {
                props.onImageStyleChange(preset.value);
              }}
            >
              <PresetThumb label={preset.label} />
              <span className="t-caption text-[color:var(--app-text)]">
                {preset.label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col gap-2">
        <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
          Custom instructions
        </span>
        <Textarea
          className="min-h-[88px]"
          value={props.imageStyle}
          onChange={(e) => {
            props.onImageStyleChange(e.target.value);
          }}
        />
      </div>
    </section>
  );
}

function PresetThumb(props: { label: string }) {
  const label = props.label;
  let thumbClass =
    "h-14 rounded-md border border-[color:var(--app-border)] bg-[color:var(--app-surface-2)]";

  if (label === "High-contrast photography") {
    thumbClass =
      "h-14 rounded-md bg-gradient-to-br from-[#2a1a10] via-[#0c0c0d] to-[#000]";
  }
  if (label === "Editorial illustration") {
    thumbClass =
      "h-14 rounded-md bg-gradient-to-br from-[#ffd4b8] via-[#ff7a3d] to-[#b22d00]";
  }
  if (label === "Flat product shots") {
    thumbClass =
      "h-14 rounded-md bg-gradient-to-br from-[#fafafa] via-[#d6d6d6] to-[#eaeaea]";
  }
  if (label === "None") {
    thumbClass =
      "h-14 rounded-md border border-dashed border-[color:var(--app-border)] bg-[color:var(--app-surface)]";
  }

  return <div className={thumbClass} aria-hidden />;
}
