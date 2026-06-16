/** Format bytes to human-readable string */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Format date to locale string */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

/** Format date relative to now (e.g. "2 hours ago") */
export function formatRelative(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const diffMs = new Date(date).getTime() - Date.now();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (Math.abs(diffSec) < 60) return rtf.format(diffSec, "second");
  if (Math.abs(diffMin) < 60) return rtf.format(diffMin, "minute");
  if (Math.abs(diffHr) < 24) return rtf.format(diffHr, "hour");
  return rtf.format(diffDay, "day");
}

/** Tool label map */
export const TOOL_LABELS: Record<string, string> = {
  background_remover: "Background Remover",
  white_background: "White Background",
  passport_photo: "Passport Photo",
  linkedin_photo: "LinkedIn Photo",
  instagram_dp: "Instagram DP",
};

/** Cap daily usage string */
export function usageLabel(used: number, limit: number | typeof Infinity): string {
  if (limit === Infinity) return `${used} (unlimited)`;
  return `${used} / ${limit}`;
}
