import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { buildSpayd, donation, isDonationConfigured } from './donation';
import './tipjar.css';

const seenKey = 'kolik-rohliku-tip-seen';

// QR se vygeneruje v prohlížeči z SPAYD řetězce – žádný server, žádné poplatky.
function useQrSvg(amount: number, open: boolean): string {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    if (!open || !isDonationConfigured()) { setSvg(''); return; }
    let alive = true;
    QRCode.toString(buildSpayd(amount), { type: 'svg', margin: 1, errorCorrectionLevel: 'M' })
      .then(out => { if (alive) setSvg(out); })
      .catch(() => { if (alive) setSvg(''); });
    return () => { alive = false; };
  }, [amount, open]);
  return svg;
}

export default function TipJar({ engaged }: { engaged: boolean }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const preset = donation.presets[0];
  const svg = useQrSvg(preset.amount, open);
  const configured = isDonationConfigured();

  // Jemný popup: jen jednou za život, až když uživatel kalkulačku opravdu použil.
  useEffect(() => {
    if (!engaged) return;
    let seen = true;
    try { seen = localStorage.getItem(seenKey) === '1'; } catch { /* ok */ }
    if (seen) return;
    const timer = setTimeout(() => {
      setOpen(true);
      try { localStorage.setItem(seenKey, '1'); } catch { /* ok */ }
    }, 1200);
    return () => clearTimeout(timer);
  }, [engaged]);

  // Zavření klávesou Esc, když je otevřeno.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function copyIban() {
    navigator.clipboard?.writeText(donation.iban).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    }).catch(() => { /* clipboard je volitelný */ });
  }

  return <>
    <button className="tip-fab" onClick={() => setOpen(true)} aria-haspopup="dialog">
      <img src="/assets/rohliky.png" alt="" aria-hidden="true" /> Kup mi rohlík
    </button>

    {open && <div className="tip-overlay" onClick={() => setOpen(false)}>
      <div className="tip-dialog" role="dialog" aria-modal="true" aria-labelledby="tip-title"
        tabIndex={-1} ref={dialogRef} onClick={e => e.stopPropagation()}>
        <button className="tip-close" onClick={() => setOpen(false)} aria-label="Zavřít">✕</button>

        <h2 id="tip-title">Hoď mi rohlík na hromadu</h2>
        <p className="tip-lead">
          Kolik rohlíků? je a vždycky bude <strong>zadarmo</strong>. Ale jestli ti to udělalo radost,
          můžeš mi přispět na rohlík. Přes QR, rovnou na účet.
        </p>

        <div className="tip-presets tip-single">
          <div className="tip-card">
            <img className="tip-roll" src="/assets/rohliky.png" alt="" aria-hidden="true" />
            <span className="tip-amount">{preset.amount} Kč</span>
            <span className="tip-plabel">{preset.label}</span>
          </div>
        </div>

        {configured ? <>
          <div className="tip-qr" dangerouslySetInnerHTML={{ __html: svg }} aria-label="QR platba" role="img" />
          <p className="tip-qr-hint">Naskenuj v bankovní aplikaci - částka i zpráva se vyplní samy.</p>
          <button className="tip-iban" onClick={copyIban}>
            {copied ? '✓ Zkopírováno' : `${donation.iban}  ·  kopírovat`}
          </button>
        </> : <div className="tip-todo">
          <p>QR se objeví, jakmile provozovatel doplní svůj IBAN. Zatím díky za úmysl! 🙏</p>
        </div>}

        <button className="tip-later" onClick={() => setOpen(false)}>Teď ne, jen počítám</button>
      </div>
    </div>}
  </>;
}
