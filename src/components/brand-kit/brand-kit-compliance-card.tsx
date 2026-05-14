"use client";

import { Check } from "lucide-react";

import {
  contrastRatio,
  passesAaNormalBody,
} from "~/lib/color-contrast";

export function BrandKitComplianceCard(props: {
  colors: {
    bg: string;
    fg: string;
    accent: string;
    highlight: string;
  };
  logoUrl: string | null;
}) {
  const fgOnBg = contrastRatio(props.colors.fg, props.colors.bg);
  const fgOnAccent = contrastRatio(props.colors.fg, props.colors.accent);
  const bodyReadable = passesAaNormalBody(fgOnBg);
  const accentChipReadable = passesAaNormalBody(fgOnAccent);
  const contrastOk = bodyReadable && accentChipReadable;
  const hasLogo =
    props.logoUrl !== null && props.logoUrl.trim().length > 0;
  const passing = contrastOk && hasLogo;

  const fgBgLabel =
    fgOnBg === null ? "—" : `${fgOnBg.toFixed(1)}:1`;

  let detail =
    `Foreground on background contrast ${fgBgLabel}`;
  if (!bodyReadable && fgOnBg !== null) {
    detail += " — tighten palette for WCAG AA body text (4.5:1).";
  }
  if (!accentChipReadable && fgOnAccent !== null) {
    detail += " Accent chip contrast needs attention.";
  }
  if (contrastOk && !hasLogo) {
    detail += " Add a logo URL when assets are ready.";
  }
  if (hasLogo && contrastOk) {
    detail += " Logo URL configured.";
  }

  return (
    <div
      className={
        passing
          ? "rounded-[10px] border border-emerald-500/30 bg-emerald-500/[0.08] p-3.5"
          : "rounded-[10px] border border-amber-500/35 bg-amber-500/[0.07] p-3.5"
      }
    >
      <div className="flex gap-2.5">
        <span
          className={
            passing
              ? "flex size-[18px] shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[color:var(--color-white)]"
              : "flex size-[18px] shrink-0 items-center justify-center rounded-full bg-amber-600 text-[color:var(--color-white)]"
          }
          aria-hidden
        >
          <Check className="size-3.5" strokeWidth={3} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="t-caption-b text-[color:var(--app-text)]">
            {passing && "Brand compliance · passing"}
            {!passing && contrastOk && "Contrast OK · finish branding"}
            {!passing && !contrastOk && "Brand compliance · review"}
          </p>
          <p className="mt-1 text-[color:var(--app-text-2)] t-caption">{detail}</p>
        </div>
      </div>
    </div>
  );
}
