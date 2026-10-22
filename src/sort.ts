export type SortDirection = 'asc' | 'desc';

function compare(a: unknown, b: unknown): number {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a).localeCompare(String(b));
}

/** Returns a sorted copy. Ties keep input order (Array#sort is stable). */
export function sortRows<T>(
  rows: readonly T[],
  key: keyof T,
  direction: SortDirection,
): T[] {
  const sign = direction === 'asc' ? 1 : -1;
  return [...rows].sort((x, y) => sign * compare(x[key], y[key]));
}
