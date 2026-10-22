/**
 * Case-insensitive substring match of the trimmed query against the given
 * keys. A blank query keeps every row.
 */
export function filterRows<T>(
  rows: readonly T[],
  query: string,
  keys: readonly (keyof T)[],
): T[] {
  const needle = query.trim().toLowerCase();
  if (needle === '') return [...rows];
  return rows.filter((row) =>
    keys.some((key) => String(row[key]).toLowerCase().includes(needle)),
  );
}
