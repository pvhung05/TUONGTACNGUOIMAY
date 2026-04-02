/**
 * Format a timestamp to a readable date string
 */
export function formatDate(date: Date | string, locale = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString(locale);
}

/**
 * Format a timestamp to a readable time string
 */
export function formatTime(date: Date | string, locale = "en-US"): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString(locale);
}

/**
 * Format a timestamp to ISO string
 */
export function formatISO(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}
