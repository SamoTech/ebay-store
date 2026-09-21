export function formatVisitCount(count: number | string | null): string {
  if (count === null) return '—';
  const normalized = typeof count === 'number' ? count.toString() : count;
  if (!/^\d+$/.test(normalized)) return '—';
  return normalized.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
