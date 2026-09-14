import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import {
  eRechnungErlaubt,
  E_RECHNUNG_DOKUMENTTYPEN,
} from '../zugferd/einbettung'

// DC-100 (Sandy, 13.09.2026): Angebote und Kostenvoranschläge dürfen keine
// E-Rechnungs-XML tragen. Die XML weist sich als Rechnung aus (TypeCode 380)
// und lief bei Geschäftskunden per E-Mail direkt in die Buchhaltung des
// Kunden. Diese Datei ist die Sperrklinke dazu.

describe('DC-100: Angebote tragen keine E-Rechnung', () => {
  it('der Normalfall — Angebot an Geschäftskunden, Schalter an — bleibt aus', () => {
    expect(eRechnungErlaubt({
      dokumentTyp: 'angebot',
      eRechnungAktiv: true,
      kundeIstUnternehmen: true,
    })).toBe(false)
  })

  it('Kostenvoranschlag genauso', () => {
    expect(eRechnungErlaubt({
      dokumentTyp: 'kostenvoranschlag',
      eRechnungAktiv: true,
      kundeIstUnternehmen: true,
    })).toBe(false)
  })

  it('ohne Dokumenttyp wird wie „Angebot" behandelt, nicht wie „egal"', () => {
    expect(eRechnungErlaubt({
      dokumentTyp: null,
      eRechnungAktiv: true,
      kundeIstUnternehmen: true,
    })).toBe(false)
    expect(eRechnungErlaubt({ kundeIstUnternehmen: true })).toBe(false)
  })

  it('es gibt derzeit keinen erlaubten Dokumenttyp', () => {
    // Diese Zeile ist der eigentliche Schalter. Wer sie ändert, muss wissen,
    // dass er DC-100 aufhebt — deshalb steht sie hier ausdrücklich im Test.
    expect(E_RECHNUNG_DOKUMENTTYPEN).toHaveLength(0)
  })
})

describe('DC-100: keine Route darf am Schalter vorbei', () => {
  const API = join(process.cwd(), 'src', 'app', 'api')

  function alleDateien(dir: string): string[] {
    const raus: string[] = []
    for (const eintrag of readdirSync(dir)) {
      const voll = join(dir, eintrag)
      if (statSync(voll).isDirectory()) raus.push(...alleDateien(voll))
      else if (voll.endsWith('.ts') || voll.endsWith('.tsx')) raus.push(voll)
    }
    return raus
  }

  it('jede Route, die ZUGFeRD anfasst, fragt vorher eRechnungErlaubt', () => {
    const suender: string[] = []

    for (const datei of alleDateien(API)) {
      const inhalt = readFileSync(datei, 'utf-8')
      const fasstZugferdAn =
        /from\s+['"][^'"]*zugferd\/(generateXML|embedXML)['"]/.test(inhalt)
      if (!fasstZugferdAn) continue

      const fragtDenSchalter = /eRechnungErlaubt/.test(inhalt)
      if (!fragtDenSchalter) suender.push(datei.slice(API.length + 1))
    }

    // Wenn dieser Test rot wird, ist eine neue Route entstanden, die eine
    // als Rechnung deklarierte XML erzeugt, ohne zu fragen, ob sie das darf.
    // Der Weg zurück ist nicht, den Test zu lockern, sondern in der Route
    // `eRechnungErlaubt({ dokumentTyp, eRechnungAktiv, kundeIstUnternehmen })`
    // abzufragen.
    expect(suender).toEqual([])
  })
})
