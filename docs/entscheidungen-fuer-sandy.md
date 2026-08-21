# Entscheidungen, die auf Sandy warten

Gebündelte Liste für genau eine Sache: Punkte, die NUR Sandy entscheiden
kann (Preis, Positionierung, Personal, Risikobereitschaft — nicht fachliche
Umsetzung, die bleibt bei den Spezialisten). Bisher lagen solche Punkte
verstreut in `design-check.md`, `chief-of-staff-todos.md` etc. — hier stehen
sie gebündelt, damit nichts im Alltag untergeht. Eine Wahrheit pro Sache
gilt weiter: hier steht nur ein kurzer Verweis + der Stand, die volle
Diskussion bleibt in der jeweiligen Heimat-Datei (verlinkt über die ID).

**Ablauf:** Sobald der Chief of Staff in einer Heimat-Datei einen Punkt auf
🔵 „Entscheidung nötig" setzt (oder eine neue Entscheidung sonst wie
entsteht), kommt sofort eine Zeile hier rein. Nach Sandys Entscheidung
wandert die Zeile von „Offen" nach „Entschieden" (bleibt stehen, nicht
löschen — Verlauf ist wertvoll).

**Status-Zeichen:** 🔵 offen, wartet auf Sandy · ✅ entschieden.

---

## Offen

🔵 **CoS-002 Schritt 3 — reicht der aktuelle Umfang für Gate 1?** (Head of
Product Engineering, 2026-08-21): Alle drei Schritte sind umgesetzt. Das
eigentliche Vertrauensproblem („Karte zeigt etwas anderes als die
Berechnung") ist damit in JEDEM Fall gelöst, unabhängig von der Anzahl
Aufnahmen (Option 2 + Schritt 2 greifen immer). Schritt 3 selbst (nur noch
ein KI-Aufruf statt zwei) ist nur für den häufigen Fall „genau eine neue
Sprachaufnahme" umgesetzt — bei mehreren gleichzeitig neuen Aufnahmen
bleibt es bewusst beim bisherigen Verhalten (zwei GPT-Aufrufe), weil der
Cache pro Aufnahme einzeln entsteht und die aktuelle Mehrfach-Aufnahmen-
Logik den Text aller Aufnahmen gemeinsam an GPT gibt (bessere
Querbezüge). Das ist jetzt eine reine Kosten-/Tempo-Frage, keine
Korrektheits-Frage mehr. Sandys Wortlaut „Schritt 3 muss vollständig
fertig sein" liest sich nach Alles-oder-nichts — deshalb hier die
Rückfrage, statt das selbst zu interpretieren: reicht dieser Umfang, um
Gate 1 zu starten, oder soll der Mehrfach-Aufnahmen-Fall auch noch
geschlossen werden, bevor der erste echte Testnutzer ans Tool darf?
Details: `docs/chief-of-staff-todos.md` CoS-002.

Stand 20.08.2026, Mittag: die weiterhin große, laufende Abwägung ist keine
einzelne Ja/Nein-Frage, sondern die Gate-1-Gesamtfrage „ist das Tool reif
für erste echte Testnutzer?" — die läuft über `docs/launch-readiness.md`
(aktuell 23 % gegen den vollen Scope, Stand 20.08.) und war an eine harte
Bedingung geknüpft: Gate 1 startet erst, wenn CoS-002 Schritt 3 fertig ist
— siehe Rückfrage oben, ob dieser Umfang das schon erfüllt.

---

## Entschieden (Verlauf)

| Datum | Entscheidung | Ergebnis | Quelle |
|---|---|---|---|
| 2026-08-16 | DC-001: Preismodell + Gewerke-Versprechen | 22 €/Monat Standard, 17 €/Monat Jahresabo, 3 Angebote/Monat kostenlos; „Maler & Bodenleger" statt „18 Gewerke" | `docs/design-check.md` DC-001 |
| 2026-08-17 | CoS-009: Head-of-IT-Rolle splitten? | Ja — aufgeteilt in Head of Product Engineering + Platform & Integrations Engineer | `docs/chief-of-staff-todos.md` CoS-009 |
| 2026-08-18 | CoS-M-001: neue CI-Richtung „Gerechnet, nicht geschätzt" | Bestätigt (direkt mit Sandy über mehrere Feedback-Runden verfeinert): Gelb-Nuance `#D9A400` testen, Überschriften Bricolage Grotesque, Mono-Zahlenschrift nur für berechnete Maße (nicht Preise), Emoji auf Landingpage durch eigenes Werkzeug-Icon-Set ersetzt (Marketing-Scope, Produkt-UI bleibt bei Lucide), neues Logomark (Maßband-Symbol, finale Version von Sandy selbst geliefert), warmes Off-White auch als Text-/Symbolfarbe auf Dunkel. Umsetzung folgt in Schritt 5 (Umsetzungsplan) | `docs/marketing-ci.md`, `docs/moodboard.html`, `docs/chief-of-staff-marketing-todos.md` CoS-M-001 |
| 2026-08-18 | PM-008/DC-024: Datenmodell für Wand-/Fassaden-Objekte (`modus: 'wand'`) — betrifft den Live-Berechnungspfad fertiger Angebote, deshalb Go nötig statt blinder Umsetzung | Go erteilt (direkt an den Designer, Konzept „Wand-Chip" lag zu dem Zeitpunkt schon vor). Head of Product Engineering setzt jetzt den `'wand'`-Zweig um (Länge/Höhe/Türen/Fenster, keine Breite/Bodenfläche; Bearbeiten-Ansicht zusätzlich aus `waende[]`; Fläche = Länge × Höhe − Öffnungen). Diese Zeile trage nachträglich ich (Product Designer) ein, war nicht vorher als „Offen" hier gelistet — Chief of Staff bitte gegenlesen | `docs/design-check.md` DC-024, `docs/pruefmeister-testfaelle.md` PM-008 Nachtest 5 |
| 2026-08-20 | CoS-002: Bestätigungskarte-Vertrauensproblem („Karte ≠ Berechnung") — nach zweimal zurückgestelltem Auftrag (16.08. dokumentiert ohne Auftrag, 19.08. spontanes „ok los" wieder zurückgezogen, weil Umsetzung komplizierter war als gedacht) | Endgültig aktiviert: „das soll endgültig gefixt werden" — höchste Priorität im Projekt, vor Live-Test-Verifikation anderer bereits gebauter Fixes. Head of Product Engineering soll einen konkreten Umsetzungsvorschlag mit Optionen/Aufwand/Risiko liefern | `docs/chief-of-staff-todos.md` CoS-002 |
| 2026-08-20 | CoS-002, Architektur-Wahl: Head of Product Engineering hat Option 1 (echte Single-Source-of-Truth, 3 Schritte, ~2–3 Wochen) + Option 2 (Sofort-Zwischenlösung, 1–2 Tage) vorgeschlagen (`docs/cos-002-architektur-vorschlag.md`) | **Option 2 sofort + Option 1 komplett (alle 3 Schritte).** Zusätzliche Bedingung von Sandy: Schritt 3 (Geld-Pfad) muss vollständig fertig sein, bevor der erste echte Testnutzer ans Tool darf — Voraussetzung für den Beginn von Gate 1, nicht nur wünschenswert. Zwei Nebenfunde (manuelle Positions-Änderungen vs. Neu-Berechnung; kaputtes Kosten-Logging seit 20.07.) als eigene kleine Tickets | `docs/chief-of-staff-todos.md` CoS-002, `docs/cos-002-architektur-vorschlag.md` |
