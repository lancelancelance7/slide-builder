import { UploadThingError } from "@uploadthing/shared";
import { eq } from "drizzle-orm";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { z } from "zod";

import { db } from "~/server/db";
import { brandKits, slides } from "~/server/db/schema";

const f = createUploadthing();

function uploadedFileUrl(file: {
  ufsUrl?: string | null;
  url?: string | null;
}): string {
  const url = file.ufsUrl ?? file.url;
  if (!url || url.trim().length === 0) {
    throw new UploadThingError("Upload completed without a file URL.");
  }
  return url;
}

export const uploadRouter = {
  slideImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .input(z.object({ slideId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const row = await db.query.slides.findFirst({
        where: eq(slides.id, input.slideId),
        columns: { id: true },
      });
      if (!row) {
        throw new UploadThingError("Slide not found.");
      }
      return { slideId: input.slideId };
    })
    .onUploadComplete(async ({ file }) => ({
      url: uploadedFileUrl(file),
      key: file.key,
    })),

  brandLogo: f({
    image: { maxFileSize: "2MB", maxFileCount: 1 },
  })
    .input(z.object({ brandKitId: z.string().uuid() }))
    .middleware(async ({ input }) => {
      const row = await db.query.brandKits.findFirst({
        where: eq(brandKits.id, input.brandKitId),
        columns: { id: true },
      });
      if (!row) {
        throw new UploadThingError("Brand kit not found.");
      }
      return { brandKitId: input.brandKitId };
    })
    .onUploadComplete(async ({ file }) => ({
      url: uploadedFileUrl(file),
      key: file.key,
    })),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
