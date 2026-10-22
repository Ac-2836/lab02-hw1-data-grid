import { filterRows } from './filter.ts';
import { sortRows, type SortDirection } from './sort.ts';
import type { DataGridProps } from './types.ts';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;
let gridCount = 0;

export function renderDataGrid<T>(props: DataGridProps<T>): HTMLElement {
  const filterId = `grid-filter-${++gridCount}`;
  let query = '';
  let sortCol = -1;
  let direction: SortDirection = 'asc';

  const root = document.createElement('section');

  const label = document.createElement('label');
  label.htmlFor = filterId;
  label.textContent = 'Filter rows';
  const input = document.createElement('input');
  input.type = 'search';
  input.id = filterId;

  const status = document.createElement('p');
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

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
    const keys = props.columns.map((c) => c.accessorKey);
    const filtered = filterRows(props.data, query, keys);
    const column = props.columns[sortCol];
    const rows = column
      ? sortRows(filtered, column.accessorKey, direction)
      : filtered;
    status.textContent = `Showing ${rows.length} of ${props.data.length} rows`;

    if (rows.length === 0) {
      const td = document.createElement('td');
      td.setAttribute('role', 'gridcell');
      td.colSpan = props.columns.length;
      td.textContent = 'No matching rows';
      const tr = document.createElement('tr');
      tr.setAttribute('role', 'row');
      tr.append(td);
      tbody.replaceChildren(tr);
      return;
    }
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

  root.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest<HTMLButtonElement>('button[data-col]');
    if (button) toggleSort(Number(button.dataset['col']));
  });
  root.addEventListener('input', (e) => {
    if (e.target !== input) return;
    query = input.value;
    renderBody();
  });

  renderBody();
  table.append(thead, tbody);
  root.append(label, input, status, table);
  return root;
}
