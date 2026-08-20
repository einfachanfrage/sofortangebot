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

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-20)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-010 | Angebot verdoppelt sich (2.000,28€ statt 1.000,14€) | 🟡 Live-Nachtest durch Sandy (19.08.) bestanden: bewusster Doppelklick auf „Angebot erstellen" erzeugt keine Verdopplung mehr. Für den alltäglichen Fall (Handwerker klickt aus Versehen doppelt) damit erledigt. Offen bleibt nur die theoretische Absicherung gegen zwei wirklich zeitgleiche Server-Anfragen (DB-Constraint) — größerer Schritt, wartet auf Sandys Go, kein akuter Blocker mehr | `pruefmeister-testfaelle.md` PM-014 |
| CoS-007 | PM-010-Fixes im Live-Nachtest nicht sichtbar — „Sockelleisten streichen" fehlt weiter nach 4 Versuchen | 🟡 wahren Grund gefunden (Ansatz gewechselt wie empfohlen) + größerer Systemfund, Live-Nachtest steht aus | Prüfmeister-Notiz an CoS (Update 17.08.) + `pruefmeister-testfaelle.md` PM-010/PM-012 |
| CoS-008 | Preisdatenbank-Lücken bei neu bestätigten Positionstypen (Kniestock/Dachschräge/Fassade streichen) | ❌ offen | PM-007, PM-008 Nachtests |
| CoS-001 | DC-001 umsetzen: Preis 22€/17€/3 frei + „Maler & Bodenleger" statt „18 Gewerke" | 🟡 umgesetzt (Landingpage, PlanWahlModal, `/vorschau` entfernt/umgeleitet, zentrale `pricing.ts` angelegt), Live-Nachtest steht aus | `docs/design-check.md` DC-001 |
| CoS-002 | Strukturelle Ursache für „Karte zeigt anderes als Berechnung": zwei unabhängige GPT-Aufrufe | ⏳ dokumentiert, kein akuter Auftrag | Prüfmeister-Notiz an CoS + PM-001-Fix-Update |
| CoS-009 | Team-Struktur: Head-of-IT-Rolle in zwei Positionen splitten? | ✅ entschieden — Sandy hat zugestimmt | Vier-Augen-Gespräch Sandy ↔ Head of Product Engineering, 2026-08-17 |
| ~~CoS-003–006~~ | Accounts, Transaktions-E-Mails, RLS, Observability | → verschoben, jetzt CoS-P-001 bis CoS-P-004 | `docs/chief-of-staff-platform-todos.md` |
| CoS-011 | Rückfragen-UI komplett neu gedacht — Konzept + klickbarer Prototyp vom Product Designer stehen, Sandy findet's „super" und will's in die Umsetzung geben | 🟡 überholt — Sandy hat Product Designer direkt „setz dc-025 um" angewiesen, noch vor der hier erbetenen Aufwandsschätzung. UI ist bereits gebaut (`RueckfragenScreen.tsx`), nur der Live-Test im Browser steht noch aus | `docs/design-check.md` DC-025/DC-026, `docs/dc-025-konzept-rueckfragen.md`, `docs/dc-025-rueckfragen-prototyp.html` |
| CoS-012 | DC-029 „Baustelle"/Projekt-Zuordnung — Wording-Konzept vom Product Designer steht, zwei Teilstücke formal zu vergeben | 🟡 Lexware/Lexoffice-Machbarkeit erledigt. Datenmodell (Head of Product Engineering) jetzt umgesetzt und live: Tabelle `baustellen` + `quotes.baustelle_id` + Migration + Backfill in der echten Datenbank angewendet, App-Code an allen vier Stellen verdrahtet. Live-Nachtest steht aus, Designer baut jetzt Konzept + Prototyp für die Baustellen-UI darauf auf | `docs/design-check.md` DC-029 |
| CoS-013 | Strukturelle Lösung für den wiederholten Datei-Speicherfehler bei gemeinsamen Doku-Dateien (jetzt 6. Mal) | ❌ offen — Sofortmaßnahme (Dateiende-Markierung) bereits umgesetzt, eigentlicher Lösungsvorschlag (Git statt Direkt-Überschreiben) braucht Sandys Go | Sandys Frage „kannst du es richtig lösen", 2026-08-20 |

---

## CoS-010 — DRINGEND: Angebot verdoppelt sich (Race-Condition-Verdacht)

**Datum:** 2026-08-17
**Status:** ❌ offen, höchste Priorität im ganzen Projekt — schwerster Einzelfund bisher

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
**Status:** ❌ offen

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

**Datum:** 2026-08-16
**Status:** ⏳ Dokumentiert und eingeordnet, aktuell kein akuter Umsetzungsauftrag — nur damit es nicht verloren geht

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
kaputt. Bleibt wie oben: kein akuter Auftrag, wartet auf einen Moment mit
mehr Zeit/Kopf, dann am besten mit einem konkreten Vorschlag von mir statt
einer offenen Entweder-Oder-Frage.

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

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

