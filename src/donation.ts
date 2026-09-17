// "Kup mi rohlík" – dobrovolný spropitné přes českou QR platbu (SPAYD).
// Vše se generuje v prohlížeči, nic se neposílá na server a neúčtují se žádné poplatky.

// ⚠️ NASTAV SVŮJ ÚČET: vlož svůj IBAN (najdeš v bankovní aplikaci).
// Dokud tu je placeholder, QR se nezobrazí a ukáže se jen vtipná hláška.
export const donation = {
  iban: 'CZ0303000000000236673244', // CZ03 0300 0000 0002 3667 3244
  currency: 'CZK',
  // Jedna částka – přesně cena jednoho rohlíku.
  presets: [
    { amount: 3, label: 'Jeden rohlík' },
  ],
  message: 'ROHLIK PRO STEPANA - DIKY MOC',
  variableSymbol: '', // volitelný VS, nech prázdné pokud nechceš
} as const;

export function isDonationConfigured(): boolean {
  return /^CZ\d{22}$/.test(donation.iban) && !/^CZ0+$/.test(donation.iban);
}

// Odstraní diakritiku a nepovolené znaky – SPAYD zprávy zvládají jen ASCII bez '*'.
function sanitizeMessage(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[*]/g, '')
    .slice(0, 60)
    .trim();
}

// Sestaví řetězec SPAYD 1.0, který české bankovní aplikace čtou z QR kódu.
export function buildSpayd(amount: number): string {
  const parts = [
    'SPD*1.0',
    `ACC:${donation.iban}`,
    `AM:${amount.toFixed(2)}`,
    `CC:${donation.currency}`,
    `MSG:${sanitizeMessage(donation.message)}`,
  ];
  if (donation.variableSymbol) parts.push(`X-VS:${donation.variableSymbol}`);
  return parts.join('*');
}
