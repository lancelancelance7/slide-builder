"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export function BrandKitLogoSection(props: {
  logoUrl: string | null;
  onLogoUrlChange: (url: string | null) => void;
}) {
  const urlStr = props.logoUrl ?? "";

  return (
    <section className="flex flex-col gap-3">
      <span className="t-micro-b uppercase tracking-wide text-[color:var(--app-text-3)]">
        Logo
      </span>
      <div className="flex flex-wrap gap-4">
        <div className="flex h-[90px] w-[140px] shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface)]">
          {props.logoUrl !== null &&
            props.logoUrl.trim() !== "" && (
              // eslint-disable-next-line @next/next/no-img-element -- remote kit asset URL
              <img
                src={props.logoUrl}
                alt=""
                className="max-h-full max-w-full object-contain p-2"
              />
            )}
          {(props.logoUrl === null || props.logoUrl.trim() === "") && (
            <span className="text-center text-[color:var(--app-text-3)] t-caption">
              No logo
            </span>
          )}
        </div>
        <div className="flex min-w-[200px] flex-1 flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={() => {
                const next = window.prompt("Paste an HTTPS logo URL", urlStr);
                if (next === null) return;
                props.onLogoUrlChange(next.trim() === "" ? null : next.trim());
              }}
            >
              Set logo URL
            </Button>
            <Button
              size="sm"
              type="button"
              variant="ghost"
              disabled={
                props.logoUrl === null || props.logoUrl.trim() === ""
              }
              onClick={() => {
                props.onLogoUrlChange(null);
              }}
            >
              Clear
            </Button>
          </div>
          <Input
            placeholder="https://…"
            value={urlStr}
            onChange={(e) => {
              const v = e.target.value;
              props.onLogoUrlChange(v.trim() === "" ? null : v);
            }}
          />
          <p className="text-[color:var(--app-text-3)] t-micro">
            Upload pipeline ships later — URLs must be reachable from your browser for preview.
          </p>
        </div>
      </div>
    </section>
  );
}
