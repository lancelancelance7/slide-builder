"use client";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { BrandLogoUploader } from "~/components/upload/brand-logo-uploader";

export function BrandKitLogoSection(props: {
  brandKitId: string;
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
        <BrandLogoUploader
          brandKitId={props.brandKitId}
          logoUrl={props.logoUrl}
          onUploaded={(url) => {
            props.onLogoUrlChange(url);
          }}
          onClear={() => {
            props.onLogoUrlChange(null);
          }}
        />
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
            Upload a PNG or SVG, or paste a public URL. Save the kit to persist.
          </p>
        </div>
      </div>
    </section>
  );
}
