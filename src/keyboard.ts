export interface CellPos {
  row: number;
  col: number;
}

/**
 * Next cell for a navigation key, clamped at the edges (no wrap), or null if
 * the key is not a navigation key. `colCounts[r]` is the cell count of row r;
 * rows can differ (the empty-state row has a single spanning cell).
 */
export function nextCell(
  pos: CellPos,
  key: string,
  colCounts: readonly number[],
): CellPos | null {
  const lastCol = (colCounts[pos.row] ?? 1) - 1;
  let { row, col } = pos;
  switch (key) {
    case 'ArrowUp':
      row = Math.max(row - 1, 0);
      break;
    case 'ArrowDown':
      row = Math.min(row + 1, colCounts.length - 1);
      break;
    case 'ArrowLeft':
      col = Math.max(col - 1, 0);
      break;
    case 'ArrowRight':
      col = Math.min(col + 1, lastCol);
      break;
    case 'Home':
      col = 0;
      break;
    case 'End':
      col = lastCol;
      break;
    default:
      return null;
  }
  return { row, col: Math.min(col, (colCounts[row] ?? 1) - 1) };
}

/**
 * Roving tabindex: exactly one element in the table is a tab stop. A header
 * with a sort button targets the button, any other cell targets itself.
 * refresh() only re-marks the tab stop and never moves focus, so re-renders
 * triggered from the filter input do not steal it.
 */
export function setupGridKeyboard(table: HTMLTableElement): {
  refresh: () => void;
} {
  let active: CellPos = { row: 0, col: 0 };

  const focusTarget = (pos: CellPos): HTMLElement | null => {
    const cell = table.rows[pos.row]?.cells[pos.col];
    return cell ? (cell.querySelector<HTMLElement>('button') ?? cell) : null;
  };

  function refresh(): void {
    for (const row of table.rows) {
      for (const cell of row.cells) {
        (cell.querySelector<HTMLElement>('button') ?? cell).tabIndex = -1;
      }
    }
    const row = Math.min(active.row, table.rows.length - 1);
    const cols = table.rows[row]?.cells.length ?? 1;
    active = { row, col: Math.min(active.col, cols - 1) };
    const stop = focusTarget(active);
    if (stop) stop.tabIndex = 0;
  }

  table.addEventListener('keydown', (e) => {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    if (!(e.target instanceof Element)) return;
    const cell = e.target.closest<HTMLTableCellElement>('th, td');
    const rowEl = cell?.parentElement;
    if (!cell || !(rowEl instanceof HTMLTableRowElement)) return;
    const counts = Array.from(table.rows, (r) => r.cells.length);
    const next = nextCell(
      { row: rowEl.rowIndex, col: cell.cellIndex },
      e.key,
      counts,
    );
    if (!next) return;
    e.preventDefault();
    active = next;
    refresh();
    focusTarget(next)?.focus();
  });

  return { refresh };
}
