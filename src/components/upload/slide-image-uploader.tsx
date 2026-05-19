"use client";

import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { UploadButton } from "~/lib/uploadthing";

import { UploadImagePreview } from "./upload-image-preview";

type SlideImageUploaderProps = {
  slideId: string;
  imageUrl: string | null;
  disabled?: boolean;
  onUploaded: (payload: { url: string; key?: string }) => void;
  onClear: () => void;
};

export function SlideImageUploader(props: SlideImageUploaderProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="t-caption text-[color:var(--app-text-2)]">Slide image</span>
      <UploadImagePreview
        imageUrl={props.imageUrl}
        alt="Slide hero"
        emptyLabel="No image yet — upload a PNG or JPG."
        onClear={props.onClear}
        clearDisabled={props.disabled}
      />
      <UploadButton
        endpoint="slideImage"
        input={{ slideId: props.slideId }}
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
              "Upload image"
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
          if (!file?.url) {
            toast.error("Upload finished without a URL.");
            return;
          }
          props.onUploaded({ url: file.url, key: file.key });
          toast.success("Image uploaded — save the slide to keep it.");
        }}
        onUploadError={(error) => {
          toast.error(error.message || "Upload failed.");
        }}
      />
      <p className="t-micro text-[color:var(--app-text-3)]">
        Saves when you click Save slide on the canvas.
      </p>
    </div>
  );
}
