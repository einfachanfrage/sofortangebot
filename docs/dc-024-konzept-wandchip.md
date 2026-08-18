# DC-024 — Konzept: eigenes Anzeige-Format für Nicht-Raum-Objekte („Wand-Chip")

**Bezug:** PD-003 (`pruefmeister-notizen-fuer-designer.md`), PM-008 Nachtest 5,
Punkt 4 im Fix-Update von Head of Product Engineering
(`pruefmeister-testfaelle.md`). Betrifft `RaumDimensionenZeile` in
`AngebotDetail.tsx` (die Bearbeiten-Ansicht eines fertigen Angebots).

## Das Problem, kurz

`RaumDimensionenZeile` ist für „echte" Räume gebaut: Breite × Länge, Höhe,
Türen, Fenster — fünf Felder, jedes zeigt ein rotes „!", sobald der Wert
`undefined` ist (`InlineNum`, Zeile 113–124 in `AngebotDetail.tsx`). Bei einer
Fassade bleibt laut Head of Product Engineerings Root-Cause-Analyse
`raeume[]` komplett leer — also sind alle fünf Werte `undefined`, und die
Karte zeigt fünf rote Fehler gleichzeitig, obwohl die Fläche darunter
(66,96 m²) korrekt berechnet ist. Das sieht aus wie „hier ist alles kaputt",
ist aber nur ein fehlendes Format.

Mein Nordstern dafür: **Alles, was es braucht, ist da. Alles, was es nicht
braucht, ist weg.** Eine Wand hat keine Breite (keine Raumtiefe) — das Feld
sollte für sie gar nicht erst existieren, statt rot zu blinken.

## Das Konzept: Wand-Chip statt Raum-Chip

Automatisch aktiv, wenn ein Aufmaß-Objekt vom Typ „Wand" ist (kein manueller
Umschalter für den Handwerker — das entscheidet die Aufnahme, nicht der
Nutzer):

1. **Kein Modus-Umschalter** (Raummaße / Flächen eingeben / Raumform). Eine
   flache Wand hat eine Form, nicht drei — die drei Tabs sind für sie
   bedeutungslose Komplexität.
2. **Zwei Maß-Felder statt drei:** „Wandlänge" × „Wandhöhe" (m). Kein
   „Breite"-Feld — das gibt es bei einer Wand konzeptionell nicht, also zeigt
   es auch kein „!" mehr dafür.
3. **Türen / Fenster bleiben**, exakt wie heute (`InlineNum`, gleiche
   Bausteine, gleiches „!"-Verhalten bei fehlendem Wert) — eine Fassade kann
   durchaus Fenster und gelegentlich eine echte Tür haben.
4. **„So gerechnet"-Zeile direkt unter den Feldern:** z. B.
   „12,00 m × 6,00 m − 3 Fenster (5,04 m²) = 66,96 m² netto". Dasselbe
   Vertrauens-Element, das laut Prüfmeister in der Positionsansicht schon gut
   funktioniert (siehe DC-023-Nebenfund) — hier eine Stufe früher, direkt am
   Ort, wo heute die roten Fehler standen.

Ergebnis: maximal **zwei** mögliche „!"-Zustände statt fünf, und die, die
bleiben, sind echte Lücken (Länge/Höhe wirklich nicht erfasst) statt
strukturell unvermeidbarer Fehlanzeigen.

Mockup (statisch, Vorher/Nachher): `dc-024-wandchip-mockup.html`.

## Was das technisch braucht (unverändert von Head of Product Engineerings
eigenem Vorschlag aus PM-008 Nachtest 5, Punkt 4 — ich übernehme ihn, ändere
nichts an der Aufteilung)

- `RaumDimension.modus` um `'wand'` erweitern (Geschwister von `'rechteck'` /
  `'flaeche'` / `'grundriss'` in `lib/raum-geometrie.ts`).
- Die Bearbeiten-Ansicht (`AngebotDetail.tsx`) zusätzlich aus `waende[]`
  befüllen, nicht nur aus `raeume[]` — sonst bleibt das Feld für reine
  Fassaden-Aufnahmen weiterhin leer, Format hin oder her.
- Flächenberechnung für `'wand'`: Länge × Höhe − Öffnungen, direkt — nicht
  über die Raumumfang-Formel (`2 × (Breite + Länge)`), die für eine einzelne
  Wand fachlich falsch wäre.

## Was ich bewusst NICHT anfasse

Ich schreibe hier keinen Code in `AngebotDetail.tsx` oder
`raum-geometrie.ts`. `modus: 'wand'` existiert im Datenmodell noch nicht, und
diese Stelle betrifft die Live-Neuberechnung fertiger, bereits verschickter
Angebote — genau der Grund, warum Head of Product Engineering das selbst als
„wartet auf Sandys Go, koordiniert mit dem Designer, nicht blind
implementiert" eingestuft hat. Das Design-Spec oben ist Feld für Feld bereit
— sobald der `'wand'`-Zweig im Datenmodell steht, baue ich die Komponente
dazu.

## Für Sandy

Design-Seite steht. Was jetzt fehlt, ist dein Go für den
Engineering-Vorschlag aus PM-008 Nachtest 5, Punkt 4 (Datenmodell-Änderung,
betrifft den Live-Berechnungspfad) — dann kann Head of Product Engineering
den `'wand'`-Zweig bauen und ich binde das Format direkt daran an.

— Product Designer, 2026-08-18
