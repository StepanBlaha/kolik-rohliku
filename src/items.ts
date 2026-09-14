export const items = [
  { id: 'rohliky', name: 'Rohlíky', icon: '🥖', single: 'rohlík', one: 'celý rohlík', few: 'celé rohlíky', many: 'celých rohlíků', price: 2.9 },
  { id: 'piva', name: 'Piva', icon: '🍺', single: 'pivo', one: 'celé pivo', few: 'celá piva', many: 'celých piv', price: 55 },
  { id: 'kavy', name: 'Kávy', icon: '☕', single: 'kávu', one: 'celou kávu', few: 'celé kávy', many: 'celých káv', price: 75 },
  { id: 'obedy', name: 'Obědy', icon: '🍲', single: 'oběd', one: 'celý oběd', few: 'celé obědy', many: 'celých obědů', price: 180 },
  { id: 'vylety', name: 'Jízdy vlakem', icon: '🚂', single: 'jízdu', one: 'celou jízdu', few: 'celé jízdy', many: 'celých jízd', price: 120 },
  { id: 'vlastni', name: 'Vlastní', icon: '✨', single: 'kus', one: 'celý kus', few: 'celé kusy', many: 'celých kusů', price: 100 },
] as const;

export type Item = (typeof items)[number];
export type ItemId = Item['id'];
export type Prices = Record<ItemId, number>;
export const number = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 2 });
export const money = (value: number) => `${number.format(value)} Kč`;
export const defaultPrices = (): Prices => Object.fromEntries(items.map(item => [item.id, item.price])) as Prices;
export function quantityLabel(item: Item, count: number): string {
  return count === 1 ? item.one : count >= 2 && count <= 4 ? item.few : item.many;
}
export function verdict(id: ItemId, amount: number, whole: number): string {
  if (amount === 0) return 'Dneska neutrácíme. Taky plán.';
  if (whole === 0) return 'Ještě trochu přišetřit a první je doma.';
  if (id === 'rohliky') return whole < 10 ? 'Snídaně vyřešena.' : whole < 100 ? 'Sáček? Spíš celou tašku.' : whole < 1000 ? 'To už chce vlastní pekárnu.' : 'Pekař právě zrušil dovolenou.';
  return { piva: 'Tohle radši rozdělit mezi kamarády.', kavy: 'A najednou má ta cena jiné aroma.', obedy: 'Tolik obědových dilemat vyřešeno.', vylety: 'Příští stanice: někam na výlet.', vlastni: 'Tvoje jednotka. Tvoje perspektiva.' }[id];
}
