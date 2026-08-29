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

**🔵 DC-026-Nebenbefund (Head of Product Engineering, 24.08.):** Beim Fixen
der „fragt nach Sachen, die ich schon gesagt habe"-Rückfragen ist ein toter
Filter aufgefallen, der Fenster-/Türanzahl-Fragen unterdrücken sollte, wenn
die Raummaße schon bekannt sind — der Filter greift technisch nicht mehr
(er prüft ein Feld, das inzwischen vorher geleert wird), Head of Product
Engineering hat ihn bewusst nicht repariert, weil das eine inhaltliche
Entscheidung ist, keine Reparatur: **Soll das Tool bei bekannten Raummaßen
weiterhin nach Fenster-/Türanzahl fragen, oder stillschweigend mit
Standard-Annahmen (1 Fenster, 1 Tür) rechnen und gar nicht erst fragen?**
Beides ist vertretbar — weniger Fragen vs. keine stille Annahme. Quelle:
`docs/chief-of-staff-todos.md` CoS-020.

**🔵 Zwei kleine Katalog-Fragen (Head of Product Engineering, 24.08., aus
CoS-019):** (1) In „Abbruch" stehen jetzt „Erschwerniszuschlag Handabbruch"
(25 %) und „Zuschlag schwierige Zufahrt" (40 %) nebeneinander — fachlich
sehr ähnlich, aber nicht identisch. Zusammenlegen oder getrennt lassen? (2)
Die Rubriken „Anfahrt & Organisation"/„Anfahrt & Planung"/„Anfahrt &
Vorbereitung" heißen uneinheitlich, aber kein Gewerk hat zwei davon
gleichzeitig — nur Kosmetik. Vereinheitlichen? Beide betreffen aktuell
niemanden live (nur Maler/Bodenleger ausgeliefert), niedrige Priorität.
Quelle: `docs/chief-of-staff-todos.md` CoS-019.

**🔵 DC-040-Folgefrage (Head of Product Engineering, 29.08.):** Deine
Entscheidung „nachfragen statt raten" ist umgesetzt — aber bewusst nur für
den Fall „ganze Wohnung/Haus/Etage". Bei einem EINZELNEN Raum („im Flur
sind es 18 Quadratmeter Wandfläche") gilt weiterhin die alte Festlegung:
eine direkt genannte Fläche ist schon die zu streichende, es wird nichts
abgezogen und nicht gefragt. Die Unsicherheit ist dort aber dieselbe — auch
ein einzelner Handwerker kann Umfang × Höhe gerechnet und die Türen noch
drin haben. **Soll die Frage „sind Türen und Fenster da noch drin?" auch
bei einzelnen Räumen kommen?** Dagegen spricht: eine Rückfrage mehr in
Abläufen, die heute schon laufen (nach PM-007 fasse ich die Zahl der Fragen
nicht ohne deinen Auftrag an). Dafür spricht: es geht um bares Geld, und
raten tun wir dort aktuell genauso. Hängt inhaltlich mit der offenen
CoS-020-Frage oben zusammen — am besten zusammen entscheiden.

**🔵 DC-033/CoS-022 (Head of Product Engineering, 25.08.):** 4 bestehende
Angebote (3 fertiggestellt, 1 versendet) haben nie eine echte Angebots-
nummer bekommen, zeigen stattdessen ein UUID-Fragment. Sollen sie
nachträglich eine echte Nummer bekommen? Bei den 3 fertiggestellten
unkritisch, beim versendeten Angebot riskant: die falsche/keine Nummer
könnte beim Kunden bereits auf Papier liegen, eine nachträglich vergebene
andere Nummer wäre schlimmer als die jetzige Ersatzbezeichnung. Beide Wege
sind in einer Minute umgesetzt, sobald du dich entschieden hast. Quelle:
`docs/chief-of-staff-todos.md` CoS-022.

Stand 24.08.2026: CoS-002 Schritt 3 ist entschieden (siehe unten) — Sandys
Antwort auf die Rückfrage war eindeutig, keine weitere Klärung nötig. Die
weiterhin große, laufende Abwägung ist keine einzelne Ja/Nein-Frage,
sondern die Gate-1-Gesamtfrage „ist das Tool reif für erste echte
Testnutzer?" — die läuft über `docs/launch-readiness.md` (aktuell 31 %
gegen den vollen Scope, Stand 24.08.).

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
| 2026-08-21 | CoS-002 Schritt 3: reicht die Umsetzung nur für den Einzelaufnahme-Fall für Gate 1, oder soll auch der Mehrfach-Aufnahmen-Fall geschlossen werden? | **„mach komplett rund also das auch noch schließen"** — auch der Mehrfach-Aufnahmen-Fall soll denselben doppelten KI-Aufruf vermeiden. Head of Product Engineering hat das über einen spekulativen Vorab-Kombi-Aufruf umgesetzt (kein Merge einzelner Caches — Korrektheits-Risiko —, sondern derselbe kombinierte Aufruf nur vorgezogen). Damit ist Schritt 3 in beiden Fällen fertig | `docs/chief-of-staff-todos.md` CoS-002 |
| 2026-08-21 | PM-021-Folgefrage: soll die VOB-Übermessungsregel für Maler-Wandflächen (kleine Fenster/Türen bis 2,5 m² nicht abziehen) automatisch für alle gelten, oder per Onboarding-Frage + Einstellungen-Schalter? | „wenn du sagst es ist gängig, dann machs für alle direkt so" — automatisch für ALLE Malerangebote, kein Einstellungen-Schalter, kein Onboarding-Schritt, dafür sichtbarer Hinweistext in den Positions-Annahmen. Ändert die berechnete Wandfläche (tendenziell nach oben) für praktisch jedes künftige Malerangebot mit normalgroßen Öffnungen — gewollte Konsequenz, kein Fehler. Prüfmeister ausdrücklich informiert: eigene Soll-Lösungen müssen die Regel ab sofort mitrechnen | `docs/pruefmeister-testfaelle.md`, Abschnitt „VOB-Übermessungsregel für Anstricharbeiten" (Dateiende) |
| 2026-08-25 | DC-034: Zwei getrennte Foto-/Notiz-Systeme im Angebot (Aufnahme-Fotos vs. „Notizen & Fotos"-Tab) — beibehalten, entfernen, oder zusammenlegen? Product Designer hatte bewusst neutral nur den Ist-Zustand dokumentiert, keine eigene Empfehlung | „ja so machen wie von dir vorgeschlagen" — nicht ersatzlos streichen (echter Bedarf: Vorher-Zustand-Dokumentation im Gewerbe), aber zu einem System zusammenlegen: Aufnahme-Fotos bekommen denselben „ins PDF"-Schalter wie der heutige Tab, der separate zweite Upload-Weg entfällt. Interne Notiz bleibt als eigene, klar benannte Mini-Funktion (nie im PDF) — anderer Zweck als Fotos. Umsetzung an Head of Product Engineering (Datenmodell/PDF) + Product Designer (UI) übergeben | `docs/design-check.md` DC-034, `docs/chief-of-staff-todos.md` CoS-021 |
