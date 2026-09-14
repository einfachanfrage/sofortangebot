// DC-078 / TN-075 (Manfred, 11.09.2026) — Anrede in Mail und WhatsApp.
//
// Diese Tests halten vor allem EINE Zusage fest: es wird nicht geraten,
// welcher Teil des Namensfelds der Vorname ist. Die drei Fälle unten sind
// genau die, an denen die alte `split(' ')[0]`-Zeile falsch lag.
import { describe, it, expect } from 'vitest'
import { anredeZeile } from '@/lib/anrede'

describe('DC-078 — Anrede', () => {
  it('spricht eine Privatkundin mit vollem Namen an, nicht mit dem Vornamen', () => {
    expect(anredeZeile({ name: 'Renate Krüger', ist_unternehmen: false }))
      .toBe('Guten Tag, Renate Krüger,')
  })

  it('macht aus „Frau Krüger" nicht „Hallo Frau,"', () => {
    expect(anredeZeile({ name: 'Frau Krüger', ist_unternehmen: false }))
      .toBe('Guten Tag, Frau Krüger,')
  })

  it('macht aus „Krüger, Renate" nicht „Hallo Krüger,"', () => {
    expect(anredeZeile({ name: 'Krüger, Renate', ist_unternehmen: false }))
      .toBe('Guten Tag, Krüger, Renate,')
  })

  it('lässt den Namen bei gewerblichen Kunden weg', () => {
    expect(anredeZeile({ name: 'Fischer GmbH', ist_unternehmen: true }))
      .toBe('Guten Tag,')
  })

  it('kommt ohne Kunden und ohne Namen aus', () => {
    expect(anredeZeile(null)).toBe('Guten Tag,')
    expect(anredeZeile(undefined)).toBe('Guten Tag,')
    expect(anredeZeile({ name: '   ' })).toBe('Guten Tag,')
  })
})
