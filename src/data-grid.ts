import { sortRows, type SortDirection } from './sort.ts';
import type { DataGridProps } from './types.ts';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;

export function renderDataGrid<T>(props: DataGridProps<T>): HTMLTableElement {
  let sortCol = -1;
  let direction: SortDirection = 'asc';

  const table = document.createElement('table');
  table.setAttribute('role', 'grid');

  const caption = document.createElement('caption');
  caption.textContent = props.ariaLabel;
  table.append(caption);

  const headRow = document.createElement('tr');
  headRow.setAttribute('role', 'row');
  props.columns.forEach((column, index) => {
    const th = document.createElement('th');
    th.scope = 'col';
    th.setAttribute('role', 'columnheader');
    if (column.sortable) {
      th.setAttribute('aria-sort', 'none');
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset['col'] = String(index);
      button.textContent = column.header;
      th.append(button);
    } else {
      th.textContent = column.header;
    }
    headRow.append(th);
  });
  const thead = document.createElement('thead');
  thead.append(headRow);

  const tbody = document.createElement('tbody');

  function renderBody(): void {
    const column = props.columns[sortCol];
    const rows = column
      ? sortRows(props.data, column.accessorKey, direction)
      : props.data;
    tbody.replaceChildren(
      ...rows.map((item) => {
        const tr = document.createElement('tr');
        tr.setAttribute('role', 'row');
        for (const col of props.columns) {
          const td = document.createElement('td');
          td.setAttribute('role', 'gridcell');
          td.textContent = String(item[col.accessorKey]);
          tr.append(td);
        }
        return tr;
      }),
    );
  }

  // none -> asc -> desc -> none; headers update in place to keep focus.
  function toggleSort(index: number): void {
    if (index !== sortCol) {
      sortCol = index;
      direction = 'asc';
    } else if (direction === 'asc') {
      direction = 'desc';
    } else {
      sortCol = -1;
    }
    headRow.querySelectorAll('th[aria-sort]').forEach((th) => {
      const button = th.querySelector('button');
      const active = button?.dataset['col'] === String(sortCol);
      th.setAttribute('aria-sort', active ? ARIA_SORT[direction] : 'none');
    });
    renderBody();
  }

  table.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest<HTMLButtonElement>('button[data-col]');
    if (button) toggleSort(Number(button.dataset['col']));
  });

  renderBody();
  table.append(thead, tbody);
  return table;
}
