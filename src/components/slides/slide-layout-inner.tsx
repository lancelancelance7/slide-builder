"use client";

import type { ReactNode } from "react";

import type { PlanSlideContent } from "~/lib/slide-plan";
import type { SlideLayoutId } from "~/lib/slide-plan";
import { cn } from "~/lib/utils";

import { RegionHitTarget, regionShell } from "./slide-region-hit-target";

export type SlideBrandTokens = {
  colors: { bg: string; fg: string; accent: string; highlight: string };
  fontDisplay: string;
  fontText: string;
  logoUrl: string | null;
  kitName: string;
};

export type EditorRegionId =
  | "eyebrow"
  | "headline"
  | "supporting"
  | "bullets"
  | "columns";

type SlideLayoutInnerProps = {
  layout: SlideLayoutId;
  content: PlanSlideContent;
  brand: SlideBrandTokens;
  slideIndex: number;
  slideTotal: number;
  activeRegion: EditorRegionId | null;
  onRegionClick: (region: EditorRegionId) => void;
  /** When false, regions are non-interactive divs (e.g. thumbnails inside another control). */
  interactive?: boolean;
};

function SlideFooter(props: {
  brand: SlideBrandTokens;
  slideIndex: number;
  slideTotal: number;
}) {
  const pad = String(props.slideIndex).padStart(2, "0");
  const tot = String(props.slideTotal).padStart(2, "0");
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-10 pb-6">
      <span
        className="t-micro tracking-wide uppercase opacity-50"
        style={{ fontFamily: props.brand.fontText }}
      >
        {props.brand.kitName}
      </span>
      <span
        className="t-micro tabular-nums opacity-50"
        style={{ fontFamily: props.brand.fontText }}
      >
        {pad}/{tot}
      </span>
    </div>
  );
}

export function SlideLayoutInner(props: SlideLayoutInnerProps) {
  const { layout, content, brand } = props;
  const { colors, fontDisplay, fontText } = brand;
  const interactive = props.interactive !== false;
  const regionRing = (active: boolean) =>
    regionShell(active, interactive ? undefined : { cursor: false });

  const footer = (
    <SlideFooter
      brand={brand}
      slideIndex={props.slideIndex}
      slideTotal={props.slideTotal}
    />
  );

  const logoCorner =
    brand.logoUrl && brand.logoUrl.trim().length > 0 ? (
      <div className="pointer-events-none absolute top-6 right-10 max-h-12 max-w-[140px] opacity-90">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={brand.logoUrl}
          alt=""
          className="max-h-12 w-auto max-w-[140px] object-contain object-right"
        />
      </div>
    ) : null;

  const shell = (
    className: string,
    inner: ReactNode,
    opts?: { relative?: boolean },
  ) => (
    <div
      className={cn(
        "relative flex flex-1 flex-col",
        opts?.relative !== false && "relative",
        className,
      )}
      style={{
        backgroundColor: colors.bg,
        color: colors.fg,
      }}
    >
      {logoCorner}
      {inner}
      {footer}
    </div>
  );

  if (layout === "title") {
    const eyebrow = (content.eyebrow ?? "").trim();
    const subtitle = (content.subtitle ?? content.body ?? "").trim();
    return shell(
      "justify-center px-24 py-16",
      <div className="flex flex-col gap-4">
        {eyebrow.length > 0 && (
          <RegionHitTarget
            interactive={interactive}
            className={cn(
              "t-caption w-fit border-0 bg-transparent p-2 text-left tracking-wide uppercase opacity-80",
              regionRing(props.activeRegion === "eyebrow"),
            )}
            style={{ fontFamily: fontText, color: colors.highlight }}
            onRegionActivate={() => {
              props.onRegionClick("eyebrow");
            }}
          >
            {eyebrow}
          </RegionHitTarget>
        )}
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "w-full border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "headline"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("headline");
          }}
        >
          <span className="t-display" style={{ fontFamily: fontDisplay }}>
            {content.title}
          </span>
        </RegionHitTarget>
        <div
          className="h-1 w-24 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "mt-6 w-full border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "supporting"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("supporting");
          }}
        >
          <p
            className="t-body max-w-xl"
            style={{
              fontFamily: fontText,
              color: colors.highlight,
              opacity: subtitle.length > 0 ? 1 : 0.45,
            }}
          >
            {subtitle.length > 0 ? subtitle : "Subtitle"}
          </p>
        </RegionHitTarget>
      </div>,
    );
  }

  if (layout === "section") {
    const bullets = content.bullets ?? [];
    return shell(
      "px-20 pt-14 pb-16",
      <>
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "mb-8 w-fit border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "headline"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("headline");
          }}
        >
          <div
            className="mb-8 h-1 w-full rounded-full"
            style={{ backgroundColor: colors.accent }}
          />
          <p className="t-tile" style={{ fontFamily: fontDisplay }}>
            {content.title}
          </p>
        </RegionHitTarget>
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "w-full border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "bullets"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("bullets");
          }}
        >
          <ul className="flex flex-col gap-5">
            {bullets.map((line) => (
              <li key={line} className="flex gap-4">
                <span
                  className="mt-2 size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: colors.highlight }}
                />
                <span className="t-body" style={{ fontFamily: fontText }}>
                  {line}
                </span>
              </li>
            ))}
            {bullets.length === 0 && (
              <li
                className="t-caption opacity-50"
                style={{ fontFamily: fontText }}
              >
                Add bullets in the inspector.
              </li>
            )}
          </ul>
        </RegionHitTarget>
      </>,
    );
  }

  if (layout === "imageText") {
    const heroUrl =
      typeof content.imageUrl === "string" && content.imageUrl.trim().length > 0
        ? content.imageUrl.trim()
        : null;

    return shell(
      "flex-row gap-10 px-14 pt-12 pb-16",
      <>
        <div className="flex h-[420px] min-w-0 flex-[1.05] overflow-hidden rounded-xl border border-dashed border-(--app-border) bg-black/10">
          {heroUrl && (
            // eslint-disable-next-line @next/next/no-img-element -- UploadThing or external CDN
            <img
              src={heroUrl}
              alt=""
              className="size-full object-cover"
            />
          )}
          {!heroUrl && <div className="size-full" aria-hidden />}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-5 pr-6">
          <RegionHitTarget
            interactive={interactive}
            className={cn(
              "w-full border-0 bg-transparent p-2 text-left",
              regionRing(props.activeRegion === "headline"),
            )}
            onRegionActivate={() => {
              props.onRegionClick("headline");
            }}
          >
            <div
              className="mb-4 h-1 w-20 rounded-full"
              style={{ backgroundColor: colors.accent }}
            />
            <p className="t-tile" style={{ fontFamily: fontDisplay }}>
              {content.title}
            </p>
          </RegionHitTarget>
          <RegionHitTarget
            interactive={interactive}
            className={cn(
              "w-full border-0 bg-transparent p-2 text-left",
              regionRing(props.activeRegion === "supporting"),
            )}
            onRegionActivate={() => {
              props.onRegionClick("supporting");
            }}
          >
            <p className="t-body" style={{ fontFamily: fontText }}>
              {(content.body ?? "").trim().length > 0
                ? content.body
                : "Supporting copy"}
            </p>
          </RegionHitTarget>
        </div>
      </>,
    );
  }

  if (layout === "quote") {
    const q = content.quote?.text ?? content.title;
    const author = content.quote?.author ?? "";
    return shell(
      "justify-center px-24 py-16",
      <div className="flex max-w-4xl flex-col gap-8">
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "w-full border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "headline"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("headline");
          }}
        >
          <p
            className="t-display leading-snug"
            style={{ fontFamily: fontDisplay }}
          >
            “{q}”
          </p>
        </RegionHitTarget>
        <div
          className="h-1 w-16 rounded-full"
          style={{ backgroundColor: colors.accent }}
        />
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "w-full border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "supporting"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("supporting");
          }}
        >
          {author.trim().length > 0 && (
            <p className="t-body" style={{ fontFamily: fontText }}>
              — {author}
            </p>
          )}
          {author.trim().length === 0 && (
            <p className="t-body opacity-45" style={{ fontFamily: fontText }}>
              Attribution
            </p>
          )}
        </RegionHitTarget>
      </div>,
    );
  }

  if (layout === "comparison") {
    const cols = content.comparison?.columns ?? [];
    return shell(
      "px-16 pt-14 pb-16",
      <>
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "mb-10 w-full border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "headline"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("headline");
          }}
        >
          <p className="t-tile" style={{ fontFamily: fontDisplay }}>
            {content.title}
          </p>
        </RegionHitTarget>
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "grid w-full flex-1 grid-cols-2 gap-8 border-0 bg-transparent p-2 text-left",
            regionRing(props.activeRegion === "columns"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("columns");
          }}
        >
          {cols.map((col, colIdx) => (
            <div
              key={`comparison-col-${colIdx}`}
              className="flex flex-col gap-4 rounded-xl border border-(--app-border) bg-(--app-surface)/5 p-6"
            >
              <p
                className="t-caption-b tracking-wide uppercase"
                style={{ fontFamily: fontDisplay, color: colors.accent }}
              >
                {col.heading}
              </p>
              <ul className="flex flex-col gap-3">
                {col.rows.map((r, rowIdx) => (
                  <li
                    key={`comparison-col-${colIdx}-row-${rowIdx}`}
                    className="t-body"
                    style={{ fontFamily: fontText }}
                  >
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {cols.length === 0 && (
            <p className="t-caption col-span-2 opacity-60">
              Add columns in the inspector.
            </p>
          )}
        </RegionHitTarget>
      </>,
    );
  }

  if (layout === "statHero") {
    const num = content.stat?.number ?? content.title;
    const label = content.stat?.label ?? content.body ?? "";
    return shell(
      "items-center justify-center px-20 py-16",
      <div className="flex flex-col items-center gap-6 text-center">
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "border-0 bg-transparent p-4",
            regionRing(props.activeRegion === "headline"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("headline");
          }}
        >
          <span
            className="font-semibold tabular-nums"
            style={{
              fontFamily: fontDisplay,
              color: colors.accent,
              fontSize: "clamp(4rem,12vw,8rem)",
              lineHeight: 1,
            }}
          >
            {num}
          </span>
        </RegionHitTarget>
        <RegionHitTarget
          interactive={interactive}
          className={cn(
            "max-w-xl border-0 bg-transparent p-2",
            regionRing(props.activeRegion === "supporting"),
          )}
          onRegionActivate={() => {
            props.onRegionClick("supporting");
          }}
        >
          <p className="t-body" style={{ fontFamily: fontText }}>
            {label}
          </p>
        </RegionHitTarget>
      </div>,
    );
  }

  return shell(
    "justify-center px-24 py-16",
    <div className="flex flex-col gap-6">
      <RegionHitTarget
        interactive={interactive}
        className={cn(
          "w-full border-0 bg-transparent p-2 text-left",
          regionRing(props.activeRegion === "headline"),
        )}
        onRegionActivate={() => {
          props.onRegionClick("headline");
        }}
      >
        <p className="t-display" style={{ fontFamily: fontDisplay }}>
          {content.title}
        </p>
      </RegionHitTarget>
      <div
        className="h-1 w-20 rounded-full"
        style={{ backgroundColor: colors.accent }}
      />
      <RegionHitTarget
        interactive={interactive}
        className={cn(
          "w-full border-0 bg-transparent p-2 text-left",
          regionRing(props.activeRegion === "supporting"),
        )}
        onRegionActivate={() => {
          props.onRegionClick("supporting");
        }}
      >
        <p className="t-body max-w-2xl" style={{ fontFamily: fontText }}>
          {(content.body ?? "").trim().length > 0 ? content.body : " "}
        </p>
      </RegionHitTarget>
    </div>,
  );
}
