import { describe, expect, it } from 'vitest'
import { ladeFotosFuerPdf } from '../angebot-fotos'

// CoS-021/DC-034: Fotos im Angebots-PDF. Der wichtigste Grundsatz hier ist
// nicht „das Foto muss rein", sondern: **ein Foto darf die Angebotserstellung
// niemals verhindern.** Ein kaputtes, fehlendes oder riesiges Bild wird
// übersprungen — das Angebot entsteht trotzdem.

function blobMit(bytes: number): Blob {
  return new Blob([new Uint8Array(bytes)], { type: 'image/jpeg' })
}

/** Minimaler Fake des Supabase-Clients — nur die zwei benutzten Wege. */
function fakeClient(
  zeilen: Array<{ foto_url: string | null; foto_beschreibung: string | null }>,
  dateien: Record<string, Blob | null | 'fehler'>,
) {
  const kette = {
    select: () => kette, eq: () => kette,
    order: () => kette,
    then: (aufloesen: (r: { data: typeof zeilen }) => unknown) => aufloesen({ data: zeilen }),
  }
  return {
    from: () => kette,
    storage: {
      from: () => ({
        download: async (pfad: string) => {
          const datei = dateien[pfad]
          if (datei === 'fehler') throw new Error('Storage weg')
          return { data: datei ?? null }
        },
      }),
    },
  }
}

describe('CoS-021 – Fotos fürs Angebots-PDF laden', () => {
  it('macht aus einem freigegebenen Foto ein einbettbares Bild', async () => {
    const client = fakeClient(
      [{ foto_url: 'u1/a1/f1/foto.jpg', foto_beschreibung: 'Wand vorher' }],
      { 'u1/a1/f1/foto.jpg': blobMit(1024) },
    )
    const fotos = await ladeFotosFuerPdf(client, 'a1')
    expect(fotos).toHaveLength(1)
    expect(fotos[0].bild.startsWith('data:image/jpeg;base64,')).toBe(true)
    expect(fotos[0].beschreibung).toBe('Wand vorher')
  })

  it('erkennt PNG und WebP an der Endung', async () => {
    const client = fakeClient(
      [
        { foto_url: 'u1/a1/f1/foto.png', foto_beschreibung: null },
        { foto_url: 'u1/a1/f2/foto.webp', foto_beschreibung: null },
      ],
      { 'u1/a1/f1/foto.png': blobMit(512), 'u1/a1/f2/foto.webp': blobMit(512) },
    )
    const fotos = await ladeFotosFuerPdf(client, 'a1')
    expect(fotos[0].bild.startsWith('data:image/png;base64,')).toBe(true)
    expect(fotos[1].bild.startsWith('data:image/webp;base64,')).toBe(true)
  })

  it('überspringt ein kaputtes Foto, statt das ganze PDF scheitern zu lassen', async () => {
    const client = fakeClient(
      [
        { foto_url: 'kaputt.jpg', foto_beschreibung: null },
        { foto_url: 'heil.jpg', foto_beschreibung: 'zählt' },
      ],
      { 'kaputt.jpg': 'fehler', 'heil.jpg': blobMit(1024) },
    )
    const fotos = await ladeFotosFuerPdf(client, 'a1')
    expect(fotos).toHaveLength(1)
    expect(fotos[0].beschreibung).toBe('zählt')
  })

  it('überspringt fehlende und leere Dateien', async () => {
    const client = fakeClient(
      [
        { foto_url: 'weg.jpg', foto_beschreibung: null },
        { foto_url: 'leer.jpg', foto_beschreibung: null },
        { foto_url: null, foto_beschreibung: null },
      ],
      { 'weg.jpg': null, 'leer.jpg': blobMit(0) },
    )
    expect(await ladeFotosFuerPdf(client, 'a1')).toEqual([])
  })

  it('überspringt zu große Bilder (ein Angebot muss versendbar bleiben)', async () => {
    const client = fakeClient(
      [{ foto_url: 'riesig.jpg', foto_beschreibung: null }],
      { 'riesig.jpg': blobMit(7 * 1024 * 1024) },
    )
    expect(await ladeFotosFuerPdf(client, 'a1')).toEqual([])
  })

  it('nimmt höchstens acht Fotos — ein Angebot ist kein Fotoalbum', async () => {
    const zeilen = Array.from({ length: 12 }, (_, i) => ({ foto_url: `f${i}.jpg`, foto_beschreibung: null }))
    const dateien = Object.fromEntries(zeilen.map(z => [z.foto_url, blobMit(256)]))
    const fotos = await ladeFotosFuerPdf(fakeClient(zeilen, dateien), 'a1')
    expect(fotos).toHaveLength(8)
  })

  it('liefert eine leere Liste, wenn die Abfrage selbst scheitert', async () => {
    const kaputterClient = {
      from: () => { throw new Error('DB weg') },
      storage: { from: () => ({ download: async () => ({ data: null }) }) },
    }
    expect(await ladeFotosFuerPdf(kaputterClient, 'a1')).toEqual([])
  })

  it('macht aus einer leeren Beschreibung kein leeres Textfeld im PDF', async () => {
    const client = fakeClient(
      [{ foto_url: 'f.jpg', foto_beschreibung: '   ' }],
      { 'f.jpg': blobMit(256) },
    )
    const fotos = await ladeFotosFuerPdf(client, 'a1')
    expect(fotos[0].beschreibung).toBeNull()
  })
})
