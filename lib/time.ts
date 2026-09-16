export function relativeTime(value: string): string {
  const ms = new Date(value).getTime();
  if (!Number.isFinite(ms)) return "recently";
  const minutes = Math.max(1, Math.round((Date.now() - ms) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}