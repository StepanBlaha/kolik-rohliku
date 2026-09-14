export interface BreadPosition { x: number; y: number; rotation: number; width: number }

// The pile is illustrative: logarithmic growth keeps large amounts legible and bounded.
export function mountainLayout(quantity: number): BreadPosition[] {
  if (!Number.isFinite(quantity) || quantity <= 0) return [];
  const count = Math.min(240, Math.max(1, Math.ceil(14 * Math.log2(1 + quantity / 4))));
  const rows = Math.ceil((Math.sqrt(8 * count + 1) - 1) / 2);
  const width = 57;
  const horizontalStep = Math.min(28, 520 / Math.max(1, rows - 1));
  const verticalStep = Math.min(20, 265 / Math.max(1, rows - 1));
  const positions: BreadPosition[] = [];
  for (let row = 0; positions.length < count; row++) {
    const capacity = rows - row;
    const remaining = Math.min(capacity, count - positions.length);
    for (let column = 0; column < remaining; column++) {
      const seed = positions.length * 137.508;
      positions.push({
        x: 300 + (column - (remaining - 1) / 2) * horizontalStep + Math.sin(seed) * 5,
        y: 397 - row * verticalStep + Math.cos(seed) * 4,
        rotation: Math.sin(seed * 2) * 29,
        width,
      });
    }
  }
  return positions;
}
