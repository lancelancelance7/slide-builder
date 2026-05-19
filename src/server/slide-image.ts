import type { SlideImageAsset, SlideLayoutId } from "~/lib/slide-plan";
import {
  normalizeContentForPersist,
  slideImageAssetSchema,
} from "~/lib/slide-plan";

export type PersistSlideImageInput = {
  layout: SlideLayoutId;
  existingContent: Record<string, unknown>;
  url: string;
  source: SlideImageAsset["source"];
  uploadthingKey?: string;
};

/** Build slide `content` patch for a stored image URL (upload or future AI). */
export function buildSlideContentWithImage(
  input: PersistSlideImageInput,
): Record<string, unknown> {
  const imageAsset: SlideImageAsset = {
    source: input.source,
    uploadthingKey: input.uploadthingKey,
    generatedAt:
      input.source === "ai" ? new Date().toISOString() : undefined,
  };
  const parsedAsset = slideImageAssetSchema.safeParse(imageAsset);
  const asset = parsedAsset.success ? parsedAsset.data : undefined;

  return normalizeContentForPersist(input.layout, {
    ...input.existingContent,
    imageUrl: input.url,
    imageAsset: asset,
  });
}
