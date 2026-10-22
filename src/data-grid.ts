import { filterRows } from './filter.ts';
import { setupGridKeyboard } from './keyboard.ts';
import { paginate } from './paginate.ts';
import { sortRows, type SortDirection } from './sort.ts';
import type { DataGridProps } from './types.ts';

const ARIA_SORT = { asc: 'ascending', desc: 'descending' } as const;
const PAGE_SIZE = 10;
let gridCount = 0;

export function renderDataGrid<T>(props: DataGridProps<T>): HTMLElement {
  const filterId = `grid-filter-${++gridCount}`;
  let query = '';
  let page = 1;
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

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'Pagination');
  const prev = document.createElement('button');
  prev.type = 'button';
  prev.dataset['page'] = '-1';
  prev.textContent = 'Previous';
  const pageText = document.createElement('span');
  const next = document.createElement('button');
  next.type = 'button';
  next.dataset['page'] = '1';
  next.textContent = 'Next';
  nav.append(prev, pageText, next);

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

  function fillBody(): void {
    const keys = props.columns.map((c) => c.accessorKey);
    const filtered = filterRows(props.data, query, keys);
    const column = props.columns[sortCol];
    const sorted = column
      ? sortRows(filtered, column.accessorKey, direction)
      : filtered;
    const result = paginate(sorted, page, PAGE_SIZE);
    const rows = result.rows;
    page = result.page;
    prev.disabled = page <= 1;
    next.disabled = page >= result.pageCount;
    pageText.textContent = `Page ${page} of ${result.pageCount}`;
    // Same text must not be rewritten or screen readers repeat it.
    const message =
      `Showing ${filtered.length} of ${props.data.length} rows, ` +
      `page ${page} of ${result.pageCount}`;
    if (status.textContent !== message) status.textContent = message;

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

  function renderBody(): void {
    fillBody();
    keyboard.refresh();
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
    page = 1;
    renderBody();
  }

  root.addEventListener('click', (e) => {
    if (!(e.target instanceof Element)) return;
    const button = e.target.closest<HTMLButtonElement>('button[data-col]');
    if (button) {
      toggleSort(Number(button.dataset['col']));
      return;
    }
    const pager = e.target.closest<HTMLButtonElement>('button[data-page]');
    if (!pager) return;
    page += Number(pager.dataset['page']);
    renderBody();
    // A button that just became disabled would drop keyboard focus.
    if (pager.disabled) (pager === next ? prev : next).focus();
  });
  root.addEventListener('input', (e) => {
    if (e.target !== input) return;
    query = input.value;
    page = 1;
    renderBody();
  });

  table.append(thead, tbody);
  const keyboard = setupGridKeyboard(table);
  renderBody();
  root.append(label, input, status, table, nav);
  return root;
}
