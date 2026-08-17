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

## Stand auf einen Blick (zuletzt aktualisiert: 2026-08-17, Abend)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-010 | **DRINGEND, höchste Priorität:** Angebot verdoppelt sich (2.000,28€ statt 1.000,14€), Auslöser ungeklärt | ❌ offen, schwerster Einzelfund bisher | `pruefmeister-testfaelle.md` PM-014 |
| CoS-007 | PM-010-Fixes im Live-Nachtest nicht sichtbar — „Sockelleisten streichen" fehlt weiter nach 4 Versuchen | ❌ offen, jetzt 3-fach bestätigt (PM-010/012), Muster statt Einzelfall | Prüfmeister-Notiz an CoS (Update 17.08.) + `pruefmeister-testfaelle.md` PM-010/PM-012 |
| CoS-008 | Preisdatenbank-Lücken bei neu bestätigten Positionstypen (Kniestock/Dachschräge/Fassade streichen) | ❌ offen | PM-007, PM-008 Nachtests |
| CoS-001 | DC-001 umsetzen: Preis 22€/17€/3 frei + „Maler & Bodenleger" statt „18 Gewerke" | ❌ offen | `docs/design-check.md` DC-001 |
| CoS-002 | Strukturelle Ursache für „Karte zeigt anderes als Berechnung": zwei unabhängige GPT-Aufrufe | ⏳ dokumentiert, kein akuter Auftrag | Prüfmeister-Notiz an CoS + PM-001-Fix-Update |
| CoS-009 | Team-Struktur: Head-of-IT-Rolle in zwei Positionen splitten? | ✅ entschieden — Sandy hat zugestimmt | Vier-Augen-Gespräch Sandy ↔ Head of Product Engineering, 2026-08-17 |
| ~~CoS-003–006~~ | Accounts, Transaktions-E-Mails, RLS, Observability | → verschoben, jetzt CoS-P-001 bis CoS-P-004 | `docs/chief-of-staff-platform-todos.md` |

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

**Aufgabe für Head of Product Engineering:**
1. Landingpage (`src/components/landing/PreiseSection.tsx`): Preis + Free-Kontingent von 29 €/5 frei auf 22 €/17 € (Jahresabo)/3 frei ändern.
2. Alte, unverlinkte Vorschau-Seite (`src/app/vorschau/page.tsx`, `/vorschau`): entfernen oder auf die Landingpage umleiten — nicht als dritte Preisquelle weiterpflegen.
3. `PlanWahlModal.tsx`: „Alle 18 Gewerke" durch „Maler & Bodenleger" ersetzen.
4. Bei Gelegenheit (kein Blocker): zentrale `pricing.ts` anlegen, von der Landingpage, `PlanWahlModal` und ggf. `/vorschau` lesen, statt drei Stellen von Hand synchron zu halten — ursprüngliche Empfehlung aus dem DC-001-Befund.

**Nicht vergessen:** Sobald Fliesen, Elektro, Sanitär oder Trockenbau vom
Prüfmeister freigegeben sind (siehe Launch-Todoliste beim Chief of Staff),
die Gewerke-Werbung hier wieder erweitern.
