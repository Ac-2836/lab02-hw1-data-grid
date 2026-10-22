import assert from 'node:assert/strict';
import { test } from 'node:test';
import { nextCell } from './keyboard.ts';

// header + 2 body rows of 3 cells
const GRID = [3, 3, 3];

test('arrows move one cell', () => {
  const at = { row: 1, col: 1 };
  assert.deepEqual(nextCell(at, 'ArrowUp', GRID), { row: 0, col: 1 });
  assert.deepEqual(nextCell(at, 'ArrowDown', GRID), { row: 2, col: 1 });
  assert.deepEqual(nextCell(at, 'ArrowLeft', GRID), { row: 1, col: 0 });
  assert.deepEqual(nextCell(at, 'ArrowRight', GRID), { row: 1, col: 2 });
});

test('clamps at every edge without wrapping', () => {
  const top = { row: 0, col: 0 };
  assert.deepEqual(nextCell(top, 'ArrowUp', GRID), top);
  assert.deepEqual(nextCell(top, 'ArrowLeft', GRID), top);
  const end = { row: 2, col: 2 };
  assert.deepEqual(nextCell(end, 'ArrowDown', GRID), end);
  assert.deepEqual(nextCell(end, 'ArrowRight', GRID), end);
});

test('Home and End jump within the row', () => {
  assert.deepEqual(nextCell({ row: 1, col: 1 }, 'Home', GRID), {
    row: 1,
    col: 0,
  });
  assert.deepEqual(nextCell({ row: 1, col: 1 }, 'End', GRID), {
    row: 1,
    col: 2,
  });
});

test('column is clamped to a shorter row (empty-state row)', () => {
  const counts = [5, 5, 1];
  assert.deepEqual(nextCell({ row: 1, col: 4 }, 'ArrowDown', counts), {
    row: 2,
    col: 0,
  });
  assert.deepEqual(nextCell({ row: 2, col: 0 }, 'ArrowRight', counts), {
    row: 2,
    col: 0,
  });
});

test('returns null for keys it does not handle', () => {
  for (const key of ['Enter', ' ', 'Tab', 'a', 'PageDown']) {
    assert.equal(nextCell({ row: 0, col: 0 }, key, GRID), null);
  }
});
