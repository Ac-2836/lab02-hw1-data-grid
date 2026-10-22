export interface Page<T> {
  rows: T[];
  page: number;
  pageCount: number;
}

/** 1-based page, clamped into range; an empty input still has one page. */
export function paginate<T>(
  rows: readonly T[],
  page: number,
  pageSize: number,
): Page<T> {
  if (!Number.isInteger(pageSize) || pageSize < 1) {
    throw new RangeError('pageSize must be a positive integer');
  }
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const current = Math.min(Math.max(Math.trunc(page) || 1, 1), pageCount);
  const start = (current - 1) * pageSize;
  return {
    rows: rows.slice(start, start + pageSize),
    page: current,
    pageCount,
  };
}
