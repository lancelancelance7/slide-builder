"use client";

import { Input } from "~/components/ui/input";

type Palette = {
  bg: string;
  fg: string;
  accent: string;
  highlight: string;
};

const ROLES: { key: keyof Palette; label: string }[] = [
  { key: "bg", label: "Background" },
  { key: "fg", label: "Foreground" },
  { key: "accent", label: "Accent" },
  { key: "highlight", label: "Highlight" },
];

export function BrandKitPaletteSection(props: {
  colors: Palette;
  onChange: (next: Palette) => void;
}) {
  return (
    <section className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
          Palette
        </span>
        <span className="flex-1" />
        <span className="text-[color:var(--app-text-3)] t-micro">
          Four tokens · contrast checked in preview panel
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ROLES.map(({ key, label }) => (
          <div
            key={key}
            className="flex min-w-0 flex-col gap-2 rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface)] p-2"
          >
            <div
              className="h-14 rounded-md border border-[color:var(--app-border)]"
              style={{ backgroundColor: props.colors[key] }}
            />
            <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
              {label}
            </span>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label={`${label} color`}
                className="size-8 cursor-pointer rounded border border-[color:var(--app-border)] bg-transparent"
                value={normalizeHex(props.colors[key])}
                onChange={(e) => {
                  props.onChange({
                    ...props.colors,
                    [key]: e.target.value,
                  });
                }}
              />
              <Input
                className="font-mono"
                value={props.colors[key]}
                onChange={(e) => {
                  props.onChange({
                    ...props.colors,
                    [key]: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function normalizeHex(hex: string): string {
  const h = hex.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(h)) return h;
  if (/^#[0-9a-fA-F]{3}$/.test(h)) return expandShortHex(h);
  return "#000000";
}

function expandShortHex(short: string): string {
  const s = short.slice(1);
  return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`;
}
