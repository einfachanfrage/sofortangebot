# DC-038 — Grundriss frei zeichnen statt nur drei Vorlagen

**Datum:** 2026-08-29 (Sandys Reaktion auf den DC-036-Screenshot: "das hier
find ich aber ehrlicherweise nicht geil")

**Auftrag (Sandys eigene Worte, zusammengefasst):** Im Grundriss-Zeichner
steht bei der Zeichnung nur die Meterzahl je Wand, nicht welche Wand aus der
Liste darunter gemeint ist ("Wand 1/2/3/4"). Außerdem gibt es nur drei
Vorlagen (Rechteck/L-Form/U-Form), aber es gibt viel mehr besondere
Raumformen. Vorschlag: der Nutzer zeichnet die Raumform grob mit dem Finger,
die App wandelt das in gerade Wände/Kanten um, die Wände werden nummeriert,
Maße können danach angepasst werden.

## Teil 1 — Wandnummern in der Zeichnung (sofort umgesetzt)

Kleinster Teil zuerst, unabhängig von der größeren Frage: in
`RaumGrundrissEditor.tsx` steht an jeder Kante jetzt `W1 · 4` statt nur `4`
— dieselbe Nummerierung wie in der Wandliste darunter. Committet (sobald ein
gerade aktiver, gleichzeitiger Commit einer anderen Rolle den Git-Lock
freigibt), `tsc` sauber.

## Teil 2 — Frei zeichnen statt nur Vorlagen (Konzept + Prototyp)

**Kernidee, technisch geprüft:** `Wand[]` (aus `raum-geometrie.ts`) ist
schon heute nichts anderes als eine Liste `{ laenge, turn?: 'L'|'R' }` —
jede Wand läuft in der aktuellen Richtung weiter, 'R'/'L' drehen die
Richtung um 90°. Eine Freihand-Zeichnung lässt sich in GENAU dieses Format
umwandeln:

1. **Erfassen:** Nutzer fährt mit dem Finger einmal um die Raumform.
2. **Vereinfachen:** Der rohe Zeichenpfad (viele Punkte) wird auf die
   wesentlichen Ecken reduziert (Ramer-Douglas-Peucker-Algorithmus, ein
   Standardverfahren dafür).
3. **Einrasten:** Jede Kantenrichtung wird auf ein Vielfaches von 90°
   relativ zur ersten Wand gerundet — Räume sind praktisch immer
   rechtwinklig, das Ergebnis ist dadurch garantiert eine gültige `Wand[]`.
   Aus der Richtungsänderung zwischen zwei Kanten ergibt sich automatisch
   `turn: 'L'` oder `'R'`.
4. **Nummerieren:** Die Wände sind durch die Zeichenreihenfolge bereits
   sortiert — Wand 1, 2, 3 … in genau der Ansicht, die Teil 1 jetzt zeigt.
5. **Anpassen:** Die erkannten Längen sind nur ein grober Startwert (Finger
   ist nie maßgenau) — sie landen direkt in derselben editierbaren
   Wandliste, die es heute schon gibt.

**Der wichtige Punkt dabei:** Das Ergebnis dieser vier Schritte ist exakt
dieselbe `Wand[]`, die die drei Vorlagen-Buttons heute schon erzeugen. Die
komplette Berechnung (Fläche, Umfang, Schließungs-Prüfung), die Vorschau
und das Speichern brauchen dafür **keine einzige Änderung** — Frei-Zeichnen
ist rein ein NEUER WEG, an dieselbe Liste zu kommen, kein neues System
daneben. Anders als DC-037 (Grundriss während der Aufnahme) ist das hier
auch **keine Backend-Änderung** — reines Frontend, bleibt komplett in
meinem Bereich.

**Prototyp:** Anbei `dc-038-freihandzeichnen-prototyp.html` — zum Ausprobieren
direkt auf deinem Handy öffnen (Datei per Mail/AirDrop/USB aufs Handy, dann
im Browser öffnen, oder auf dem Laptop mit der Maus zeichnen). Simuliert
genau die vier Schritte oben inkl. Live-Vorschau, Wandliste und
Flächenberechnung — mit der echten Farbwelt/Typo, aber isoliert von der
echten App (kein Anschluss an echte Daten).

**Bekannte Grenzen des Ansatzes (bewusst in Kauf genommen):**

- Funktioniert nur für rechtwinklige Formen (wie die bestehenden Vorlagen
  auch) — ein 45°-Erker oder eine runde Wand geht damit nicht, genau wie
  heute schon nicht. Für den ganz überwiegenden Regelfall (Nischen, Erker,
  L-/U-Grundrisse, versetzte Wände) reicht das.
- Bei einer sehr krakelig gezeichneten Form kann die Vereinfachung mal eine
  Ecke zu viel oder zu wenig erkennen — deswegen bleibt die Wandliste
  danach vollständig editierbar (Wand hinzufügen/löschen gibt es ja schon),
  kein Blocker.
- Die erkannten Längen sind reine Platzhalter aus der Zeichnung, nie exakt
  — muss so kommuniziert werden ("grob reicht, Maße danach anpassen"),
  damit niemand denkt, das Zeichnen selbst sei schon die Vermessung.

**Vorschlag zur Umsetzung, falls du grünes Licht gibst:** "Frei zeichnen"
wird ein VIERTER Button neben Rechteck/L-Form/U-Form (nicht deren Ersatz —
bei einem simplen rechteckigen Raum bleibt ein Tap auf "Rechteck" schneller
als Zeichnen). Baue ich komplett selbst, keine Rückfrage an Engineering
nötig, sobald du den Prototyp gesehen hast und sagst "so ungefähr, mach
das" oder mit Anmerkungen zurückkommst.

**Status:** ✅ Gebaut nach deinem Go ("bau den zecihner") — echter Code in
`RaumGrundrissEditor.tsx`, committet (`f88ca33`), `tsc` sauber. Details
siehe DC-038 Teil 2 in `docs/design-check.md`.
