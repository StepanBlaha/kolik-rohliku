import { useEffect, useRef, useState } from 'react';
import { convert, parseMoney } from './math';
import { defaultPrices, items, money, number, quantityLabel, verdict, type ItemId } from './items';
import { loadInitialState, savePrices } from './preferences';

function ItemImage({ id }: { id: ItemId }) {
  return <img src={`/assets/${id}.png`} alt="" width={280} height={280} decoding="async" />;
}

export default function App() {
  const [state, setState] = useState(loadInitialState);
  const [status, setStatus] = useState('');
  const [fallback, setFallback] = useState('');
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const selected = items.find(item => item.id === state.selected)!;
  const amount = parseMoney(state.amount);
  const price = parseMoney(state.price);
  const badAmount = amount === null;
  const badPrice = price === null || price <= 0;
  const result = amount !== null && price !== null && !badPrice ? convert(amount, price) : null;
  const label = result ? quantityLabel(selected, result.whole) : 'čekáme na platnou cenu';

  useEffect(() => { savePrices(state.prices); }, [state.prices]);
  useEffect(() => {
    if (fallback) { fallbackRef.current?.focus(); fallbackRef.current?.select(); }
  }, [fallback]);

  function select(id: ItemId) {
    setState(current => ({ ...current, selected: id, price: number.format(current.prices[id]) }));
  }
  function changePrice(value: string) {
    const parsed = parseMoney(value);
    setState(current => ({
      ...current, price: value,
      prices: parsed !== null && parsed > 0 ? { ...current.prices, [current.selected]: parsed } : current.prices,
    }));
  }
  async function copy(text: string, success: string) {
    try {
      await navigator.clipboard.writeText(text);
      setFallback('');
      setStatus(success);
    } catch {
      setStatus('Automatické kopírování není dostupné. Označ a zkopíruj text:');
      setFallback(text);
    }
  }
  function copyReceipt() {
    if (!result || amount === null || price === null) return;
    void copy(`KOLIK ROHLÍKŮ?\nÚčtenka za realitu\n\n${money(amount)} = ${number.format(result.whole)} ${label}\nCena za ${selected.single}: ${money(price)}\nZbývá: ${money(result.remainder)}\n\nNení daňový doklad. Je to perspektiva.`, 'Účtenka zkopírována. Pošli trochu perspektivy dál.');
  }
  function share() {
    if (!result || amount === null || price === null) return;
    const url = new URL(location.href);
    url.search = new URLSearchParams({ amount: String(amount), unit: selected.id, price: String(price) }).toString();
    void copy(url.href, 'Odkaz zkopírován. Obsahuje částku i tvoji cenu.');
  }
  function reset() {
    const prices = defaultPrices();
    setState(current => ({ ...current, prices, price: number.format(prices[current.selected]) }));
    setStatus('Ukázkové ceny jsou zpátky.');
  }

  return <>
    <header className="masthead"><a className="brand" href="/" aria-label="Kolik rohlíků – úvod">kolik rohlíků?</a></header>
    <main>
      <section className="calculator" aria-labelledby="title">
        <h1 id="title">A to je kolik<br /><span>rohlíků?</span></h1>
        <div className="amount-section">
          <label className="field-label" htmlFor="amount">Kolik to stojí?</label>
          <div className="amount-wrap"><input id="amount" type="text" inputMode="decimal" value={state.amount} onChange={event => setState(current => ({ ...current, amount: event.target.value }))} autoComplete="off" maxLength={18} aria-describedby="amount-error" aria-invalid={badAmount} /><span>Kč</span></div>
          <p id="amount-error" className="error" hidden={!badAmount}>Zadej částku od 0 do 1 miliardy, nejvýše na dvě desetinná místa.</p>
          <div className="presets" aria-label="Příklady částek">{[{ name: 'Předplatné', amount: 149 }, { name: 'Boty', amount: 2500 }, { name: 'Telefon', amount: 25000 }].map(preset => <button key={preset.amount} data-amount={preset.amount} onClick={() => setState(current => ({ ...current, amount: number.format(preset.amount) }))}>{preset.name} <span>{money(preset.amount)}</span></button>)}</div>
        </div>
        <fieldset className="units"><legend className="field-label">Přepočítat na…</legend><div id="unit-options" className="unit-options">{items.map(item => <button key={item.id} type="button" className="unit-button" data-unit={item.id} aria-pressed={item.id === selected.id} onClick={() => select(item.id)}><span className="unit-sketch"><ItemImage id={item.id} /></span><span>{item.name}</span></button>)}</div></fieldset>
        <div className="price-row"><label htmlFor="unit-price">Cena za <span id="price-label">{selected.single}</span></label><div className="price-input"><input id="unit-price" type="text" inputMode="decimal" value={state.price} onChange={event => changePrice(event.target.value)} maxLength={15} aria-describedby="price-error" aria-invalid={badPrice} /><span>Kč</span><span aria-hidden="true">✎</span></div></div>
        <p id="price-error" className="error" hidden={!badPrice}>Cena musí být vyšší než nula a mít nejvýše dvě desetinná místa.</p>
      </section>
      <section className="result-stage" aria-label="Výsledek přepočtu">
        <article className={`receipt${result ? '' : ' invalid'}`}>
          <div className="receipt-heading">ZA STEJNOU CENU</div>
          <div className="result" aria-live="polite" aria-atomic="true"><p className="result-lead">Za <strong id="receipt-amount">{amount === null ? '—' : money(amount)}</strong> můžeš mít</p><div id="quantity" className={`quantity${result && String(result.whole).length > 6 ? ' long' : ''}`}>{result ? number.format(result.whole) : '—'}</div><div id="quantity-label" className="quantity-label">{label}</div></div>
          <div id="item-art" className="illustration" aria-hidden="true"><ItemImage id={selected.id} /></div>
          <p id="verdict" className="verdict">{result && amount !== null ? verdict(selected.id, amount, result.whole) : '\u00a0'}</p>
          <div className="receipt-details"><div><span>Cena za <span id="receipt-unit">{selected.single}</span></span><strong id="receipt-price">{badPrice || price === null ? '—' : money(price)}</strong></div><div><span>A ještě ti zbyde</span><strong id="remainder">{result ? money(result.remainder) : '—'}</strong></div></div>
        </article>
        <div className="receipt-actions"><button id="copy-receipt" onClick={copyReceipt} disabled={!result}>Uložit do schránky <span>↗</span></button><button id="share" aria-label="Zkopírovat odkaz na tento přepočet" onClick={share} disabled={!result}>Sdílet odkaz <span>⌁</span></button></div>
        <p id="status" className="status" role="status">{status}</p>
        {fallback ? <textarea ref={fallbackRef} id="copy-fallback" aria-label="Text ke zkopírování" value={fallback} readOnly style={{ width: '100%', maxWidth: 382, minHeight: 100, marginTop: 8, padding: 10 }} /> : null}
      </section>
    </main>
    <footer><span>Jen pro radost. A trochu perspektivy.</span><button id="reset" onClick={reset}>Obnovit ceny ↺</button></footer>
  </>;
}
