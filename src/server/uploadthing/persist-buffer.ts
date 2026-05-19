import "server-only";

import { UTApi, UTFile } from "uploadthing/server";

const utapi = new UTApi();

type UploadedFile = {
  url?: string | null;
  ufsUrl?: string | null;
  key?: string;
};

function uploadedFileUrl(file: UploadedFile): string {
  const url = file.ufsUrl ?? file.url;
  if (!url || url.trim().length === 0) {
    throw new Error("Upload finished without a file URL.");
  }
  return url;
}

/** Upload raw image bytes to UploadThing and return a durable URL. */
export async function persistImageBuffer(input: {
  buffer: Buffer;
  filename: string;
  contentType?: string;
}): Promise<{ url: string; key?: string }> {
  const file = new UTFile(
    [input.buffer as unknown as ArrayBuffer],
    input.filename,
    {
      type: input.contentType ?? "image/png",
    },
  );
  const result = await utapi.uploadFiles(file);

  if (result.error) {
    throw new Error(result.error.message || "Image upload failed.");
  }

  const data = result.data;
  if (!data) {
    throw new Error("Image upload returned no data.");
  }

  return {
    url: uploadedFileUrl(data),
    key: data.key,
  };
}
