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

## Offen (aktuell keine)

Stand 17.08.2026: keine akute Einzelentscheidung offen. Die eine große,
laufende Abwägung ist keine einzelne Ja/Nein-Frage, sondern die
Gate-1-Gesamtfrage „ist das Tool reif für erste echte Testnutzer?" — die
läuft über `docs/launch-readiness.md` (aktuell 19 % gegen den vollen Scope)
und die Meta-Einschätzung des Prüfmeisters in
`docs/pruefmeister-notiz-fuer-chief-of-staff.md` („der Vertrauens-Mechanismus
selbst hält wiederholt nicht, was er verspricht" — seine Formulierung, nicht
meine Entscheidung). Kein Handlungsbedarf hier, bis der Chief of Staff das
explizit als Go/No-Go-Frage vorlegt.

---

## Entschieden (Verlauf)

| Datum | Entscheidung | Ergebnis | Quelle |
|---|---|---|---|
| 2026-08-16 | DC-001: Preismodell + Gewerke-Versprechen | 22 €/Monat Standard, 17 €/Monat Jahresabo, 3 Angebote/Monat kostenlos; „Maler & Bodenleger" statt „18 Gewerke" | `docs/design-check.md` DC-001 |
| 2026-08-17 | CoS-009: Head-of-IT-Rolle splitten? | Ja — aufgeteilt in Head of Product Engineering + Platform & Integrations Engineer | `docs/chief-of-staff-todos.md` CoS-009 |
| 2026-08-18 | CoS-M-001: neue CI-Richtung „Gerechnet, nicht geschätzt" | Bestätigt (direkt mit Sandy über mehrere Feedback-Runden verfeinert): Gelb-Nuance `#D9A400` testen, Überschriften Bricolage Grotesque, Mono-Zahlenschrift nur für berechnete Maße (nicht Preise), Emoji auf Landingpage durch eigenes Werkzeug-Icon-Set ersetzt (Marketing-Scope, Produkt-UI bleibt bei Lucide), neues Logomark (Maßband-Symbol, finale Version von Sandy selbst geliefert), warmes Off-White auch als Text-/Symbolfarbe auf Dunkel. Umsetzung folgt in Schritt 5 (Umsetzungsplan) | `docs/marketing-ci.md`, `docs/moodboard.html`, `docs/chief-of-staff-marketing-todos.md` CoS-M-001 |
| 2026-08-18 | PM-008/DC-024: Datenmodell für Wand-/Fassaden-Objekte (`modus: 'wand'`) — betrifft den Live-Berechnungspfad fertiger Angebote, deshalb Go nötig statt blinder Umsetzung | Go erteilt (direkt an den Designer, Konzept „Wand-Chip" lag zu dem Zeitpunkt schon vor). Head of Product Engineering setzt jetzt den `'wand'`-Zweig um (Länge/Höhe/Türen/Fenster, keine Breite/Bodenfläche; Bearbeiten-Ansicht zusätzlich aus `waende[]`; Fläche = Länge × Höhe − Öffnungen). Diese Zeile trage nachträglich ich (Product Designer) ein, war nicht vorher als „Offen" hier gelistet — Chief of Staff bitte gegenlesen | `docs/design-check.md` DC-024, `docs/pruefmeister-testfaelle.md` PM-008 Nachtest 5 |
