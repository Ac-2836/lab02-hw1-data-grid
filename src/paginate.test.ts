import assert from 'node:assert/strict';
import { test } from 'node:test';
import { paginate } from './paginate.ts';

const ROWS = [1, 2, 3, 4, 5, 6, 7];

test('slices the requested page', () => {
  assert.deepEqual(paginate(ROWS, 1, 3), {
    rows: [1, 2, 3],
    page: 1,
    pageCount: 3,
  });
  assert.deepEqual(paginate(ROWS, 2, 3).rows, [4, 5, 6]);
});

test('last page holds the remainder', () => {
  assert.deepEqual(paginate(ROWS, 3, 3).rows, [7]);
});

test('exact multiple does not add an empty page', () => {
  assert.equal(paginate([1, 2, 3, 4], 1, 2).pageCount, 2);
});

test('clamps out-of-range and invalid pages', () => {
  assert.equal(paginate(ROWS, 99, 3).page, 3);
  assert.deepEqual(paginate(ROWS, 99, 3).rows, [7]);
  assert.equal(paginate(ROWS, 0, 3).page, 1);
  assert.equal(paginate(ROWS, -5, 3).page, 1);
  assert.equal(paginate(ROWS, Number.NaN, 3).page, 1);
});

test('empty input has one empty page', () => {
  assert.deepEqual(paginate([], 4, 10), { rows: [], page: 1, pageCount: 1 });
});

test('rejects an invalid page size and does not mutate', () => {
  assert.throws(() => paginate(ROWS, 1, 0), RangeError);
  assert.throws(() => paginate(ROWS, 1, 2.5), RangeError);
  const copy = [...ROWS];
  paginate(ROWS, 2, 3);
  assert.deepEqual(ROWS, copy);
});
