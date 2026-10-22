import { COLUMNS, EMPLOYEES } from './data.ts';
import { renderDataGrid } from './data-grid.ts';

const app = document.getElementById('app');
if (app) {
  app.replaceChildren(
    renderDataGrid({
      data: EMPLOYEES,
      columns: COLUMNS,
      ariaLabel: 'Employee directory',
    }),
  );
}
