import { useEffect, useState } from 'react';
import { convert, parseMoney } from './math';
import { items, money, number, quantityLabel, verdict } from './items';
import { loadInitialState, savePrices } from './preferences';
import { mountainLayout } from './mountain';
import './mountain.css';

export default function MountainApp() {
  const [state, setState] = useState(() => {
    const initial = loadInitialState();
    return { ...initial, price: number.format(initial.prices.rohliky) };
  });
  const amount = parseMoney(state.amount);
  const price = parseMoney(state.price);
  const result = amount !== null && price !== null && price > 0 ? convert(amount, price) : null;
  const pile = mountainLayout(result?.whole ?? 0);
  useEffect(() => { savePrices(state.prices); }, [state.prices]);
  function changePrice(value: string) {
    const parsed = parseMoney(value);
    setState(current => ({ ...current, price: value, prices: parsed !== null && parsed > 0 ? { ...current.prices, rohliky: parsed } : current.prices }));
  }
  return <div className="mountain-page">
    <main className="mountain-main">
      <section className="mountain-controls" aria-labelledby="title">
        <h1 id="title">Kolik rohlíků?</h1>
        <label className="field-label" htmlFor="mountain-amount">Kolik to stojí?</label>
        <div className="amount-wrap"><input id="mountain-amount" inputMode="decimal" autoComplete="off" maxLength={18} value={state.amount} onChange={event => setState(current => ({ ...current, amount: event.target.value }))} aria-invalid={amount === null} aria-describedby="mountain-error" /><span>Kč</span></div>
        <div className="presets">{[{ name: 'Svačina', value: 50 }, { name: 'Boty', value: 2500 }, { name: 'Telefon', value: 25000 }, { name: 'Auto', value: 500000 }].map(preset => <button key={preset.value} onClick={() => setState(current => ({ ...current, amount: number.format(preset.value) }))}>{preset.name}</button>)}</div>
        <div className="price-row"><label htmlFor="mountain-price">Cena za rohlík</label><div className="price-input"><input id="mountain-price" inputMode="decimal" value={state.price} maxLength={15} onChange={event => changePrice(event.target.value)} aria-invalid={price === null || price <= 0} aria-describedby="mountain-error" /><span>Kč</span><span aria-hidden="true">✎</span></div></div>
        <p id="mountain-error" className="error" hidden={!!result}>Zadej nezápornou částku a cenu rohlíku vyšší než nula, nejvýše na dvě desetinná místa.</p>
        <div className="mountain-add"><button disabled={!result} onClick={() => setState(current => ({ ...current, amount: number.format(Math.min(1_000_000_000, (amount ?? 0) + 100)) }))}>+ 100 Kč</button><button disabled={!result} onClick={() => setState(current => ({ ...current, amount: number.format(Math.min(1_000_000_000, (amount ?? 0) + 1000)) }))}>+ 1 000 Kč</button></div>
      </section>
      <section className="mountain-scene" aria-label="Hora rohlíků">
        <div className="mountain-total" aria-live="polite" aria-atomic="true"><div className={`quantity${result && result.whole > 999999 ? ' long' : ''}`}>{result ? number.format(result.whole) : '-'}</div><div className="quantity-label">{result ? quantityLabel(items[0], result.whole) : 'čekáme na platnou cenu'}</div></div>
        <svg className="bread-mountain" viewBox="0 0 600 450" aria-hidden="true">
          <ellipse cx="300" cy="412" rx={pile.length ? Math.min(264, 30 + Math.sqrt(pile.length) * 16) : 35} ry="13" fill="#d7cbb1" opacity=".22" />
          <path d="M28 420Q300 415 572 420" stroke="#d9d4c7" fill="none" />
          {pile.map((bread, index) => <g key={index} className="bread-piece" style={{ transform: `translate(${bread.x}px, ${bread.y}px) rotate(${bread.rotation}deg)` }}><image href="/assets/rohliky.png" x={-bread.width / 2} y={-bread.width / 2} width={bread.width} height={bread.width} /></g>)}
        </svg>
        <p className="mountain-verdict">{result && amount !== null ? verdict('rohliky', amount, result.whole) : '\u00a0'}</p>
        <p className="mountain-change">{result ? `A ještě ti zbyde ${money(result.remainder)}.` : '\u00a0'}</p>
      </section>
    </main>
    <footer><span>Hromada je ilustrační. Počet sedí na rohlík.</span><span>Jen pro radost. A trochu perspektivy.</span></footer>
  </div>;
}
