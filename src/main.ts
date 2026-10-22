import './styles.css';
import { COLUMNS, EMPLOYEES } from './data.ts';
import { renderDataGrid } from './data-grid.ts';

const app = document.getElementById('app');
if (app) {
  const details = document.createElement('p');
  details.setAttribute('role', 'status');
  details.setAttribute('aria-live', 'polite');
  details.textContent = 'No employee selected.';

  app.replaceChildren(
    renderDataGrid({
      data: EMPLOYEES,
      columns: COLUMNS,
      ariaLabel: 'Employee directory',
      onRowSelect: (employee) => {
        details.textContent =
          `Selected: ${employee.name}, ${employee.department}, ` +
          `${employee.city}`;
      },
    }),
    details,
  );
}
