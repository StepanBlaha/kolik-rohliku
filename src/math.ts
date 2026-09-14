export function parseMoney(value: unknown): number | null {
  const normalized = String(value).replace(/[\s\u00a0\u202f]/g, '').replace(',', '.');
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) return null;
  const number = Number(normalized);
  return Number.isFinite(number) && number <= 1_000_000_000 ? number : null;
}

export function convert(amount: number, price: number) {
  if (!Number.isFinite(amount) || !Number.isFinite(price) || amount < 0 || price <= 0) return null;
  const cents = Math.round(amount * 100);
  const unitCents = Math.round(price * 100);
  if (unitCents < 1) return null;
  return { quantity: cents / unitCents, whole: Math.floor(cents / unitCents), remainder: (cents % unitCents) / 100 };
}
