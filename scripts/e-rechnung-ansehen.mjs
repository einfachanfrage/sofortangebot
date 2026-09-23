#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-unused-expressions --
   Die zehn Pruefungen sind bewusst als `bedingung ? ok(...) : fehler(...)`
   geschrieben: nebeneinander gestellt liest man Soll und Ist in einer Zeile.
   Die Regel zaehlt das als unbenutzten Ausdruck und hat mit neun Warnungen
   das Warnbudget der CI gesprengt (121 > 120, Lauf 229 rot). Hier
   abgeschaltet statt das Budget zu heben — die Regel gilt woanders weiter.
   Chief of Staff, 23.09.2026. */
/**
 * e-rechnung-ansehen.mjs — macht eine E-Rechnung lesbar und rechnet sie nach.
 *
 * Aufruf:
 *   node scripts/e-rechnung-ansehen.mjs <datei.xml|datei.pdf> [--out <ordner>] [--nur-pruefen]
 *
 * Kann:
 *   - reine XRechnung (UBL 2.1, Invoice + CreditNote)
 *   - reine CII-Datei (ZUGFeRD / Factur-X, UN/CEFACT)
 *   - ZUGFeRD-PDF: holt das eingebettete XML heraus (nur zum Lesen)
 *
 * Erzeugt eine HTML-Ansicht und fuehrt zehn Pruefungen aus (Rechenwerk +
 * Pflichtangaben nach § 14 UStG).
 *
 * WICHTIG: Die Eingangsdatei wird ausschliesslich gelesen. Sie wird nicht
 * umbenannt, nicht neu gespeichert und nicht veraendert — die
 * Aufbewahrungspflicht gilt fuer den Beleg in der Form, in der er eingegangen
 * ist. Die HTML-Ansicht ist eine Hilfsdatei, kein Beleg; sie gehoert NICHT in
 * belege/ und das Programm verweigert das auch.
 *
 * Head of Finance, 21.09.2026 — Gate-1-Punkt 4.7.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import zlib from 'node:zlib';

/* ------------------------------------------------------------------ XML --- */

function decodeEnt(s) {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&amp;/g, '&');
}

/** Sehr toleranter XML-Leser. Praefixe werden verworfen, es zaehlt der lokale Name. */
function parseXml(src) {
  src = src.replace(/<\?[\s\S]*?\?>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!DOCTYPE[^>]*>/gi, '');
  const root = { name: '#root', attrs: {}, children: [], text: '' };
  const stack = [root];
  const re = /<\s*(\/?)\s*([^\s/>]+)((?:\s+[^\s=/>]+\s*=\s*(?:"[^"]*"|'[^']*'))*)\s*(\/?)\s*>/g;
  let last = 0, m;
  const local = (n) => (n.includes(':') ? n.split(':').pop() : n);
  while ((m = re.exec(src))) {
    const chunk = src.slice(last, m.index);
    if (chunk.trim()) stack[stack.length - 1].text += decodeEnt(chunk);
    last = re.lastIndex;
    if (m[1] === '/') { if (stack.length > 1) stack.pop(); continue; }
    const attrs = {};
    const ar = /([^\s=]+)\s*=\s*("([^"]*)"|'([^']*)')/g;
    let a;
    while ((a = ar.exec(m[3]))) attrs[local(a[1])] = decodeEnt(a[3] !== undefined ? a[3] : a[4]);
    const node = { name: local(m[2]), attrs, children: [], text: '' };
    stack[stack.length - 1].children.push(node);
    if (m[4] !== '/') stack.push(node);
  }
  return root;
}

const kids = (n, name) => (n ? n.children.filter((c) => c.name === name) : []);
function first(n, pathArr) {
  let cur = n;
  for (const seg of pathArr) { cur = kids(cur, seg)[0]; if (!cur) return undefined; }
  return cur;
}
function all(n, pathArr) {
  let cur = n ? [n] : [];
  for (const seg of pathArr) cur = cur.flatMap((c) => kids(c, seg));
  return cur;
}
const txt = (n, pathArr) => { const e = first(n, pathArr); return e ? e.text.trim() : ''; };

/* ------------------------------------------------------------------ PDF --- */

/** Holt eingebettete XML-Daten aus einem ZUGFeRD-/Factur-X-PDF. Nur lesend. */
function xmlAusPdf(buf) {
  const treffer = [];
  const hay = buf.toString('latin1');
  const re = /stream\r?\n?/g;
  let m;
  while ((m = re.exec(hay))) {
    const start = m.index + m[0].length;
    const end = hay.indexOf('endstream', start);
    if (end < 0) continue;
    let roh = buf.subarray(start, end);
    while (roh.length && (roh[roh.length - 1] === 0x0a || roh[roh.length - 1] === 0x0d)) {
      roh = roh.subarray(0, roh.length - 1);
    }
    let out = null;
    try { out = zlib.inflateSync(roh); } catch {
      try { out = zlib.inflateRawSync(roh); } catch { out = null; }
    }
    if (!out) {
      if (roh.subarray(0, 300).toString('utf8').includes('<?xml')) out = roh; else continue;
    }
    const kopf = out.subarray(0, 500).toString('utf8');
    if (!kopf.includes('<?xml') && !kopf.includes('<rsm:') && !kopf.includes('<Invoice')) continue;
    const s = out.toString('utf8');
    if (/CrossIndustryInvoice|<Invoice[\s>]|<CreditNote[\s>]/.test(s)) treffer.push(s);
  }
  return treffer[0] || null;
}

/* -------------------------------------------------------------- Zahlen --- */

const z = (s) => { const v = parseFloat(String(s).replace(',', '.')); return Number.isFinite(v) ? v : null; };
const eur = (v) => (v === null || v === undefined || v === '')
  ? '—'
  : new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' €';
const pct = (v) => (v === null || v === undefined) ? '—'
  : new Intl.NumberFormat('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(v) + ' %';
const r2 = (v) => Math.round((v + Number.EPSILON) * 100) / 100;
const datum102 = (s) => (/^\d{8}$/.test(s) ? `${s.slice(6, 8)}.${s.slice(4, 6)}.${s.slice(0, 4)}` : s);
const datumIso = (s) => (/^\d{4}-\d{2}-\d{2}/.test(s) ? `${s.slice(8, 10)}.${s.slice(5, 7)}.${s.slice(0, 4)}` : s);

const DOKUMENTARTEN = {
  380: 'Rechnung', 381: 'Gutschrift (Storno)', 384: 'Korrekturrechnung',
  386: 'Vorauszahlungsrechnung', 389: 'Selbstfakturierte Rechnung (Gutschriftverfahren)',
  875: 'Abschlagsrechnung (Bau)', 876: 'Abschlagsrechnung (Bau)', 877: 'Abschlagsrechnung (Bau)',
};
const STEUERKATEGORIEN = {
  S: 'Regelsteuersatz', Z: 'Nullsatz', E: 'steuerbefreit',
  AE: 'Reverse Charge — Steuerschuld beim Empfaenger', K: 'innergemeinschaftliche Lieferung',
  G: 'Ausfuhrlieferung', O: 'nicht steuerbar', L: 'Kanarische Inseln', M: 'Ceuta / Melilla',
};

/* ----------------------------------------------------------- Abbildung --- */

function ublAdresse(party) {
  const a = first(party, ['PostalAddress']);
  if (!a) return {};
  return {
    strasse: [txt(a, ['StreetName']), txt(a, ['AdditionalStreetName'])].filter(Boolean).join(', '),
    plz: txt(a, ['PostalZone']), ort: txt(a, ['CityName']),
    land: txt(a, ['Country', 'IdentificationCode']),
  };
}

function ublPartei(party) {
  if (!party) return { adresse: {} };
  const steuern = all(party, ['PartyTaxScheme']).map((p) => ({
    id: txt(p, ['CompanyID']), art: txt(p, ['TaxScheme', 'ID']),
  }));
  return {
    name: txt(party, ['PartyLegalEntity', 'RegistrationName']) || txt(party, ['PartyName', 'Name']),
    adresse: ublAdresse(party),
    ustId: (steuern.find((s) => s.art.toUpperCase() === 'VAT') || {}).id || '',
    steuerNr: (steuern.find((s) => s.art.toUpperCase() !== 'VAT') || {}).id || '',
    endpunkt: txt(party, ['EndpointID']),
    kontaktMail: txt(party, ['Contact', 'ElectronicMail']),
    kontaktTel: txt(party, ['Contact', 'Telephone']),
  };
}

function ausUbl(doc, wurzelName) {
  const zeilenName = wurzelName === 'CreditNote' ? 'CreditNoteLine' : 'InvoiceLine';
  const mengeName = wurzelName === 'CreditNote' ? 'CreditedQuantity' : 'InvoicedQuantity';
  const lm = first(doc, ['LegalMonetaryTotal']);
  return {
    quelle: wurzelName === 'CreditNote' ? 'UBL 2.1 CreditNote (XRechnung)' : 'UBL 2.1 Invoice (XRechnung)',
    profil: txt(doc, ['CustomizationID']),
    nummer: txt(doc, ['ID']),
    datum: datumIso(txt(doc, ['IssueDate'])),
    faellig: datumIso(txt(doc, ['DueDate'])),
    art: txt(doc, ['InvoiceTypeCode']) || txt(doc, ['CreditNoteTypeCode']),
    waehrung: txt(doc, ['DocumentCurrencyCode']) || 'EUR',
    leistungsdatum: datumIso(txt(doc, ['InvoicePeriod', 'StartDate']))
      || datumIso(txt(doc, ['Delivery', 'ActualDeliveryDate'])),
    kaeuferReferenz: txt(doc, ['BuyerReference']),
    hinweise: kids(doc, 'Note').map((n) => n.text.trim()).filter(Boolean),
    verkaeufer: ublPartei(first(doc, ['AccountingSupplierParty', 'Party'])),
    kaeufer: ublPartei(first(doc, ['AccountingCustomerParty', 'Party'])),
    iban: txt(doc, ['PaymentMeans', 'PayeeFinancialAccount', 'ID']),
    zahlungsbedingung: txt(doc, ['PaymentTerms', 'Note']),
    testkennzeichen: '',
    steuer: all(doc, ['TaxTotal', 'TaxSubtotal']).map((s) => ({
      netto: z(txt(s, ['TaxableAmount'])),
      steuer: z(txt(s, ['TaxAmount'])),
      satz: z(txt(s, ['TaxCategory', 'Percent'])),
      kategorie: txt(s, ['TaxCategory', 'ID']),
      grund: txt(s, ['TaxCategory', 'TaxExemptionReason']),
    })),
    steuerGesamt: z(txt(doc, ['TaxTotal', 'TaxAmount'])),
    summen: {
      zeilenSumme: z(txt(lm, ['LineExtensionAmount'])),
      nachlaesse: z(txt(lm, ['AllowanceTotalAmount'])) ?? 0,
      zuschlaege: z(txt(lm, ['ChargeTotalAmount'])) ?? 0,
      netto: z(txt(lm, ['TaxExclusiveAmount'])),
      brutto: z(txt(lm, ['TaxInclusiveAmount'])),
      angezahlt: z(txt(lm, ['PrepaidAmount'])) ?? 0,
      zahlbar: z(txt(lm, ['PayableAmount'])),
    },
    zeilen: all(doc, [zeilenName]).map((l) => ({
      nr: txt(l, ['ID']),
      bezeichnung: txt(l, ['Item', 'Name']),
      beschreibung: txt(l, ['Item', 'Description']),
      menge: z(txt(l, [mengeName])),
      einheit: (first(l, [mengeName]) || { attrs: {} }).attrs.unitCode || '',
      einzelpreis: z(txt(l, ['Price', 'PriceAmount'])),
      summe: z(txt(l, ['LineExtensionAmount'])),
      satz: z(txt(l, ['Item', 'ClassifiedTaxCategory', 'Percent'])),
      kategorie: txt(l, ['Item', 'ClassifiedTaxCategory', 'ID']),
    })),
  };
}

function ciiPartei(p) {
  if (!p) return { adresse: {} };
  const a = first(p, ['PostalTradeAddress']);
  const regs = all(p, ['SpecifiedTaxRegistration', 'ID']);
  const vat = regs.find((r) => (r.attrs.schemeID || '').toUpperCase() === 'VA');
  const fa = regs.find((r) => (r.attrs.schemeID || '').toUpperCase() === 'FC');
  return {
    name: txt(p, ['Name']),
    adresse: a ? {
      strasse: [txt(a, ['LineOne']), txt(a, ['LineTwo'])].filter(Boolean).join(', '),
      plz: txt(a, ['PostcodeCode']), ort: txt(a, ['CityName']), land: txt(a, ['CountryID']),
    } : {},
    ustId: vat ? vat.text.trim() : '',
    steuerNr: fa ? fa.text.trim() : '',
    endpunkt: txt(p, ['URIUniversalCommunication', 'URIID']),
    kontaktMail: txt(p, ['DefinedTradeContact', 'EmailURIUniversalCommunication', 'URIID']),
    kontaktTel: txt(p, ['DefinedTradeContact', 'TelephoneUniversalCommunication', 'CompleteNumber']),
  };
}

function ausCii(root) {
  const dok = first(root, ['ExchangedDocument']);
  const tx = first(root, ['SupplyChainTradeTransaction']);
  const ver = first(tx, ['ApplicableHeaderTradeAgreement']);
  const lief = first(tx, ['ApplicableHeaderTradeDelivery']);
  const abr = first(tx, ['ApplicableHeaderTradeSettlement']);
  const su = first(abr, ['SpecifiedTradeSettlementHeaderMonetarySummation']);
  return {
    quelle: 'UN/CEFACT CII (ZUGFeRD / Factur-X)',
    profil: txt(root, ['ExchangedDocumentContext', 'GuidelineSpecifiedDocumentContextParameter', 'ID']),
    testkennzeichen: txt(root, ['ExchangedDocumentContext', 'TestIndicator', 'Indicator']),
    nummer: txt(dok, ['ID']),
    datum: datum102(txt(dok, ['IssueDateTime', 'DateTimeString'])),
    faellig: datum102(txt(abr, ['SpecifiedTradePaymentTerms', 'DueDateDateTime', 'DateTimeString'])),
    art: txt(dok, ['TypeCode']),
    waehrung: txt(abr, ['InvoiceCurrencyCode']) || 'EUR',
    leistungsdatum: datum102(txt(lief, ['ActualDeliverySupplyChainEvent', 'OccurrenceDateTime', 'DateTimeString'])),
    kaeuferReferenz: txt(ver, ['BuyerReference']),
    hinweise: all(dok, ['IncludedNote', 'Content']).map((n) => n.text.trim()).filter(Boolean),
    verkaeufer: ciiPartei(first(ver, ['SellerTradeParty'])),
    kaeufer: ciiPartei(first(ver, ['BuyerTradeParty'])),
    iban: txt(abr, ['SpecifiedTradeSettlementPaymentMeans', 'PayeePartyCreditorFinancialAccount', 'IBANID']),
    zahlungsbedingung: txt(abr, ['SpecifiedTradePaymentTerms', 'Description']),
    steuer: all(abr, ['ApplicableTradeTax']).map((t) => ({
      netto: z(txt(t, ['BasisAmount'])),
      steuer: z(txt(t, ['CalculatedAmount'])),
      satz: z(txt(t, ['RateApplicablePercent'])),
      kategorie: txt(t, ['CategoryCode']),
      grund: txt(t, ['ExemptionReason']),
    })),
    steuerGesamt: z(txt(su, ['TaxTotalAmount'])),
    summen: {
      zeilenSumme: z(txt(su, ['LineTotalAmount'])),
      nachlaesse: z(txt(su, ['AllowanceTotalAmount'])) ?? 0,
      zuschlaege: z(txt(su, ['ChargeTotalAmount'])) ?? 0,
      netto: z(txt(su, ['TaxBasisTotalAmount'])),
      brutto: z(txt(su, ['GrandTotalAmount'])),
      angezahlt: z(txt(su, ['TotalPrepaidAmount'])) ?? 0,
      zahlbar: z(txt(su, ['DuePayableAmount'])),
    },
    zeilen: all(tx, ['IncludedSupplyChainTradeLineItem']).map((l) => {
      const menge = first(l, ['SpecifiedLineTradeDelivery', 'BilledQuantity']);
      return {
        nr: txt(l, ['AssociatedDocumentLineDocument', 'LineID']),
        bezeichnung: txt(l, ['SpecifiedTradeProduct', 'Name']),
        beschreibung: txt(l, ['SpecifiedTradeProduct', 'Description']),
        menge: menge ? z(menge.text) : null,
        einheit: menge ? (menge.attrs.unitCode || '') : '',
        einzelpreis: z(txt(l, ['SpecifiedLineTradeAgreement', 'NetPriceProductTradePrice', 'ChargeAmount'])),
        summe: z(txt(l, ['SpecifiedLineTradeSettlement', 'SpecifiedTradeSettlementLineMonetarySummation', 'LineTotalAmount'])),
        satz: z(txt(l, ['SpecifiedLineTradeSettlement', 'ApplicableTradeTax', 'RateApplicablePercent'])),
        kategorie: txt(l, ['SpecifiedLineTradeSettlement', 'ApplicableTradeTax', 'CategoryCode']),
      };
    }),
  };
}

/* ------------------------------------------------------------ Pruefung --- */

const TOLERANZ = 0.01;

function pruefe(r) {
  const b = [];
  const ok = (t, d) => b.push({ stufe: 'ok', titel: t, text: d });
  const warn = (t, d) => b.push({ stufe: 'warnung', titel: t, text: d });
  const fehler = (t, d) => b.push({ stufe: 'fehler', titel: t, text: d });
  const gleich = (a, c) => a !== null && c !== null && Math.abs(a - c) <= TOLERANZ;
  const s = r.summen;

  if (r.zeilen.length && r.zeilen.every((l) => l.summe !== null)) {
    const summe = r2(r.zeilen.reduce((a, l) => a + l.summe, 0));
    gleich(summe, s.zeilenSumme)
      ? ok('1 · Zeilensummen', `${r.zeilen.length} Position(en) ergeben ${eur(summe)} — wie ausgewiesen.`)
      : fehler('1 · Zeilensummen', `Positionen ergeben ${eur(summe)}, ausgewiesen ist ${eur(s.zeilenSumme)}. Differenz ${eur(r2(summe - s.zeilenSumme))}.`);
  } else warn('1 · Zeilensummen', 'Keine oder unvollstaendige Einzelpositionen — nicht nachrechenbar.');

  if (s.zeilenSumme !== null && s.netto !== null) {
    const soll = r2(s.zeilenSumme + s.zuschlaege - s.nachlaesse);
    gleich(soll, s.netto)
      ? ok('2 · Nettobetrag', `${eur(s.zeilenSumme)} + ${eur(s.zuschlaege)} − ${eur(s.nachlaesse)} = ${eur(s.netto)}.`)
      : fehler('2 · Nettobetrag', `Rechnerisch ${eur(soll)}, ausgewiesen ${eur(s.netto)}.`);
  } else warn('2 · Nettobetrag', 'Nicht nachrechenbar — Summenblock unvollstaendig.');

  if (r.steuer.length && s.netto !== null && r.steuer.every((t) => t.netto !== null)) {
    const summe = r2(r.steuer.reduce((a, t) => a + t.netto, 0));
    gleich(summe, s.netto)
      ? ok('3 · Bemessungsgrundlagen', `Die Steuergruppen summieren sich auf ${eur(summe)} — gleich dem Nettobetrag.`)
      : fehler('3 · Bemessungsgrundlagen', `Steuergruppen ${eur(summe)} gegen Nettobetrag ${eur(s.netto)}.`);
  } else warn('3 · Bemessungsgrundlagen', 'Nicht nachrechenbar.');

  r.steuer.forEach((t, i) => {
    const nr = `4.${i + 1} · Steuerbetrag ${t.satz === null ? '' : pct(t.satz)}`.trim();
    if (t.netto === null || t.steuer === null || t.satz === null) {
      warn(nr, 'Gruppe unvollstaendig — nicht nachrechenbar.'); return;
    }
    const soll = r2(t.netto * t.satz / 100);
    gleich(soll, t.steuer)
      ? ok(nr, `${eur(t.netto)} × ${pct(t.satz)} = ${eur(t.steuer)}.`)
      : fehler(nr, `${eur(t.netto)} × ${pct(t.satz)} ergaebe ${eur(soll)}, ausgewiesen ist ${eur(t.steuer)}.`);
  });
  if (!r.steuer.length) warn('4 · Steuerbetrag', 'Keine Steuergruppe in der Datei.');

  if (r.steuer.length && r.steuerGesamt !== null && r.steuer.every((t) => t.steuer !== null)) {
    const summe = r2(r.steuer.reduce((a, t) => a + t.steuer, 0));
    gleich(summe, r.steuerGesamt)
      ? ok('5 · Steuer gesamt', `${eur(summe)}.`)
      : fehler('5 · Steuer gesamt', `Gruppen ergeben ${eur(summe)}, ausgewiesen ${eur(r.steuerGesamt)}.`);
  }

  if (s.netto !== null && r.steuerGesamt !== null && s.brutto !== null) {
    const soll = r2(s.netto + r.steuerGesamt);
    gleich(soll, s.brutto)
      ? ok('6 · Bruttobetrag', `${eur(s.netto)} + ${eur(r.steuerGesamt)} = ${eur(s.brutto)}.`)
      : fehler('6 · Bruttobetrag', `Rechnerisch ${eur(soll)}, ausgewiesen ${eur(s.brutto)}.`);
  }

  if (s.brutto !== null && s.zahlbar !== null) {
    const soll = r2(s.brutto - s.angezahlt);
    gleich(soll, s.zahlbar)
      ? ok('7 · Zahlbetrag', s.angezahlt
        ? `${eur(s.brutto)} − ${eur(s.angezahlt)} bereits gezahlt = ${eur(s.zahlbar)}.`
        : `${eur(s.zahlbar)} offen.`)
      : fehler('7 · Zahlbetrag', `Rechnerisch ${eur(soll)}, ausgewiesen ${eur(s.zahlbar)}.`);
  }

  const fremd = r.steuer.filter((t) => t.satz !== null && ![0, 7, 19].includes(t.satz));
  fremd.length
    ? warn('8 · Steuersaetze', `Ungewoehnlich fuer Deutschland: ${fremd.map((t) => pct(t.satz)).join(', ')}. Bei auslaendischen Lieferanten normal — dann pruefen, ob stattdessen Reverse Charge gilt.`)
    : ok('8 · Steuersaetze', r.steuer.length
      ? `${r.steuer.map((t) => pct(t.satz)).join(', ')} — in Deutschland uebliche Saetze.`
      : 'Keine Steuerangabe in der Datei.');

  const rc = r.steuer.filter((t) => ['AE', 'K', 'G', 'E', 'O'].includes((t.kategorie || '').toUpperCase()));
  if (rc.length) {
    warn('9 · Steuerschuld', `Kategorie ${rc.map((t) => `${t.kategorie} (${STEUERKATEGORIEN[t.kategorie] || 'unbekannt'})`).join(', ')}. `
      + 'Aus dieser Rechnung ist kein gewoehnlicher Vorsteuerabzug moeglich. Bei AE schuldet der Empfaenger die Umsatzsteuer selbst (§ 13b UStG) und zieht sie im selben Zug als Vorsteuer ab — in der Voranmeldung gehoeren beide Betraege eingetragen.'
      + (rc.some((t) => !t.grund) ? ' Hinweis: der Befreiungsgrund fehlt in der Datei.' : ''));
  } else ok('9 · Steuerschuld', 'Regelfall — der Lieferant weist die Steuer aus, Vorsteuerabzug moeglich.');

  const klein = (s.brutto ?? 0) <= 250 && (s.brutto ?? 0) > 0;
  const pflicht = [
    ['Rechnungsnummer', r.nummer],
    ['Rechnungsdatum', r.datum],
    ['Name des Lieferanten', r.verkaeufer.name],
    ['Anschrift des Lieferanten', [r.verkaeufer.adresse?.strasse, r.verkaeufer.adresse?.ort].filter(Boolean).join(' ')],
    ['Steuernummer oder USt-IdNr. des Lieferanten', r.verkaeufer.ustId || r.verkaeufer.steuerNr],
    ['Leistungsbeschreibung', r.zeilen.map((l) => l.bezeichnung).filter(Boolean).join(', ')],
    ['Entgelt (netto)', s.netto === null ? '' : String(s.netto)],
    ['Steuersatz und Steuerbetrag', r.steuer.length ? 'ja' : ''],
  ];
  if (!klein) {
    pflicht.push(['Name des Empfaengers', r.kaeufer.name]);
    pflicht.push(['Anschrift des Empfaengers', [r.kaeufer.adresse?.strasse, r.kaeufer.adresse?.ort].filter(Boolean).join(' ')]);
  }
  const fehlend = pflicht.filter(([, v]) => !v).map(([k]) => k);
  fehlend.length
    ? fehler('10 · Pflichtangaben § 14 UStG', `Es fehlt: ${fehlend.join(', ')}. Ohne diese Angaben ist der Vorsteuerabzug gefaehrdet — eine berichtigte Rechnung beim Lieferanten anfordern, nichts selbst ergaenzen.`)
    : ok('10 · Pflichtangaben § 14 UStG', klein
      ? 'Vollstaendig (Kleinbetragsrechnung bis 250 €, § 33 UStDV — Empfaengerangaben nicht erforderlich).'
      : 'Vollstaendig.');

  if ((r.testkennzeichen || '').toLowerCase() === 'true') {
    warn('Testkennzeichen', 'Die Datei traegt TestIndicator = true. Das ist keine echte Forderung und gehoert nicht in die Buchhaltung.');
  }
  return b;
}

/* ------------------------------------------------------------- Ausgabe --- */

const esc = (s) => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const adresseZeile = (a) => !a ? ''
  : [a.strasse, [a.plz, a.ort].filter(Boolean).join(' '), a.land].filter(Boolean).join(' · ');

function html(r, befunde, quelldatei) {
  const rang = { fehler: 0, warnung: 1, ok: 2 };
  const nFehler = befunde.filter((b) => b.stufe === 'fehler').length;
  const nWarn = befunde.filter((b) => b.stufe === 'warnung').length;
  const ampel = nFehler
    ? ['#b42318', 'Rechnung nicht in Ordnung', `${nFehler} Fehler${nWarn ? `, ${nWarn} Hinweis${nWarn > 1 ? 'e' : ''}` : ''} — vor dem Bezahlen klaeren.`]
    : nWarn
      ? ['#b54708', 'Rechnerisch in Ordnung, mit Hinweisen', `${nWarn} Hinweis${nWarn > 1 ? 'e' : ''} — bitte lesen.`]
      : ['#067647', 'In Ordnung', 'Alle zehn Pruefungen bestanden.'];
  const partei = (titel, p) => `
    <div class="partei"><h3>${titel}</h3>
      <div class="pname">${esc(p.name) || '<span class="fehlt">fehlt</span>'}</div>
      <div>${esc(adresseZeile(p.adresse))}</div>
      ${p.ustId ? `<div>USt-IdNr.: <code>${esc(p.ustId)}</code></div>` : ''}
      ${p.steuerNr ? `<div>Steuernummer: <code>${esc(p.steuerNr)}</code></div>` : ''}
      ${p.kontaktMail ? `<div>${esc(p.kontaktMail)}</div>` : ''}
      ${p.kontaktTel ? `<div>${esc(p.kontaktTel)}</div>` : ''}
      ${p.endpunkt ? `<div class="klein">Elektronische Adresse: ${esc(p.endpunkt)}</div>` : ''}
    </div>`;

  return `<!DOCTYPE html>
<html lang="de"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Rechnung ${esc(r.nummer)} — ${esc(r.verkaeufer.name)}</title>
<style>
 :root{--t:#1a1a1a;--m:#5c5c5c;--l:#e3e3e0;--bg:#fbfbf9;--k:#f4f4f1;--fl:#fff}
 *{box-sizing:border-box}
 body{margin:0;padding:24px 16px 64px;background:var(--bg);color:var(--t);
  font:16px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif}
 .blatt{max-width:880px;margin:0 auto}
 h1{font-size:1.5rem;margin:0 0 4px;line-height:1.25}
 h2{font-size:1.02rem;margin:32px 0 10px;padding-bottom:6px;border-bottom:1px solid var(--l)}
 h3{font-size:.78rem;text-transform:uppercase;letter-spacing:.05em;color:var(--m);margin:0 0 6px}
 .kopf{color:var(--m);font-size:.92rem}
 .ampel{border-left:5px solid ${ampel[0]};background:var(--fl);border-radius:6px;padding:14px 18px;
  margin:18px 0 8px;box-shadow:0 1px 2px rgba(0,0,0,.05)}
 .ampel .gross{font-weight:650;color:${ampel[0]};font-size:1.08rem}
 .parteien{display:flex;gap:16px;flex-wrap:wrap}
 .partei{flex:1 1 300px;background:var(--fl);border:1px solid var(--l);border-radius:6px;padding:14px 16px;font-size:.93rem}
 .pname{font-weight:650;margin-bottom:2px;font-size:1rem}
 table{width:100%;border-collapse:collapse;background:var(--fl);font-size:.93rem;
  border:1px solid var(--l);border-radius:6px;overflow:hidden}
 th,td{padding:8px 10px;border-bottom:1px solid var(--l);text-align:left;vertical-align:top}
 tr:last-child td{border-bottom:none}
 th{background:var(--k);font-size:.76rem;text-transform:uppercase;letter-spacing:.04em;color:var(--m)}
 td.z,th.z{text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}
 .summen{margin-left:auto;margin-top:14px;width:min(430px,100%)}
 .summen td:first-child{color:var(--m)}
 .summen tr.haupt td{font-weight:700;font-size:1.05rem;border-top:2px solid var(--t)}
 .befund{display:flex;gap:10px;padding:9px 2px;border-bottom:1px solid var(--l);font-size:.93rem}
 .befund:last-child{border-bottom:none}
 .pkt{flex:0 0 auto;font-weight:700;width:1.2em;text-align:center}
 .ok .pkt{color:#067647}.warnung .pkt{color:#b54708}.fehler .pkt{color:#b42318}
 .btitel{font-weight:600}
 code{background:var(--k);padding:1px 5px;border-radius:3px;font-size:.88em;word-break:break-all}
 .klein{font-size:.82rem;color:var(--m)}
 .fehlt{color:#b42318;font-style:italic}
 .fuss{margin-top:40px;padding-top:14px;border-top:1px solid var(--l);font-size:.8rem;color:var(--m)}
 @media(prefers-color-scheme:dark){
  :root{--t:#e8e8e6;--m:#a3a39f;--l:#3a3a38;--bg:#1a1a19;--k:#242423;--fl:#212120}}
 @media print{body{background:#fff;padding:0}.ampel{box-shadow:none}}
</style></head><body><div class="blatt">

<h1>${esc(DOKUMENTARTEN[r.art] || 'Rechnung')} ${esc(r.nummer)}</h1>
<div class="kopf">${esc(r.verkaeufer.name || '')} · ${esc(r.datum)}${r.faellig ? ` · faellig ${esc(r.faellig)}` : ''}</div>

<div class="ampel"><div class="gross">${ampel[1]}</div><div>${ampel[2]}</div></div>

<h2>Wer an wen</h2>
<div class="parteien">${partei('Lieferant', r.verkaeufer)}${partei('Empfaenger', r.kaeufer)}</div>

<h2>Eckdaten</h2>
<table><tbody>
 <tr><td>Rechnungsnummer</td><td><strong>${esc(r.nummer) || '<span class="fehlt">fehlt</span>'}</strong></td></tr>
 <tr><td>Rechnungsdatum</td><td>${esc(r.datum) || '<span class="fehlt">fehlt</span>'}</td></tr>
 ${r.leistungsdatum ? `<tr><td>Leistungsdatum</td><td>${esc(r.leistungsdatum)}</td></tr>` : ''}
 ${r.faellig ? `<tr><td>Faellig am</td><td>${esc(r.faellig)}</td></tr>` : ''}
 <tr><td>Dokumentart</td><td>${esc(DOKUMENTARTEN[r.art] || 'unbekannt')} (Code ${esc(r.art) || '—'})</td></tr>
 <tr><td>Waehrung</td><td>${esc(r.waehrung)}</td></tr>
 ${r.kaeuferReferenz ? `<tr><td>Leitweg-ID / Referenz</td><td><code>${esc(r.kaeuferReferenz)}</code></td></tr>` : ''}
 ${r.iban ? `<tr><td>IBAN</td><td><code>${esc(r.iban)}</code></td></tr>` : ''}
 ${r.zahlungsbedingung ? `<tr><td>Zahlungsbedingung</td><td>${esc(r.zahlungsbedingung)}</td></tr>` : ''}
 <tr><td>Format</td><td>${esc(r.quelle)}</td></tr>
 ${r.profil ? `<tr><td>Profil</td><td class="klein"><code>${esc(r.profil)}</code></td></tr>` : ''}
</tbody></table>
${r.hinweise.length ? `<h2>Hinweise auf der Rechnung</h2>${r.hinweise.map((h) => `<p>${esc(h)}</p>`).join('')}` : ''}

<h2>Positionen</h2>
<table><thead><tr><th>Nr.</th><th>Bezeichnung</th><th class="z">Menge</th><th class="z">Einzelpreis</th><th class="z">Satz</th><th class="z">Summe</th></tr></thead>
<tbody>${r.zeilen.length ? r.zeilen.map((l) => `<tr>
  <td>${esc(l.nr)}</td>
  <td>${esc(l.bezeichnung) || '<span class="fehlt">ohne Bezeichnung</span>'}${l.beschreibung ? `<div class="klein">${esc(l.beschreibung)}</div>` : ''}</td>
  <td class="z">${l.menge === null ? '—' : new Intl.NumberFormat('de-DE', { maximumFractionDigits: 4 }).format(l.menge)}${l.einheit ? ` ${esc(l.einheit)}` : ''}</td>
  <td class="z">${eur(l.einzelpreis)}</td>
  <td class="z">${pct(l.satz)}</td>
  <td class="z">${eur(l.summe)}</td></tr>`).join('')
    : '<tr><td colspan="6" class="klein">Keine Einzelpositionen in der Datei.</td></tr>'}</tbody></table>

<h2>Steuer und Summen</h2>
<table><thead><tr><th>Steuergruppe</th><th class="z">Bemessung</th><th class="z">Satz</th><th class="z">Steuer</th></tr></thead>
<tbody>${r.steuer.length ? r.steuer.map((t) => `<tr>
  <td>${esc(t.kategorie) || '—'} — ${esc(STEUERKATEGORIEN[t.kategorie] || 'unbekannt')}${t.grund ? `<div class="klein">${esc(t.grund)}</div>` : ''}</td>
  <td class="z">${eur(t.netto)}</td><td class="z">${pct(t.satz)}</td><td class="z">${eur(t.steuer)}</td></tr>`).join('')
    : '<tr><td colspan="4" class="klein">Keine Steuerangabe in der Datei.</td></tr>'}</tbody></table>

<table class="summen"><tbody>
 <tr><td>Summe der Positionen</td><td class="z">${eur(r.summen.zeilenSumme)}</td></tr>
 ${r.summen.nachlaesse ? `<tr><td>abzgl. Nachlaesse</td><td class="z">− ${eur(r.summen.nachlaesse)}</td></tr>` : ''}
 ${r.summen.zuschlaege ? `<tr><td>zzgl. Zuschlaege</td><td class="z">${eur(r.summen.zuschlaege)}</td></tr>` : ''}
 <tr><td>Nettobetrag</td><td class="z">${eur(r.summen.netto)}</td></tr>
 <tr><td>Umsatzsteuer</td><td class="z">${eur(r.steuerGesamt)}</td></tr>
 <tr><td>Bruttobetrag</td><td class="z">${eur(r.summen.brutto)}</td></tr>
 ${r.summen.angezahlt ? `<tr><td>bereits gezahlt</td><td class="z">− ${eur(r.summen.angezahlt)}</td></tr>` : ''}
 <tr class="haupt"><td>Zahlbetrag</td><td class="z">${eur(r.summen.zahlbar)}</td></tr>
</tbody></table>

<h2>Pruefung</h2>
<div>${[...befunde].sort((a, c) => rang[a.stufe] - rang[c.stufe]).map((b) => `
 <div class="befund ${b.stufe}"><div class="pkt">${b.stufe === 'ok' ? '✓' : b.stufe === 'warnung' ? '!' : '✗'}</div>
 <div><span class="btitel">${esc(b.titel)}</span> — ${esc(b.text)}</div></div>`).join('')}</div>

<div class="fuss">
 Erzeugt aus <code>${esc(path.basename(quelldatei))}</code> am ${new Date().toLocaleString('de-DE')} mit
 <code>scripts/e-rechnung-ansehen.mjs</code>.<br>
 Diese Ansicht ist eine Lesehilfe, <strong>kein Beleg</strong>. Aufbewahrungspflichtig ist die
 Originaldatei in dem Format, in dem sie eingegangen ist (§ 14b UStG, § 147 AO); dieses Programm hat
 sie ausschliesslich gelesen und nicht veraendert. Die Pruefung ersetzt weder eine Validierung gegen
 das amtliche Schema noch den Steuerberater.
</div>
</div></body></html>`;
}

/* ---------------------------------------------------------------- Main --- */

const argv = process.argv.slice(2);
if (!argv.length || argv.includes('--hilfe') || argv.includes('-h')) {
  console.log(`
E-Rechnung ansehen und nachrechnen

  node scripts/e-rechnung-ansehen.mjs <datei.xml|datei.pdf> [Optionen]

  --out <ordner>   Zielordner fuer die HTML-Ansicht
                   (Voreinstellung: Unterordner "e-rechnung-ansicht" im Temp-Verzeichnis)
  --nur-pruefen    nur die Pruefung auf der Konsole, keine HTML-Datei

Rueckgabewert: 0 = keine Fehler, 1 = Rechnung fehlerhaft, 2/3 = Datei nicht lesbar.
Die Eingangsdatei wird nur gelesen, nie veraendert.
`);
  process.exit(argv.length ? 0 : 1);
}

const outIdx = argv.indexOf('--out');
const outDir = outIdx >= 0 ? argv[outIdx + 1] : path.join(os.tmpdir(), 'e-rechnung-ansicht');
const nurPruefen = argv.includes('--nur-pruefen');
const quelle = argv.find((a, i) => !a.startsWith('--') && (outIdx < 0 || i !== outIdx + 1));

if (!quelle || !fs.existsSync(quelle)) { console.error(`Datei nicht gefunden: ${quelle}`); process.exit(2); }
const outAbs = path.resolve(outDir);
if (outAbs.split(path.sep).includes('belege')) {
  console.error('Abbruch: die Ansicht darf nicht nach belege/ geschrieben werden. Dort liegen nur Originale.');
  process.exit(2);
}

const roh = fs.readFileSync(quelle);
let xmlText;
if (roh.subarray(0, 5).toString('latin1') === '%PDF-') {
  xmlText = xmlAusPdf(roh);
  if (!xmlText) {
    console.error('Kein eingebettetes XML gefunden. Entweder ist das ein normales PDF ohne strukturierten');
    console.error('Teil — dann ist es seit 2025 keine E-Rechnung, sondern eine "sonstige Rechnung" — oder der');
    console.error('Anhang liegt in einer Kodierung, die dieses Programm nicht aufloest. Dann im PDF-Betrachter');
    console.error('unter "Anlagen" nachsehen und die XML-Datei einzeln uebergeben.');
    process.exit(3);
  }
} else {
  xmlText = roh.toString('utf8').replace(/^﻿/, '');
}

const baum = parseXml(xmlText);
const wurzel = baum.children.find((c) => ['Invoice', 'CreditNote', 'CrossIndustryInvoice'].includes(c.name));
if (!wurzel) { console.error('Das ist keine erkennbare E-Rechnung (weder UBL noch CII).'); process.exit(3); }

const r = wurzel.name === 'CrossIndustryInvoice' ? ausCii(wurzel) : ausUbl(wurzel, wurzel.name);
const befunde = pruefe(r);
const nFehler = befunde.filter((b) => b.stufe === 'fehler').length;
const nWarn = befunde.filter((b) => b.stufe === 'warnung').length;

console.log('');
console.log(`  ${DOKUMENTARTEN[r.art] || 'Rechnung'} ${r.nummer} · ${r.verkaeufer.name || '?'} · ${r.datum}`);
console.log(`  Format: ${r.quelle}`);
console.log(`  Netto ${eur(r.summen.netto)} + USt ${eur(r.steuerGesamt)} = Brutto ${eur(r.summen.brutto)} · zahlbar ${eur(r.summen.zahlbar)}`);
console.log('');
for (const b of befunde) {
  console.log(`  ${b.stufe === 'ok' ? '+' : b.stufe === 'warnung' ? '!' : 'x'} ${b.titel} — ${b.text}`);
}
console.log('');
console.log(nFehler
  ? `  ERGEBNIS: ${nFehler} Fehler — nicht bezahlen, bevor das geklaert ist.`
  : nWarn ? `  ERGEBNIS: rechnerisch in Ordnung, ${nWarn} Hinweis(e).`
    : '  ERGEBNIS: alle zehn Pruefungen bestanden.');

if (!nurPruefen) {
  fs.mkdirSync(outAbs, { recursive: true });
  const ziel = path.join(outAbs, `${path.basename(quelle).replace(/\.[^.]+$/, '')}-ansicht.html`);
  fs.writeFileSync(ziel, html(r, befunde, quelle), 'utf8');
  console.log(`  Ansicht: ${ziel} (${fs.statSync(ziel).size} Byte)`);
}
console.log('  Die Originaldatei wurde nur gelesen, nicht veraendert.');
console.log('');
process.exit(nFehler ? 1 : 0);
