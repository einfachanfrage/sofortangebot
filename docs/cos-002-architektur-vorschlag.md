# CoS-002 — Architektur-Vorschlag: „Karte ≠ Berechnung" endgültig fixen

**Datum:** 2026-08-20
**Autor:** Head of Product Engineering
**Auftrag:** Chief of Staff, `chief-of-staff-todos.md` CoS-002 (aktiviert 20.08., Sandy: „das soll
endgültig gefixt werden") — konkreter Umsetzungsvorschlag mit Optionen, Aufwand, Risiko, Umgang mit
den zwei am 19.08. aufgetauchten Kompliziertheiten, und Einschätzung klein-schrittig vs. großer Schritt.

**Kurzfassung (für Eilige):** Root Cause ist bestätigt zwei unabhängige, verschieden teure GPT-Aufrufe
auf demselben Text. Ich empfehle **Option 1 — echte Single-Source-of-Truth**, aber **in drei kleinen,
unabhängig auslieferbaren Schritten statt einem großen Umbau**, plus **Option 2 als sofortige
Zwischenmaßnahme** (kann diese Woche raus, schließt aber die Vertrauenslücke nur teilweise). Ein
Nebenfund beim Recherchieren: die Kosten-Protokollierung für die teure Extraktion ist seit 20.07. still
kaputt (Details unten) — eigenes, kleines Ticket wert, nicht Teil dieses Vorschlags.

---

## 1. Root Cause (bestätigt, nicht nur vermutet)

Card („Aufnahmekarte") und finale Berechnung laufen über zwei komplett getrennte KI-Aufrufe auf
demselben Transkript:

| | Karte (`extrahiereChips`) | Finale Berechnung (`ki-extrahieren`) |
|---|---|---|
| Modell | `gpt-4o-mini` | `gpt-4o` (**~16× teurer pro Aufruf**, Kommentar im Code: „hält die Anweisungen zuverlässiger ein") |
| Prompt | ~30 Zeilen, einfache Chip-Liste | ~140 Zeilen, strukturierte Vollextraktion (Räume, Öffnungen, Gewerk-Sonderfelder, Rückfragen) |
| Wo aufgerufen | bei jeder Aufnahme sofort (`aufnahme/upload`, `aufnahme/verarbeite`) | erst beim Klick „Entwurf erstellen" (`generiere-positionen` → `angebot-extrahieren`) |
| Nachbearbeitung | ein deterministischer Zusatzschritt (`chips-vervollstaendigung.ts`, heutiger PM-001-Fix) | großer deterministischer Rechenkern (`mehrgewerk.ts`, Preis-Matching) |
| Cross-Aufnahme-Kontext | bekommt bis zu 5 vorherige Aufnahmen als Kontext-Notizen | **bekommt gar keinen** — jede neue Aufnahme wird isoliert extrahiert |

Zwei getrennte GPT-Antworten auf (fast) denselben Text können strukturell nie zu 100 % übereinstimmen —
das ist keine Race-Condition und kein Bug im engeren Sinn, sondern eine Architekturentscheidung von
Anfang an: „schnelle Vorschau" und „genaue Berechnung" wurden bewusst getrennt gebaut, wahrscheinlich
für Antwortzeit und Kosten bei der Vorschau. Das erklärt auch, warum sich das Muster durch so viele
Einzelfunde zieht (PM-001, PD-001, DC-021, DC-022, Punkt 3/DC-010) — es ist überall dieselbe Ursache.

---

## 2. Die zwei Kompliziertheiten vom 19.08. — was sie konkret bedeuten

**(a) Additive statt vollständige Raum-Verarbeitung.** Bestätigt im Code: `generiere-positionen`
verarbeitet bei jedem Klick nur die *neuen* Aufnahmen seit der letzten Generierung
(`aufnahmen_ids`/Timestamp-Filter), fasst NUR deren Transkripte zu einem Text zusammen und schickt genau
diesen einen Text an `ki-extrahieren`. Eine später hinzugefügte Aufnahme zu „Küche" hat null Sichtbarkeit
auf das, was in einer früheren, bereits generierten „Wohnzimmer"-Aufnahme stand. Innerhalb EINES Klicks
mit mehreren gleichzeitig neuen Aufnahmen funktioniert Zusammenführen/Korrektur („ach nein, doch nicht")
noch, weil deren Texte gemeinsam in einem Aufruf landen — das Problem betrifft nur den Fall „neue Aufnahme
NACH einer bereits generierten".

**(b) Manuelle Positions-Änderungen vs. Neu-Berechnung.** Bestätigt im Code: es gibt aktuell **keinen**
Schutz-Flag und **keine** explizite Logik dafür — bereits generierte `quote_items` überleben eine erneute
Generierung nur, weil `generiere-positionen` rein additiv arbeitet (nur `INSERT`, nie `UPDATE`/`DELETE`
auf bestehende Zeilen). Das ist aktuell zufällig sicher, aber fragil: der Dublettenschutz vergleicht nur
Titel+Menge exakt — ändert ein Nutzer manuell den Preis einer Position und beschreibt später denselben
Raum nochmal (leicht anders formuliert), kann eine fast-doppelte Zeile NEBEN der bearbeiteten entstehen,
statt sie zu ersetzen. **Das ist ein eigener, von CoS-002 unabhängiger Bug** (keine Verschlechterung durch
irgendeine der beiden Optionen unten, aber auch keine der beiden Optionen behebt ihn automatisch) — siehe
Empfehlung am Ende.

---

## 3. Option 1 — Single Source of Truth (empfohlen, in drei Schritten)

**Idee:** Nicht mehr zweimal fragen. Die teure, strukturierte Extraktion (`ki-extrahieren`) läuft genau
einmal pro Aufnahme, das Ergebnis wird gespeichert, und sowohl Karte als auch finale Berechnung lesen
DASSELBE gespeicherte Ergebnis — die Karte zeigt also ab dann keine Vorschau mehr, sondern die Wahrheit,
nur eben noch ohne Preise.

**Schritt 1 (klein, risikoarm): Ergebnis cachen, ohne Verhalten zu ändern.**
`ki-extrahieren` wird zusätzlich zum Aufnahme-Zeitpunkt aufgerufen (parallel zur bisherigen
`extrahiereChips`, beide laufen erstmal weiter nebeneinander), das strukturierte Ergebnis wird auf der
`entwurf_aufnahmen`-Zeile gespeichert (neue Spalte, z. B. `voll_extraktion jsonb`). Nichts am sichtbaren
Verhalten ändert sich, reines Plumbing. Aufwand: klein, 1–2 Tage. Risiko: sehr gering (additive
Schema-Änderung, kein bestehender Pfad wird verändert).

**Schritt 2 (mittel): Karte liest aus dem gecachten Ergebnis statt aus `extrahiereChips`.**
Die Chip-Anzeige wird aus `voll_extraktion` abgeleitet (dieselbe deterministische Positions-Logik aus
`mehrgewerk.ts`, ohne den Preis-Matching-Schritt) statt aus dem separaten, einfacheren Mini-Modell-Aufruf.
`extrahiereChips` kann danach entfernt werden. Aufwand: mittel, ca. 3–5 Tage (Mapping-Funktion
Extraktion→Kartenanzeige, UI-Anpassungen für „wird geprüft…"-Zustand während der längeren KI-Antwortzeit).
Risiko: mittel — ändert erstmals, was der Nutzer sofort nach dem Sprechen sieht.

**Schritt 3 (größer, der eigentliche Kern): „Entwurf erstellen" ruft `ki-extrahieren` NICHT mehr neu auf.**
Stattdessen werden die gecachten Extraktionen aller beteiligten Aufnahmen deterministisch zusammengeführt
und direkt in `mehrgewerk.ts`/Preis-Matching gegeben. Hier muss auch (a) oben mit adressiert werden: die
gecachte Extraktion pro Aufnahme braucht denselben Kontext-Mechanismus, den `extrahiereChips` schon hat
(letzte 5 Aufnahmen als Kontext an den GPT-Aufruf mitgeben), sonst geht die heutige
Innerhalb-eines-Klicks-Zusammenführung verloren. Aufwand: groß, ca. 1–1,5 Wochen inkl. Testabdeckung —
das ist der Rechenkern, an dem Sandy explizit vorsichtig sein wollte. Risiko: mittel-hoch, aber
beherrschbar, weil Schritt 1+2 vorher schon in Produktion gelaufen sind und Vertrauen in die gecachte
Struktur aufgebaut haben, bevor der Geld-Pfad angefasst wird.

**Trade-offs, ehrlich benannt:**
- **Kosten:** jede Aufnahme löst jetzt einen `gpt-4o`-Aufruf aus (~16× teurer als der bisherige
  `gpt-4o-mini`-Vorschau-Aufruf), nicht mehr nur die tatsächlich generierten Entwürfe. Bei den aktuellen
  Test-Nutzungszahlen (70 Aufnahmen, 61 davon generiert — siehe Abschnitt 5) ist der absolute Unterschied
  Cent-Beträge, aber der Multiplikator gilt genauso beim Hochskalieren mit echten Kunden. Das ist eine
  Preis-/Kalkulationsfrage, keine rein technische — gehört meiner Einschätzung nach zur Entscheidung dazu,
  nicht nur „wird schon passen".
- **Latenz:** der Moment direkt nach dem Sprechen wird langsamer (der große Modell-Aufruf braucht laut
  eigenem Timeout-Budget der Funktion bis zu 25 Sekunden, statt der heutigen schnellen Vorschau). Lässt
  sich abfedern (Karte zeigt kurz „wird geprüft…" statt eines sofortigen, aber unsicheren Ergebnisses),
  ändert aber das gefühlte Antwortverhalten des Produkts an einer zentralen Stelle.
- **(a) Additive Verarbeitung:** wird durch den Kontext-Mechanismus in Schritt 3 spürbar besser
  (dieselbe Technik wie bei den Chips heute), aber nicht vollständig gelöst — „5 vorherige Aufnahmen als
  Kontext" ist eine Heuristik, kein echtes Gedächtnis über den ganzen Entwurf. Für den ganz sauberen Fall
  bräuchte es eine dritte, größere Änderung (die komplette bisherige Struktur des Angebots als Kontext
  mitgeben) — bewusst NICHT Teil dieses Vorschlags, das wäre echter Big-Bang.
- **(b) Manuelle Änderungen:** wird durch Option 1 strukturell nicht schlechter (weiterhin additiv,
  bereits generierte Aufnahmen werden nie neu verarbeitet) — aber auch nicht besser. Bleibt eigener Fund.

---

## 4. Option 2 — Nachträglicher Abgleich statt Architekturwechsel (sofort machbar, Teillösung)

**Idee:** Beide GPT-Aufrufe bleiben wie heute bestehen. Sobald „Entwurf erstellen" das echte,
verlässliche Ergebnis berechnet hat, wird dieses Ergebnis zurück auf die beteiligten
`entwurf_aufnahmen`-Zeilen geschrieben (überschreibt die ursprüngliche Chip-Vorschau). Geht man später
zu einer Aufnahme zurück, sieht man die Wahrheit, nicht mehr die ursprüngliche Vermutung.

Aufwand: klein, 1–2 Tage. Risiko: sehr gering — reine Zusatz-Schreiboperation nach erfolgreicher
Berechnung, rührt an keiner bestehenden Berechnungslogik.

**Ehrlich zur Grenze dieser Option:** Sie behebt NICHT das eigentliche, von Sandy benannte
Vertrauensproblem — die Karte kann direkt nach der Aufnahme, VOR dem Klick auf „Entwurf erstellen",
weiterhin etwas versprechen, das die Berechnung dann anders sieht. Genau dieser Moment ist der, den Sandy
mit „bevor ich dir was in Rechnung stelle" meinte. Ich würde das nicht als Ersatz für Option 1 verkaufen,
sondern höchstens als schnelle Zwischenmaßnahme, die den Schaden nach dem ersten „Entwurf erstellen"
begrenzt, während Option 1 gebaut wird.

---

## 5. Kleine Schritte oder ein großer? Meine Einschätzung

Ein großer Big-Bang-Umbau (alles auf einmal umstellen) würde gegen die eigene Grundregel verstoßen und
ist hier auch technisch nicht nötig — Option 1 lässt sich sauber in die drei oben beschriebenen Schritte
zerlegen, jeder für sich einzeln auslieferbar und einzeln zurückrollbar. Nur Schritt 3 fasst den
Geld-Pfad an, und genau der lässt sich am sichersten bauen, wenn Schritt 1+2 vorher schon bewiesen haben,
dass die gecachte Extraktion in der Praxis trägt. Meine Empfehlung: **Option 2 diese Woche als
Sofortmaßnahme, parallel Option 1 Schritt 1 starten, danach Schritt 2, erst danach Schritt 3** — nicht,
weil Schritt 3 unwichtig wäre, sondern weil er der einzige Teil ist, der wirklich Sorgfalt statt
Geschwindigkeit braucht.

---

## Daten, die ich für diesen Vorschlag geprüft habe (nur lesend, Produktions-DB)

- **Aktuelles Nutzungsvolumen:** 70 Sprach-Aufnahmen über 68 Angebote (Ø ~1,03 Aufnahmen/Angebot — noch
  sehr frühe Testphase, kein echtes Kundenvolumen), davon 61 Angebote mit mindestens einer Generierung.
  Grundlage für die Einschätzung „Kosten-Unterschied aktuell klein, aber Multiplikator zählt beim
  Hochskalieren" oben.
- **Nebenfund, nicht Teil dieses Vorschlags:** Die Kosten-Protokollierung (`ki_usage`) für den teuren
  `extraktion`-Aufruf ist seit **20.07.2026 komplett ausgefallen** (kein einziger neuer Eintrag seither,
  während die `transkription`-Protokollierung bis heute normal weiterläuft). Ursache vermutlich ein
  Spalten-Mismatch: die Funktion `ki-extrahieren` schreibt `prompt_typ`/`input_tokens`/`output_tokens`/
  `angebot_id`, die echte Tabelle hat aber `endpunkt`/`tokens_in`/`tokens_out` (kein `angebot_id`-Feld) —
  der `.then(() => {})`-Fire-and-forget im Code schluckt den daraus resultierenden Fehler still. Deshalb
  konnte ich die aktuellen Ist-Kosten pro Extraktion nicht aus der Datenbank bestätigen, nur aus der
  16×-Preisrelation im Code-Kommentar ableiten. Das ist ein eigenes, kleines, unabhängiges Ticket wert
  (blinder Fleck bei den KI-Kosten seit einem Monat) — mache ich nicht ungefragt, sage aber hiermit
  ausdrücklich Bescheid, falls das jemand aufgreifen möchte.
