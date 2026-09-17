import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildSpayd, isDonationConfigured } from './donation';

test('SPAYD má správnou hlavičku, měnu a částku na dvě místa', () => {
  const spayd = buildSpayd(3);
  assert.ok(spayd.startsWith('SPD*1.0*'));
  assert.match(spayd, /\*AM:3\.00\*/);
  assert.match(spayd, /\*CC:CZK\*/);
});

test('zpráva je bez diakritiky a bez hvězdičky', () => {
  const spayd = buildSpayd(9);
  const msg = spayd.split('*').find(p => p.startsWith('MSG:')) ?? '';
  assert.ok(!/[^\x00-\x7f]/.test(msg), 'jen ASCII');
  assert.equal(msg.split(':').length, 2, 'žádná hvězdička nerozbije pole');
});

test('nastavený IBAN je rozpoznán jako platný', () => {
  assert.equal(isDonationConfigured(), true);
});
