/** Hex pairs (#rgb / #rrggbb). Returns WCAG relative luminance channel-linearized (sRGB). */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const h = hex.trim().replace(/^#/, "");
  if (h.length === 3) {
    const r = Number.parseInt(h.slice(0, 1).repeat(2), 16);
    const g = Number.parseInt(h.slice(1, 2).repeat(2), 16);
    const b = Number.parseInt(h.slice(2, 3).repeat(2), 16);
    return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)
      ? { r, g, b }
      : null;
  }
  if (h.length === 6) {
    const r = Number.parseInt(h.slice(0, 2), 16);
    const g = Number.parseInt(h.slice(2, 4), 16);
    const b = Number.parseInt(h.slice(4, 6), 16);
    return Number.isFinite(r) && Number.isFinite(g) && Number.isFinite(b)
      ? { r, g, b }
      : null;
  }
  return null;
}

function channelLuminance(channel255: number): number {
  const x = channel255 / 255;
  return x <= 0.039_28 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function luminance(rgb: { r: number; g: number; b: number }): number {
  return (
    0.2126 * channelLuminance(rgb.r) +
    0.7152 * channelLuminance(rgb.g) +
    0.0722 * channelLuminance(rgb.b)
  );
}

/** Contrast ratio of two sRGB hex colors (normal text AA threshold typically 4.5). */
export function contrastRatio(hexA: string, hexB: string): number | null {
  const ca = hexToRgb(hexA);
  const cb = hexToRgb(hexB);
  if (!ca || !cb) {
    return null;
  }
  const la = luminance(ca);
  const lb = luminance(cb);
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

export function passesAaNormalBody(ratio: number | null): boolean {
  return ratio !== null && ratio >= 4.5;
}
