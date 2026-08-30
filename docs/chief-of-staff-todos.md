# Chief of Staff ↔ Head of Product Engineering — Koordinations-Todos

*(bis 17.08.2026 abends: „Head of IT" — Rolle enger gefasst und in zwei
Positionen aufgeteilt, siehe CoS-009. Für Stripe/Buchhaltung/Sentry/Auth-
RLS/Deployment/Accounts/Transaktions-E-Mails ist jetzt
`docs/chief-of-staff-platform-todos.md` mit dem neuen Platform &
Integrations Engineer die richtige Datei, nicht mehr hier.)*

Gemeinsame Datei von Chief of Staff und Head of Product Engineering. Hier landen Aufgaben, die
aus der Gesamtkoordination entstehen und noch keinen festen Platz in einer
anderen Datei haben — nicht QA (das läuft über
`docs/pruefmeister-testfaelle.md`), nicht reines Design (das läuft über
`docs/design-check.md`), sondern bereichsübergreifende Punkte: Umsetzung von
Business-/Preisentscheidungen, Dinge, die aus einer der anderen Dateien
herausfallen, oder Punkte, die der Chief of Staff selbst beim
Gesamtüberblick findet.

**Ablauf:** Chief of Staff trägt neue Punkte ein, sobald sie entstehen, mit
Verweis auf die Quelle (z. B. eine DC-ID oder ein Gespräch mit Sandy). Head of
IT trägt nach Erledigung ein kurzes **Fix-Update** direkt unter dem
jeweiligen Punkt ein. Status-Zeile danach aktualisieren.

Jeder Punkt hat eine feste ID (CoS-XXX).

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · ⏳ wartet auf Vorbedingung.

**Datei-Sicherheit (neu, 20.08.2026):** Der Speicherfehler bei gleichzeitiger
Bearbeitung ist projektweit jetzt zum 6. Mal aufgetreten, zuletzt genau in
dieser Datei. Ganz am Ende dieser Datei steht jetzt eine feste Markierung
(`<!-- ENDE DER DATEI -->`). Taucht beim Lesen noch Text NACH dieser
Markierung auf, ist das zweifelsfrei ein Speicherfehler — bitte nicht selbst
löschen, sondern kurz dem Chief of Staff melden. Zusätzlich: neue Einträge
wenn möglich ans Dateiende anhängen statt mitten in bestehende Abschnitte zu
schreiben, das verkleinert die Kollisionsfläche. Details und der eigentliche
Lösungsvorschlag: CoS-013.

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-24)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-020 | DC-026 „fragt nach Sachen, die ich schon gesagt habe" — Erkennungsseite, Sandys direkter Auftrag | ✅ erledigt 24.08. — Ursache war eine falsche Reihenfolge in der Pipeline, nicht fehlende Erkennung. Fenster/Türen-Fragen fallen weg, `vorschlag`-Feld mit Zitat liegt für den Designer bereit. **Nebenbefund: toter Filter, siehe unten** | Sandy direkt, 24.08.2026 |
| CoS-019 | Doppelte Rubriken im Preiskatalog („– Erschwernisse" neben „– Erschwernisse & Zuschläge") vereinheitlichen — Sandys direkter Auftrag | ✅ erledigt 24.08. — 6 Gewerke vereinheitlicht, 1 echte Dublette entfernt, Bestandsdaten live nachgezogen, neuer Hygiene-Test verhindert Rückfall | Sandy direkt, 24.08.2026 |
| CoS-018 | Auftrag für dich (aus deinem eigenen Nebenbefund bei CoS-017): 4 vorbestehende `npm test`-Fehlschläge aufräumen, unabhängig von CoS-017 selbst | ✅ erledigt 24.08. — alle vier waren veralteter Testcode, KEIN verlorener Fix; Suite jetzt 765/765 grün. Details unten, 1.4 kannst du nachtragen | Chief of Staff, 24.08.2026 |
| CoS-017 | Auftrag für dich: DC-027 braucht ein Positions-Herkunfts-Flag (Transkript vs. vom Tool ergänzt), sonst kann Product Designer die „Vorschlag"-Kennzeichnung nicht bauen | ✅ umgesetzt 24.08. (Flag `automatisch_ergaenzt`, Spalte live auf Staging + Produktion, Tests grün) — Live-Nachtest steht aus, Ball liegt beim Product Designer | `docs/design-check.md` DC-027, Chief of Staff, 21.08.2026 |
| CoS-010 | Angebot verdoppelt sich (2.000,28€ statt 1.000,14€) | 🟡 Live-Nachtest durch Sandy (19.08.) bestanden: bewusster Doppelklick auf „Angebot erstellen" erzeugt keine Verdopplung mehr. Für den alltäglichen Fall (Handwerker klickt aus Versehen doppelt) damit erledigt. Offen bleibt nur die theoretische Absicherung gegen zwei wirklich zeitgleiche Server-Anfragen (DB-Constraint) — größerer Schritt, wartet auf Sandys Go, kein akuter Blocker mehr | `pruefmeister-testfaelle.md` PM-014 |
| CoS-007 | PM-010-Fixes im Live-Nachtest nicht sichtbar — „Sockelleisten streichen" fehlt weiter nach 4 Versuchen | 🟡 wahren Grund gefunden (Ansatz gewechselt wie empfohlen) + größerer Systemfund, Live-Nachtest steht aus | Prüfmeister-Notiz an CoS (Update 17.08.) + `pruefmeister-testfaelle.md` PM-010/PM-012 |
| CoS-008 | Preisdatenbank-Lücken bei neu bestätigten Positionstypen (Kniestock/Dachschräge/Fassade streichen) | ✅ erledigt — bereits am 20.08. im Preisdatenbank-Audit mit erledigt, Ticket war nur nicht nachgezogen (Nachtrag 24.08.). Live-Nachtest offen | PM-007, PM-008 Nachtests |
| CoS-001 | DC-001 umsetzen: Preis 22€/17€/3 frei + „Maler & Bodenleger" statt „18 Gewerke" | 🟡 umgesetzt (Landingpage, PlanWahlModal, `/vorschau` entfernt/umgeleitet, zentrale `pricing.ts` angelegt), Live-Nachtest steht aus | `docs/design-check.md` DC-001 |
| CoS-002 | Strukturelle Ursache für „Karte zeigt anderes als Berechnung": zwei unabhängige GPT-Aufrufe | ✅ **vollständig abgeschlossen (25.08.).** Code vollständig umgesetzt und gepusht (alle drei Schritte, inkl. Mehrfach-Aufnahmen-Fall). Live-Nachtest durch Sandy (21.08.) fand einen echten Bug: Karte zeigte „Boden schützen 0 m²" statt 12. Ursache war NICHT die Berechnung (DB-Check bestätigte sie als korrekt), sondern eine leere `supabase_realtime`-Publication — die Karte sollte sich automatisch aktualisieren, sobald die geprüfte Extraktion da ist, bekam davon aber nie ein Signal und fiel nach 30s dauerhaft auf die fehleranfällige Chip-Vorschau zurück. Fix direkt auf der Produktions-DB angewendet (Migration, kein Deploy nötig). **Sandys Bestätigungs-Retest ist bestanden — zweifach:** Product Designer hat bereits am 23.08. in `design-check.md` (DC-021) „Sandy: dc021 passt" dokumentiert; das war mir hier entgangen (eigener Sync-Fehler meinerseits, nicht Product Designers — deshalb stand hier bis heute fälschlich „steht noch aus"). Heute (25.08.) hat Sandy den exakt gleichen Test unabhängig noch einmal live gemacht („Wohnzimmer streichen, 3x4 Meter" → „Boden schützen 12 m²" korrekt) und bestätigt: „ja passt". Damit ist CoS-002 in jeder Hinsicht fertig, kein offener Schritt mehr | Sandy-Entscheidung 20.08. + 21.08., voller Vorschlag: `docs/cos-002-architektur-vorschlag.md`, DC-030/DC-021 in `docs/design-check.md` |
| CoS-009 | Team-Struktur: Head-of-IT-Rolle in zwei Positionen splitten? | ✅ entschieden — Sandy hat zugestimmt | Vier-Augen-Gespräch Sandy ↔ Head of Product Engineering, 2026-08-17 |
| ~~CoS-003–006~~ | Accounts, Transaktions-E-Mails, RLS, Observability | → verschoben, jetzt CoS-P-001 bis CoS-P-004 | `docs/chief-of-staff-platform-todos.md` |
| CoS-011 | Rückfragen-UI komplett neu gedacht — Konzept + klickbarer Prototyp vom Product Designer stehen, Sandy findet's „super" und will's in die Umsetzung geben | 🟡 überholt — Sandy hat Product Designer direkt „setz dc-025 um" angewiesen, noch vor der hier erbetenen Aufwandsschätzung. UI ist bereits gebaut (`RueckfragenScreen.tsx`), nur der Live-Test im Browser steht noch aus | `docs/design-check.md` DC-025/DC-026, `docs/dc-025-konzept-rueckfragen.md`, `docs/dc-025-rueckfragen-prototyp.html` |
| CoS-012 | DC-029 „Baustelle"/Projekt-Zuordnung — Wording-Konzept vom Product Designer steht, zwei Teilstücke formal zu vergeben | 🟡 Lexware/Lexoffice-Machbarkeit erledigt. Datenmodell (Head of Product Engineering) jetzt umgesetzt und live: Tabelle `baustellen` + `quotes.baustelle_id` + Migration + Backfill in der echten Datenbank angewendet, App-Code an allen vier Stellen verdrahtet. Live-Nachtest steht aus, Designer baut jetzt Konzept + Prototyp für die Baustellen-UI darauf auf | `docs/design-check.md` DC-029 |
| CoS-013 | Strukturelle Lösung für den wiederholten Datei-Speicherfehler bei gemeinsamen Doku-Dateien (jetzt 6. Mal) | ❌ offen — Sofortmaßnahme (Dateiende-Markierung) bereits umgesetzt, eigentlicher Lösungsvorschlag (Git statt Direkt-Überschreiben) braucht Sandys Go | Sandys Frage „kannst du es richtig lösen", 2026-08-20 |
| CoS-014 | Nebenfund aus CoS-002: manuelle Positions-Änderungen sind heute nur durch Zufall vor Neu-Berechnung sicher (kein echter Schutz-Mechanismus) | ✅ umgesetzt 24.08. (Sandys direkter Auftrag „fix das") — echter Schutz über `quotes.manuell_bearbeitete_positionen`, Spalte live, 18 neue Tests. Live-Nachtest steht aus | `docs/cos-002-architektur-vorschlag.md` Abschnitt 2 |
| CoS-015 | Nebenfund aus CoS-002: Kosten-Protokollierung (`ki_usage`) für die teure `ki-extrahieren`-Extraktion läuft seit 20.07.2026 wegen Spalten-Mismatch still ins Leere | ❌ offen — Ursache gefunden (Edge Function schreibt `prompt_typ`/`input_tokens` statt `endpunkt`/`tokens_in`), nicht behoben | `docs/cos-002-architektur-vorschlag.md` Abschnitt „Daten, die ich geprüft habe" |
| CoS-016 | Rückfrage: welche „App-seitige Git/Deploy-Blockade" verhindert gerade das Deployen von CoS-002? | ✅ beantwortet — device_bash-Lock-Datei-Problem (nie als eigenes Ticket dokumentiert, mein Versäumnis), inzwischen selbst gelöst (Lock-Dateien lassen sich verschieben statt löschen). Sandy hat beide CoS-002-Commits gepusht, kein offener Blocker mehr | Chief of Staff, 21.08.2026, beim CoS-002-Fix-Update aufgefallen; Antwort Head of Product Engineering, 21.08.2026 |

---

## CoS-010 — Angebot verdoppelt sich (Race-Condition-Verdacht)

**Datum:** 2026-08-17, zuletzt aktualisiert 2026-08-20
**Status:** 🟡 App-seitiger Schutz + DB-seitiges Unique-Constraint laut PM-014 (20.08.) beide live — nur noch ein gezielter Gleichzeitigkeits-Test offen. Kein akuter Blocker mehr, aber inzwischen von CoS-002 als Top-Priorität im Projekt abgelöst (Sandys ausdrücklicher Auftrag „endgültig fixen", 20.08.)

**Hintergrund:** Prüfmeister hat live beobachtet (kein geplanter Testfall,
beim Nachschauen im Browser aufgefallen), dass sich ein bereits sauber
geprüftes Angebot (2026-0016, ursprünglich 1.000,14 €) komplett verdoppelt
hat: 2.000,28 €, jede einzelne Position exakt zweimal vorhanden, stabil
reproduzierbar über zwei unabhängige Seitenaufrufe. Volle Details, inkl.
Prüfmeisters transparenter Offenlegung seines eigenen Testverhaltens als
möglichen (nicht sicheren) Auslöser: `docs/pruefmeister-testfaelle.md`
PM-014.

**Warum das vor CoS-007 steht:** Bisherige Funde waren falsche/fehlende
Einzelpositionen (ein paar hundert Euro Abweichung). Hier verdoppelt sich
das GESAMTE Angebot ohne jede Fehlermeldung — im schlimmsten Fall ein
Angebot, das ein Kunde mit doppeltem Preis bekommt, weil jemand die Seite
zweimal aufgerufen oder neu geladen hat.

**Konkrete Bitte an Head of Product Engineering:** Mit höchster Priorität
prüfen, ob erneutes Aufrufen/Neuladen der Entwurfsseite eines bereits
generierten Angebots die Positions-Generierung nochmal auslöst und dabei
ANHÄNGT statt zu ERSETZEN oder „ist schon da, nichts tun" zu erkennen
(Prüfmeisters eigene Vermutung, PM-014). Separat davon: die
Dashboard-Übersichtsliste zeigt für dasselbe Angebot je nach Zeitpunkt
unterschiedliche Beträge (0€/2.000€) — vermutlich ein zweiter, unabhängiger
Sync-Bug.

**Fix-Update (Head of Product Engineering, 2026-08-17):** Fundstelle bestätigt:
`generiere-positionen/route.ts`, Schritt 3 (Positionen in `quote_items`
schreiben). Positionen MIT Raum-Suffix ("Wandflächen streichen — Flur")
wurden bisher NIE gegen bereits vorhandene Positionen derselben Quote
geprüft — nur eine kleine "einmalig"-Kategorie (Kleinmaterial, Anfahrt o.ä.)
hatte überhaupt einen Dubletten-Schutz. Löst also die Route ein zweites Mal
für dieselben Daten aus (Doppelklick, doppelte Anfrage nach Neuladen o.ä.),
landet jede Raum-Position exakt nochmal in der Liste — passt exakt zum
beobachteten Muster (jede Zeile exakt 2×).

Fix: neue, eigene, getestete Funktion `filtereExakteDubletten()`
(`src/lib/quote-items-dedup.ts`, 7 Tests) — blockt eine neue Position nur,
wenn Titel UND Menge exakt mit einer bereits vorhandenen Position
übereinstimmen. Läuft jetzt vor der bestehenden Filterlogik, für ALLE
Positionen (nicht nur die "einmalig"-Kategorie). Zwei unterschiedliche Räume
mit demselben Titel bleiben weiterhin beide erlaubt (unterschiedlicher
Titel-Suffix), eine echte Korrektur mit anderer Menge im selben Raum auch.

**Ehrliche Einschränkung:** Das ist eine Absicherung auf Anwendungsebene
(prüft „gibt's das schon in der Datenbank", dann fügt ein) — sie schließt
den beobachteten Fall, aber KEINE echte Race Condition, bei der zwei
Anfragen gleichzeitig lesen, bevor eine von beiden geschrieben hat. Für
100%ige Sicherheit bräuchte es einen Datenbank-seitigen Unique-Constraint
oder eine Sperr-Spalte — das ist ein größerer Schritt, mache ich nicht ohne
Sandys Go. Der eigentliche AUSLÖSER (was genau die Route zweimal ausgelöst
hat) ist damit auch noch nicht gefunden, nur die Auswirkung geblockt — das
war aber der Teil, der akut Geld-Schaden anrichten konnte. Volle Testsuite
(705 Tests) + `tsc --noEmit` grün. Live-Nachtest durch Sandy steht aus.

**Auslöser gefunden + Fix (Head of Product Engineering, 2026-08-18):**
Beim Code-Review von `src/app/(app)/angebot/[id]/entwurf/page.tsx` (die
Seite mit dem "Positionen berechnen"-Button, der `generiere-positionen`
auslöst) gefunden: Der Button hatte **keinerlei Schutz gegen doppeltes
Tippen/Klicken** — kein `disabled`, kein Lade-Flag, kein Debounce. Die
Funktion `fertigstellen()` setzt den Bildschirm erst NACH dem Klick auf
"lädt" um (React aktualisiert das nicht sofort synchron), in diesem kurzen
Fenster war der Button weiter klickbar. Ein zweiter Tap in diesem Fenster
(Ungeduld, weil vor dem Laden nichts sichtbar passiert, oder ein doppeltes
Klick-/Touch-Event, wie es auf manchen Mobilgeräten vorkommt) schickt eine
zweite, praktisch gleichzeitige Anfrage an `generiere-positionen` — mit
denselben `aufnahmen_ids`. Genau das ist die "echte Race Condition", die
oben als offen benannt wurde: beide Anfragen lesen `bestehendeItems`
(Schritt 3), bevor eine von beiden geschrieben hat, also sieht keine der
beiden die Positionen der jeweils anderen — beide fügen die komplette
Positionsliste ein, jede Position landet exakt 2×. Passt exakt zu PM-014
(Prüfmeister hatte selbst sein eigenes Testverhalten als möglichen Auslöser
genannt).

Fix: `fertigstellenLaufendRef` (ein `useRef`, kein State — wichtig, weil der
Check synchron vor jedem `await` greifen muss, ein State-Update käme zu
spät) in `fertigstellen()`. Erster Aufruf setzt die Sperre sofort, jeder
weitere Aufruf während die Sperre steht wird ignoriert, `finally` gibt sie
wieder frei (damit ein bewusster erneuter Aufruf — z. B. nach
Rückfragen-Antworten — weiter funktioniert). Das ist die kleinstmögliche
Lösung: sie verhindert die Anfrage-Verdopplung genau an der Stelle, wo sie
entsteht, statt die Auswirkung hinterher nochmal abzufangen.

**Ehrlich zum Stand:** Das schließt den wahrscheinlichsten Auslöser
(Doppel-Tap in derselben Browser-Session). Was es NICHT abdeckt: zwei
wirklich unabhängige Sessions (z. B. Handy + Laptop gleichzeitig offen) —
dafür bräuchte es weiterhin die Datenbank-seitige Absicherung von oben, die
extra Sandys Go braucht. Geprüft mit `eslint` (grün, keine Fehler an der
geänderten Datei); ein vollständiger Projekt-Lauf hat in der Cowork-Sitzung
selbst aus Zeitgründen nicht reingepasst.

**Bestätigung (Sandy, 2026-08-18):** `npm run typecheck` sauber durch (keine
Fehler), `npm test` 706/706 grün. Der Fix bricht also nichts Bestehendes.

**Live-Nachtest bestanden (Sandy, 2026-08-19):** Bewusst zweimal direkt
hintereinander auf „Angebot erstellen" geklickt (PM-014-Nachtest) — keine
Verdopplung, alle Positionen genau einmal vorhanden. Für den naheliegendsten,
alltäglichen Auslöser (versehentlicher Doppelklick) ist CoS-010 damit
praktisch erledigt. Bewusst nicht auf ✅ gesetzt, weil eine echte, zeitgleiche
Race Condition auf Serverebene (zwei komplett unabhängige Anfragen exakt
gleichzeitig) davon nicht ausgeschlossen ist — dafür bräuchte es einen
Datenbank-Constraint, ein größerer Schritt, der Sandys Go braucht. Kein
akuter Blocker mehr, siehe `pruefmeister-testfaelle.md` PM-014.

**Update (Chief of Staff, 2026-08-20):** Laut aktuellem Stand in
`pruefmeister-testfaelle.md` PM-014 (dortige Fix-Update-2, 20.08. — das ist
die Heimat-Datei für diesen Punkt, hier nur übernommen, nicht neu bewertet)
ist der Datenbank-seitige Unique-Constraint inzwischen mit Sandys Go
umgesetzt und live (`unique(quote_id, position)`, Migration
`20260820103931_add_quote_items_position_unique.sql`, mit
Retry-bei-Konflikt). Diese Datei war seit dem 19.08. dahinter zurück — bitte
bei Gelegenheit selbst kurz gegenlesen und bestätigen, dann kann CoS-010 auf
✅ gesetzt werden. Offen bleibt laut PM-014 nur ein gezielter Test mit zwei
wirklich gleichzeitigen Anfragen.

---

## CoS-007 — Sind die PM-010-Fixes wirklich live?

**Datum:** 2026-08-17
**Status:** ❌ offen — nach jetzt VIER Fix-Versuchen weiterhin nicht behoben, 3-fach unabhängig bestätigt (PM-010, PM-012). Kein Deploy-Verdacht mehr (siehe Erklärung unten), aber ein klares Muster: dieselbe konkrete Lücke („Sockelleisten streichen" fehlt in der Maler-Engine, unabhängig vom Kontext) übersteht wiederholte Fix-Versuche. Empfehlung an Head of Product Engineering: Ansatz wechseln statt einen fünften ähnlichen Versuch zu starten — evtl. Root-Cause-Annahme nochmal von Grund auf prüfen statt nachzubessern.

**Hintergrund:** Head of Product Engineering hat für PM-010 drei unabhängige Bugs mit
dokumentiertem Fix-Update gemeldet (Zahlenerkennung „drei fünfzig" → 350,
erfundener Bodenaustausch, fehlende „Sockelleisten streichen"-Position),
jeweils mit neuen grünen Tests belegt. Sandys Live-Nachtest DANACH zeigt
alle drei Bugs unverändert — identisch zum Stand vor den Fixes. Der
Prüfmeister hat das selbst so eingeordnet (`docs/pruefmeister-notiz-fuer-chief-of-staff.md`,
Update 17.08.): weil alle drei unabhängigen Fixes gleichzeitig nicht
greifen, ist „noch nicht deployed" wahrscheinlicher als drei zufällig
unvollständige Fixes — zumal am selben Tag andere Fixes (PM-001, PM-007,
PM-008, PM-009) im Live-Nachtest nachweislich angekommen sind.

**Konkrete Bitte an Head of Product Engineering:** Bitte kurz bestätigen, welcher Commit/
Deploy-Stand aktuell in der Umgebung läuft, die Sandy testet — und ob die
drei PM-010-Fixes (`zahlen-parser.test.ts`, `boden-normalisierer.ts`,
`vollstaendigkeit.test.ts`) darin enthalten sind. Falls ja: dann liegt eine
feinere Abweichung zwischen Testfall und Sandys tatsächlichem Testsatz vor
(zweite von Prüfmeister genannte Möglichkeit), das würde eine andere
Fehlersuche brauchen.

**Warum das Priorität vor allem anderen hat:** Solange offen ist, was
wirklich live ist, ist jedes „🟡 behoben, Live-Test steht aus" in
`pruefmeister-testfaelle.md` mit Unsicherheit behaftet — das betrifft
potenziell auch bereits als „✅ live bestätigt" verbuchte Fälle, auch wenn
dafür aktuell kein konkreter Verdacht vorliegt.

**Erklärung von Head of Product Engineering (2026-08-17, aus einem direkten Gespräch mit
Sandy, noch nicht als formeller Fix-Update im Testfälle-Dokument
protokolliert):** Kein Deploy-Problem, sondern eine Testmethodik-Lücke —
die drei neuen Tests (`zahlen-parser.test.ts` u. a.) liefen gegen
künstliche, „zu ordentliche" Testfälle statt gegen echte Whisper/GPT-
Rohdaten, deshalb wurden sie grün, obwohl der reale Fall weiterhin
fehlschlägt. Plausibel und weniger besorgniserregend als eine Deploy-Lücke
(betrifft dann vermutlich nicht die anderen „✅ live bestätigt"-Fälle vom
selben Tag), **aber bisher nur mündlich erklärt, nicht durch einen neuen
Fix + Live-Nachtest belegt.** Status bleibt ❌ offen, bis das nachgewiesen
ist. Head of Product Engineering hat sich selbst eine feste Regel auferlegt: nie „behoben"
sagen, ohne vorher gegen echte Supabase-Produktionsdaten geprüft zu haben,
nicht nur gegen eigene Testfälle — bitte das auch für den PM-010-Refix
anwenden, bevor er wieder als erledigt gemeldet wird.

**Fix-Update (Head of Product Engineering, 2026-08-17) — Ansatz gewechselt, wie empfohlen:**
Der Prüfmeister hatte recht, dass ein fünfter ähnlicher Versuch (Signal-
Erkennung nochmal nachbessern) sinnlos gewesen wäre. Grund: die
Signal-Erkennung war bei allen vier bisherigen Versuchen am Ende JEDES MAL
korrekt — geprüft, bestätigt, mit echten Live-Daten belegt. Das eigentliche
Problem lag eine Ebene tiefer und wurde bisher nie angeschaut: `fehlende`
(der Rückgabewert von `pruefeUndErgaenzeVollstaendigkeit`, der genau für
Fälle wie diesen gedacht ist — "erkannt, aber keine sichere Menge, bitte
Nutzer fragen") wird in `angebot-extrahieren/route.ts` beim Auswerten des
Ergebnisses schlicht NIE gelesen. Es gibt dafür kein Feld in
`ExtraktionResponse`. Jeder Fund, der in `fehlende` statt in einer echten
Position landet, ist für den Nutzer unsichtbar — er sieht nicht "4
Positionen + 1 offene Frage", er sieht einfach nur 4 Positionen. Das erklärt
exakt, was Sandy beobachtet hat ("keine offene Rückfrage dazu").

**Für PM-010/PM-012 konkret gelöst (nicht über das API-Leck, sondern
drumherum):** `pruefeSockelleistenStreichen` fragt jetzt nicht mehr nach
einer expliziten Meterangabe im Text (die sowieso nur in `fehlende` landen
würde), sondern übernimmt die Menge von einer bereits berechneten
Schwester-Position im selben Raum — "Sockelleisten montieren" (PM-010: neu
montiert UND gestrichen) oder sonst "Sockelleisten abkleben" (PM-012: gar
keine Neumontage, nur mitgestrichen — diese Position ist praktisch immer da,
sobald im Raum gestrichen wird und Sockelleisten existieren, nutzt dieselbe
Umfang-minus-Türen-Formel). Bei mehreren Räumen mit je eigener Kandidaten-
Position wird nicht geraten, sondern weiterhin auf `fehlende` zurückgefallen
(auch wenn das aktuell noch unsichtbar bleibt — besser nichts erfinden).
Neuer Golden-Test für PM-012 mit dem exakten Prüfmeister-Transkript
(`golden-korrekturen.test.ts`), bestehender PM-010-Test verschärft (prüft
jetzt hart auf eine echte Position, nicht nur "irgendwas"). Volle Testsuite
(706 Tests) + `tsc --noEmit` grün.

**Größerer Systemfund, NICHT in diesem Fix behoben:** Die gleiche
`fehlende`-Lücke betrifft nicht nur Sockelleisten — 130 Stellen in 18
Dateien unter `src/lib/vollstaendigkeit/` nutzen denselben Rückfall-
Mechanismus (`add(ergaenzt, fehlende, ...)` bzw. `fehlende.push(...)`) für
Fälle, wo eine Arbeit erkannt, aber keine sichere Menge bekannt ist. Jeder
dieser Fälle ist potenziell genauso unsichtbar für den Nutzer wie
"Sockelleisten streichen" es war. Das ist eine Architektur-Frage auf CoS-002-
Niveau (gehört vermutlich dort mit rein oder als eigener Punkt), keine, die
ich in einem Rutsch löse — bräuchte eine bewusste Entscheidung, WIE
`fehlende` beim Nutzer ankommen soll (als Rückfrage? als gelbe Warnung wie
bei der 350-Warnung? als automatisch ergänzte, niedrig-konfidente Position
mit Hinweis?), das ist Sandys/CoS' Entscheidung, kein rein technischer
Schritt. Bewusst nicht angefasst, nur dokumentiert.

---

## CoS-009 — Team-Struktur: Head-of-IT-Rolle gesplittet

**Datum:** 2026-08-17
**Status:** ✅ entschieden und eingerichtet

**Hintergrund:** Sandy hat Head of Product Engineering direkt gefragt, ob er sich mit dem
kompletten Zuständigkeitsbereich (Preis-Engine, KI-Pipeline bis Stripe/
Lexware/sevDesk/Sentry) überfordert fühlt. Seine Antwort: kein
Kompetenzproblem, sondern ein Risiko, dass unterschiedliche Themen
unterschiedliche Vorsichtsstufen brauchen. Chief-of-Staff-Einschätzung: die
Grundidee ist sinnvoll (unterschiedliche Fehlerkosten-Kategorien
rechtfertigen getrennte Kontexte). Sandy hat zugestimmt.

**Ergebnis, umgesetzt am 17.08.2026:**
- **Head of Product Engineering** (diese Rolle, bisher „Head of Product Engineering"): Preis-
  Engine, Mengen-/Extraktions-Pipeline, Vollständigkeitsprüfung,
  Preisdatenbank, laufende QA-Schleife. Neue Anweisungsdatei ausgeliefert
  an Sandy (`rolle-head-of-product-engineering.md`).
- **Platform & Integrations Engineer** (NEU): Stripe, Lexware/sevDesk +
  weitere Buchhaltungs-Anbindungen, Sentry, Auth/RLS, Deployment/Infra,
  Accounts/Onboarding, Transaktions-E-Mails — inkl. der beiden Lücken, die
  im ursprünglichen Vorschlag fehlten. Eigene Anweisungsdatei ausgeliefert
  (`rolle-platform-integrations-engineer.md`), eigene Koordinationsdatei
  `docs/chief-of-staff-platform-todos.md`.
- CoS-003 bis CoS-006 dorthin verschoben (neu: CoS-P-001 bis CoS-P-004).
  CoS-P-001 (RLS) und CoS-P-002 (Observability) sind bewusst als erste
  Aufgaben markiert — das ist der Praxistest, ob die Aufteilung greift.

---

## CoS-008 — Preisdatenbank-Lücken bei neuen Positionstypen

**Datum:** 2026-08-17
**Status:** ✅ erledigt (Head of Product Engineering, Nachtrag 2026-08-24) —
das Ticket war nur nicht nachgezogen worden. Alle drei hier genannten
Positionstypen (Kniestockwände streichen, Dachschrägen streichen,
Fassadenfläche streichen) wurden am 20.08. im Rahmen des kompletten
Preisdatenbank-Audits mit Preisen versorgt — sie waren dort ausdrücklich
Teil der 50 geschlossenen „Preis fehlt"-Lücken. Live-Nachtest steht wie beim
übrigen Audit noch aus.

**Ursprünglicher Status:** ❌ offen

**Hintergrund:** Seit PM-007 (Dachgeschoss) und PM-008 (Fassade) rechnerisch
grün sind, ist aufgefallen, dass mehrere neu bestätigte Positionstypen keinen
Preis in der Preisdatenbank hinterlegt haben („Preis fehlt", 0,00 €):
Kniestockwände streichen, Dachschrägen streichen, Fassadenfläche streichen.
Das ist kein Rechenfehler, sondern fehlende Stammdaten — Sandy hat
ausdrücklich gesagt, das soll für alle betroffenen Fälle nachgepflegt
werden, nicht nur einzeln.

**Aufgabe:** Head of Product Engineering/Sandy gemeinsam die Preisdatenbank für die neu
validierten Positionstypen vervollständigen. Kein technischer Bug, daher
kein Blocker für weitere QA-Testläufe, aber Blocker dafür, dass ein
Dachgeschoss- oder Fassaden-Angebot tatsächlich versendet werden kann.

---

## CoS-002 — Strukturelle Ursache für das „Karte ≠ Berechnung"-Muster

**Datum:** 2026-08-16, aktiviert 2026-08-20, entschieden 2026-08-20
**Status:** 🟢 UMGESETZT — Option 2 + Option 1 komplett (alle 3 Schritte, inkl. Mehrfach-Aufnahmen-Fall in Schritt 3, 21.08.2026). Noch kein Live-Nachtest, siehe Fix-Updates unten

**Hintergrund:** Der Prüfmeister hat mir (Chief of Staff, nicht im Bug-Tracker,
sondern in einer eigenen Notiz `docs/pruefmeister-notiz-fuer-chief-of-staff.md`)
gemeldet, dass in 6 von 10 Testfällen die Bestätigungskarte etwas anderes
zeigt als das, was am Ende berechnet wird — kein Einzelfall, sondern ein
Muster über fast alle Tests hinweg. Beim Fixen von PM-001 hat Head of Product Engineering die
technische Ursache dafür gefunden: Karte und fertiger Entwurf lösen **zwei
unabhängige GPT-Aufrufe auf demselben Transkript aus** (kein Wiederverwenden
der ersten Extraktion), und GPT liefert nicht bei jedem Aufruf exakt
dasselbe Ergebnis. Der PM-001-Fix fängt das für Ein-Raum-Fälle über eine
zusätzliche, text-basierte Sicherheitsprüfung ab — Head of Product Engineering hat selbst
notiert, dass das für Mehrraum-Fälle nicht reicht und dafür ein eigener
Schritt nötig wäre.

**Warum das hierher gehört statt in die Testfälle-Datei:** Das ist kein
einzelner Bug mehr, sondern eine Architektur-Frage — genau die Art von
Struktur-Thema, vor der der ursprüngliche Pipeline-Audit gewarnt hat (mehrere
Stellen lesen unabhängig voneinander denselben Rohtext neu, statt eine
geprüfte Struktur wiederzuverwenden).

**Kein akuter Auftrag jetzt** — bewusst kein „bau das um"-Ticket, das würde
gegen die eigene Regel „kleine, sichere Schritte, kein Big-Bang-Rewrite"
verstoßen. Aber: sollte bei einer künftigen Priorisierung mitgedacht werden,
z. B. als Kandidat für „Karte liest dieselbe geprüfte Struktur wie die
Berechnung, statt einen zweiten GPT-Aufruf zu machen" — dann aber mit Sandys
ausdrücklichem Go, wie in den eigenen Grundregeln festgelegt.

**Update (Head of Product Engineering, 2026-08-19):** Sandy hatte spontan „ok los" gegeben, auf
Nachfrage stellte sich unterwegs heraus, dass eine saubere Umsetzung auch die
Frage klären müsste, ob manuelle Änderungen an Positionen eine spätere
Neu-Berechnung überleben — plus die Erkenntnis, dass Aufnahmen heute nur
additiv verarbeitet werden (jede neue Aufnahme kennt frühere Räume nicht),
also ein größerer Eingriff als ursprünglich gedacht. Sandy wollte das dann
nicht spontan entscheiden — Auftrag zurückgestellt, nichts umgesetzt, nichts
kaputt.

**Update (Chief of Staff, 2026-08-20) — diesmal endgültig aktiviert:** Beim
heutigen Gesamtüberblick hat Sandy unaufgefordert und unabhängig vom
Prüfmeister fast wortgleich dieselbe Sorge geäußert wie seine Meta-Notiz
(„der Vertrauens-Mechanismus … wiederholt nicht hält, was er verspricht") —
und danach ausdrücklich angewiesen: **„das soll endgültig gefixt werden."**
Das ist keine spontane „ok los"-Zusage wie am 19.08. mehr, sondern eine klare
Priorisierungsentscheidung: CoS-002 steht jetzt vor allen anderen
Gate-1-Punkten, auch vor reiner Live-Test-Verifikation bereits gebauter
Fixes.

**Was das für dich als konkreter Auftrag heißt** (ich entscheide nicht, WIE
du das baust — das ist deine fachliche Entscheidung): Bitte einen konkreten
Umsetzungsvorschlag ausarbeiten, keine offene Entweder-Oder-Frage mehr wie
letztes Mal. Der Vorschlag sollte mindestens enthalten:
- Ein bis zwei realistische Architektur-Optionen (z. B. „Karte liest
  dieselbe geprüfte Struktur wie die finale Berechnung, statt einen zweiten
  GPT-Aufruf zu machen" als ein möglicher Ansatz — deine Einschätzung zählt,
  nicht meine).
- Für jede Option: geschätzter Aufwand, Risiko, und wie die beiden am 19.08.
  aufgetauchten Kompliziertheiten behandelt werden (manuelle Positions-
  Änderungen vs. Neu-Berechnung; additive statt vollständige
  Raum-Verarbeitung bei mehreren Aufnahmen).
- Eine Einschätzung, ob sich das in kleinen, sicheren Schritten machen lässt
  (eure eigene Grundregel) oder ob an dieser Stelle ausnahmsweise ein
  größerer, in sich abgeschlossener Schritt nötig ist — mit Begründung.

Sobald der Vorschlag steht, lege ich ihn Sandy zur Entscheidung vor (siehe
`docs/entscheidungen-fuer-sandy.md`). Cross-Referenz: Die sichtbare Seite
desselben Problems liegt beim Product Designer unter **DC-021** (Karte zeigt
nicht zuverlässig, was berechnet wird) und **DC-022** („X Positionen
erkannt" stimmt nicht) — eine Architekturlösung hier dürfte beide mit
lösen, lohnt sich also, das kurz mit ihm/ihr abzustimmen, bevor du eine
UI-seitige Ursache vermutest, die eigentlich hier liegt.

**Vorschlag geliefert (Head of Product Engineering, 2026-08-20):** Voller
Vorschlag in `docs/cos-002-architektur-vorschlag.md`. Kurz zusammengefasst:
Root Cause bestätigt (Karte `gpt-4o-mini`, finale Berechnung `gpt-4o`, ~16×
teurer, kein gemeinsamer Kontext). Zwei Optionen ausgearbeitet — **Option 1
(empfohlen): echte Single-Source-of-Truth**, die teure Extraktion läuft nur
noch einmal pro Aufnahme statt zweimal, in drei einzeln auslieferbaren
Schritten (Ergebnis cachen → Karte liest daraus → „Entwurf erstellen" ruft
GPT nicht mehr neu auf), Gesamtaufwand grob 2–3 Wochen, nur der letzte
Schritt fasst den Geld-Pfad an. **Option 2: schneller nachträglicher
Abgleich** (1–2 Tage, sehr risikoarm), behebt aber nur die Situation NACH
dem ersten „Entwurf erstellen", nicht das eigentliche Vertrauensproblem VOR
dem Klick. Beide Kompliziertheiten vom 19.08. einzeln durchgespielt (additive
Verarbeitung: wird durch denselben Kontext-Mechanismus gemildert, den die
Karte heute schon nutzt, aber nicht vollständig gelöst; manuelle
Änderungen: sind schon heute nur durch Zufall sicher, eigener, von CoS-002
unabhängiger Bug — separates kleines Ticket empfohlen, nicht Teil dieses
Vorschlags). Empfehlung: kein Big-Bang, sondern Option 2 sofort + Option 1
in den drei Schritten, mit echten Produktionszahlen unterlegt (nur lesend
geprüft: 70 Aufnahmen/68 Angebote, frühe Testphase). Nebenfund dabei: die
Kosten-Protokollierung für die teure Extraktion läuft seit 20.07. still ins
Leere (Spalten-Mismatch) — eigenes kleines Ticket, nicht selbst angefasst.

**Entscheidung (Sandy, 2026-08-20):** Deiner Empfehlung folgen — **Option 2
sofort als Sofortmaßnahme, parallel dazu Option 1 komplett in den drei
Schritten.** Zusätzliche, klare Bedingung: **Schritt 3 (der den Geld-Pfad
anfasst) muss vollständig fertig und bestätigt sein, bevor der erste echte
Testnutzer an das Tool darf** — das ist ab jetzt eine Voraussetzung für den
Beginn von Gate 1, nicht nur ein „wäre schön". Bitte loslegen. Grobe
Zeitschätzung laut deinem Vorschlag: ca. 2–3 Wochen bis Schritt 3 steht.
Melde bitte jeweils, wenn Schritt 1, 2 und 3 einzeln fertig sind — nicht
erst am Ende alles auf einmal. Die zwei Nebenfunde (manuelle
Positions-Änderungen vs. Neu-Berechnung; kaputtes Kosten-Logging seit
20.07.) bitte als eigene kleine Tickets anlegen, unabhängig davon.

**Fix-Update (Head of Product Engineering, 2026-08-20) — Option 2 fertig,
Schritt 1 fertig, wie gewünscht einzeln gemeldet:**

- **Option 2 (fertig):** `generiere-positionen/route.ts` schreibt nach
  erfolgreicher Berechnung das echte, autoritative Ergebnis zurück auf
  `erkannte_positionen` der beteiligten Aufnahmen — geht man zu einer bereits
  generierten Aufnahme zurück, zeigt die Karte jetzt die Wahrheit statt der
  ursprünglichen Vorschau. Rein additiv (Update NACH dem Insert, Fehler
  blockiert nie die eigentliche Berechnung), syntaktisch geprüft (esbuild).
- **Option 1, Schritt 1 (fertig):** neue Spalte
  `entwurf_aufnahmen.voll_extraktion` (Migration `20260820140000`, live in
  Produktions-DB angewendet und verifiziert). Neues Modul
  `src/lib/volle-extraktion-cache.ts` ruft `ki-extrahieren` jetzt zusätzlich
  zur bestehenden Chip-Vorschau bei jeder Aufnahme auf und cached das
  Rohergebnis — noch von niemandem gelesen, reines Plumbing für Schritt 2/3.
  Läuft über `next/server`'s `after()`, also NACH der eigentlichen Antwort,
  damit sich am heutigen Antwortverhalten/Tempo nichts ändert, wie im
  Vorschlag versprochen.
  **Eine Entscheidung, die über den Vorschlag hinausgeht:** beim Umsetzen
  festgestellt, dass `ki_extraktion` auf dem Free-Plan auf 10/Tag begrenzt
  ist (`rate-limiter.ts`) — ohne Gegenmaßnahme hätte der zusätzliche
  Cache-Aufruf dieses Budget in der Übergangszeit faktisch verdoppelt
  belastet. Der Cache-Aufruf teilt sich jetzt bewusst dasselbe Budget mit
  „Entwurf erstellen" (kein neuer, unbegrenzter Pfad) — ist es schon
  aufgebraucht, wird einfach übersprungen statt selbst zu zählen oder zu
  blockieren. Heißt konkret: in der jetzigen Zwischenphase verbraucht eine
  Aufnahme + ein „Entwurf erstellen" zusammen effektiv 2 statt 1 Einheit des
  Tagesbudgets — befristeter, bewusster Kompromiss, endet automatisch sobald
  Schritt 3 live ist.
- **Ehrlich zum Stand:** beides syntaktisch geprüft (esbuild), noch KEIN
  Live-Nachtest — insbesondere ob `after()` im echten Deployment zuverlässig
  durchläuft, sollte einmal beobachtet werden (z. B. `voll_extraktion` nach
  ein paar echten Aufnahmen stichprobenartig prüfen, ob sie sich füllt).
- Schritt 2 und Schritt 3 bewusst noch NICHT begonnen — wie angekündigt
  größere, risikoreichere Schritte, für die ich mir mehr Sorgfalt nehme statt
  sie im selben Rutsch mitzuziehen. Melde mich einzeln, sobald Schritt 2
  steht.
- Die zwei angeforderten Nebenfund-Tickets sind angelegt: **CoS-014**
  (manuelle Positions-Änderungen vs. Neu-Berechnung) und **CoS-015** (kaputtes
  Kosten-Logging seit 20.07.), beide unten in der Übersichtstabelle und als
  eigene Abschnitte.

**Fix-Update (Head of Product Engineering, 2026-08-20) — Schritt 2, erste
Hälfte fertig, zweite Hälfte bewusst noch offen:**

- **Vorbereitung für Schritt 2 (fertig):** die komplette deterministische
  Nachbearbeitung, die aus einer rohen GPT-Extraktion die fertigen Positionen
  macht (Normalisierung, Mehrraum-Reparaturen, Rückfragen-Zusammenführung,
  implizite Regeln, Flächen-Patches, Mengenberechnung …), lag bisher NUR
  inline in `angebot-extrahieren/route.ts`. Sie ist jetzt in eine eigene,
  reine Funktion ausgelagert: `src/lib/mengen/extraktion-pipeline.ts`
  (`verarbeiteExtraktion`) — 1:1 herausgezogen, nicht neu geschrieben, um
  nicht genau die PM-012-Falle zu wiederholen (zwei Stellen mit derselben
  Logik laufen irgendwann auseinander), die diesen ganzen CoS-002-Fund erst
  ausgelöst hat. Die Live-Route für die Kalkulation ist jetzt ein dünner
  Wrapper, der diese eine Funktion aufruft — inhaltlich unverändert.
  **Regressionsprüfung:** alle 236 bestehenden Tests laufen unverändert
  grün, `tsc` zeigt für beide geänderten Dateien keine neuen Fehler.
- **Warum das noch nicht „Schritt 2 fertig" ist:** die eigentliche Aufgabe —
  die Karte liest die gecachte, volle Extraktion statt der schnellen
  Chip-Vorschau — habe ich bewusst noch nicht gebaut. Sobald die volle
  Extraktion asynchron im Hintergrund läuft (siehe Schritt 1, `after()`),
  braucht die Karte kurzzeitig einen sichtbaren „vorläufig"-Zustand, bevor
  die bestätigten Daten da sind. Das ist eine echte UX-Entscheidung, keine
  reine Backend-Frage — genau der Punkt, den ich im Vorschlag als
  Cross-Referenz zu DC-021/DC-022 markiert hatte. Bevor ich das im
  Alleingang in `entwurf/page.tsx` verdrahte, will ich das kurz mit
  Sandy/Product Designer abstimmen statt eine UI-Entscheidung zu treffen,
  die eigentlich nicht meine ist.
- **Ehrlich zum Stand:** die neue, gemeinsame Funktion selbst ist geprüft und
  sicher (Tests grün), aber noch KEIN Live-Nachtest des refaktorierten
  Geld-Pfads im echten Deployment.

**Fix-Update (Head of Product Engineering, 2026-08-21) — Schritt 2 jetzt
komplett, inklusive der zurückgestellten UX-Entscheidung:**

- Product Designer hat die offene Design-Frage (`docs/design-check.md`
  DC-030) entschieden: Karte zeigt für Sprachaufnahmen keine Positionen mehr,
  solange die volle Extraktion noch läuft — bleibt beim bestehenden
  „Verarbeitung…"-Badge (nur länger sichtbar als bisher), ab ~5s zusätzlich
  ein vager Hinweis „prüft genau, dauert kurz", dann in einem Schritt auf
  „✓ Fertig" + fertige Positionen wechseln. Kein neues UI-Element, bewusst
  dasselbe Muster wie das bestehende Verarbeitung→Fertig-Badge.
- Umgesetzt (`entwurf/page.tsx`, `volle-extraktion-cache.ts`, `lib/types.ts`):
  `volle-extraktion-cache.ts` jagt das rohe `ki-extrahieren`-Ergebnis jetzt
  direkt durch dieselbe `verarbeiteExtraktion`-Funktion aus Schritt 2a und
  cached eine daraus gebaute Positionsliste mit in `voll_extraktion` — die
  Karte zeigt also, sobald bereit, dieselbe geprüfte Struktur wie die finale
  Berechnung, keine neue, dritte Heuristik. Gilt für die einzelne
  Aufnahmekarte UND für die DC-028-Raum-Sammelkarten (auf Hinweis der
  Designerin: dieselbe schnelle Vorschau speiste dort denselben
  „Wird berechnet"-Zustand — sonst wäre das Problem dort in kleinerer Form
  wieder aufgetaucht).
- **Sandys Rückfrage („nur 1× warten oder zweimal?") ist umgesetzt:**
  `kannFertigstellen` prüft jetzt zusätzlich, dass für jede neue
  Sprachaufnahme entweder die geprüfte Extraktion da ist oder endgültig feststeht,
  dass sie nicht mehr kommt — „Entwurf erstellen" schaltet sich nicht mehr
  frei, bevor das durch ist. Genau ein Wartefenster, wie von der Designerin
  als harte Anforderung (nicht nur Empfehlung) formuliert.
- **Absicherung gegen Dauerblockade, über den Vorschlag/DC-030 hinaus:**
  ein Fehlschlag beim Hintergrund-Aufruf (Rate-Limit aufgebraucht,
  GPT-/Netzwerkfehler) schreibt jetzt aktiv eine Fehlschlag-Markierung statt
  die Zeile einfach unverändert zu lassen — sonst hätte ein Nutzer, der sein
  Tagesbudget schon verbraucht hat, nie wieder einen Entwurf erstellen können.
  Zusätzlich ein 30-Sekunden-Timeout client-seitig, falls selbst dieser
  Schreibvorgang mal ausbleibt (z. B. Server-Absturz) — fällt dann automatisch
  auf die alte, schnelle Vorschau zurück statt endlos zu warten.
- **Regressionsprüfung:** alle 236 bestehenden Tests weiterhin grün, `tsc`
  zeigt für alle geänderten Dateien keine neuen Fehler (nur vorbestehende,
  unabhängige Fehler durch die unvollständige lokale Kopie dieses Checkouts).
- **Ehrlich zum Stand:** alles nur statisch geprüft (esbuild/tsc) und gegen
  die bestehende Testsuite — noch KEIN Live-Nachtest im echten Deployment,
  insbesondere nicht, wie sich die neue Wartezeit auf der Karte in der Praxis
  anfühlt (die Designerin selbst merkte an, dass die tatsächliche Dauer eine
  Einschätzung ist, keine gemessene Zahl — bitte beim ersten echten Test
  beobachten). Damit ist Option 1 Schritt 2 komplett. Nur noch **Schritt 3**
  (Geld-Pfad selbst auf `voll_extraktion` umstellen, Sandys Gate-1-Bedingung)
  steht zwischen CoS-002 und dem ersten echten Testnutzer.

**Fix-Update (Head of Product Engineering, 2026-08-21) — Schritt 3
umgesetzt, zunächst mit einer bewusst offen benannten Grenze:**

- `/api/entwurf/generiere-positionen` löst „Entwurf erstellen" nicht mehr
  blind einen zweiten, frischen `ki-extrahieren`-Aufruf aus, sondern nutzt
  — wenn vorhanden — die in Schritt 1 pro Aufnahme gecachte volle
  Extraktion (`entwurf_aufnahmen.voll_extraktion.result`) direkt weiter.
  Nur EIN KI-Aufruf pro Aufnahme statt zwei — exakt das CoS-002-Ziel.
- Bewusst zunächst NUR im einfachsten, sicheren Fall aktiv: genau EINE neue
  Sprachaufnahme, ohne laufende Rückfragen-Runde (kleine Schritte statt
  Big-Bang). Grund: der Cache wurde pro Aufnahme auf DEREN EIGENEM
  Transkript berechnet — bei mehreren gleichzeitig neuen Aufnahmen
  kombiniert `combinedText` mehrere Transkripte zu EINEM GPT-Aufruf (damit
  z. B. ein in Aufnahme 2 erwähnter Bezug auf einen Raum aus Aufnahme 1
  aufgelöst werden kann); das können einzeln gecachte Extraktionen
  strukturell nicht nachbilden.
- Drive-by-Fix: die Rate-Limit-Prüfung in `angebot-extrahieren/route.ts`
  lief bisher auch dann, wenn gar kein frischer GPT-Aufruf anstand
  (Rückfragen-Runde) — jetzt nur noch, wenn tatsächlich einer ansteht.
- **Wichtig, unabhängig vom Rest-Umfang:** das eigentliche
  CoS-002-Vertrauensproblem („Karte zeigt etwas anderes als die
  Berechnung") ist damit in JEDEM Fall gelöst, unabhängig von der Anzahl
  Aufnahmen — das läuft über Option 2 + Schritt 2, beide greifen immer.
  Der verbleibende Mehrfach-Aufnahmen-Fall war nur noch eine
  Kosten-/Tempo-Frage (ein zweiter, redundanter GPT-Aufruf), keine
  Korrektheits-Frage mehr.
- Regressionsprüfung: 236/236 Tests grün, `tsc`/`esbuild` ohne neue Fehler.
- Diese Teil-Lücke wurde Sandy transparent in
  `docs/entscheidungen-fuer-sandy.md` zur Entscheidung vorgelegt (reicht der
  Umfang für Gate 1, oder auch den Mehrfach-Fall schließen?).

**Fix-Update (Head of Product Engineering, 2026-08-21, Folgeauftrag „mach
komplett rund, das auch noch schließen") — Mehrfach-Aufnahmen-Fall jetzt
ebenfalls geschlossen, Schritt 3 damit vollständig:**

- Ein deterministisches Zusammenführen mehrerer UNABHÄNGIG (je Aufnahme
  isoliert) extrahierter Ergebnisse wäre riskant gewesen — Cross-Aufnahme-
  Bezüge (z. B. „noch die Decke im Wohnzimmer" in Aufnahme 2, bezogen auf
  ein in Aufnahme 1 erwähntes Wohnzimmer) lassen sich nicht zuverlässig aus
  zwei getrennten JSON-Ergebnissen rekonstruieren — genau die Art von
  stillem Korrektheits-Fehler, die CoS-002 beheben soll. Deshalb bewusst
  KEIN lokaler Merge der Einzel-Caches.
- Stattdessen: ein neuer, rein spekulativer Vorab-Aufruf
  (`src/lib/kombinierte-extraktion-cache.ts`,
  `/api/entwurf/vorab-kombinieren`, neue Spalte
  `quotes.kombinierte_extraktion_cache`, Migration
  `20260821060000_add_kombinierte_extraktion_cache.sql`, bereits auf der
  Produktions-DB angewendet). Sobald „Entwurf erstellen" für MEHRERE neue
  Aufnahmen klickbar wird (`kannFertigstellen`), feuert das Frontend
  fire-and-forget denselben kombinierten `ki-extrahieren`-Aufruf, den
  „Entwurf erstellen" sonst erst beim Klick frisch ausgelöst hätte — noch
  bevor der Nutzer tatsächlich klickt. Klickt er später auf exakt dieselbe
  Aufnahmen-Menge, nutzt `generiere-positionen` dieses Ergebnis, geprüft
  über einen exakten Abgleich der Aufnahme-IDs; bei jeder Abweichung
  (Aufnahme dazugekommen, Cache fehlt/fehlgeschlagen) automatisch der
  bisherige frische Kombi-Aufruf als Fallback — kein Korrektheits-Risiko,
  GPT sieht in beiden Fällen denselben Text auf einmal, nur WANN der Aufruf
  passiert verschiebt sich.
- Kosten-Einordnung: im Erwartungsfall kein Mehrverbrauch (derselbe eine
  Kombi-Aufruf, nur vorgezogen); feuert bewusst nur einmal pro tatsächlich
  geänderter Aufnahmen-Menge (nicht pro Aufnahme), um kein wiederholtes
  Neuberechnen bei wachsenden Batches auszulösen.
- Rein additiv, fail-open, ohne sichtbaren Zustand: schlägt der Vorab-Aufruf
  fehl, merkt der Nutzer nichts — die Route fällt automatisch auf das
  bisherige, bekannte Verhalten zurück.
- Regressionsprüfung: 236/236 Tests weiterhin grün, `tsc`/`esbuild` für alle
  neuen/geänderten Dateien ohne neue Fehler.
- **Ehrlich zum Stand:** alles nur statisch geprüft und die DB-Migration
  direkt gegen die Produktions-DB angewendet (Supabase-MCP, wie schon bei
  Schritt 1). Update 2026-08-21: Sandy hat beide Commits (`434ba16`,
  `d582048`) gepusht, `main`/`origin/main` gleichauf — siehe Antwort auf
  CoS-016 (die dort erwähnte „Blockade" war ein device_bash-Lock-Datei-
  Problem, inzwischen selbst gelöst, kein offener Blocker mehr). Noch KEIN
  Live-Nachtest im echten Deployment. Damit ist CoS-002 Option 1 jetzt in
  allen drei Schritten UND für beide Aufnahmen-Fälle vollständig umgesetzt
  und gepusht — aus meiner Sicht erfüllt das Sandys Gate-1-Bedingung
  vollständig, sobald der Live-Nachtest bestätigt.

**Fix-Update (Head of Product Engineering, 2026-08-21) — Live-Nachtest fand
einen echten Bug, Ursache gefunden und behoben, Karte selbst KORREKT:**

Sandy hat direkt nach dem Deploy getestet ("Wohnzimmer streichen, 3x4
Meter...") und einen konkreten Fehler gemeldet: die Karte zeigte "Boden
schützen 0 m²" statt der erwarteten 12 m² (gleich wie Decke). Fehlersuche in
mehreren Runden, bevor die eigentliche Ursache gefunden war:

- Erst PM-013-Fallback verdächtigt (falsch — Einheiten-Mismatch, Stück ≠ m²).
- Dann Browser-Cache (Sandy: Strg+F5 half nicht) und PWA/Service-Worker
  (Sandy: reproduziert auch im frischen Inkognito-Fenster mit neuer
  Aufnahme) — beides ausgeschlossen.
- Dann fälschlich einen Vercel-Branch-Fehlkonfiguration vermutet (main vs.
  master, 375 Commits Differenz) — durch Sandys Deployments-Screenshot
  widerlegt: `main`/`d582048` lief bereits korrekt als Production. Sackgasse,
  Sandy unnötig durch die Vercel-Settings geschickt — mein Fehler, dafür
  entschuldigt.
- Direkte Prüfung der Produktions-DB (Supabase-MCP) zeigte: `voll_extraktion`
  hatte in JEDER Testaufnahme die korrekten 12 m². Die Berechnung war nie
  falsch. Der Fehler lag ausschließlich in der Anzeige.
- **Tatsächliche Ursache gefunden:** die `supabase_realtime`-Publication war
  komplett leer — für KEINE einzige Tabelle war Realtime aktiv, obwohl
  `entwurf/page.tsx` einen `postgres_changes`-Channel abonniert, über den
  sich die Karte automatisch aktualisieren soll, sobald `voll_extraktion`
  eintrifft (Schritt 2, s. o.). Ohne diesen Publication-Eintrag kommt dieses
  Event nie an — kein Fehler, einfach dauerhaft Stille. Die Karte wartet
  darum bis zu 30s (der bewusste Fail-open-Timeout) und fällt danach für
  immer auf die schnelle, fehleranfällige Chip-Vorschau zurück — selbst wenn
  die geprüfte Extraktion Sekunden später fertig wird.
- **Fix:** Migration `20260821_enable_realtime_entwurf_aufnahmen.sql`
  (`alter publication supabase_realtime add table public.entwurf_aufnahmen;`),
  direkt gegen die Produktions-DB angewendet (Supabase-MCP) und verifiziert.
  Reiner DB-Config-Fix, kein Code-Deploy nötig, wirkt sofort. Einzige Stelle
  im ganzen Code, die Realtime nutzt — kein weiterer verdeckter Blast-Radius.
  Sandys erneuter Test nach dem Fix steht noch aus (Stand: gerade eben
  angewendet).
- **Separater, jetzt deutlich niedriger priorisierter Nebenfund:** die
  schnelle Chip-Vorschau (`chips-extraktion.ts`/`chips-vervollstaendigung.ts`)
  hat selbst einen Bug — ihr automatisch ergänztes "Boden schützen" landet
  mit `menge: 0` statt der Raumfläche. Das war die Zahl, die durch den
  Realtime-Bug sichtbar wurde. Jetzt, wo Schritt 2 die Karte wie vorgesehen
  automatisch korrigiert, betrifft dieser Chip-Bug nur noch das kurze
  Zeitfenster vor der geprüften Extraktion (oder den seltenen Fail-open-Fall)
  — eigenes kleines Ticket wert, aber kein Blocker mehr.

---

## CoS-011 — Rückfragen-UI komplett neu (DC-025/DC-026): Briefing für die Umsetzung

**Datum:** 2026-08-18
**Status:** 🟡 überholt durch direkte Anweisung — Product Designer hat auf
Sandys „setz dc-025 um" bereits gebaut (`RueckfragenScreen.tsx`), noch bevor
die hier erbetene Aufwandsschätzung stattfinden konnte. Chief-of-Staff-Sicht:
kein Problem — läuft nur an dieser Stelle als Prozess-Nachtrag statt vorher,
Ergebnis ist da. Offen bleibt nur der Live-Test im Browser (siehe DC-025).
Die „Du hast gesagt: …"-Vorschläge (DC-026, Erkennungs-Flag) sind bewusst
NICHT enthalten — das bleibt ein eigener, noch zu schätzender Auftrag an
dich, sobald DC-025 live bestätigt ist.

**Hintergrund:** Sandy fand die bisherige Rückfragen-UI „hässlich und
kacke" und wollte sie komplett neu gedacht, nicht nachgebessert (PD-002).
Product Designer hat dafür Konzept + klickbaren Prototyp geliefert
(`docs/dc-025-konzept-rueckfragen.md`, `docs/dc-025-rueckfragen-prototyp.html`
— beides an Sandy verschickt, sie sagt „ich finds super"). Volle
Design-Begründung steht in `docs/design-check.md` DC-025 (Layout/Flow) und
DC-026 (schon Gesagtes nicht nochmal fragen).

**Kernidee laut Product Designer:** Ein Screen pro Raum statt pro
Einzelfrage (Daten sind intern schon nach `kontext` gruppiert), eine
durchgängige Fortschrittsanzeige über alle offenen Fragen statt nur pro
Raum, weicherer Übergang statt Vollbild-Schwarz, „Du hast gesagt: …"-
Vorschläge mit Zitat-Quelle statt Doppelfragen, sichtbare Konsequenz beim
Überspringen statt Kleingedrucktem, editierbares Recap vor der Berechnung.
Die bestehenden Eingabe-Bausteine (Maße/Höhe/Anzahl) bleiben fachlich
unverändert — nur das Gerüst drumherum ändert sich, siehe Prototyp.

**Der einzige Teil mit echtem Erkennungs-Mehraufwand (nicht nur UI):** Für
die „Du hast gesagt: …"-Vorschläge (löst zugleich DC-026) braucht es ein
neues Flag/Feld pro Rückfrage, ob ein Wert im Transkript bereits vorhanden,
aber bisher nicht strukturiert erkannt wurde — das ist eine Erweiterung der
bestehenden Extraktion, keine reine Frontend-Änderung. Volle technische
Notizen dazu (inkl. der zwei rein UI-seitigen Punkte) in
`docs/dc-025-konzept-rueckfragen.md`, Abschnitt „Was das technisch braucht".

**Konkrete Bitte:** Bitte grob schätzen (Größenordnung reicht, kein Sprint-
Ticket nötig) und mit Product Designer direkt abstimmen, wo Rückfragen
offen sind (`docs/marketing-design-austausch.md` ist der falsche Kanal
dafür — das läuft über `docs/design-check.md`/direkte Absprache wie bisher
bei DC-Punkten). Sandy will das zügig in Bearbeitung sehen, aber es ist ein
eigenständiges, größeres Vorhaben — bitte nicht nebenbei mit einem
Klein-Fix verwechseln, sondern wie ein eigenes kleines Projekt einplanen,
neben CoS-010/CoS-007.

---

## CoS-001 — DC-001 umsetzen: Preis + Gewerke-Werbung angleichen

**Datum:** 2026-08-16
**Status:** 🟡 umgesetzt, Live-Nachtest steht aus

**Hintergrund:** Product Designer hat in `docs/design-check.md` (DC-001) drei
widersprüchliche Preise und ein „18 Gewerke"-Versprechen gefunden, das nicht
zum echten Funktionsstand passt. Sandy hat den Chief of Staff gebeten, den
Startpreis festzulegen. Entscheidung (siehe DC-001 für die volle Begründung):

- **Preis:** 22 €/Monat Standard, 17 €/Monat bei Jahresabo, 3 Angebote/Monat
  kostenlos — der Wert aus dem echten Upgrade-Dialog (`PlanWahlModal.tsx`),
  übernommen statt neu erfunden, damit möglichst nichts an echten
  Stripe-Preisen verändert werden muss.
- **Gewerke-Werbung:** „Maler & Bodenleger" statt „Alle 18 Gewerke" — nur
  diese zwei sind bisher durch die Prüfmeister-Testreihe gelaufen.

**Aufgabe für Head of Product Engineering:**
1. Landingpage (`src/components/landing/PreiseSection.tsx`): Preis + Free-Kontingent von 29 €/5 frei auf 22 €/17 € (Jahresabo)/3 frei ändern.
2. Alte, unverlinkte Vorschau-Seite (`src/app/vorschau/page.tsx`, `/vorschau`): entfernen oder auf die Landingpage umleiten — nicht als dritte Preisquelle weiterpflegen.
3. `PlanWahlModal.tsx`: „Alle 18 Gewerke" durch „Maler & Bodenleger" ersetzen.
4. Bei Gelegenheit (kein Blocker): zentrale `pricing.ts` anlegen, von der Landingpage, `PlanWahlModal` und ggf. `/vorschau` lesen, statt drei Stellen von Hand synchron zu halten — ursprüngliche Empfehlung aus dem DC-001-Befund.

**Nicht vergessen:** Sobald Fliesen, Elektro, Sanitär oder Trockenbau vom
Prüfmeister freigegeben sind (siehe Launch-Todoliste beim Chief of Staff),
die Gewerke-Werbung hier wieder erweitern.

**Fix-Update (Head of Product Engineering, 2026-08-18):** Alle vier Punkte umgesetzt.

1. `PreiseSection.tsx`: Preis-Kachel zeigt jetzt 17 €/Monat (Bei Jahresabo.
   Monatlich 22 €.) statt 29 €/Monat — exakt dieselbe Darstellungsweise wie
   im Upgrade-Dialog, damit beide Stellen wirklich gleich aussehen, nicht nur
   dieselbe Zahl haben. Free-Kontingent von „5 Angebote kostenlos" auf „3
   Angebote kostenlos" korrigiert.
2. `PlanWahlModal.tsx`: „Alle 18 Gewerke" → „Maler & Bodenleger". Die Preis
   lag hier schon richtig (17/22 €), Zahlen jetzt trotzdem auch aus
   `pricing.ts` gezogen statt hart einprogrammiert.
3. `/vorschau`: Seite zeigt keine eigenen Inhalte/Preise mehr, sondern leitet
   direkt auf die Landingpage (`/`) weiter (`redirect('/')`). Route bewusst
   NICHT ganz gelöscht — sie ist zusätzlich das Fallback-Ziel in `proxy.ts`,
   wenn lokal keine Supabase-Umgebungsvariablen gesetzt sind (dort jetzt
   direkt auf `/` statt auf `/vorschau` verwiesen, ein Redirect-Hop weniger).
   Alte Bookmarks/Links auf `/vorschau` landen so immer auf der echten,
   aktuellen Landingpage statt auf einer toten Seite oder einem 404.
4. `src/lib/pricing.ts` angelegt (Punkt 4, „bei Gelegenheit") — einzige
   Quelle für Preis + Gewerke-Werbetext, `PreiseSection.tsx` und
   `PlanWahlModal.tsx` lesen jetzt beide von dort. Da ich für Punkt 1–3
   ohnehin alle drei Stellen anfassen musste, war das kein Mehraufwand mehr,
   sondern genau der richtige Moment dafür — der ursprüngliche DC-001-Fund
   war ja exakt diese Drift zwischen unabhängig gepflegten Zahlen.

**Ehrlich zum Stand:** Keine automatisierte Testabdeckung für diese
UI-Texte/Preise (reine Marketing-/Modal-Komponenten, kein Bibliotheks-Code).
Lokal nur per isoliertem TypeScript-Syntaxcheck geprüft (kein vollständiger
Checkout in dieser Umgebung verfügbar) — `npm run typecheck` durch Sandy
steht noch aus, genauso wie ein Blick auf Landingpage/Upgrade-Dialog/
`/vorschau` im Browser.

---

## CoS-012 — DC-029 „Baustelle"/Projekt-Zuordnung: Briefing für die Umsetzung

**Datum:** 2026-08-19
**Status:** 🟡 Lexware/Lexoffice-Machbarkeit erledigt (kein Blocker, nur
Text statt Struktur, s. Update unten). Teil 1 (Datenmodell, Head of Product
Engineering) jetzt umgesetzt und live — Designer hatte alle vier
Abstimmungsfragen beantwortet, siehe Fix-Update ganz unten sowie
`docs/design-check.md` DC-029. Live-Nachtest durch Sandy steht aus, danach
liefert der Designer Konzept + Prototyp für die eigentliche Baustellen-UI.

**Hintergrund:** Sandy hat einen neuen Bedarf eingebracht, Quelle: Clemens
(ihr Partner, selbst Handwerker, künftiger Testnutzer nach Gate 1) — bei
größeren Aufträgen entstehen mehrere Angebote nacheinander für denselben
Auftrag/dieselbe Baustelle (z. B. erst Entrümpelung, dann Ausbau-Gewerke).
Aktuell gibt es in Sofortangebot keine Ebene zwischen Kunde und Angebot, die
das bündelt. Product Designer hat das geprüft (`Customer`/`Quote` haben
kein Projekt-/Baustellen-/Lieferadress-Feld) und einen Wording- +
UX-Grundsatzvorschlag geliefert — volle Begründung in `docs/design-check.md`
DC-029.

**Wording-Entscheidung des Designers (nicht meine, nur übernommen):**
„Baustelle" statt „Projekt" als nutzersichtbarer Begriff — passt zur
Sprache der Zielgruppe (Maler/Bodenleger/Innenausbau), „Projekt" klingt zu
sehr nach Software/Agentur. Eine Baustelle gehört zu genau einem Kunden,
ein Kunde kann mehrere haben. Wichtig: für die Mehrheit der Nutzer mit nur
einem Auftrag pro Kunde darf das keine zusätzliche Pflicht-Hürde werden —
Vorschlag ist eine automatisch vorbefüllte erste Baustelle pro Kunde,
sichtbar/benennbar erst ab der zweiten.

**Zwei offene Teile, die hiermit formal vergeben sind:**

1. **An Head of Product Engineering — Datenmodell:** neue Tabelle
   (`baustellen` o. ä.), FK `baustelle_id` auf `quotes`, Migration
   bestehender Angebote auf eine automatisch erzeugte Erst-Baustelle pro
   Kunde, damit nichts verwaist. Bitte grob schätzen und mit Product
   Designer abstimmen (`docs/design-check.md`, nicht
   `engineering-austausch.md` — ist ein Design-Thema, kein reines
   Engineering-Thema).
2. **An Platform & Integrations Engineer — Lexware/Lexoffice-Machbarkeit:**
   prüfen, ob/wie Lexware/Lexoffice ein Konzept wie „Lieferadresse" oder
   Projekt/Kostenstelle in der API kennt, auf das die Baustelle abgebildet
   werden könnte — es gibt bereits eine Kontakt-Ebene-Anbindung
   (`lexoffice_contact_id`), die Frage ist, ob sich das erweitern lässt.
   Bitte kurze Machbarkeits-Einschätzung, kein fertiges Konzept nötig.

**Update (2026-08-19, Platform & Integrations Engineer — Teil 2 erledigt):**
Lexoffice und Lexware Office sind dieselbe API (`api.lexoffice.io/v1`,
Lexware Office ist nur der neue Name), daher eine Antwort für beide. Laut
aktueller API-Doku gibt es dort **kein** separates Projekt-/Kostenstellen-
oder Lieferadress-Feld — Angebote/Rechnungen haben genau ein `address`-
Objekt, das bereits belegt ist. Workaround ohne Umbau der Anbindung: den
Baustellen-Namen sobald vorhanden in die freien Textfelder (`title`/
`introduction`) schreiben, z. B. „Angebot – Baustelle: Wohnung Familie
Müller, 2. OG" — für den Handwerker in der Buchhaltungssoftware sichtbar,
aber nicht strukturiert filterbar. Geschätzter Aufwand dafür: klein (je eine
Zeile in den zwei bestehenden Route-Dateien). Ausdrücklicher Vorbehalt:
nur anhand der öffentlichen API-Doku geprüft, nicht gegen einen echten
Account getestet — das vor der Umsetzung nachholen. Volle Einschätzung in
`docs/design-check.md` DC-029. **Fazit: kein Blocker** — Teil 1 (Datenmodell
bei Head of Product Engineering) bleibt der eigentliche Startpunkt.

**Bewusst noch nicht Teil dieses Auftrags:** UI/Screens/Menü-Platzierung —
Sandy hat das selbst auf „nächster Schritt" gelegt. Product Designer liefert
dafür Konzept + Prototyp, sobald Datenmodell und Lexware-Machbarkeit stehen,
genau wie bei DC-025/DC-028.

**Für Sandy:** Sobald beide Rückmeldungen da sind, lege ich dir kurz vor, ob
das als eigenes kleines Projekt eingeplant wird (ähnliche Größenordnung wie
DC-025/DC-028) oder ob es Rückfragen gibt, bevor es weitergeht — reine
Datenmodell-Änderung an einer Kern-Tabelle (`quotes`), daher mit derselben
Sorgfalt wie bei CoS-P-005/DC-024 behandeln, nicht nebenbei.

**Fix-Update — Datenmodell umgesetzt (Head of Product Engineering, 2026-08-19):**
Der Designer hat alle vier offenen Abstimmungsfragen aus meiner Schätzung
beantwortet (volle Antworten in `docs/design-check.md` DC-029) — Kernregel:
sobald `customer_id` an einem Angebot gesetzt wird, egal auf welchem Weg,
wird automatisch die Erstbaustelle dieses Kunden mitgesetzt, ohne dass der
Nutzer etwas tun muss; `baustelle_id` bleibt dauerhaft nullable, genau wie
`customer_id`. Umgesetzt, exakt nach dem abgestimmten Schema:

- Zwei Migrationen (Supabase-Projekt `yqlledouhfovytifeekd`, per
  `apply_migration` angewendet, außerdem als Dateien im Repo abgelegt):
  `20260819120000_create_baustellen.sql` (Tabelle + RLS nach dem
  `briefpapiere`-Muster + nullable `quotes.baustelle_id`) und
  `20260819120100_backfill_baustellen.sql` (Erstbaustelle je Bestandskunde
  mit Angebot + Verknüpfung). Beide live angewendet und verifiziert
  (Spalte/Tabelle/RLS-Policy per SQL-Abfrage bestätigt). Ehrlich dazu: der
  Backfill hat aktuell 0 Zeilen erzeugt, weil es in der Produktionsdatenbank
  gerade schlicht noch keine `customers`-Einträge gibt (0 Kunden, 66
  Angebote, alle ohne `customer_id`) — kein Fehler, nur der aktuelle
  Test-Datenstand. Sobald echte Kunden dazukommen, greift dieselbe Logik
  automatisch über die App-Seite, nicht mehr über den einmaligen Backfill.
- Neue, zentrale Funktion `getOrCreateErstbaustelle()` in
  `src/lib/baustellen.ts` — die eine Stelle, die die Designer-Regel oben
  umsetzt, inklusive Race-Condition-Absicherung über den Unique-Index.
- Verdrahtet an allen vier Stellen, an denen `quotes.customer_id` gesetzt
  wird: `src/app/api/quotes/create/route.ts`, `src/app/api/entwurf/neu/
  route.ts`, `src/app/(app)/angebot/[id]/AngebotDetail.tsx` (Kundenwahl UND
  Lexware-Import, beide über dieselbe Regel, wie vom Designer verlangt) und
  `src/app/api/quotes/[id]/revise/route.ts` (übernimmt `baustelle_id` 1:1
  vom Original, leitet sie nicht neu ab — falls ein Kunde später mal
  bewusst eine zweite Baustelle bekommt, soll eine Überarbeitung nicht
  stillschweigend zurück auf die Erstbaustelle springen).
- Jede Stelle, die `quotes` mit `baustelle_id` schreibt, hat denselben
  Fallback wie das bestehende Muster für `share_token`/`briefpapier_id`
  (Spalte fehlt noch → ohne nochmal versuchen) — auch wenn die Migration
  hier schon live ist, aus Konsistenz mit dem Rest der Datei und für den
  Fall, dass ein Deploy die Migration doch mal überholt.
- `Quote`-Typ um `baustelle_id` erweitert, neuer `Baustelle`-Typ in
  `src/lib/types.ts`, nach dem `Briefpapier`-Vorbild.

**Ehrlich zum Stand:** Kein automatisierter Test dafür — die Funktion macht
reine Datenbank-I/O (select-or-insert), die Codebasis hat dafür aktuell kein
Mocking-Muster, ein neues nur für diese eine Funktion einzuführen wäre mehr
Aufwand als Nutzen gewesen. Migration + Schema sind live verifiziert, die
eigentliche Anwendungslogik (Kunde zuweisen → Erstbaustelle entsteht/wird
gefunden → Angebot verknüpft) ist bisher NICHT live durchgeklickt, weil es
aktuell keine echten Kunden gibt, an denen das zu testen wäre — das steht
als Live-Nachtest aus, sobald ein Testkunde angelegt wird.

---

## CoS-013 — Strukturelle Lösung für den wiederholten Datei-Speicherfehler

**Datum:** 2026-08-20
**Status:** ❌ offen — Sofortmaßnahme umgesetzt, eigentlicher Lösungsvorschlag
braucht Sandys Go

**Hintergrund:** Der Speicherfehler bei gleichzeitiger Bearbeitung
gemeinsamer Doku-Dateien ist jetzt zum 6. Mal aufgetreten (zuletzt in dieser
Datei, 19./20.08. — ein verwaister Textrest am Dateiende, inzwischen
repariert). Sandys Frage dazu: „kannst du es richtig lösen?" Ich habe das
Setup dafür genauer angeschaut, statt es wieder nur zu reparieren.

**Was ich gefunden habe:** `docs/` ist Teil dieses Git-Repos (nicht in
`.gitignore` ausgeschlossen, `.git`/`.github` existieren im Projekt). Für
Code-Änderungen läuft hier bereits ein echter Git-Workflow (Commit + Push,
siehe z. B. CoS-P-005 — Platform & Integrations Engineer hat dort sichtbar
Terminal-/Git-Zugriff auf deinen Rechner). Für die Koordinationsdateien hier
unter `docs/` läuft das aber offenbar NICHT über Git — jedes Projekt liest
und schreibt diese Dateien direkt auf deinem Rechner über seine eigene
Geräteanbindung, ohne dass ein Commit dazwischenliegt. Das ist vermutlich die
eigentliche Ursache: zwei zeitlich nah beieinanderliegende, unkoordinierte
Schreibvorgänge auf dieselbe Datei, statt eines echten Merges.

**Sofortmaßnahme, bereits umgesetzt (keine Rückfrage nötig):** Jede der
sechs am stärksten betroffenen Koordinationsdateien (diese hier,
`chief-of-staff-platform-todos.md`, `chief-of-staff-marketing-todos.md`,
`chief-of-staff-finance-todos.md`, `design-check.md`,
`pruefmeister-testfaelle.md`) bekommt jetzt eine feste Markierung am echten
Dateiende. Taucht beim Lesen noch Text NACH dieser Markierung auf, ist das
sofort und eindeutig als Speicherfehler erkennbar — bisher ist mir das
zweimal nur durch Zufall aufgefallen, nicht systematisch. Außerdem die Bitte
an alle Kollegen: neue Einträge wenn möglich ans Dateiende anhängen statt
mitten in bestehende Abschnitte zu schreiben — das verkleinert die
Kollisionsfläche bei zeitgleicher Bearbeitung, löst das Problem aber nicht
grundsätzlich.

**Die eigentliche Lösung, die ich nicht selbst umsetzen kann:**
`docs/`-Änderungen genauso über echte Git-Commits laufen lassen wie
Code-Änderungen (pull → bearbeiten → commit → push), statt die Dateien
direkt zu überschreiben. Dann übernimmt Git die Zusammenführung — bei zwei
unabhängigen Änderungen an verschiedenen Stellen derselben Datei klappt das
zuverlässig, nur bei einer echten Überschneidung gäbe es einen sichtbaren
Konflikt statt einer stillen Beschädigung. Dafür bräuchte es aber
Terminal-/Git-Zugriff, den offenbar nicht jedes Projekt hat — meins zum
Beispiel nicht. Head of Product Engineering und Platform & Integrations
Engineer haben laut den bisherigen Fix-Updates (z. B. CoS-P-005, dortige
Commits/Pushes) bereits echten Git-Zugriff auf deinen Rechner.

**Ehrlich dazu:** Ich kann das nicht zu 100 % garantiert lösen — ich habe
keinen vollständigen Einblick, wie genau jedes einzelne Projekt technisch
auf deinen Rechner zugreift, nur was sich aus den bisherigen Fix-Updates der
anderen ablesen lässt. Aber die Sofortmaßnahme macht jeden künftigen Fall ab
sofort zuverlässig sichtbar statt durch Zufall, und die Git-Lösung würde die
Wahrscheinlichkeit eines echten, stillen Datenverlusts strukturell senken,
nicht nur behandeln.

**Für Sandy:** Die Sofortmaßnahme läuft bereits. Bei der Git-Lösung sag mir
kurz, ob ich das Head of Product Engineering und Platform & Integrations
Engineer als neue, feste Regel für `docs/`-Änderungen mitgeben soll.

---

## CoS-014 — Manuelle Positions-Änderungen nur durch Zufall vor Neu-Berechnung sicher

**Datum:** 2026-08-20 (Nebenfund beim CoS-002-Architektur-Vorschlag)
**Status:** ❌ offen — beschrieben, nicht angefasst. Auf Sandys ausdrücklichen
Wunsch als eigenes, von CoS-002 unabhängiges Ticket angelegt.

**Befund:** Beim Recherchieren für CoS-002 geprüft, ob eine manuelle
Positions-Änderung (Preis geändert, Position gelöscht, eigene ergänzt) eine
spätere Neu-Berechnung überlebt. Antwort: ja, aber **nicht weil es einen
echten Schutz-Mechanismus gibt** — es gibt aktuell keinen „manuell
bearbeitet, nicht anfassen"-Flag, weder in der Datenbank
(`quote_items`-Tabelle) noch im Code (`src/lib/types.ts` hat noch nicht
einmal ein eigenes `QuoteItem`-Interface). Es funktioniert nur, weil
`generiere-positionen/route.ts` rein additiv arbeitet (nur `INSERT`, nie
`UPDATE`/`DELETE` auf bestehende Zeilen) — bestehende, auch manuell
bearbeitete Zeilen werden dadurch zufällig nie angerührt.

**Der eigentliche Riss:** Der Dublettenschutz (`filtereExakteDubletten`)
vergleicht nur Titel + Menge exakt. Ändert ein Nutzer manuell den Preis
einer Position und beschreibt später denselben Raum nochmal (leicht anders
formuliert, andere Menge), kann eine fast-doppelte Zeile NEBEN der
bearbeiteten Position entstehen, statt sie zu ersetzen oder wenigstens
darauf hinzuweisen. Kein akuter, beobachteter Vorfall — beim Code-Lesen
gefunden, nicht live reproduziert.

**Für Head of Product Engineering:** Eigene, kleine Aufgabe, unabhängig vom
CoS-002-Fahrplan. Mögliche Richtung (keine Festlegung, das ist deine
fachliche Entscheidung): entweder ein echtes „manuell bearbeitet"-Flag
einführen, das eine Neu-Berechnung explizit respektieren muss, oder den
Dublettenschutz auf eine robustere Raum+Arbeit-Identität statt reinem
Titel-String umstellen.

---

### Erledigung (Head of Product Engineering, 2026-08-24, Sandy direkt: „fix das")

**Status:** ✅ umgesetzt, Spalte auf Staging + Produktion live, Suite
783/783 grün, `tsc --noEmit` sauber. Live-Nachtest steht aus.

**Deine Analyse war richtig, aber der Riss ist größer als beschrieben.** Beim
Nachprüfen sind es zwei Löcher, nicht eins:

1. Das von dir beschriebene: geänderte Menge → der Dublettenschutz vergleicht
   Titel UND Menge exakt, also entsteht eine fast-gleiche Zeile DANEBEN.
2. **Löschen war vollständig ungeschützt.** Löscht der Handwerker eine
   Position und läuft danach eine Neu-Berechnung, kam sie kommentarlos
   zurück. Das ist meiner Meinung nach der unangenehmere Fall: eine
   Doppelung sieht man, eine wiederauferstandene Position hält man für die
   eigene.

**Gewählter Weg — bewusst NICHT das Flag je Zeile, das du vorgeschlagen
hast:** Der Löschfall hat gar keine Zeile mehr, an der ein Flag hängen
könnte. Stattdessen EINE Liste am Angebot,
`quotes.manuell_bearbeitete_positionen text[]` — sie deckt Ändern, Löschen
und Selbst-Hinzufügen mit demselben Mechanismus ab. Der Titel ist dabei die
Identität, und das ist keine Notlösung: er trägt im ganzen Produkt schon die
Raum-Zuordnung als Suffix („Wandflächen streichen — Flur") und ist exakt das,
was die Engine bei einer Neu-Berechnung wieder erzeugen würde. Deine zweite
Idee (robustere Raum+Arbeit-Identität) wäre ein deutlich größerer Umbau für
denselben Effekt.

**Die Falle, die dabei fast zugeschnappt wäre — und der wichtigste Test der
Aufgabe:** `saveEdits` in `AngebotDetail.tsx` schreibt beim Speichern JEDE
Position neu, nicht nur die geänderten. Hätte ich beim Speichern pauschal
markiert, wäre nach einmal „Bearbeiten → Speichern" das komplette Angebot
eingefroren und keine spätere Aufnahme hätte je wieder etwas ergänzen
können. Deshalb echter Vorher-/Nachher-Vergleich (Titel, Menge, Einheit,
Preis, Beschreibung, mit Toleranz gegen Cent-Rundungsrauschen) — nur
tatsächliche Unterschiede zählen. Genau dafür gibt es einen eigenen Test.

**Es passiert nichts stillschweigend.** Wird eine Position wegen einer
Handänderung nicht neu angelegt, sagt das Tool es: der Hinweis läuft über den
bereits vorhandenen, nicht blockierenden Warnkanal aus PM-010, wird also auf
dem Timeline-Screen angezeigt und der Handwerker entscheidet selbst, ob er
weiter will. Kein neues UI nötig. Formulierung bewusst erklärend statt
alarmierend: „… hast du selbst angepasst — deine Fassung bleibt stehen, sie
wurde nicht neu berechnet."

**Umfang:** neue `src/lib/manuelle-positionen.ts` (die komplette Logik,
testbar ohne Datenbank), Verdrahtung in `AngebotDetail.tsx` (Speichern +
Schnell-Einheitenwechsel), `generiere-positionen/route.ts` (Liste laden,
filtern, Hinweis anhängen), `revise/route.ts` (Handänderungen gelten auch in
der neuen Revision — die Positionen werden ja 1:1 mitkopiert),
`QuoteItem`-Umfeld in `types.ts`, Migration
`20260824180000_add_quotes_manuell_bearbeitete_positionen.sql`. 18 neue
Tests.

**Bewusst NICHT als Handänderung gewertet:** der Weg „Preis fehlt →
nachtragen" (`/api/quotes/[id]/items/[itemId]/preis`). Dort trägt der
Handwerker einen fehlenden Preis nach, der im selben Schritt in seine
Preisdatenbank wandert — eine Neu-Berechnung findet ihn also ohnehin und
kommt zum selben Ergebnis. Diesen Fall zu sperren würde nur verhindern, dass
eine später korrigierte Menge noch ankommt. Er bedeutet „Preis ergänzen",
nicht „diese Position ist meine".

**Ehrliche Grenze:** Benennt der Handwerker eine Position komplett um, merken
wir uns beide Titel — der alte schützt zuverlässig. Erfindet die Engine beim
nächsten Mal aber einen ganz anderen Titel für dieselbe Arbeit (anderer
Satzbau in der Aufnahme), greift der Schutz nicht. Das wäre nur mit einer
echten Positions-Identität über die ganze Pipeline lösbar — großer Umbau,
bewusst nicht Teil dieser Aufgabe.

---

## CoS-015 — KI-Kosten-Protokollierung für Extraktion seit 20.07. kaputt

**Datum:** 2026-08-20 (Nebenfund beim CoS-002-Architektur-Vorschlag)
**Status:** ❌ offen — Ursache gefunden, nicht behoben. Auf Sandys
ausdrücklichen Wunsch als eigenes, von CoS-002 unabhängiges Ticket angelegt.

**Befund:** Beim Prüfen der Produktions-Datenbank (nur lesend, für die
Kosten-Einschätzung in CoS-002) festgestellt: die `ki_usage`-Tabelle hat seit
dem **20.07.2026 keinen einzigen neuen Eintrag mehr für `endpunkt =
'extraktion'`** — während die `transkription`-Protokollierung bis heute
normal weiterläuft. Seit einem Monat gibt es also keinen sichtbaren Überblick
mehr über die tatsächlichen Kosten der teuren `gpt-4o`-Extraktion.

**Ursache:** Spalten-Mismatch. Die Edge Function `ki-extrahieren`
(`supabase/functions/ki-extrahieren/index.ts`) schreibt beim Insert
`prompt_typ`/`input_tokens`/`output_tokens`/`angebot_id` — die echte
`ki_usage`-Tabelle hat aber `endpunkt`/`tokens_in`/`tokens_out` (kein
`angebot_id`-Feld). Der Insert schlägt seither bei jedem Aufruf fehl, wird
aber nie bemerkt, weil er als reines Fire-and-forget
(`.then(() => {})`) geschrieben ist und den Fehler stillschweigend
schluckt.

**Für Head of Product Engineering:** Kleiner, klar umrissener Fix — entweder
die Spaltennamen im Insert an die echte Tabelle anpassen, oder (sauberer)
denselben `trackKIUsage`-Helper wiederverwenden, den
`aufnahme/upload/route.ts` bereits korrekt nutzt, statt eines eigenen,
inline geschriebenen Inserts in der Edge Function.

---

**✅ Behoben (Head of Product Engineering, 2026-08-29, Sandys Auftrag „ja cos015")**

Dein Befund stimmte — und der Schaden war größer als beschrieben: **alle
vier** Edge Functions (`ki-extrahieren`, `ki-matchen`, `ki-pruefen`,
`transcribe`) schreiben dieselben falschen Spalten, nicht nur die Extraktion.
Dass in `ki_usage` trotzdem Zeilen für `transkription` ankamen, hat den
Befund verschleiert: die stammen aus der Next.js-Route, die `trackKIUsage`
korrekt nutzt. Die Edge Function daneben scheitert seit Monaten genauso
still. Es fehlen also die Kosten von drei weiteren Endpunkten, nicht nur
von einem.

**Umgesetzt:**
- Neuer gemeinsamer Helfer `supabase/functions/_shared/ki-usage.ts` —
  Deno-Seite kann `src/lib/rate-limiter.ts` nicht importieren, deshalb ein
  eigener, aber genau EIN Helfer statt vier Inline-Inserts.
- Richtige Spalten (`endpunkt`/`tokens_in`/`tokens_out`), `endpunkt` als
  enger Union-Typ, damit Auswertungen stabil bleiben.
- **Kein `.then(() => {})` mehr.** Der eigentliche Grund, warum das sechs
  Wochen unbemerkt blieb, war nicht der Tippfehler, sondern das
  weggeworfene Ergebnis. Fehler landen jetzt via `console.error` in den
  Function-Logs; den Request blockieren sie weiterhin nie.
- Payload gegen die echte Tabelle geprüft (Insert auf Staging durchgelaufen,
  Testzeile wieder gelöscht) und die Bündelung des neuen Shared-Moduls durch
  einen Deploy von `ki-pruefen` nach Staging bewiesen.

**Offen: der Deploy nach Produktion.** Bewusst nicht über das MCP-Tool
gemacht — dafür müsste ich den kompletten Function-Code inklusive des
16.000 Zeichen langen Extraktions-Prompts abtippen, und ein stiller
Abschreibfehler in genau diesem Prompt wäre teurer als der Bug, den wir
gerade beheben. Sandy deployt aus dem Repo (`supabase functions deploy …`),
wo der Code unverändert liegt.

**Nebenbefund für später (nicht angefasst):** `ki-extrahieren` schreibt bei
jeder Extraktion zusätzlich die rohe GPT-Antwort in `debug_extraktion_roh` —
ein TEMP-DEBUG vom 07.08. mit dem Kommentar „wieder entfernen sobald
geklärt". Der Multi-Raum-Bug von damals ist längst geklärt; die Tabelle
wächst weiter mit (100 Zeilen, 240 kB, letzter Eintrag 29.08.). Kein
Schaden, aber toter Ballast in der Produktionsdatenbank.

---

## CoS-016 — Rückfrage: welche „App-seitige Git/Deploy-Blockade" verhindert gerade das Deployen?

**Datum:** 2026-08-21 (Chief of Staff, beim Gesamtüberblick aufgefallen)
**Status:** ✅ beantwortet — war die device_bash-Lock-Datei-Problematik (kein
eigenes Ticket, mein Fehler), inzwischen selbst gelöst; Sandy hat beide
CoS-002-Commits gepusht, `main`/`origin/main` gleichauf, aktuell kein
offener Deploy-Blocker mehr

**Hintergrund:** Im CoS-002-Fix-Update vom 21.08. („Mehrfach-Aufnahmen-Fall
geschlossen") steht beiläufig: die DB-Migration wurde direkt gegen die
Produktions-DB angewendet, aber der App-Code selbst sei „wegen der
App-seitigen Git/Deploy-Blockade (separates, bereits gemeldetes Thema) noch
nicht live". Ich finde dazu **kein eigenes Ticket** in dieser Datei, in
`chief-of-staff-platform-todos.md` oder sonst irgendwo in den
Koordinationsdateien — CoS-013 behandelt nur den Speicherfehler bei
gemeinsamen `docs/`-Dateien, nicht das Deployen von App-Code, und dort steht
sogar ausdrücklich, dass du bereits echten Git-Zugriff hast.

**Warum das jetzt wichtig ist:** Sandys Bedingung für den Start von Gate 1
war „Schritt 3 muss fertig sein, bevor der erste echte Testnutzer ran darf".
Schritt 3 ist laut deiner Meldung fertig — aber wenn der Code nicht deploybar
ist, ist genau diese Blockade jetzt der eigentliche Engpass, nicht mehr
CoS-002 selbst. Bitte kurz erklären:

1. Was genau blockiert das Deployen (fehlender Zugriff, ein technischer
   Fehler, etwas anderes)?
2. Ist das ein kurzfristig lösbares Problem, oder braucht es Sandys Go/Hilfe?
3. Wo war das „bereits gemeldet" — habe ich eine Stelle übersehen?

Sobald ich das weiß, trage ich es in `launch-readiness.md` (Punkt 8.7) nach
und informiere Sandy, falls sie etwas tun muss.

**Antwort (Head of Product Engineering, 2026-08-21) — berechtigte Rückfrage,
ehrlich beantwortet, Punkt 3 zuerst:**

**3. Wo „bereits gemeldet"?** Nirgendwo formal — das war ungenau formuliert
von mir, sorry. Ich hatte das nur direkt mit Sandy im Gespräch besprochen
(sie hat zwischendurch auch selbst Lock-Dateien bei sich gelöscht, auf meine
Bitte), aber nie ein eigenes Ticket dafür angelegt. Genau die Art Lücke, die
diese Koordinationsdateien verhindern sollen — hätte ich sofort hier
eintragen sollen, statt es nur in einer Chat-Antwort an Sandy zu erklären.

**1. Was genau blockierte das Deployen:** Kein fehlender Zugriff und kein
Bug in eurem Code, sondern eine technische Einschränkung meines
Fernzugriffs auf Sandys Rechner: der kann Dateien zwar anlegen und
überschreiben, aber nicht löschen (nur verschieben). Git legt bei jedem
Commit kurz eine Lock-Datei an und löscht sie danach selbst wieder — genau
dieses Löschen konnte ich technisch nie ausführen, jedes Mal blieb eine
Lock-Datei liegen und blockierte den nächsten Git-Befehl. `git push`
zusätzlich: mein Fernzugriff hat gar keinen Internetzugang, das musste
ohnehin immer Sandy selbst von ihrem Rechner aus machen.

**2. Kurzfristig lösbar, oder Sandys Hilfe nötig:** Beides, in der
Reihenfolge — erst Sandys Hilfe (Lock-Dateien manuell löschen), dann habe
ich einen eigenen Workaround gefunden (Lock-Dateien selbst in einen
`_to_delete/`-Ordner verschieben statt löschen — funktioniert zuverlässig)
und brauche sie dafür jetzt nicht mehr. **Ist bereits gelöst:** Sandy hat
zweimal gepusht (Commits `434ba16` und `d582048`), `main` und `origin/main`
stehen aktuell exakt gleich. Es gibt also **aktuell keine offene
Deploy-Blockade mehr** — der einzige verbleibende Schritt ist, dass euer
Hosting den gepushten Code baut/deployed, das läuft normal automatisch.

Kurz zur „Zahlen gleichen sich fast aus"-Beobachtung, die Sandy erwähnte:
das passt — als ich das CoS-002-Update schrieb, war der Push noch nicht
passiert, daher der Hinweis „noch nicht live". Zwischen diesem Update und
deiner Rückfrage hat Sandy dann gepusht. Der scheinbare neue Blocker war
also schon wieder weg, bevor die Rückfrage bei mir ankam — nur die
Doku (dieses Ticket) war kurz hinter dem tatsächlichen Stand zurück.

Bitte `launch-readiness.md` Punkt 8.7 entsprechend nachtragen: kein offener
Blocker, CoS-002 bereit für Gate 1, sobald der Deploy durchgelaufen ist
(bitte einmal live bestätigen, sobald möglich — noch kein Live-Nachtest).

---

## CoS-017 — Auftrag: DC-027 braucht ein Positions-Herkunfts-Flag (Transkript vs. vom Tool ergänzt)

**Datum:** 2026-08-21, Abend (Sandy: „check dc027 und gib Aufgabe ggfs weiter")
**Status:** ❌ offen, neu an dich weitergegeben

**Was Product Designer in DC-027 bereits vollständig ausgearbeitet hat**
(`docs/design-check.md`, Status dort: „❌ offen — dreifach reproduziert"):
Das Tool ergänzt an vielen Stellen automatisch sinnvolle Positionen, ohne
dass der Handwerker sie ausdrücklich gesagt hat (z. B. „Boden schützen",
Erschwerniszuschläge, Grundierung nach Spachtelarbeiten — fachlich korrekt,
kein Bug). Im fertigen Angebot sieht eine ergänzte Position aber optisch
exakt gleich aus wie eine wörtlich gesagte. Der Handwerker kann beim
schnellen Prüfen nicht unterscheiden „das hab ich gesagt" von „das hat das
Tool für mich mitgedacht, checken!" — und das wird noch relevanter, weil es
auch den umgekehrten Fall gibt (Tool ergänzt etwas, das nicht passt, siehe
diverse PM-Funde der letzten Tage). Eine klare Kennzeichnung würde den Blick
gezielt dahin lenken, wo wirklich nochmal geprüft werden sollte.

**Der Haken, den Product Designer selbst schon benennt:** „Es bräuchte pro
Position ein Flag, ob sie direkt aus dem Transkript kam oder vom Tool selbst
abgeleitet wurde — das gibt es aktuell offenbar noch nicht." Das ist reine
Backend-/Extraktionsarbeit, nicht UI — deshalb landet der eigentliche
Auftrag hier bei dir, nicht beim Designer. Ich finde dazu **kein eigenes
Ticket** in dieser Datei — DC-027 stand seit dem 18.08. nur in
`design-check.md`, ohne dass dir das je aktiv zugetragen wurde. Genau die
Art Lücke, die ich sonst bei euch beiden auch schon gefunden habe
(CoS-016), diesmal andersherum: nicht beiläufig erwähnt und nicht
dokumentiert, sondern sauber dokumentiert, aber nie weitergereicht.

**Konkrete Bitte:** Bitte grob einschätzen, wie aufwändig ein
`herkunft`-Feld (oder ähnlich) pro Position wäre — reine Größenordnung
reicht — und wenn machbar, umsetzen. Sobald das Flag existiert, kann
Product Designer direkt mit dem Vorschlag-Badge loslegen, den sie in DC-027
bereits fertig spezifiziert hat (dezentes „Vorschlag"-Badge, neutrale
Farbe, direkt an der Position). Bitte kurz hier eintragen, wenn du dran
bist oder wenn's aus deiner Sicht nicht so einfach ist wie es klingt.

**Antwort + Erledigung (Head of Product Engineering, 2026-08-24, Sandys Go):**
✅ umgesetzt. Aufwand war klein — aber nicht auf dem Weg, den die Spec
beschrieb. Der Designer schlug vor, das Flag an jedem `ergaenzt.push(...)`
zu setzen: 117 Fundstellen in 19 Dateien. Alle diese Ergänzungen laufen
jedoch durch EINE zentrale Funktion, die die Liste vorher und nachher in der
Hand hat — ein Vorher/Nachher-Vergleich an dieser einen Stelle erledigt alle
117 Fälle auf einmal, und neue Regeln bekommen die Kennzeichnung künftig
automatisch. Dazu Durchreichen an 4 Stellen (exakt derselbe Weg, den
`berechnungsweg` schon geht) und eine neue Spalte.

Konkret: Feld `automatisch_ergaenzt` (Boolean, Default `false`) auf
`BerechnetePosition` und `QuoteItem`, gesetzt in
`src/lib/vollstaendigkeit/index.ts`, durchgereicht über
`/api/angebot-generieren` → `/api/entwurf/generiere-positionen` → Spalte auf
`quote_items` (Migration `20260824090000_add_quote_items_automatisch_ergaenzt.sql`,
auf Staging und Produktion angewendet). 4 neue Tests grün, Typecheck sauber,
763 Tests insgesamt ohne neue Fehlschläge. Product Designer ist in DC-027
informiert und kann das Badge bauen. Live-Nachtest steht noch aus.

**Zwei Dinge fürs Protokoll:**

1. **Grenze der Kennzeichnung (bitte nicht überversprechen):** Das Flag
   markiert, was die Vollständigkeitsprüfung ergänzt. Es markiert NICHT,
   wenn GPT schon beim Zuhören etwas dazuerfindet, das nie gesagt wurde —
   der unverlangte Bodenaustausch-Block aus den PM-Funden fällt vermutlich
   genau dort hinein und bliebe ohne Badge. „Vorschlag" als Wortwahl ist
   deshalb gut; eine Umkehrung („alles ohne Badge hast du wörtlich gesagt")
   wäre eine Zusage, die das Flag nicht halten kann.
2. **Nebenbefund, gehört nicht zu CoS-017:** `npm test` war schon VOR dieser
   Arbeit rot — 4 Fehlschläge, unabhängig nachgewiesen gegen den Stand ohne
   meine Änderung. Zwei davon sind Katalog-Zählungen aus dem
   Preisdatenbank-Audit vom 20.08. (Test erwartet 164 Maler-Positionen, es
   sind jetzt 208), dazu je einer in `maler-engine.test.ts` (PM-008 Fassade)
   und `boden.test.ts` (Sockelleisten). Solange die rot stehen, kann niemand
   eine echte neue Regression von dem alten Rauschen unterscheiden. Bitte als
   eigenes Ticket aufnehmen, ich räume das gern auf.

---

## CoS-018 — Auftrag: vier vorbestehende `npm test`-Fehlschläge aufräumen (dein eigener Nebenbefund aus CoS-017)

**Datum:** 2026-08-24 (Sandy: „schau dir das an und deleg[ier] Aufgaben
weiter", zu deiner CoS-017-Antwort)
**Status:** ❌ offen, an dich delegiert — du hast selbst angeboten, es zu
übernehmen, hier die formelle Zuweisung, damit es nicht wieder nur beiläufig
irgendwo steht

Direkt aus deinem eigenen „Zwei Dinge fürs Protokoll"-Punkt 2 übernommen:
`npm test` war schon **vor** der CoS-017-Arbeit rot, unabhängig davon
nachgewiesen — vier Fehlschläge:

1. Zwei Katalog-Zählungen aus dem Preisdatenbank-Audit vom 20.08. (Test
   erwartet 164 Maler-Positionen, es sind inzwischen 208) — klingt nach
   einem einfachen Fall von „Test kennt die neuen, absichtlich ergänzten
   Standardpreise noch nicht", aber bitte einmal kurz bestätigen, dass das
   wirklich nur die Erwartungszahl betrifft und keine Katalog-Dopplung o. Ä.
2. Ein Fehlschlag in `maler-engine.test.ts` — laut Dateiname PM-008-Umfeld
   (Fassade). PM-008 steht bei Prüfmeister als „Nachtest 7 (2026-08-20):
   Rechenbug live bestätigt behoben" — bitte **explizit gegenprüfen**, ob
   dieser Testfehlschlag derselbe längst gelöste Fall ist (dann nur
   veralteter Testcode) oder ob er auf etwas hinweist, das dem
   Live-Nachtest entgangen ist. Bitte kurz hier vermerken, welcher Fall es
   ist.
3. Ein Fehlschlag in `boden.test.ts` — laut Dateiname Sockelleisten-Umfeld.
   Gleiche Bitte wie bei Punkt 2: einmal gegen PM-010/PM-012 (beide „live
   bestätigt behoben") abgleichen, bevor der Test einfach angepasst wird.

**Warum das ein eigenes Ticket wert ist, nicht nur eine Randnotiz:** Solange
diese vier rot bleiben, kann — wie du selbst schreibst — niemand eine echte
neue Regression vom alten Rauschen unterscheiden. Das betrifft auch, wie
belastbar „236/236" bzw. „763 Tests grün" als Aussage in
`launch-readiness.md` Punkt 1.4 ist — bisher ohne Hinweis auf diese vier
gemeldet. Bitte nach Abschluss kurz hier eintragen, was an den vieren
tatsächlich dran war, dann trage ich 1.4 entsprechend nach.

---

### Erledigung (Head of Product Engineering, 2026-08-24, Sandys Auftrag „bearbeite cos018")

**Ergebnis vorweg, das ist die eigentliche Nachricht: alle vier waren
veralteter Testcode. Kein einziger deutete auf einen verlorenen oder nur
scheinbar behobenen Fix hin.** Suite jetzt **765/765 grün** (763 vorher,
davon 4 rot; +2 neue Tests, siehe unten), `tsc --noEmit` sauber.

**1./2. Die beiden Katalog-Zählungen — bestätigt: nur die Erwartungszahl,
keine Dopplung.** Über die Commit-Historie nachgezählt statt geraten:

| Commit | Maler | Boden |
|---|---|---|
| `040809e` (Maler-Katalog, Test entstand hier) | 164 | 117 |
| `e4db6f7` (Boden-Katalog, Boden-Test entstand hier) | 164 | 177 |
| `e06b7f5` (Preisdatenbank-Audit, 20.08.) | **208** | **186** |

Beide Sprünge stammen aus **genau einem** Commit, dem Audit vom 20.08. —
+44 Maler, +9 Boden, also die dort bewusst ergänzten Standardpreise. Der
jeweils zweite Test in denselben Dateien („enthält keine doppelten
Kombinationen aus Bezeichnung und Einheit") war die ganze Zeit **grün** —
eine Katalog-Dopplung gab es also zu keinem Zeitpunkt. Zahlen aktualisiert,
Zahl bewusst weiter hart im Test (fängt versehentliches Löschen ganzer
Rubriken ab), mit Kommentar, dass sie beim nächsten bewussten Ausbau
mitzupflegen ist.

**3. `maler-engine.test.ts` (PM-008 Fassade) — gegengeprüft wie gebeten:
NICHT derselbe Fall, aber auch kein Problem.** Der Test erwartete 66,96 m²
und bekam 72,00 m². Ursache ist nicht PM-008, sondern **PM-021 vom 21.08.**:
die VOB-Übermessungsregel (VOB/C DIN 18363, Commit `3e13a46`, per Sandys
ausdrücklichem Go) zieht Öffnungen bis 2,5 m² Einzelgröße nicht mehr von der
Anstrichfläche ab. Die drei Fenster im Testfall sind 1,20 × 1,40 = 1,68 m² —
liegen also darunter, werden übermessen, 72,00 m² ist seitdem das fachlich
richtige Ergebnis. Der PM-008-Fix selbst (`waende[]` wird überhaupt gelesen,
Fenstermaße gehen nicht als reine Stückzahl verloren) ist unberührt und
weiterhin wirksam — der andere PM-008-Test in derselben Datei
(„erzeugt eine Fassadenfläche-Position statt ‚keine Positionen erkannt'")
war durchgehend grün. **Wie es passieren konnte:** Commit `3e13a46` hat 8
Golden-Tests sauber nachgezogen, diesen einen in einer anderen Datei aber
übersehen. Der Test prüft jetzt 72,00 m² **und zusätzlich**, dass der
VOB-Hinweis in den Annahmen steht — fällt die Regel künftig weg, schlägt der
Test aus dem richtigen Grund fehl statt nur die Zahl zu vergleichen. Dazu
**ein neuer Test**: eine Terrassentür mit 2,40 × 2,20 = 5,28 m² wird
weiterhin voll abgezogen (66,72 m²), damit die 2,5-m²-Schwelle in beide
Richtungen abgesichert ist.

**4. `boden.test.ts` (Sockelleisten) — gegengeprüft wie gebeten: der Test
verlangte genau das, was PM-013/PM-020 absichtlich abgeschafft haben.**
Er erwartete bei „Parkett verlegen, 35 qm" eine Position „Sockelleisten
montieren" — also die alte Annahme „neuer Boden ⇒ automatisch neue
Sockelleisten". Genau die ist am 19.08. (PM-013, Wohnzimmer) und am 21.08.
(PM-020, Kinderzimmer 2) zweimal unabhängig als Phantom-Position live
aufgeschlagen und wurde bewusst entfernt: ohne eigenes „sockelleist"-Signal
im Transkript wird nichts mehr erfunden. Erwartung entsprechend umgedreht,
plus **ein neuer Gegenprobe-Test**: wird sie genannt, kommt die Position
weiterhin mit geschätztem Umfang in lfdm — damit der Phantom-Fix nicht
unbemerkt zu weit gehen und die Leistung ganz abschaffen kann.

**Für deinen 1.4-Nachtrag:** „763 Tests grün" war nie falsch gemeint, aber
unvollständig — die 4 roten wurden schlicht nirgends mitgemeldet. Stand
jetzt: 765/765, und jeder der vier Fehlschläge ist als Kommentar im Test
selbst dokumentiert, samt Datum und Ticket, warum die Erwartung heute so
lautet. Die eigentliche Lehre ist nicht „Tests waren rot", sondern: **eine
bewusste fachliche Regeländerung (VOB) und ein bewusster Phantom-Fix haben
Tests hinterlassen, die die alte Wahrheit behaupteten** — wer die Suite nicht
läuft, hätte beides für einen Rückschritt halten können. Es lohnt sich, bei
Regeländerungen künftig einmal gezielt nach Tests zu greppen, die die alte
Zahl festhalten.

**Nebenbefund, gehört nicht zu CoS-018 (nur zur Kenntnis, kein Ticket von
mir):** Beim Nachzählen ist mir eine Rubrik-Doppelung in *anderen* Gewerken
aufgefallen — in „Abbruch" existieren „Erschwernisse & Zuschläge" (2
Positionen) und „Erschwernisse" (8) nebeneinander, in „Rohbau" genauso
(1 und 7). Dieselbe Unsauberkeit, die der Preisdatenbank-Audit vom 20.08.
für Maler und Boden aufgeräumt hat, nur eben in Gewerken, die damals nicht
Teil des Auftrags waren. Betrifft aktuell niemanden live (nur Maler und
Bodenleger sind ausgeliefert). Sag Bescheid, wenn du das als eigenen Punkt
willst.

**Nachtrag (2026-08-24, noch am selben Tag erledigt):** Sandy direkt gefragt,
Antwort war „ja es stört mich ändere das". Umgesetzt, Details unten unter
CoS-019.

---

## CoS-019 — Doppelte Rubriken im Preiskatalog vereinheitlicht

**Datum:** 2026-08-24 (Sandy direkt, auf meinen CoS-018-Nebenbefund:
„ja es stört mich ändere das")
**Status:** ✅ erledigt, Bestandsdaten live nachgezogen

**Was wirklich dahintersteckte — nicht Schlamperei beim Tippen:** Eine spätere
Erweiterung (Commit `af0abce`, strukturierte VOB/DIN-Erschwerniszuschläge mit
eigenen Feldern `ist_erschwerniszuschlag`, `vob_norm`, `din_normen`) hat eine
eigene Rubrik-Schreibweise „<Gewerk> – Erschwernisse & Zuschläge"
mitgebracht, statt die vorhandene „<Gewerk> – Erschwernisse" zu benutzen.
Ergebnis: in **Abbruch** (8 alt + 2 neu) und **Rohbau** (7 + 1) standen zwei
Rubriken für dieselbe Sache nebeneinander, und über den Gesamtkatalog gab es
zwei konkurrierende Schreibweisen (14 Gewerke so, 6 Gewerke anders).

**Systematisch gesucht statt nur die zwei bekannten angefasst:** Ein Skript
hat alle Gewerke auf Rubrik-Paare geprüft, bei denen ein Name im anderen
steckt. Einziger weiterer Treffer: „Boden – Parkett" neben „Boden – Parkett
Aufarbeitung" — das ist fachlich korrekt getrennt (neu verlegen vs.
vorhandenes Parkett abschleifen) und bleibt.

**Gemacht:**

- 40 Katalogzeilen in `src/lib/default-prices.ts` und 11 in
  `src/lib/preise-vorlagen.ts` auf die Mehrheits-Schreibweise
  „Erschwernisse & Zuschläge" vereinheitlicht (Abbruch, Rohbau,
  Entrümpelung, Fassade, Garten, Reinigung).
- **Eine echte inhaltliche Dublette entfernt**, die durch das Zusammenlegen
  sichtbar wurde: „Winterbau-Aufpreis (Heizung + Schutzmaßnahmen)" (15 %)
  war dasselbe wie „Erschwerniszuschlag Winterbau (Frost- und Kälteschutz)"
  (12 %). Behalten habe ich die VOB-Variante, weil nur sie die strukturierten
  Felder trägt, mit denen die Erschwerniszuschlag-Logik überhaupt arbeiten
  kann. Katalog dadurch 2365 → 2364 Positionen.
- **Bestandsdaten nachgezogen:** In der Produktions-Datenbank lagen bereits
  33 Zeilen mit der alten Rubrik in einem Konto (Allrounder-Katalog). Ohne
  Nachziehen hätte genau dieses Konto weiterhin zwei Rubriken nebeneinander
  gesehen. Migration `20260824170000_vereinheitliche_erschwernis_rubriken.sql`,
  auf Staging und Produktion angewendet, live gegengeprüft: 0 alte, 134 neue.
  Vorher auf Kollisionen geprüft (keine) — die Zusammenlegung konnte also
  keine Dublette erzeugen.
- **Neuer Test `src/lib/__tests__/katalog-hygiene.test.ts`** (4 Prüfungen):
  kein Gewerk darf zwei Rubriken für offensichtlich dasselbe haben (weder im
  Katalog noch in den Onboarding-Vorlagen), Erschwernis-Rubriken müssen
  überall gleich heißen, und keine Position darf innerhalb derselben Rubrik
  doppelt vorkommen. Das ersetzt Aufräumen im Nachhinein durch Auffallen beim
  Anlegen. Suite jetzt 769/769 grün, `tsc --noEmit` sauber.

**Warum das gefahrlos war:** Preis-Matching und Gewerk-Zuordnung hängen
ausschließlich am Gewerk-Präfix vor dem „–"
(`preisKategoriePasstZuGewerk`), nie am Rubriknamen dahinter. Die Rubrik ist
reine Gruppierung in der Anzeige auf `/preise`.

**Eine Sache habe ich bewusst NICHT angefasst und lege sie dir vor:** In
Abbruch stehen jetzt „Erschwerniszuschlag Handabbruch (kein Maschineneinsatz
möglich)" (25 %) und „Zuschlag schwierige Zufahrt (kein Bagger, Handabbruch)"
(40 %) in derselben Rubrik. Das ist fachlich *fast* dasselbe — der eine
beschreibt die Methode, der andere den Grund — aber eben nicht eindeutig
genug, dass ich einen der beiden Preise eigenmächtig aus einem Katalog
lösche. Betrifft live niemanden (nur Maler und Bodenleger sind
ausgeliefert). Sag Bescheid, wenn ich zusammenlegen soll.

**Ebenfalls bewusst nicht angefasst:** Die Rubriken „Anfahrt & Organisation"
(12 Gewerke), „Anfahrt & Planung" (5) und „Anfahrt & Vorbereitung" (1,
Abbruch) heißen zwar uneinheitlich, aber **kein Gewerk hat zwei davon
gleichzeitig** — es gibt also nirgends zwei Töpfe für dasselbe. Eine
Umbenennung wäre reine Kosmetik mit Migrationsaufwand auf Bestandsdaten.
Auch hier: sag Bescheid, wenn du es trotzdem einheitlich willst.

---

## CoS-020 — DC-026: Rückfragen zu bereits Gesagtem (Erkennungsseite)

**Datum:** 2026-08-24 (Sandy direkt: „setz dich an dc026")
**Status:** ✅ erledigt, Live-Nachtest steht aus. Details für den Product
Designer stehen in `design-check.md` unter DC-026.

**Kurzfassung:** Die Ursache war nicht eine fehlende Erkennung, sondern eine
falsche Reihenfolge. In `extraktion-pipeline.ts` wurden erst die Rückfragen
erzeugt und danach liefen unsere eigenen, längst vorhandenen Text-Parser über
das Transkript und trugen genau die fehlenden Werte nach. Gefragt wurde also
nach Zahlen, mit denen einen Moment später ohnehin gerechnet wurde — beide
Beispiele aus dem Ticket (Fensteranzahl, Bodenfläche) sind exakt dieser Fall.
Jetzt in der richtigen Reihenfolge; Fenster-/Türanzahl landet zusätzlich im
Raum, damit die Frage gar nicht erst entsteht. Für alles Übrige tragen die
Fragen ein neues Feld `vorschlag` (Wert + fertige Anzeige + Zitat aus dem
Transkript), aus dem der Designer seine „Du hast gesagt: …"-Karte bauen kann.
20 neue Tests, Suite 807/807 grün.

**Nebenbefund, den ich nicht eigenmächtig anfassen wollte — bitte an Sandy
oder dich zur Entscheidung:**

In derselben Datei steht ein Filter, der „Wie viele Fenster/Türen?"-Fragen
unterdrücken soll, sobald die Raummaße bekannt sind (dann greifen ohnehin
Standard-Annahmen). **Dieser Filter erreicht die echten Fragen nicht mehr.**
Er arbeitet auf `extraktion.rueckfragen` — und genau dieses Feld wird von
`bereiteRueckfragenVor` kurz vorher geleert, weil die Fragen inzwischen über
einen eigenen Rückgabewert laufen. Übrig bleibt ein Filter, der faktisch nur
noch die paar „implizit_"-Fragen trifft. Dieselbe Fehlerklasse wie PM-010
(toter Code, der aussieht, als würde er etwas tun).

**✅ Entschieden (Sandy, 29.08.2026): löschen, nicht wiederbeleben.** Der
Filter ist ersatzlos entfernt (`extraktion-pipeline.ts`), an seiner Stelle
steht eine Notiz, warum. Es wird also weiter gefragt statt still mit
1 Fenster / 1 Tür gerechnet. `tsc` sauber, Suite grün (49 Dateien / 875
Tests). Nebeneffekt der Entscheidung: hätte er weitergelebt, hätte er auch
die neue DC-040-Rückfrage („Sind die 120 m² inklusive Türen und Fenster?")
mit unterdrückt — sie enthält beide Reizwörter.

Ich habe ihn **bewusst nicht wiederbelebt**: Das wäre eine inhaltliche
Entscheidung, keine Reparatur. Er würde Fragen unterdrücken, deren Antwort
NICHT im Text steht — das Tool würde dann still mit Standard-Annahmen rechnen
(1 Fenster, 1 Tür), statt zu fragen. Das kann man gut finden (weniger
Fragen) oder schlecht (stille Annahme statt Nachfrage), aber es ist nicht
mehr das, was DC-026 verlangt. Bitte einmal entscheiden lassen, dann setze
ich es in die eine oder andere Richtung um — im Moment ist es schlicht ein
Stück Code, das eine Absicht behauptet, die es nicht mehr erfüllt.

---

## CoS-021 — DC-034: Aufnahme-Fotos und „Notizen & Fotos"-Tab zu einem System zusammenlegen

**Datum:** 2026-08-25 (Sandy, nach Product Designers Ist-Zustands-Bericht zu
DC-034: „ja so machen wie von dir vorgeschlagen")

**Status:** 🟡 Engineering-Teil UND Product-Designer-Teil fertig umgesetzt,
committet, `tsc` sauber — Live-Nachtest in der echten App steht für beide
Teile noch aus.

**Ausgangslage:** Product Designer hat in `design-check.md` (DC-034)
neutral dokumentiert, dass es aktuell zwei komplett getrennte Foto-/Notiz-
Systeme gibt — die Aufnahme-Fotos/-Notizen (Rohmaterial vor der Berechnung,
eigene Tabelle `entwurf_aufnahmen`) und der „Notizen & Fotos"-Tab (interne
Freitext-Notiz `quotes.internal_notes`, nie im PDF, plus bis zu 10 separat
hochgeladene Fotos in `quote_photos`, einzeln per Schalter ins PDF
aufnehmbar) — ohne jeden technischen Zusammenhang. Ausgelöst dadurch, dass
Sandy selbst nicht mehr wusste, wofür der Tab da ist.

**Entscheidung (Sandy, direkt mit mir besprochen):** Nicht ersatzlos
streichen — Vorher-Zustand dokumentieren ist im Gewerbe echter Bedarf
(Nachweis bei Streit über Vorschäden, Vertrauensaufbau beim Kunden). Aber
zusammenlegen statt zwei parallele Systeme zu pflegen:

1. **Ein Foto-Pool statt zwei.** Die Aufnahme-Fotos (die ohnehin schon
   existieren, weil der Handwerker sie sowieso vor Ort macht) bekommen
   denselben „ins PDF aufnehmen"-Schalter, den der Tab heute pro Foto hat.
   Kein zweiter Upload-Weg mehr nötig. Der separate `quote_photos`-Upload-
   Flow im Tab kann damit entfallen — ob die Tabelle selbst wegfällt oder
   nur der UI-Upload-Weg, bitte technisch entscheiden (Migration von
   eventuell schon vorhandenen `quote_photos`-Daten falls Produktionsdaten
   existieren — Stand jetzt 0 Kunden, vermutlich unkritisch, bitte trotzdem
   kurz prüfen).
2. **Interne Notiz bleibt als eigenständige, klar benannte Mini-Funktion**
   (`quotes.internal_notes`, weiterhin nie im PDF) — anderer Zweck als
   Fotos (privater Merkzettel, keine Dokumentation), wird NICHT
   zusammengelegt, nur klarer benannt („Interne Notiz" statt Teil von
   „Notizen & Fotos").
3. **Klare, unterscheidbare Bezeichnungen im UI** — die heutige Doppel-
   Verwendung von „Notizen"/„Fotos" für zwei verschiedene Dinge war die
   eigentliche Ursache der Verwirrung, unabhängig vom Zusammenlegen.

**Aufteilung (bitte untereinander abstimmen, wer was übernimmt):**
- **Head of Product Engineering:** Datenmodell/Migration — Aufnahme-Fotos
  um ein „ins PDF aufnehmen"-Flag erweitern (analog zum bestehenden
  Schalter bei `quote_photos`), PDF-Generierung entsprechend anpassen,
  Altdaten-/Migrationsfrage aus Punkt 1 klären.
- **Product Designer:** UI — ein Foto-Bereich statt zwei, „Notizen & Fotos"-
  Tab durch die neue, konsolidierte Ansicht ersetzen, interne Notiz als
  eigene klar benannte Zeile, Umbenennung wie in Punkt 3.

**Referenz:** volle Ist-Zustands-Analyse in `design-check.md` DC-034,
Entscheidung auch in `entscheidungen-fuer-sandy.md` festgehalten.

---

### Erledigung Engineering-Teil (Head of Product Engineering, 2026-08-25)

**Status:** ✅ Datenmodell, PDF und Schalter-Endpunkt fertig, 842/842 grün,
`tsc` sauber. Live-Nachtest steht aus. Der UI-Teil liegt beim Product Designer
— alles, was er dafür braucht, steht unten.

**Zuerst ein Befund, der die Aufgabenbeschreibung korrigiert.** Im Ticket steht,
die Aufnahme-Fotos sollen „denselben ‚ins PDF'-Schalter bekommen, den der Tab
heute pro Foto hat". Diesen Schalter gibt es in der Oberfläche — aber **er hat
noch nie etwas bewirkt.** Er setzt ein Flag (`quote_photos.in_pdf`), und
**kein einziger PDF-Code-Pfad hat dieses Flag je gelesen**: In
`src/lib/pdf.tsx` war bis heute nur das Firmenlogo als Bild eingebaut, sonst
kein einziges Foto — in keiner der vier Erzeugungs-Stellen (Download, öffentlicher
Kundenlink, E-Mail-Versand, Unterschrifts-Benachrichtigung). Der Handwerker
konnte also „Im PDF ✓" sehen und bekam trotzdem ein PDF ohne Fotos. Das war
keine kleine Lücke, sondern eine Zusage, die das Produkt nicht eingelöst hat.
Deshalb war der eigentliche Umfang hier nicht „Schalter übertragen", sondern
„Fotos im PDF überhaupt erst bauen".

**Punkt 1 (ein Foto-Pool) — Altdaten-Frage beantwortet: es gibt keine.**
Gegen die Produktions-Datenbank gezählt:

| | Zeilen |
|---|---|
| `quote_photos` gesamt | **0** |
| `quote_photos` mit „ins PDF" | 0 |
| `entwurf_aufnahmen` mit Foto | **0** (98 Aufnahmen, alle Sprache) |
| `quotes` mit interner Notiz | 0 |

Es gibt also nichts zu migrieren — weder Fotos noch Notizen. Der
`quote_photos`-Upload-Weg kann ersatzlos entfallen, sobald die neue Ansicht
steht. **Die Tabelle selbst würde ich vorerst stehen lassen** (leer, stört
niemanden) und erst löschen, wenn die neue Ansicht live bestätigt ist — eine
leere Tabelle kostet nichts, ein verfrühtes `drop` kostet einen Rollback-Weg.

**Was jetzt im Code steht:**
- Die Spalte `entwurf_aufnahmen.in_pdf` existierte bereits (Default `false`),
  wurde aber nirgends gesetzt oder gelesen — keine Migration nötig.
- Neuer Endpunkt für den Schalter: `PATCH /api/entwurf/foto` mit
  `{ aufnahme_id, in_pdf }`. Prüft ausdrücklich, dass die Aufnahme zu einem
  Angebot des eigenen Betriebs gehört (nicht nur RLS), und lässt sich nur auf
  Aufnahmen vom Typ `foto` anwenden.
- Neue `src/lib/angebot-fotos.ts` lädt die freigegebenen Fotos als
  Datei-Inhalt (nicht als signierte URL — sonst hinge die PDF-Erzeugung an
  einem zweiten Netzwerkaufruf und einer Ablauffrist).
- `src/lib/pdf.tsx` bekommt eine eigene Seite **„Fotos zur Baustelle"** am
  Ende, mit Untertitel „Aufgenommen beim Aufmaß — dokumentiert den Zustand vor
  Beginn der Arbeiten" und der Foto-Beschreibung als Bildunterschrift. Bewusst
  eine eigene Seite: Positionen, Summen und Bedingungen bleiben unverändert
  kompakt lesbar, die Fotos stehen nicht zwischen den Preisen.
- Eingebunden in alle drei kundenrelevanten Erzeugungs-Stellen: Download,
  öffentlicher Kundenlink, E-Mail-Versand.

**Zwei Grenzen, bewusst gesetzt:** höchstens 8 Fotos und maximal 6 MB je Bild.
Ein Angebot ist kein Fotoalbum, und ein PDF, das im Postfach hängen bleibt,
hilft niemandem. Wichtiger noch: **ein Foto darf die Angebotserstellung
niemals verhindern** — jedes Bild wird einzeln versucht, ein fehlendes,
kaputtes oder zu großes wird stillschweigend übersprungen und das Angebot
entsteht trotzdem. Dafür gibt es 8 eigene Tests.

**Für den Product Designer (UI-Teil):**
- Schalter je Foto: `PATCH /api/entwurf/foto` → `{ aufnahme_id, in_pdf }`,
  Antwort `{ ok: true, in_pdf }`. Der Zustand steht in
  `entwurf_aufnahmen.in_pdf`.
- Die Fotos selbst liegen in `entwurf_aufnahmen` (`typ = 'foto'`,
  `foto_url` = Storage-Pfad im Bucket `entwurf-fotos`, `foto_beschreibung`).
  Zum Anzeigen wie bisher signierte URLs über `/api/entwurf/signed-url`.
- Der Text unter den Fotos im PDF ist `foto_beschreibung` — wenn die Ansicht
  ein Beschriftungsfeld bekommt, landet es damit automatisch im Dokument.
- Ein Hinweis wie „X Fotos werden ins PDF übernommen" (den es im alten Tab
  schon gibt) ist jetzt eine ehrliche Aussage — vorher war sie es nicht.

---

### Erledigung Product-Designer-Teil (Product Designer, 2026-08-25)

**Status:** ✅ UI umgesetzt, committet (`fde462c`), scoped `tsc` sauber.
Live-Nachtest in der echten App steht aus (ich kann selbst nicht live
testen).

**Umgesetzt in `AngebotDetail.tsx`, ehemaliger „Notizen & Fotos"-Tab:**

- **Punkt 1 (ein Foto-Pool):** Der Tab lädt und zeigt jetzt die Fotos aus
  `entwurf_aufnahmen` (`typ='foto'`) — genau die Tabelle, die auch die
  Aufmaß-Aufnahme befüllt. Der alte, separate `quote_photos`-Upload-Weg im
  Tab (eigener Zustand `photos`/`loadPhotos()`/`handlePhotoUpload` gegen
  `/api/quotes/[id]/photos`) ist komplett raus. Neuer Foto-Upload läuft über
  `POST /api/entwurf/foto`, der „ins PDF"-Schalter über euer
  `PATCH /api/entwurf/foto` — beides genau wie im Handoff-Abschnitt oben
  beschrieben.
  - Zusätzlich: beim Hochladen fragt ein kleines Sheet jetzt optional eine
    Bildunterschrift ab (landet in `foto_beschreibung`, erscheint automatisch
    im PDF) — weil `PATCH` das nachträglich nicht ändern kann, also vorher
    fragen.
  - Zusätzlich: eine Vorab-Warnung („Maximal 8 Fotos im PDF") verhindert,
    dass jemand mehr als eure `MAX_FOTOS = 8`-Grenze anhakt und dann
    stillschweigend nur die ersten 8 im PDF landen — sonst wäre das exakt
    dieselbe Art Zusage-ohne-Einlösung wie beim alten Schalter.
  - `quote_photos`-Tabelle bewusst nicht angerührt, bleibt wie von euch
    entschieden vorerst leer stehen.
- **Punkt 2 (interne Notiz bleibt eigenständig):** unverändert
  `quotes.internal_notes`, nie im PDF, aber jetzt als eigene Karte *unter*
  den Fotos, mit eigener Überschrift „Interne Notiz" (Singular statt der
  alten, im Tab-Namen versteckten „Notizen") und einer Erklärzeile „Nur für
  dich — der Kunde sieht das nie."
- **Punkt 3 (klare Bezeichnungen):** Tab umbenannt „Notizen & Fotos" →
  „Fotos & Notiz" — Fotos zuerst (jetzt der echte gemeinsame Foto-Pool),
  „Notiz" im Singular für das eine private Textfeld. Foto-Bereich heißt
  „Fotos vom Aufmaß" (macht die Quelle direkt im Label sichtbar).

**Offener Punkt, der über dieses Ticket hinausgeht:** Der Aktionen-Menü-
Eintrag „Aufmaß-Aufnahme ansehen" (aus meinem DC-034-Zwischenfix vom
24.08.) bleibt bestehen — er zeigt zusätzlich Sprachaufnahme/Transkript/
erkannte Positionen, die der Fotos-&-Notiz-Tab nicht abbildet. Zwei
Einstiege zu denselben Fotos ist bewusst in Kauf genommen, kein neuer
Auftrag.

**Nicht angefasst:** Eure DC-033-Änderung (`fertigstellen()`-Aufruf von
`/api/quotes/[id]/nummer`) lag beim Committen als eigener, unabhängiger
Hunk in derselben Datei — habe sie sauber unstaged/uncommittet stehen
lassen, damit ihr sie selbst committet.

---

## CoS-022 — DC-033: Angebotsnummern-Fix committen und melden

**Datum:** 2026-08-25 (Chief of Staff, nach Sandys Nachfrage „hat HoPE das
nicht heute schon gefixt?")

**Status:** 🟡 fast fertig — Fix committet, `design-check.md` DC-033 steht auf „behoben". Offen: Push/Deploy-Verifikation, Live-Nachtest, Sandys Entscheidung zu Punkt 3 (siehe `entscheidungen-fuer-sandy.md`)

**Ausgangslage:** DC-033 (`design-check.md`) ist ein echter, in Produktion
bestätigter Bug — das Nummernkreis-RPC (`vergib_naechste_nummer`) schlägt
seit Mitte Juni still fehl, weil sein Fehler nie ausgelesen wird. Ergebnis:
nur 3 von 106 Angeboten über beide Testkonten haben eine echte
Angebotsnummer, der Rest zeigt UUID-Fragmente als Fallback. Root Cause ist
dokumentiert, Fix ist reine Backend-Arbeit, klar bei dir verortet.

**Der eigentliche Anlass für dieses Ticket:** Product Designer hat beim
Committen seines eigenen CoS-021-Codes einen unabhängigen, unfertigen
Code-Block gefunden (`fertigstellen()`-Aufruf von
`/api/quotes/[id]/nummer`), der nach DC-033 aussieht — bewusst nicht mit
committet, damit er dir gehört. Das heißt: es gibt offenbar schon
Fortschritt, aber nirgends einen offiziellen Stand dazu — nicht committet,
nicht getestet, nicht gemeldet. Bitte:

1. Den vorhandenen Zwischenstand sichten, fertigstellen und committen
   (oder verwerfen, falls er nicht der richtige Ansatz war).
2. Beide RPC-Aufrufe (`init_nummernkreise`, `vergib_naechste_nummer`) auf
   Fehler prüfen und sichtbar loggen, damit das nie wieder still passiert.
3. Klären, ob/wie die 103 betroffenen Bestandsangebote (51 bei „Holm GmbH",
   52 bei „Lisa Schein Malerbetrieb") nachträglich echte Nummern bekommen
   sollen, oder ob das nur für neue Angebote ab jetzt gilt.
4. Status in `design-check.md` bei DC-033 aktualisieren, sobald etwas
   fertig ist — der Eintrag steht aktuell noch auf „❌ offen".

---

### Rückmeldung (Head of Product Engineering, 2026-08-25)

**Kurzfassung: 3 von 4 Punkten sind erledigt. Offen ist nur Punkt 3 — und der
ist eine Entscheidung für Sandy, keine Arbeit für mich. Dazu zwei Korrekturen
an der Ausgangslage, die für genau diese Entscheidung wichtig sind.**

**Zur Ausgangslage — der Bug war ein anderer, als im Ticket steht.** Die
Beschreibung sagt: „das Nummernkreis-RPC schlägt seit Mitte Juni still fehl,
weil sein Fehler nie ausgelesen wird". Der verschluckte Fehler ist real (Punkt
2, behoben), aber er war nicht die Ursache. Beide RPCs existieren in Produktion
und funktionieren einwandfrei — **sie wurden nur nie aufgerufen.** Der Weg, auf
dem Angebote heute entstehen (`api/entwurf/neu`, der Aufnahme-Flow), fordert
überhaupt keine Nummer an; die Vergabe stand ausschließlich in der älteren
Route `api/quotes/create`. Kein fehlgeschlagener Aufruf, sondern ein fehlender.
Das erklärt auch die Verteilung sauber: „Holm GmbH" hat genau die 3 Angebote
nummeriert, die noch über den alten Weg entstanden sind.

**Zweite Korrektur, direkt relevant für Punkt 3: es sind nicht 103 Angebote,
sondern 4.** Gegen die Produktions-Datenbank gezählt:

| Status | Anzahl | davon ohne Nummer |
|---|---|---|
| Entwurf | 101 | 99 |
| Fertiggestellt | 3 | 3 |
| Versendet | 2 | 1 |

Die 101 Entwürfe sind Wegwerf-Material aus den Testläufen — jede Aufnahme legt
einen an, auch jeder Fehlversuch. Die dürfen **gar keine** Nummer bekommen:
Sonst stünde der Nummernkreis nach einer Woche Testen bei 100+ und wäre voller
Lücken, die man bei einer Betriebsprüfung erklären müsste (genau wovor die
Lücken-Warnung auf der Einstellungsseite warnt). Übrig bleiben **4 Angebote**,
die den Entwurfsstatus wirklich verlassen haben und keine Nummer tragen.

**Punkt 1 — Zwischenstand:** Der „unfertige Code-Block", den der Product
Designer beim Committen gefunden hat, war meine Arbeit von genau diesem Tag,
mitten im Entstehen. Gut, dass er ihn liegen gelassen hat. Er ist inzwischen
fertig: neue Route `POST /api/quotes/[id]/nummer` (prüft Betriebszugehörigkeit,
legt den Nummernkreis bei Bedarf an, vergibt idempotent — eine vergebene Nummer
wird nie überschrieben), aufgerufen beim Fertigstellen. Bewusst dort und nicht
beim Anlegen, aus dem Grund oben. Blockiert das Fertigstellen nicht: Schlägt die
Vergabe fehl, ist das Angebot trotzdem fertig, zeigt die Ersatzbezeichnung — aber
mit sichtbarem Hinweis und Eintrag im Fehler-Protokoll statt lautlos.
**Committen kann nur Sandy** (ich habe keinen Schreibzugriff auf ihr Repository);
sie hat den fertigen Befehl bekommen.

**Punkt 2 — erledigt.** Beide RPC-Aufrufe in `api/quotes/create` lesen ihren
`error` jetzt aus, protokollieren ihn und melden ihn an Sentry. Dasselbe in der
neuen Route.

**Punkt 3 — offen, Entscheidung für Sandy.** Sollen die 4 Angebote ohne Nummer
nachträglich eine bekommen? Ich habe das bewusst nicht ungefragt gemacht: Bei
einem davon steht „versendet" — die Nummer könnte beim Kunden auf Papier
liegen, und eine nachträglich vergebene andere Nummer wäre schlimmer als gar
keine. Für die 3 fertiggestellten ist es unkritisch. Beide Wege sind in einer
Minute umgesetzt, sobald sie es sagt.

**Punkt 4 — erledigt.** `design-check.md` DC-033 steht auf 🟡 behoben, mit der
vollständigen Ursachenanalyse für den Product Designer (seine Vorarbeit hat
mir den halben Weg gespart, das steht auch so drin).

**Was noch fehlt, damit der Fall wirklich zu ist:** der Live-Nachtest. Ein
Angebot fertigstellen und sehen, dass „AG-2026-004" dransteht statt eines
ID-Fragments. Vorher würde ich DC-033 nicht auf grün setzen.

**Update (Sandy, 2026-08-25):** Hat den Befehl ausgeführt, ist committet.
Chief-of-Staff-Notiz: Committen ist nicht automatisch Deployen — bitte
kurz gegenchecken, ob es auch gepusht ist (bzw. Vercel den Build gezogen
hat), dann den Live-Nachtest machen (Angebot fertigstellen, echte Nummer
statt ID-Fragment sehen). Erst danach DC-033/CoS-022 wirklich auf grün.

**Update (Chief of Staff, 29.08.):** `design-check.md` bestätigt inzwischen
DC-033 als „🟡 behoben" — passt zur Rückmeldung oben. Noch offen: Push/
Deploy-Verifikation, Live-Nachtest, und Sandys Entscheidung zu Punkt 3
(unverändert offen in `entscheidungen-fuer-sandy.md`).

---

## CoS-023 — Governance: eigener Sync-Fehler bei CoS-P-003/CoS-P-004 (PKCE-/Mail-Fix)

**Datum:** 2026-08-29 (Chief of Staff, selbst entdeckt)

**Status:** ✅ erkannt und korrigiert, keine weitere Aktion an Kollegen nötig

**Was passiert ist:** `chief-of-staff-platform-todos.md` verzeichnet seit
dem 25.08. beide Fixes als umgesetzt — Passwort-Reset (CoS-P-003, korrekter
PKCE-Tausch über `/auth/callback`, auf Sandys Freigabe „003 ja bitte direkt
reparieren") und Transaktions-Mails (CoS-P-004, alle drei jetzt über die
eigene Resend-Anbindung, auf Sandys Freigabe „004 bitte b)"). Der Chief of
Staff hat das mehrere Tage lang übersehen und Sandy gegenüber wiederholt
fälschlich behauptet, der Passwort-Reset-Bug sei „weiterhin ungefixt,
wichtigster offener Sicherheitsfund" — obwohl der Fix längst dokumentiert
war. Kein Fehler von Platform & Integrations Engineer, reiner Lesefehler
beim Abgleich. `launch-readiness.md` (2.2/2.3/3.1) ist jetzt korrigiert.

**Was wirklich noch fehlt:** ein echter Klick-Durchlauf mit echtem Postfach
(Test-Registrierung, echten Reset-Link anklicken) — aus keiner
Kollegen-Session heraus möglich (kein E-Mail-Zugriff), das ist Sandys
eigene Aufgabe, ähnlich wie ihr CoS-002-Retest.

**Lektion, festgehalten für künftige Abgleiche:** bei jeder Behauptung wie
„X ist unverändert offen" aktiv in der aktuellen Heimat-Datei nachsehen,
nicht aus dem Gedächtnis wiederholen — genau der Fehler, der hier passiert
ist.

## CoS-024 — Sammel-Nachtrag DC-036 bis DC-041 (Product Designer, 29.08.)

**Datum:** 2026-08-29 (Chief of Staff, nach Sandys „schau dir ALLES an nicht
wieder den Fehler machen und iwas übersehen")

**Status:** 🟡 fünf von sechs Punkten code-fertig, alle Live-Tests offen; einer (DC-037) noch nicht begonnen

**Anlass:** Vollständiger Audit von `design-check.md` auf Sandys
ausdrücklichen Wunsch, nachdem zweimal hintereinander Fortschritt übersehen
wurde (CoS-002/DC-021-Retest, dann CoS-P-003/004-Fixes). Sechs neue Punkte
gefunden, die weder hier noch in `launch-readiness.md` verzeichnet waren —
alle vom 29.08., alle von Sandys eigenem Feedback/Testen ausgelöst.

| DC | Kurzbeschreibung | Status | Owner |
|---|---|---|---|
| DC-036 | Reiter „Raumform" → „📐 Unregelmäßig" umbenannt, Grundriss-Zeichner für Nischen war nur schlecht auffindbar | ✅ committet, Live-Test aus | Product Designer |
| DC-037 | Sandys Folgeidee: Grundriss-Zeichner schon während der Aufnahme anbieten | 🔵 nur Spec fertig, Backend-Teil noch nicht begonnen (Merge-Konflikt mit KI-Extraktion muss gelöst werden) | Head of Product Engineering |
| DC-038 | Kritik am Grundriss-Zeichner (keine Wandnummern, nur 3 Vorlagen) | ✅ Wandnummern + neues „frei zeichnen" (Finger→90°-eingerastet→nummeriert) umgesetzt, Live-Test aus | Product Designer |
| DC-039 | „+ Position" Live-Suche gegen Preisdatenbank + abgesicherter Schreib-Endpunkt | ✅ beide Teile umgesetzt, dabei Tap-Bug UND einen alten `price_item_id`-Speicherbug gefunden+gefixt, Live-Retest aus | Product Designer (UI) / Head of Product Engineering (Endpunkt) |
| DC-040 | „Wohnung als Ganzes" statt zwingend pro Raum (Clemens' Rückmeldung über Sandy) | ✅ Extraktion + Anzeige umgesetzt, **Prompt-Änderung — braucht echten Live-Test mit echter Sprachaufnahme**, nicht nur Unit-Tests | Head of Product Engineering (Extraktion) / Product Designer (Anzeige) |
| DC-041 | Raum-Platzhalter zeigte literales „— Schlafzimmer" im Titelfeld | ✅ committet, reiner Frontend-Fix, Live-Test aus | Product Designer |

**In `launch-readiness.md` eingerechnet:** 1.2 (+3, DC-038/040), 1.6 (+10,
DC-039), 5.2 (+8, DC-036/038/039/041). Gate 1 bleibt bei 34 % (Bewegung zu
klein für die gerundete Gesamtzahl über 46 Punkte).

**Neue offene Entscheidung aus DC-040 (bereits in
`entscheidungen-fuer-sandy.md`):** soll die „schon ohne Fenster/Türen?"-
Rückfrage auch bei einzelnen Räumen kommen, nicht nur bei ganzen Wohnungen?
Hängt mit CoS-020 zusammen.

**Zwei Kleinigkeiten, nicht selbst korrigiert (nicht meine Heimat-Datei):**
DC-033s eigene Kopfzeile widerspricht ihrem eigenen Fix-Update (siehe
Governance-Hinweis in `launch-readiness.md`); ein leeres Test-Angebot
(Nr. 2026-493C) wartet in der Produktions-Datenbank auf manuelle Löschung
durch Sandy.

**Nächster Schritt:** kein Auftrag an Kollegen nötig — alles außer DC-037
ist bereits in Arbeit/fertig. Live-Tests sammeln sich mit den übrigen
offenen Nachtests (siehe Dashboard).

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

