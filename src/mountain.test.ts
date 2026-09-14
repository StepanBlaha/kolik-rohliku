import test from 'node:test';
import assert from 'node:assert/strict';
import { mountainLayout } from './mountain';

test('pile is empty at zero and grows with quantity while remaining bounded', () => {
  assert.deepEqual(mountainLayout(0), []);
  const counts = [1, 10, 100, 1000, 100000, 100000000000].map(n => mountainLayout(n).length);
  assert.ok(counts.every((n, i) => i === 0 || n >= counts[i - 1]));
  assert.ok(counts.at(-1)! <= 240);
  for (const position of mountainLayout(100000000000)) {
    assert.ok(position.x > 20 && position.x < 580);
    assert.ok(position.y > 120 && position.y < 410);
  }
});
