"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { UploadButton } from "~/lib/uploadthing";

import { UploadImagePreview } from "./upload-image-preview";

type BrandLogoUploaderProps = {
  brandKitId: string;
  logoUrl: string | null;
  disabled?: boolean;
  onUploaded: (url: string) => void;
  onClear: () => void;
};

export function BrandLogoUploader(props: BrandLogoUploaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <UploadImagePreview
        imageUrl={props.logoUrl}
        alt="Brand logo"
        emptyLabel="No logo"
        onClear={props.onClear}
        clearDisabled={props.disabled}
      />
      <UploadButton
        endpoint="brandLogo"
        input={{ brandKitId: props.brandKitId }}
        disabled={props.disabled}
        className="ut-custom-button w-full"
        content={{
          button: ({ ready, isUploading }) =>
            isUploading ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Uploading…
              </span>
            ) : ready ? (
              "Upload logo"
            ) : (
              "Preparing…"
            ),
        }}
        appearance={{
          button:
            "h-9 w-full rounded-md border border-[color:var(--app-border)] bg-[color:var(--app-surface)] px-3 t-caption font-medium text-[color:var(--app-text)] hover:bg-[color:var(--app-hover)] ut-ready:bg-[color:var(--app-surface)] ut-uploading:cursor-wait",
          allowedContent: "hidden",
        }}
        onClientUploadComplete={(res) => {
          const file = res[0];
          const url = file?.serverData?.url ?? file?.url;
          if (!url) {
            toast.error("Upload finished without a URL.");
            return;
          }
          props.onUploaded(url);
          toast.success("Logo uploaded — save the brand kit to keep it.");
        }}
        onUploadError={(error) => {
          toast.error(error.message || "Upload failed.");
        }}
      />
    </div>
  );
}
