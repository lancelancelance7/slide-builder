import type { brandKits } from "~/server/db/schema";

export type BrandKitDraft = {
  name: string;
  logoUrl: string | null;
  colors: {
    bg: string;
    fg: string;
    accent: string;
    highlight: string;
  };
  fontDisplay: string;
  fontText: string;
  tone: "direct" | "warm" | "technical";
  imageStyle: string;
};

export function draftFromKitRow(
  kit: typeof brandKits.$inferSelect,
): BrandKitDraft {
  return {
    name: kit.name,
    logoUrl: kit.logoUrl ?? null,
    colors: { ...kit.colors },
    fontDisplay: kit.fontDisplay,
    fontText: kit.fontText,
    tone: kit.tone,
    imageStyle: kit.imageStyle,
  };
}

export function draftsEqual(a: BrandKitDraft, b: BrandKitDraft): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
