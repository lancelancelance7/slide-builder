"use client";

import { cn } from "~/lib/utils";

export type PreviewTab = "cover" | "content";

export type BrandKitPreviewModel = {
  name: string;
  colors: {
    bg: string;
    fg: string;
    accent: string;
    highlight: string;
  };
  fontDisplay: string;
  fontText: string;
};

const LOGICAL_W = 1280;
const LOGICAL_H = 720;
const TARGET_W = 540;

export function BrandKitLivePreview(props: {
  draft: BrandKitPreviewModel;
  tab: PreviewTab;
  onTabChange: (tab: PreviewTab) => void;
}) {
  const scale = TARGET_W / LOGICAL_W;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
          Live preview
        </span>
        <span className="flex-1" />
        <div className="flex gap-1">
          <button
            type="button"
            className={cn(
              "rounded-md border px-2 py-1 transition-colors t-caption",
              props.tab === "cover"
                ? "border-[color:var(--app-border)] bg-[color:var(--app-surface)] text-[color:var(--app-text)]"
                : "border-transparent bg-transparent text-[color:var(--app-text-2)] hover:bg-[color:var(--app-hover)]",
            )}
            onClick={() => {
              props.onTabChange("cover");
            }}
          >
            Cover
          </button>
          <button
            type="button"
            className={cn(
              "rounded-md border px-2 py-1 transition-colors t-caption",
              props.tab === "content"
                ? "border-[color:var(--app-border)] bg-[color:var(--app-surface)] text-[color:var(--app-text)]"
                : "border-transparent bg-transparent text-[color:var(--app-text-2)] hover:bg-[color:var(--app-hover)]",
            )}
            onClick={() => {
              props.onTabChange("content");
            }}
          >
            Content
          </button>
        </div>
      </div>

      <div
        className="rounded-xl border border-[color:var(--app-border)] bg-[color:var(--app-surface-2)] p-4"
        style={{
          height: LOGICAL_H * scale,
        }}
      >
        <div
          className="overflow-hidden rounded-lg shadow-[var(--app-shadow-soft)]"
          style={{
            width: TARGET_W,
            height: LOGICAL_H * scale,
          }}
        >
          <div
            className="flex flex-col"
            style={{
              width: LOGICAL_W,
              height: LOGICAL_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              backgroundColor: props.draft.colors.bg,
              color: props.draft.colors.fg,
            }}
          >
            {props.tab === "cover" && (
              <div className="flex flex-1 flex-col justify-center px-24 py-16">
                <p
                  className="t-display"
                  style={{
                    fontFamily: props.draft.fontDisplay,
                    color: props.draft.colors.fg,
                  }}
                >
                  {props.draft.name.trim() || "Untitled kit"}
                </p>
                <div
                  className="mt-6 h-1 w-24 rounded-full"
                  style={{ backgroundColor: props.draft.colors.accent }}
                />
                <p
                  className="mt-10 max-w-xl t-body"
                  style={{
                    fontFamily: props.draft.fontText,
                    color: props.draft.colors.highlight,
                  }}
                >
                  Membership momentum through disciplined storytelling.
                </p>
              </div>
            )}
            {props.tab === "content" && (
              <div className="flex flex-1 flex-col px-20 pt-14 pb-16">
                <div
                  className="mb-8 h-1 w-full rounded-full"
                  style={{ backgroundColor: props.draft.colors.accent }}
                />
                <p
                  className="t-tile"
                  style={{ fontFamily: props.draft.fontDisplay }}
                >
                  Quarterly priorities
                </p>
                <ul className="mt-8 flex flex-col gap-5">
                  {[
                    "Grow trial-to-member conversion",
                    "Launch studio renewal campaign",
                    "Operational excellence checkpoints",
                  ].map((line) => (
                    <li key={line} className="flex gap-4">
                      <span
                        className="mt-2 size-2 shrink-0 rounded-full"
                        style={{
                          backgroundColor: props.draft.colors.highlight,
                        }}
                      />
                      <span
                        className="t-body"
                        style={{ fontFamily: props.draft.fontText }}
                      >
                        {line}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
