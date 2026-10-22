import assert from 'node:assert/strict';
import { test } from 'node:test';
import { sortRows } from './sort.ts';

interface Row {
  id: number;
  name: string;
  score: number;
}

const ROWS: Row[] = [
  { id: 1, name: 'b', score: 10 },
  { id: 2, name: 'a', score: 9 },
  { id: 3, name: 'c', score: 100 },
  { id: 4, name: 'a', score: 100 },
];

const ids = (rows: Row[]) => rows.map((r) => r.id);

test('sorts strings ascending and descending', () => {
  assert.deepEqual(ids(sortRows(ROWS, 'name', 'asc')), [2, 4, 1, 3]);
  assert.deepEqual(ids(sortRows(ROWS, 'name', 'desc')), [3, 1, 2, 4]);
});

test('sorts numbers numerically, not as text', () => {
  assert.deepEqual(ids(sortRows(ROWS, 'score', 'asc')), [2, 1, 3, 4]);
  assert.deepEqual(ids(sortRows(ROWS, 'score', 'desc')), [3, 4, 1, 2]);
});

test('is stable on ties in both directions', () => {
  assert.deepEqual(ids(sortRows(ROWS, 'name', 'asc')).slice(0, 2), [2, 4]);
  assert.deepEqual(ids(sortRows(ROWS, 'name', 'desc')).slice(2), [2, 4]);
});

test('does not mutate the input', () => {
  const copy = [...ROWS];
  sortRows(ROWS, 'score', 'desc');
  assert.deepEqual(ROWS, copy);
});
