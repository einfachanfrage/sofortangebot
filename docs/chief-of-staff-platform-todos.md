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
| CoS-P-005 | Logo-Upload im Onboarding schlägt mit RLS-Fehler fehl | 🟡 DB + Produktions-Deploy erledigt & verifiziert, Live-Test im echten Onboarding-Flow steht noch aus | Sandys Screenshots vom Onboarding-Testlauf, 2026-08-17 |
| CoS-P-006 | Drei Nebenbefunde abarbeiten: check_migrationen.sql-Lücke, search_path-Warnungen, Resend-Env-Check | 🟡 zwei von drei erledigt, einer (Vercel-Env-Check) wartet auf Dashboard-Zugriff | Sandys Bitte "nebenbefunde", 2026-08-17 |

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
**Status:** 🟡 DB + Produktions-Deploy erledigt & verifiziert, Live-Test im echten Onboarding-Flow steht noch aus

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
- **Nebenbefund:** `supabase/check_migrationen.sql` hatte schon vor diesem
  Fix eine Lücke — drei Migrationen zwischen `#50` und dieser hier fehlten
  im Status-Check komplett. Nicht Teil dieses Fixes, aber notiert.
- **Git-Sperrdatei-Blocker (17.08.) gelöst:** `.git/HEAD.lock` bzw.
  `.git/index.lock` hingen fest und verhinderten jeden Commit/Push — Sandy
  hat die Dateien auf ihrem Rechner gelöscht, danach lief alles durch.
- **Gepusht auf `main`:** Commit `3bcfc2b` (ursprünglich `01ec0d7`, dann per
  `git commit --amend` bereinigt, siehe Sicherheitsfund unten), 25 Dateien.
  **Wichtig:** ist direkt auf `main` gelandet, nicht über `develop` →
  Staging-Test wie im normalen Workflow vorgesehen — das lokale Terminal
  stand zum Zeitpunkt des Commits schon auf `main`. Ob dadurch automatisch
  ein Vercel-Produktions-Deploy der App ausgelöst wurde, ist ungeprüft.
- **Sicherheitsfund beim Pushen:** GitHub Push Protection hat den ersten
  Push-Versuch blockiert — `.claude/settings.local.json` enthielt einen
  Resend-API-Key im Klartext (`re_JA1uDZRb...`), unabhängig von diesem Fix
  schon länger in der Historie. Zeile entfernt, Commit amended, sauber
  gepusht. **Erledigt (Sandy, 2026-08-17):** Key im Resend-Dashboard
  rotiert/widerrufen, alter Key aus der Git-Historie damit wertlos. Neuen
  Key auch direkt selbst in den Vercel-Umgebungsvariablen hinterlegt.
  Prüfen (Platform Engineer, kurz gegenchecken): ob prod UND preview
  gesetzt sind und ob ein Redeploy nötig ist, damit die laufende App den
  neuen Key wirklich zieht. **Noch offen** — kein Vercel-Zugriff aus dieser
  Session heraus, muss jemand mit Dashboard-Zugriff kurz gegenchecken.
- **Migration angewendet (Platform Engineer, 2026-08-17, mit Sandys
  ausdrücklicher `DEPLOY-PRODUCTION`-Bestätigung):** Der GitHub-Actions-
  Workflow war aus dieser Session heraus nicht auslösbar (kein
  Actions-Zugriff auf das Repo, nur Lesezugriff). Migration stattdessen
  direkt über die Supabase-Verwaltungs-API angewendet — erst auf Staging
  (`bkldyddstovvkkhpiqiy`), dann verifiziert, dann identisch auf Produktion
  (`yqlledouhfovytifeekd`), dann verifiziert (4 Policies + Bucket vorhanden
  auf beiden). Security-Advisor-Check auf Produktion danach durchlaufen:
  keine neuen Warnungen durch diesen Fix, nur die bekannten alten
  (search_path, Leaked-Password-Protection, `rate_limit_log`ohne Policy —
  siehe CoS-P-001-Notiz oben). **Abweichung vom dokumentierten Workflow:**
  dadurch wurden keine `migration-status-*.txt`-Artefakte über die GitHub
  Action erzeugt, wie es `docs/operations/database-and-environments.md`
  eigentlich vorsieht (Vorher-/Nachher-Nachweis als Artefakt). Sollte bei
  Gelegenheit nachgezogen werden (z. B. den Workflow einmal im `audit`-Modus
  laufen lassen, damit der dokumentierte Nachweis existiert) — inhaltlich
  ist die Migration aber angewendet und verifiziert.
- **Produktions-Deploy war nach dem Migrations-Fix zunächst kaputt, jetzt
  behoben (Platform Engineer, 2026-08-17):** Nach der `DEPLOY-PRODUCTION`-
  Bestätigung wollte Sandy zusätzlich prüfen, ob der frühere Push auf `main`
  versehentlich einen Vercel-Deploy ausgelöst hatte. Ergebnis: ja — und der
  Build war **fehlgeschlagen** (Sandys Vercel-Screenshot zeigte "Build
  Failed"). Fehler laut Vercel-Log: `Turbopack build failed ... ./src/app/api/
  angebot-extrahieren/route.ts:16:8 Expected ',', got '*'`.
  **Root Cause:** Kein Zusammenhang mit dem Logo-Fix selbst, sondern eine
  Merge-Kollision in einer Datei aus dem Zuständigkeitsbereich Head of
  Product Engineering: `import * as Sentry from '@sentry/nextjs'`
  (vermutlich aus paralleler Observability-Arbeit, CoS-P-002) war mitten in
  ein anderes mehrzeiliges Import-Statement (`extraktion-masse`) hineingerutscht
  statt danach zu stehen — dadurch ungültiges JavaScript. **Fix:** Sentry-
  Import-Zeile hinter die schließende Klammer des `extraktion-masse`-Imports
  verschoben, per Skript verifiziert (Klammer-Balance geprüft). Commit
  `228bdc7` ("fix: kaputten Import in angebot-extrahieren/route.ts
  reparieren (Vercel-Build-Fehler)"), 1 Datei geändert, von Sandy gepusht.
  Vercel-Screenshot danach bestätigt: Deploy für `228bdc7` steht auf
  **"Ready"** — Produktion baut wieder erfolgreich. Der vorherige fehlerhafte
  Deploy-Versuch (`3bcfc2b`) bleibt in der Vercel-Historie als "Error"
  stehen, das ist unproblematisch, da `228bdc7` der aktuelle Produktionsstand
  ist. **Cross-Ref:** siehe `docs/engineering-austausch.md` EX-002 — dieser
  Fund betrifft eine Datei aus dem Product-Engineering-Bereich und wurde dort
  zusätzlich vermerkt, da er nicht durch den Logo-Fix verursacht wurde.
- **Noch offen:** Live-Test im echten Onboarding-Flow (Logo tatsächlich
  über die UI hochladen und bestätigen) steht noch aus — DB-seitig und
  deploy-seitig ist jetzt alles bereit (Migration verifiziert, Produktions-
  Build wieder grün). Auf ✅ setzen, sobald das einmal live durchgeklickt
  wurde.

---

## CoS-P-006 — Drei Nebenbefunde abarbeiten

**Datum:** 2026-08-17
**Status:** 🟡 zwei von drei erledigt, einer wartet auf Dashboard-Zugriff

**Hintergrund:** Sammelte sich aus vorherigen Punkten an — drei nur notierte,
nicht gefixte Kleinfunde. Sandy bat mit "nebenbefunde" darum, sie abzuräumen.

**1. `check_migrationen.sql`-Lücke (aus CoS-P-005) — ✅ erledigt:**
Drei Migrationen zwischen `#50` und der Logo-Migration fehlten im
Status-Check: `20260807054617_add_extraktion_logging`,
`20260817180000_secure_debug_extraktion_roh`,
`20260817180100_drop_duplicate_briefpapiere_policy`. Alle drei als #51–#53
ergänzt (Logo-Migration dadurch zu #54 verschoben), Prüf-Logik pro Migration
gegen das jeweils erwartete Datenbank-Objekt geschrieben.

**Dabei ein echter, bisher unbekannter Fund:** Der neue Check zeigte, dass
zwei dieser Migrationen (`add_extraktion_logging`,
`secure_debug_extraktion_roh`) zwar auf Produktion angewendet waren, auf
Staging aber fehlten — echte Umgebungs-Drift, nicht nur eine Doku-Lücke.
`add_extraktion_logging` (zwei neue Spalten auf `quotes`) direkt auf Staging
nachgezogen und verifiziert. `secure_debug_extraktion_roh` ließ sich auf
Staging nicht anwenden, weil die betroffene Tabelle `debug_extraktion_roh`
dort gar nicht existiert — sie wurde laut CoS-P-001-Fund am 07.08. manuell
(nicht per Migration) direkt in Produktion angelegt, rein als Debug-Hilfe.
**Bewusst nicht nachgezogen:** die Tabelle jetzt auch auf Staging anzulegen,
nur um den Check grün zu bekommen, wäre das falsche Signal — sie ist eine
Altlast, die eigentlich eher aufgeräumt (in Produktion entfernt) als
repliziert gehört. Als Kommentar direkt im Check-Skript vermerkt, damit ein
"FEHLT" bei #52 auf Staging nicht als Handlungsaufforderung missverstanden
wird. **Möglicher Folgepunkt, falls gewünscht:** `debug_extraktion_roh` in
Produktion ganz entfernen, wenn sie nicht mehr gebraucht wird.

**2. Zwei allgemeine Supabase-Warnhinweise aus CoS-P-001 — 🟡 halb erledigt:**
- **`search_path` bei 9 Funktionen — ✅ erledigt (auf Staging):** Neue
  Migration `supabase/migrations/20260818000000_fix_function_search_path.sql`
  setzt `search_path = public, pg_temp` fest für alle 9 betroffenen
  Funktionen (Signaturen vorher per `pg_proc` abgefragt, nicht geraten).
  Reiner Härtungs-Fix, kein Verhaltensunterschied für die App. Auf Staging
  angewendet und verifiziert (Warnung im Security-Advisor verschwunden).
  **Auf Produktion noch nicht angewendet** — wartet auf deine
  `DEPLOY-PRODUCTION`-Bestätigung wie beim Logo-Fix.
- **"Leaked Password Protection" aus — ❌ weiterhin offen:** Das ist kein
  SQL-Fix, sondern ein Schalter im Supabase-Dashboard (Auth-Einstellungen →
  Password Security), auf den diese Session keinen Zugriff hat. Ein Klick,
  sobald jemand mit Dashboard-Zugriff kurz reinschaut.

**Nebenbei beim Security-Advisor-Check entdeckt, NICHT Teil dieses Punkts
(neuer Fund, nur notiert):** mehrere `SECURITY DEFINER`-Funktionen
(`check_rate_limit`, `get_vault_secret`, `handle_new_user`,
`increment_nutzung`, `init_nummernkreise`, `vergib_naechste_nummer`) sind
auch für nicht eingeloggte Besucher (`anon`) über die REST-API aufrufbar.
Das muss nicht zwangsläufig ein Fehler sein (z. B. `handle_new_user` läuft
vermutlich bewusst beim Registrieren), aber verdient einen eigenen,
gezielten Blick — nicht einfach mit hier durchgewunken.

**3. Vercel-Env-Check für den rotierten Resend-Key (aus CoS-P-005) — ❌
weiterhin offen:** Kein Vercel-Dashboard-Zugriff aus dieser Session. Bitte
kurz selbst gegenchecken (Vercel → Projekt → Settings → Environment
Variables → `RESEND_API_KEY`): ist der neue Key für **Production UND
Preview** gesetzt, und war nach dem Setzen ein Redeploy nötig, damit die
laufende App ihn zieht?
