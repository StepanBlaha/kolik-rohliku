import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMoney, convert } from './math.ts';

test('Czech amounts support spaces and decimal commas', () => {
  assert.equal(parseMoney('1 299,90'), 1299.9);
  assert.equal(parseMoney('1\u00a0299,90'), 1299.9);
  for (const value of ['', '-10', '1,2,3', 'Infinity', '1e6', '0.001', '1000000001']) assert.equal(parseMoney(value), null);
});
test('whole units and change use integer cents', () => {
  assert.deepEqual(convert(100, 2.9), { quantity: 10000 / 290, whole: 34, remainder: 1.4 });
  assert.deepEqual(convert(0.3, 0.1), { quantity: 3, whole: 3, remainder: 0 });
  assert.deepEqual(convert(0, 2.9), { quantity: 0, whole: 0, remainder: 0 });
  assert.deepEqual(convert(1, 2.9), { quantity: 100 / 290, whole: 0, remainder: 1 });
  assert.equal(convert(100, 0), null);
});
