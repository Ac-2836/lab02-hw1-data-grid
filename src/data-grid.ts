import type { DataGridProps } from './types.ts';

export function renderDataGrid<T>(props: DataGridProps<T>): HTMLTableElement {
  const table = document.createElement('table');
  table.setAttribute('role', 'grid');

  const caption = document.createElement('caption');
  caption.textContent = props.ariaLabel;
  table.append(caption);

  const headRow = document.createElement('tr');
  headRow.setAttribute('role', 'row');
  for (const column of props.columns) {
    const th = document.createElement('th');
    th.scope = 'col';
    th.setAttribute('role', 'columnheader');
    th.textContent = column.header;
    headRow.append(th);
  }
  const thead = document.createElement('thead');
  thead.append(headRow);

  const tbody = document.createElement('tbody');
  for (const item of props.data) {
    const tr = document.createElement('tr');
    tr.setAttribute('role', 'row');
    for (const column of props.columns) {
      const td = document.createElement('td');
      td.setAttribute('role', 'gridcell');
      td.textContent = String(item[column.accessorKey]);
      tr.append(td);
    }
    tbody.append(tr);
  }

  table.append(thead, tbody);
  return table;
}
