// PM-010, Vorschlag von Head of IT, freigegeben von Sandy (2026-08-17):
// Whisper (Spracherkennung) verschriftlicht die Handwerker-Sprechweise
// "drei fünfzig" (= 3,50 m) manchmal direkt als Ziffernfolge "350" — schon
// BEVOR unser eigener Code überhaupt läuft. Das ist mit Text-Nachbearbeitung
// grundsätzlich nicht zuverlässig zu fangen (siehe PM-010-Fix-Update in
// docs/pruefmeister-testfaelle.md). Diese Prüfung repariert das NICHT,
// sondern macht es nur sichtbar: eine unrealistische Raumseite löst eine
// Warnung aus, bevor ein Angebot mit einer absurden Fläche verschickt wird.
//
// Wichtig, passend zur Produktphilosophie: blockiert NIE den Flow. Nur ein
// Hinweis, den der Mensch in 5 Sekunden sieht und selbst einschätzt — nicht
// mehr "100% korrekt" erzwingen, nur schneller korrigierbar machen.
const MAX_PLAUSIBLE_SEITE_M = 15

export interface RaumFuerPlausibilitaet {
  name?: string | null
  laenge?: number | null
  breite?: number | null
}

export function pruefeMassPlausibilitaet(raeume: RaumFuerPlausibilitaet[] | undefined | null): string[] {
  const warnungen: string[] = []
  for (const raum of raeume ?? []) {
    const name = raum?.name?.trim() || 'Raum'
    const felder: Array<['Länge' | 'Breite', number | null | undefined]> = [
      ['Länge', raum?.laenge],
      ['Breite', raum?.breite],
    ]
    for (const [feld, wert] of felder) {
      if (typeof wert === 'number' && isFinite(wert) && wert > MAX_PLAUSIBLE_SEITE_M) {
        const wertText = wert.toLocaleString('de-DE')
        warnungen.push(
          `${name}: ${feld} ${wertText} m wirkt unrealistisch für einen Innenraum — bitte kurz prüfen (z. B. wurde „drei fünfzig" (3,50 m) als Ziffer „350" verstanden statt als Meterangabe mit Komma).`,
        )
      }
    }
  }
  return warnungen
}
