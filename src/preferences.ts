import { defaultPrices, items, number, type ItemId, type Prices } from './items';
import { parseMoney } from './math';

export const storageKey = 'kolik-rohliku-prices';
export function loadInitialState() {
  const prices = defaultPrices();
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (saved && typeof saved === 'object') {
      for (const item of items) {
        const value = parseMoney((saved as Record<string, unknown>)[item.id]);
        if (value !== null && value > 0) prices[item.id] = value;
      }
    }
  } catch { /* Local storage is optional. */ }
  const params = new URLSearchParams(location.search);
  const selected: ItemId = items.find(item => item.id === params.get('unit'))?.id ?? 'rohliky';
  const amount = parseMoney(params.get('amount')) ?? 1000;
  const sharedPrice = parseMoney(params.get('price'));
  if (sharedPrice !== null && sharedPrice > 0) prices[selected] = sharedPrice;
  return { prices, selected, amount: number.format(amount), price: number.format(prices[selected]) };
}
export function savePrices(prices: Prices) {
  try { localStorage.setItem(storageKey, JSON.stringify(prices)); } catch { /* Local storage is optional. */ }
}
