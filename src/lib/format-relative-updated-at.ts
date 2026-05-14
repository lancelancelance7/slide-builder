export function formatRelativeUpdatedAt(updatedAt: Date) {
  const now = Date.now();
  const diffSec = Math.round((updatedAt.getTime() - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  const absSeconds = Math.abs(diffSec);
  if (absSeconds < 45) {
    return rtf.format(diffSec, "seconds");
  }

  const diffMin = Math.round(diffSec / 60);
  if (Math.abs(diffMin) < 60) {
    return rtf.format(diffMin, "minutes");
  }

  const diffHour = Math.round(diffMin / 60);
  if (Math.abs(diffHour) < 24) {
    return rtf.format(diffHour, "hours");
  }

  const diffDay = Math.round(diffHour / 24);
  if (Math.abs(diffDay) < 30) {
    return rtf.format(diffDay, "days");
  }

  const diffMonth = Math.round(diffDay / 30);
  if (Math.abs(diffMonth) < 12) {
    return rtf.format(diffMonth, "months");
  }

  const diffYear = Math.round(diffMonth / 12);
  if (Math.abs(diffYear) < 8) {
    return rtf.format(diffYear, "years");
  }

  return updatedAt.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
