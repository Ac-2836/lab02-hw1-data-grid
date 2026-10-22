import assert from 'node:assert/strict';
import { test } from 'node:test';
import { filterRows } from './filter.ts';

interface Row {
  id: number;
  name: string;
  team: string;
  score: number;
}

const ROWS: Row[] = [
  { id: 1, name: 'Alice', team: 'Red', score: 42 },
  { id: 2, name: 'bob', team: 'Blue', score: 7 },
  { id: 3, name: 'Carol', team: 'red', score: 420 },
  { id: 4, name: 'Dave', team: 'Alice Co', score: 1 },
];
const KEYS: (keyof Row)[] = ['name', 'team', 'score'];

const ids = (rows: Row[]): number[] => rows.map((r) => r.id);

test('matches case-insensitively as a substring', () => {
  assert.deepEqual(ids(filterRows(ROWS, 'RED', KEYS)), [1, 3]);
  assert.deepEqual(ids(filterRows(ROWS, 'ob', KEYS)), [2]);
});

test('searches every given column, including numbers', () => {
  assert.deepEqual(ids(filterRows(ROWS, 'alice', KEYS)), [1, 4]);
  assert.deepEqual(ids(filterRows(ROWS, '42', KEYS)), [1, 3]);
});

test('ignores keys that are not listed', () => {
  assert.deepEqual(ids(filterRows(ROWS, '3', KEYS)), []);
  assert.deepEqual(ids(filterRows(ROWS, 'blue', ['name'])), []);
});

test('trims the query; a blank query keeps all rows in order', () => {
  assert.deepEqual(ids(filterRows(ROWS, '  bob  ', KEYS)), [2]);
  assert.deepEqual(ids(filterRows(ROWS, '   ', KEYS)), [1, 2, 3, 4]);
  assert.deepEqual(ids(filterRows(ROWS, '', KEYS)), [1, 2, 3, 4]);
});

test('returns an empty array when nothing matches, without mutating', () => {
  const copy = [...ROWS];
  assert.deepEqual(filterRows(ROWS, 'zzz', KEYS), []);
  assert.deepEqual(ROWS, copy);
});
