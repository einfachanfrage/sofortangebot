# Chief of Staff ↔ Platform & Integrations Engineer — Koordinations-Todos

Gemeinsame Datei von Chief of Staff und dem Platform & Integrations Engineer
(neue Stelle seit 17.08.2026, ausgegliedert aus der bisherigen „Head of
IT"-Rolle — siehe CoS-009 in `chief-of-staff-todos.md`). Hier landen Themen
aus: Zahlungen (Stripe), Buchhaltungs-Anbindungen (Lexware/sevDesk/etc.),
Fehler-Überwachung (Sentry), Accounts/Login, Datentrennung (Row-Level-
Security), Transaktions-E-Mails, Deployment/Infrastruktur.

**Nicht hier rein:** Sprach-zu-Angebot-Pipeline, Preisdatenbank-Inhalte, QA
(läuft weiterhin über `pruefmeister-testfaelle.md` und
`chief-of-staff-todos.md` mit dem Head of Product Engineering).

**Ablauf:** Chief of Staff trägt neue Punkte ein, sobald sie entstehen.
Platform & Integrations Engineer trägt nach Erledigung ein kurzes
**Fix-Update** direkt unter dem jeweiligen Punkt ein. Status-Zeile danach
aktualisieren.

Jeder Punkt hat eine feste ID (CoS-P-XXX).

**Status-Zeichen:** ✅ erledigt & geprüft · 🟡 erledigt, noch nicht
nachgeprüft · ❌ offen · ⏳ wartet auf Vorbedingung.

**Hinweis zur Pflege dieser Datei:** Sie ist am 17.08. durch gleichzeitige
Bearbeitung kurz auf einen älteren Stand zurückgefallen (die Fix-Updates zu
CoS-P-001/002 waren kurz weg, jetzt vom Chief of Staff wiederhergestellt,
CoS-P-005 unangetastet). Bitte vor dem Speichern kurz nochmal lesen, was
gerade drinsteht — das Problem gab es in anderen Dateien hier schon öfter.

## Stand auf einen Blick (angelegt: 2026-08-17)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-P-001 | Row-Level-Security bestätigen: sieht jeder Nutzer wirklich nur eigene Daten? | ✅ erledigt & geprüft | `docs/launch-readiness.md` Abschnitt 6 (vormals CoS-005) |
| CoS-P-002 | Observability herstellen: strukturiertes Logging über die wichtigsten Schritte | 🟡 Erster Schritt umgesetzt (Sentry im Kernpfad), Restarbeit sauber abgegrenzt | `docs/launch-readiness.md` Abschnitt 8 (vormals CoS-006) |
| CoS-P-003 | Accounts/Onboarding-Flow (Registrierung/Login/Logout/Passwort-Reset) einmal end-to-end testen | ❌ offen | `docs/launch-readiness.md` Abschnitt 2 (vormals CoS-003) |
| CoS-P-004 | Transaktions-E-Mails wirklich zugestellt? (Willkommen/Verifizierung/Reset) | ❌ offen | `docs/launch-readiness.md` Abschnitt 3 (vormals CoS-004) |
| CoS-P-005 | Logo-Upload im Onboarding schlägt mit RLS-Fehler fehl | 🟡 gefixt, noch nicht auf Staging nachgetestet | Sandys Screenshots vom Onboarding-Testlauf, 2026-08-17 |

---

## CoS-P-001 — Row-Level-Security bestätigen

**Datum:** 2026-08-17
**Status:** ✅ erledigt & geprüft

**Hintergrund:** Übernommen von CoS-005 (bisher in `chief-of-staff-todos.md`
beim Head of Product Engineering, jetzt hier, weil es klar in den neuen
Zuständigkeitsbereich fällt). Bisher an keiner Stelle bestätigt, dass ein
Nutzer ausschließlich seine eigenen Daten sieht.

**Konkrete Bitte:** Bitte prüfen und in einfachen Worten zurückmelden, WIE
das erzwungen wird (welche Supabase-RLS-Policies greifen wo), nicht nur
„passt schon".

**Fix-Update (2026-08-17, Platform & Integrations Engineer):**

Alle 22 Tabellen mit Nutzerdaten in Produktion (`yqlledouhfovytifeekd`)
direkt per SQL geprüft (Datenbank-Policies, nicht nur Code gelesen). Ergebnis:
21 von 22 waren korrekt abgesichert nach demselben Muster — „Zeile gehört
zur Firma/zum Nutzer, der eingeloggt ist" (`auth.uid()`), durchgesetzt von der
Datenbank selbst, nicht nur von der App. Das ist die richtige, robuste Bauweise.

**Ein akuter Fund, sofort behoben:** Tabelle `debug_extraktion_roh` (Rohdaten
aus der KI-Erkennung, als Temp-Debug-Hilfe am 07.08. eingebaut) hatte gar
keine RLS-Regel und volle Lese-/Schreibrechte für jeden — auch nicht
eingeloggte Besucher, allein mit dem öffentlichen Website-Schlüssel. Das
hätte bedeutet: jeder hätte per einfachem Web-Request alle Sprach-Transkripte
und KI-Rohdaten aller Nutzer auslesen können. Mit deinem OK direkt auf
Produktion geschlossen (RLS an + Besitzer-Regel wie bei den anderen Tabellen,
öffentlicher Zugriff entzogen), sofort verifiziert. Migration zusätzlich im
Repo nachgetragen: `supabase/migrations/20260817180000_secure_debug_extraktion_roh.sql`.

**Zweite Runde (2026-08-17, Punkt jetzt vollständig abgeschlossen):**

Alle ~19 Code-Stellen durchgesehen, die mit erweiterten Datenbank-Rechten an
RLS vorbeigehen (Service-Rolle — nötig z. B. für Stripe-Kündigung, Cron-Jobs,
öffentliche Freigabelinks ohne Login). 18 davon sauber auf den jeweils
eigenen Nutzer/Betrieb begrenzt. Eine Stelle gefunden, die sich beim Laden
eines Angebots komplett auf RLS als einzige Absicherung verließ, ohne eigene
Prüfung im Code (`quotes/[id]/public-pdf`) — nicht akut ausnutzbar (RLS hat
gehalten), aber genau die Art Einzelpunkt-Abhängigkeit, die uns beim
`debug_extraktion_roh`-Fund oben oder bei einer künftigen versehentlich
deaktivierten RLS-Regel wehtun würde. Direkt eine zweite, unabhängige
Prüfung im Code selbst ergänzt (Standardmuster wie in den anderen Routen).

Außerdem: doppelte, wirkungsgleiche Policy auf `briefpapiere` entfernt
(Aufräumen, war keine Lücke) — auf Staging und Produktion.

Beide Fixes zusätzlich als Migrationsdateien im Repo nachgetragen:
`supabase/migrations/20260817180000_secure_debug_extraktion_roh.sql`,
`supabase/migrations/20260817180100_drop_duplicate_briefpapiere_policy.sql`.

**Bewusst nicht Teil dieses Punkts** (kein Bezug zu „sieht jeder Nutzer nur
eigene Daten", eigenständige Themen): zwei allgemeine Supabase-Warnhinweise
(Funktionen ohne festen „search_path", „Leaked Password Protection" aus) —
beide WARN-Stufe, trage ich bei Gelegenheit als eigenen kleinen Punkt nach.

---

## CoS-P-002 — Observability herstellen

**Datum:** 2026-08-17
**Status:** 🟡 erster Schritt umgesetzt, Restarbeit sauber abgegrenzt

**Hintergrund:** Übernommen von CoS-006. Aktuell wird laut Prüfmeister-Notiz
an den Chief of Staff (17.08.) weiterhin reaktiv gefixt, wenn ein Testfall
etwas findet — kein durchgängiges Logging der Pipeline-Stufen bekannt.

**Konkrete Bitte:** Prüfen, was an Logging existiert (Sandy erwähnt, dass
Logging-Spalten in der Datenbank schon existieren, nur nicht befüllt
werden), kleinsten ersten Schritt vorschlagen, um das sichtbar zu machen.

**Fix-Update (2026-08-17, Platform & Integrations Engineer) — Bestandsaufnahme:**

Direkt in Produktion nachgesehen (Zeilen gezählt, nicht nur Code gelesen).
Drei getrennte Baustellen:

1. **Die „Logging-Spalten, die nicht befüllt werden" — Teilbild ist besser als
   gedacht.** Zwei Tabellen haben eigene Debug-Spalten (`entwurf_aufnahmen`
   fürs Transkript, `quotes` für die rohe/finale KI-Extraktion). Seit ca.
   07.08. füllt der Code sie bei fast jedem neuen Durchlauf zuverlässig —
   die leeren Altfälle in meiner Stichprobe stammen fast alle von davor.
   Zwei Spalten sind aber wirklich tot: `hat_normalisierung` und
   `konfidenz_whisper` — im Schema angelegt, nirgendwo im Code jemals
   beschrieben. `konfidenz_whisper` ist besonders schade: das ist genau der
   Wert, der eine unsichere Spracherkennung wie bei PM-010 („drei fünfzig"
   → 350) anzeigen würde, wird aber gar nicht erst abgefragt.

2. **Fehler-Überwachung (Sentry) ist eingerichtet, aber praktisch blind für
   die eigentliche Pipeline.** Sentry ist technisch sauber aufgesetzt
   (Client/Server/Edge, DSGVO-Filter für Nutzerdaten). Das Problem: an rund
   35 Stellen im Code wird ein Fehler abgefangen, nur mit einer kurzen
   Zeile in die Server-Konsole geschrieben und dann eine „Fehler"-Antwort
   ans Frontend geschickt — an nur 2 Stellen wird der Fehler zusätzlich an
   Sentry gemeldet.

3. **Was schon funktioniert, ohne dass wir was tun müssen:** `/api/health`,
   `/api/health/ai`, `/api/health/pdf` sind echte Prüfungen. Kosten-Alarm
   bei ungewöhnlich hohen KI-Kosten eines Nutzers ist verdrahtet und
   verschickt automatisch eine E-Mail an dich.

**Fix-Update (2026-08-17, Platform & Integrations Engineer):** Mit deinem OK
umgesetzt. 8 Fehlerstellen in 4 Dateien im Kernpfad (Aufnahme hochladen,
Aufnahme verarbeiten/Retry, KI-Extraktion, Positionen generieren) melden
Fehler jetzt zusätzlich an Sentry. TypeScript-Check läuft fehlerfrei über
das komplette Projekt. `SENTRY_DSN`/`NEXT_PUBLIC_SENTRY_DSN` in Vercel
bestätigt gesetzt (Production + Preview).

**Bewusst nicht in diesem Schritt** (eigene Entscheidung wert): die zwei
KI-Edge-Functions (Deno, eigene Sentry-Anbindung nötig); die übrigen ~27
Fehlerstellen außerhalb des Kernpfads; die zwei toten Logging-Spalten.

---

## CoS-P-003 — Accounts/Onboarding end-to-end testen

**Datum:** 2026-08-17
**Status:** ❌ offen

**Hintergrund:** Übernommen von CoS-003. Registrierung, Login, Logout,
Passwort-Reset — nie dokumentiert end-to-end durchgespielt.

---

## CoS-P-004 — Transaktions-E-Mails auf echte Zustellung prüfen

**Datum:** 2026-08-17
**Status:** ❌ offen

**Hintergrund:** Übernommen von CoS-004. Unklar, ob Willkommens-/
Verifizierungs-/Reset-Mails wirklich zugestellt werden, nicht nur im Code
ausgelöst.

---

## CoS-P-005 — Logo-Upload im Onboarding schlägt mit RLS-Fehler fehl

**Datum:** 2026-08-17
**Status:** 🟡 gefixt, noch nicht auf Staging nachgetestet

**Hintergrund:** Sandy meldete aus einem Onboarding-Testlauf (Screenshots),
dass der Logo-Upload zuverlässig (zweimal in Folge) mit *"Upload
fehlgeschlagen: new row violates row-level security policy"* abbricht —
blockiert einen kompletten Onboarding-Schritt für jeden neuen Nutzer.

**Root Cause:** `supabase/schema.sql` vermerkt den Bucket `company-logos`
als "manuell im Supabase Dashboard anzulegen" — dabei entstehen keine
Row-Level-Security-Policies auf `storage.objects`. Ohne INSERT-Policy lehnt
Postgres jeden Upload ab, unabhängig vom eingeloggten Nutzer. Das etablierte
Muster im Projekt (Bucket + Policies gemeinsam per Migration, Ordner =
`auth.uid()`) existiert bereits für die Buckets `entwurf-audio` und
`entwurf-fotos` — für `company-logos` fehlte es schlicht.

**Fix-Update (Platform & Integrations Engineer, 2026-08-17):**
- Neue Migration `supabase/migrations/20260817190000_add_company_logos_storage_policies.sql`:
  legt den Bucket idempotent an (falls nur manuell vorhanden) und ergänzt
  SELECT/INSERT/UPDATE/DELETE-Policies, die jeden Nutzer auf seinen eigenen
  Ordner (`auth.uid()`) beschränken.
- `src/app/api/upload-logo/route.ts`: Upload-Pfad von `logos/${user.id}.${ext}`
  auf `${user.id}/logo.${ext}` geändert, damit das erste Pfadsegment (worauf
  die Policy prüft) tatsächlich der User-ID entspricht.
- `supabase/check_migrationen.sql`: Zeile 51 für die neue Migration ergänzt.
- **Noch offen:** Migration ist nur lokal geschrieben, noch nicht auf
  Staging ausgeführt. Erst nach erfolgreichem Staging-Test und Merge nach
  `main` auf Produktion anwenden — dann auf ✅ setzen.
- **Nebenbefund:** `supabase/check_migrationen.sql` hatte schon vor diesem
  Fix eine Lücke — drei Migrationen zwischen `#50` und dieser hier fehlten
  im Status-Check komplett. Nicht Teil dieses Fixes, aber notiert.

---

## Weiterhin blockiert: Git-Sperrdatei

Alle Fix-Updates oben (CoS-P-001, CoS-P-002, CoS-P-005) liegen lokal fertig,
aber eine Git-Sperrdatei (`.git/index.lock` im Projektordner) verhindert
seit dem 17.08. das Committen. Braucht einmalig jemanden mit Zugriff auf
den Ordner, der die Datei löscht — der Platform Engineer kann das selbst
technisch nicht.
