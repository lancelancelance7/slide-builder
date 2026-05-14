"use client";

import { FONT_PRESETS } from "~/components/brand-kit/font-presets";

export function BrandKitTypographySection(props: {
  fontDisplay: string;
  fontText: string;
  onFontDisplayChange: (value: string) => void;
  onFontTextChange: (value: string) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
        Type
      </span>
      <div className="flex flex-col gap-2">
        <FontRow
          label="Display"
          sample="Train hard."
          fontFamily={props.fontDisplay}
          value={props.fontDisplay}
          onChange={props.onFontDisplayChange}
        />
        <FontRow
          label="Body"
          sample="A concise plan for steady membership growth."
          fontFamily={props.fontText}
          value={props.fontText}
          onChange={props.onFontTextChange}
        />
      </div>
      <p className="text-[color:var(--app-text-3)] t-micro">
        Display headings vs body copy swap automatically inside slide layouts.
      </p>
    </section>
  );
}

function fontOptions(current: string) {
  const base = [...FONT_PRESETS];
  if (!base.some((p) => p.value === current)) {
    base.unshift({ label: "Custom", value: current });
  }
  return base;
}

function FontRow(props: {
  label: string;
  sample: string;
  fontFamily: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const opts = fontOptions(props.value);

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-3 py-2.5">
      <div className="w-[92px] shrink-0">
        <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
          {props.label}
        </span>
      </div>
      <div className="hidden h-8 w-px shrink-0 bg-[color:var(--app-border)] sm:block" />
      <div className="min-w-[140px] shrink-0">
        <select
          className="h-8 w-full rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-2)] px-2 t-caption text-[color:var(--app-text)] outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-focus)]"
          value={props.value}
          onChange={(e) => {
            props.onChange(e.target.value);
          }}
        >
          {opts.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[160px] flex-1">
        <p className="t-card" style={{ fontFamily: props.fontFamily }}>
          {props.sample}
        </p>
      </div>
    </div>
  );
}
