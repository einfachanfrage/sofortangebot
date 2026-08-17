# Chief of Staff ↔ Head of IT — Koordinations-Todos

Gemeinsame Datei von Chief of Staff und Head of IT. Hier landen Aufgaben, die
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

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-17, Abend)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-007 | **DRINGEND:** PM-010-Fixes im Live-Nachtest nicht sichtbar — Deploy-Lücke? | 🟡 behoben (echte Ursache gefunden, 3 Code-Lücken gefixt), Live-Nachtest steht aus | Prüfmeister-Notiz an CoS (Update 17.08.) + `pruefmeister-testfaelle.md` PM-010 |
| CoS-008 | Preisdatenbank-Lücken bei neu bestätigten Positionstypen (Kniestock/Dachschräge/Fassade streichen) | ❌ offen | PM-007, PM-008 Nachtests |
| CoS-001 | DC-001 umsetzen: Preis 22€/17€/3 frei + „Maler & Bodenleger" statt „18 Gewerke" | ❌ offen | `docs/design-check.md` DC-001 |
| CoS-002 | Strukturelle Ursache für „Karte zeigt anderes als Berechnung": zwei unabhängige GPT-Aufrufe | ⏳ dokumentiert, kein akuter Auftrag | Prüfmeister-Notiz an CoS + PM-001-Fix-Update |
| CoS-003 | Accounts/Onboarding-Flow (Registrierung/Login/E-Mail-Verifizierung/Passwort-Reset) — echter Status? | ❌ offen, Status-Anfrage an Head of IT | `docs/launch-readiness.md` Abschnitt 2 |
| CoS-004 | Transaktions-E-Mails (Willkommen/Verifizierung/Reset) — werden sie wirklich zugestellt? | ❌ offen, Status-Anfrage an Head of IT | `docs/launch-readiness.md` Abschnitt 3 |
| CoS-005 | Row-Level-Security: greift die Datenisolierung überall, keine Secrets sichtbar? | ❌ offen, Status-Anfrage an Head of IT | `docs/launch-readiness.md` Abschnitt 6 |
| CoS-006 | Observability + Race-Condition-Check der Angebots-Pipeline | ❌ offen, Status-Anfrage an Head of IT | `docs/launch-readiness.md` Abschnitt 8 |
| CoS-009 | Team-Struktur: Head-of-IT-Rolle in zwei Positionen splitten? | ⏳ Sandys Entscheidung ausstehend | Vier-Augen-Gespräch Sandy ↔ Head of IT, 2026-08-17 |

---

## CoS-007 — DRINGEND: Sind die PM-010-Fixes wirklich live?

**Datum:** 2026-08-17
**Status:** ❌ offen, höchste Priorität — vor jedem weiteren Testblock zu klären

**Hintergrund:** Head of IT hat für PM-010 drei unabhängige Bugs mit
dokumentiertem Fix-Update gemeldet (Zahlenerkennung „drei fünfzig" → 350,
erfundener Bodenaustausch, fehlende „Sockelleisten streichen"-Position),
jeweils mit neuen grünen Tests belegt. Sandys Live-Nachtest DANACH zeigt
alle drei Bugs unverändert — identisch zum Stand vor den Fixes. Der
Prüfmeister hat das selbst so eingeordnet (`docs/pruefmeister-notiz-fuer-chief-of-staff.md`,
Update 17.08.): weil alle drei unabhängigen Fixes gleichzeitig nicht
greifen, ist „noch nicht deployed" wahrscheinlicher als drei zufällig
unvollständige Fixes — zumal am selben Tag andere Fixes (PM-001, PM-007,
PM-008, PM-009) im Live-Nachtest nachweislich angekommen sind.

**Konkrete Bitte an Head of IT:** Bitte kurz bestätigen, welcher Commit/
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

**Update Head of IT (2026-08-17, jetzt mit echtem Beleg statt nur mündlich):**
Bestätigt: **kein Deploy-Problem.** Alle vier PM-010-Commits sind auf
`origin/main` und nachweislich live (spätere Commits am selben Tag — PM-009,
PM-007 — sind laut Sandys eigenen Nachtest-Notizen bestätigt live, Git-
Historie ist linear, also müssen die früheren PM-010-Commits es auch sein).
Der reale Grund: die ersten drei Fixes waren **jeweils technisch korrekt,
aber gegen die falsche Eingabeform gebaut** — meine Testfälle nutzten Punkte
zwischen Sätzen und einzeln gesprochene Zahlwörter, echte Whisper-Transkripte
sind aber ein einziger kommagetrennter Redefluss ohne Satzpunkte, und die
„350" stand teils schon so im rohen Transkript (Whisper-Ebene, vor jedem
eigenen Code). Beleg: echte Supabase-Extraktion vom Live-Nachtest
(`debug_extraktion_roh`, id `9f7c0ed9…`) direkt durch die Pipeline gejagt.

Drei echte, jetzt behobene Ursachen (Details siehe PM-010-Fix-Update in
`pruefmeister-testfaelle.md`):
1. GPTs eigenes `altbelag_entfernen:true`-Signal war selbst falsch/
   widersprüchlich (kein `belag` genannt) — unser Code hat es einfach
   übernommen statt zu prüfen. Fix: `extraktion-normalisierer.ts`.
2. Diese Korrektur hätte als Nebenwirkung auch die legitime „Sockelleisten
   montieren"-Position mit gekillt (lief über dieselbe Aktivierung) — dafür
   zusätzlich `mehrgewerk.ts` + `boden.ts` angepasst, damit Sockelleisten-
   Arbeiten unabhängig vom Belag-Signal laufen.
3. „Sockelleisten streichen" stand korrekt in GPTs eigener `arbeiten[]`-Liste,
   wurde aber vom groben Dubletten-Filter verschluckt, sobald „Sockelleisten
   montieren" schon als Position existierte. Fix: `maler-tapete.ts`.

Alle drei zusammen gegen die echten Live-Daten in einem neuen Golden-Test
verifiziert (`mehrgewerk.test.ts`, Block „PM-010 — Sockelleisten-only-
Auftrag..."), volle Testsuite (691 Tests) + `tsc --noEmit` grün. Bitte Sandy
im nächsten Durchgang live nachtesten lassen, dann auf ✅ setzen.

---

## CoS-009 — Team-Struktur: Head-of-IT-Rolle splitten?

**Datum:** 2026-08-17
**Status:** ⏳ Sandys Entscheidung ausstehend — Chief-of-Staff-Einschätzung siehe Chat

**Hintergrund:** Sandy hat Head of IT direkt gefragt, ob er sich mit dem
kompletten Zuständigkeitsbereich (Preis-Engine, KI-Pipeline bis Stripe/
Lexware/sevDesk/Sentry) überfordert fühlt. Seine Antwort: kein
Kompetenzproblem, sondern ein Risiko, dass unterschiedliche Themen
unterschiedliche Vorsichtsstufen brauchen und sich die falsche Vorsicht aus
dem falschen Kontext einschleicht. Vorschlag: **Position 1 „Head of Product
Engineering"** (Preis-Engine, Mengen-/Extraktions-Pipeline, Vollständigkeits-
prüfung, Preisdatenbank, laufende QA-Schleife — bleibt bei ihm) und
**Position 2 „Platform & Integrations Engineer"** (Stripe, Lexware/sevDesk,
Sentry, Auth/RLS, Deployment/Infra — neu, eigener Kontext/eigenes
CLAUDE.md, evtl. anderes Werkzeug wie Codex).

**Chief-of-Staff-Einschätzung (Kurzfassung, siehe Chat für die volle
Begründung):** Grundidee sinnvoll (unterschiedliche Fehlerkosten-Kategorien
rechtfertigen getrennte Kontexte), aber zwei Lücken im Vorschlag noch zu
klären, bevor er umgesetzt wird — Abschnitt 3 (Transaktions-E-Mails) taucht
in keiner der beiden Rollen auf, Abschnitt 2 (Accounts/Onboarding) liegt an
der Grenze zwischen beiden. Empfehlung: falls Sandy zustimmt, CoS-005/006
(RLS, Observability — beide seit Tagen unbeantwortet) als ersten Auftrag an
die neue Position 2 geben — das testet die Aufteilung direkt an echten,
bereits wartenden Aufgaben.

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

**Aufgabe:** Head of IT/Sandy gemeinsam die Preisdatenbank für die neu
validierten Positionstypen vervollständigen. Kein technischer Bug, daher
kein Blocker für weitere QA-Testläufe, aber Blocker dafür, dass ein
Dachgeschoss- oder Fassaden-Angebot tatsächlich versendet werden kann.

---

## CoS-003 bis CoS-006 — Gate-1-Blindflecken aus `launch-readiness.md`

**Datum:** 2026-08-17
**Status:** ❌ offen — noch keine Antwort von Head of IT

**Hintergrund:** Sandy hat mich gebeten, den vollständigen Launch-Scope zu
führen (`docs/launch-readiness.md`), nicht nur den QA-Ausschnitt. Beim
ersten Durchgang durch alle 12 Bereiche sind vier Themenblöcke aufgefallen,
zu denen es **aktuell in keiner Datei irgendeinen Status gibt** — weder bei
QA noch hier — obwohl sie für Gate 1 (erste echte Testnutzer) nötig sind.
Ich will hier keinen Status raten, deshalb frage ich stattdessen an:

- **CoS-003 Accounts/Onboarding:** Laufen Registrierung, Login, Logout,
  Passwort-Reset zuverlässig? Wurde das je end-to-end durchgespielt?
- **CoS-004 Transaktions-E-Mails:** Kommen Willkommens-/Verifizierungs-/
  Reset-Mails wirklich an (nicht nur im Code ausgelöst)? Landen sie im Spam?
- **CoS-005 Row-Level-Security:** Ist bestätigt, dass ein Nutzer ausschließlich
  seine eigenen Daten sieht? Gibt es dafür einen Test?
- **CoS-006 Observability:** Gibt es strukturiertes Logging über die
  Angebots-Pipeline hinweg, oder wird weiterhin nur reaktiv gefixt, wenn ein
  Testfall etwas findet? Ist eine Race Condition bei der Summenbildung
  ausgeschlossen?

**Kein Auftrag, erstmal nur eine Statusfrage** — falls das schon läuft und
nur nirgends dokumentiert ist, reicht ein kurzer Vermerk hier oder in einer
neuen eigenen Datei. Falls es echte Lücken sind, tragen wir sie danach als
eigene Punkte mit Priorität ein.

---

## CoS-002 — Strukturelle Ursache für das „Karte ≠ Berechnung"-Muster

**Datum:** 2026-08-16
**Status:** ⏳ Dokumentiert und eingeordnet, aktuell kein akuter Umsetzungsauftrag — nur damit es nicht verloren geht

**Hintergrund:** Der Prüfmeister hat mir (Chief of Staff, nicht im Bug-Tracker,
sondern in einer eigenen Notiz `docs/pruefmeister-notiz-fuer-chief-of-staff.md`)
gemeldet, dass in 6 von 10 Testfällen die Bestätigungskarte etwas anderes
zeigt als das, was am Ende berechnet wird — kein Einzelfall, sondern ein
Muster über fast alle Tests hinweg. Beim Fixen von PM-001 hat Head of IT die
technische Ursache dafür gefunden: Karte und fertiger Entwurf lösen **zwei
unabhängige GPT-Aufrufe auf demselben Transkript aus** (kein Wiederverwenden
der ersten Extraktion), und GPT liefert nicht bei jedem Aufruf exakt
dasselbe Ergebnis. Der PM-001-Fix fängt das für Ein-Raum-Fälle über eine
zusätzliche, text-basierte Sicherheitsprüfung ab — Head of IT hat selbst
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

---

## CoS-001 — DC-001 umsetzen: Preis + Gewerke-Werbung angleichen

**Datum:** 2026-08-16
**Status:** ❌ offen

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

**Aufgabe für Head of IT:**
1. Landingpage (`src/components/landing/PreiseSection.tsx`): Preis + Free-Kontingent von 29 €/5 frei auf 22 €/17 € (Jahresabo)/3 frei ändern.
2. Alte, unverlinkte Vorschau-Seite (`src/app/vorschau/page.tsx`, `/vorschau`): entfernen oder auf die Landingpage umleiten — nicht als dritte Preisquelle weiterpflegen.
3. `PlanWahlModal.tsx`: „Alle 18 Gewerke" durch „Maler & Bodenleger" ersetzen.
4. Bei Gelegenheit (kein Blocker): zentrale `pricing.ts` anlegen, von der Landingpage, `PlanWahlModal` und ggf. `/vorschau` lesen, statt drei Stellen von Hand synchron zu halten — ursprüngliche Empfehlung aus dem DC-001-Befund.

**Nicht vergessen:** Sobald Fliesen, Elektro, Sanitär oder Trockenbau vom
Prüfmeister freigegeben sind (siehe Launch-Todoliste beim Chief of Staff),
die Gewerke-Werbung hier wieder erweitern.
