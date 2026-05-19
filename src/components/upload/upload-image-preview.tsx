"use client";

import { Button } from "~/components/ui/button";

type UploadImagePreviewProps = {
  imageUrl: string | null;
  alt: string;
  emptyLabel: string;
  onClear: () => void;
  clearDisabled?: boolean;
};

export function UploadImagePreview(props: UploadImagePreviewProps) {
  const hasImage =
    props.imageUrl !== null && props.imageUrl.trim().length > 0;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex h-[120px] items-center justify-center overflow-hidden rounded-lg border border-[color:var(--app-border)] bg-[color:var(--app-surface-2)]">
        {hasImage && (
          // eslint-disable-next-line @next/next/no-img-element -- UploadThing CDN URL
          <img
            src={props.imageUrl!}
            alt={props.alt}
            className="max-h-full max-w-full object-contain p-2"
          />
        )}
        {!hasImage && (
          <span className="t-caption text-center text-[color:var(--app-text-3)] px-3">
            {props.emptyLabel}
          </span>
        )}
      </div>
      {hasImage && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="w-full"
          disabled={props.clearDisabled}
          onClick={props.onClear}
        >
          Remove image
        </Button>
      )}
    </div>
  );
}
