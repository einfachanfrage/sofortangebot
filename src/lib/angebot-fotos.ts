// CoS-021 / DC-034 (2026-08-25, Sandys Entscheidung „zusammenlegen statt zwei
// Systeme"): Die Fotos, die der Handwerker ohnehin schon bei der Aufnahme vor
// Ort macht (`entwurf_aufnahmen`, Typ `foto`), sollen pro Foto ins Angebots-PDF
// übernommen werden können — statt sie über einen zweiten, getrennten
// Upload-Weg nochmal hochzuladen.
//
// Wichtiger Befund beim Umsetzen: Der „Ins PDF"-Schalter im bisherigen
// „Notizen & Fotos"-Tab hat zwar ein Flag gesetzt (`quote_photos.in_pdf`),
// aber **kein PDF-Code hat dieses Flag je gelesen** — im erzeugten PDF war
// noch nie ein Foto, nur das Firmenlogo. Der Schalter war also eine Zusage,
// die das Produkt nicht eingelöst hat. Diese Datei ist die Einlösung.
//
// Bewusst als Datei-Inhalt (Base64) statt als signierte URL: react-pdf würde
// eine URL beim Rendern selbst nachladen — das macht die PDF-Erzeugung von
// einem zweiten Netzwerkaufruf und einer Ablauffrist abhängig. Die Bytes
// direkt mitzugeben ist der ruhigere Weg.

// Bewusst lockerer Parametertyp statt der vollen SupabaseClient-Signatur: die
// generischen Ketten von supabase-js sind so tief, dass TypeScript beim
// Nachbauen aussteigt ("Type instantiation is excessively deep"). Hier zählt
// nur, dass die zwei benutzten Wege existieren — die Aufrufer übergeben ohnehin
// den echten Client.
/* eslint-disable @typescript-eslint/no-explicit-any */
interface FotoQuelle {
  from(tabelle: string): any
  storage: { from(bucket: string): { download(pfad: string): PromiseLike<{ data: Blob | null }> } }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

interface FotoZeile {
  foto_url: string | null
  foto_beschreibung: string | null
}

export interface AngebotsFoto {
  /** Vollständige data:-URI, direkt für react-pdf `<Image src>` verwendbar. */
  bild: string
  beschreibung: string | null
}

// Ein Angebots-PDF ist ein Dokument, kein Fotoalbum: eine Handvoll Bilder
// dokumentiert den Zustand, dreißig machen die Datei unversendbar.
const MAX_FOTOS = 8
const MAX_BYTES_JE_FOTO = 6 * 1024 * 1024

function mimeAusPfad(pfad: string): string {
  const endung = pfad.split('.').pop()?.toLowerCase()
  if (endung === 'png') return 'image/png'
  if (endung === 'webp') return 'image/webp'
  return 'image/jpeg'
}

/**
 * Lädt die für dieses Angebot fürs PDF freigegebenen Aufnahme-Fotos.
 *
 * Grundsatz: Ein Foto darf die Angebotserstellung niemals verhindern. Jedes
 * einzelne Bild wird für sich versucht — ein fehlendes, zu großes oder
 * kaputtes Foto wird stillschweigend übersprungen, statt das ganze PDF
 * scheitern zu lassen.
 */
export async function ladeFotosFuerPdf(
  supabase: FotoQuelle,
  angebotId: string,
): Promise<AngebotsFoto[]> {
  let zeilen: FotoZeile[] = []
  try {
    const { data } = await supabase
      .from('entwurf_aufnahmen')
      .select('foto_url, foto_beschreibung')
      .eq('angebot_id', angebotId)
      .eq('typ', 'foto')
      .eq('in_pdf', true)
      .order('sortierung', { ascending: true })
      .order('erstellt_am', { ascending: true })
    zeilen = data ?? []
  } catch {
    return []
  }

  const fotos: AngebotsFoto[] = []
  for (const zeile of zeilen.slice(0, MAX_FOTOS)) {
    const pfad = zeile.foto_url
    if (!pfad) continue
    try {
      const { data: blob } = await supabase.storage.from('entwurf-fotos').download(pfad)
      if (!blob) continue
      const bytes = Buffer.from(await blob.arrayBuffer())
      if (bytes.byteLength === 0 || bytes.byteLength > MAX_BYTES_JE_FOTO) continue
      fotos.push({
        bild: `data:${mimeAusPfad(pfad)};base64,${bytes.toString('base64')}`,
        beschreibung: zeile.foto_beschreibung?.trim() || null,
      })
    } catch {
      continue
    }
  }
  return fotos
}
