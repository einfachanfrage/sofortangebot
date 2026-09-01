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

**Datei-Sicherheit (aktualisiert 20.08.2026):** Der Speicherfehler bei
gleichzeitiger Bearbeitung ist projektweit jetzt zum 6. Mal aufgetreten
(hier am 17.08., zuletzt in `chief-of-staff-todos.md`). Ganz am Ende dieser
Datei steht jetzt eine feste Markierung (`<!-- ENDE DER DATEI -->`). Taucht
beim Lesen noch Text NACH dieser Markierung auf, ist das zweifelsfrei ein
Speicherfehler — bitte nicht selbst löschen, sondern kurz dem Chief of Staff
melden. Zusätzlich: neue Einträge wenn möglich ans Dateiende anhängen statt
mitten in bestehende Abschnitte zu schreiben. Voller Hintergrund und der
eigentliche Lösungsvorschlag (Git-Commits statt Direkt-Überschreiben, dafür
bräuchte es genau den Terminal-/Git-Zugriff, den du laut CoS-P-005 bereits
hast): CoS-013 in `chief-of-staff-todos.md`.

## Stand auf einen Blick (angelegt: 2026-08-17)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-P-001 | Row-Level-Security bestätigen: sieht jeder Nutzer wirklich nur eigene Daten? | ✅ erledigt & geprüft | `docs/launch-readiness.md` Abschnitt 6 (vormals CoS-005) |
| CoS-P-002 | Observability herstellen: strukturiertes Logging über die wichtigsten Schritte | 🟡 Erster Schritt umgesetzt (Sentry im Kernpfad), Restarbeit sauber abgegrenzt | `docs/launch-readiness.md` Abschnitt 8 (vormals CoS-006) |
| CoS-P-003 | Accounts/Onboarding-Flow (Registrierung/Login/Logout/Passwort-Reset) einmal end-to-end testen | 🟢 Fix umgesetzt — Passwort-Reset-Bug behoben, Live-Test steht noch aus | `docs/launch-readiness.md` Abschnitt 2 (vormals CoS-003) |
| CoS-P-004 | Transaktions-E-Mails wirklich zugestellt? (Willkommen/Verifizierung/Reset) | 🟢 Fix umgesetzt — alle drei Mails laufen jetzt über unsere eigene Resend-Anbindung, Live-Test steht noch aus | `docs/launch-readiness.md` Abschnitt 3 (vormals CoS-004) |
| CoS-P-005 | Logo-Upload im Onboarding schlägt mit RLS-Fehler fehl | 🟡 DB + Produktions-Deploy erledigt & verifiziert, Live-Test im echten Onboarding-Flow steht noch aus | Sandys Screenshots vom Onboarding-Testlauf, 2026-08-17 |
| CoS-P-006 | Drei Nebenbefunde abarbeiten: check_migrationen.sql-Lücke, search_path-Warnungen, Resend-Env-Check | 🟡 zwei von drei komplett erledigt (inkl. Produktion), einer (Vercel-Env-Check) wartet auf Dashboard-Zugriff | Sandys Bitte "nebenbefunde", 2026-08-17 |

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
**Status:** 🟢 Fix umgesetzt (2026-08-25), auf Sandys Rechner ausgeliefert —
Live-Test mit echtem Klick-Durchlauf steht noch aus

**Hintergrund:** Übernommen von CoS-003. Registrierung, Login, Logout,
Passwort-Reset — nie dokumentiert end-to-end durchgespielt.

**Fix-Update (Platform & Integrations Engineer, 2026-08-24) —
Code-Review aller vier Flows:**

- **Registrierung** (`src/app/(auth)/register/page.tsx`): sauber. Passwort-
  Mindestlänge 8, AGB-Pflicht-Checkbox mit Versionsstempel
  (`agb_akzeptiert_am`/`agb_version`), generische Erfolgsmeldung unabhängig
  davon ob die E-Mail schon existiert (verhindert Account-Enumeration).
  Bestätigungslink läuft über `/auth/callback` (`src/app/auth/callback/
  route.ts`), der den PKCE-Code serverseitig korrekt gegen eine Session
  tauscht (`exchangeCodeForSession`) und danach die Willkommens-Mail
  auslöst.
- **Login** (`.../login/page.tsx`): sauber. `signInWithPassword`,
  bewusst generische Fehlermeldung „E-Mail oder Passwort falsch" (verrät
  nicht, ob die E-Mail existiert), Redirect ins Dashboard.
- **Logout** (u. a. `einstellungen/page.tsx`, `AvatarSheet.tsx`): sauber.
  `signOut()` + Redirect auf `/login`.
- **Passwort-Reset — 🔴 wahrscheinlicher Bug:** `passwort-vergessen/
  page.tsx` schickt den Reset-Link direkt auf `/passwort-reset` (nicht über
  `/auth/callback`). Die Seite `passwort-reset/page.tsx` tauscht den
  PKCE-Code aus der URL aber **nirgends aktiv gegen eine Session** — sie
  wartet nur passiv auf ein `PASSWORD_RECOVERY`-Event von
  `onAuthStateChange`. Das ist exakt das Muster aus einem bekannten,
  dokumentierten Supabase/Next.js-Problem („Auth Session Missing" beim
  PKCE-Passwort-Reset, siehe Quelle unten) — die Registrierung macht es
  beim strukturell gleichen Problem richtig (expliziter Tausch in
  `/auth/callback`), der Passwort-Reset tut es nicht. Wahrscheinlicher
  Effekt: Nutzer klickt den Reset-Link, landet auf „Link wird geprüft..."
  und das Formular erscheint nie, oder `updateUser()` schlägt mit „Auth
  session missing" fehl.

  **Konfidenz:** hoch, aber **nicht live nachgetestet** — das ist reine
  Code-/Doku-Analyse, kein tatsächlicher Klick-Durchlauf mit einem echten
  Test-Konto. Vor dem Fixen kurz live bestätigen (z. B. echte Registrierung
  + Passwort-vergessen-Link anklicken), dann fixen.

  Quelle zum bekannten Fehlerbild:
  [supabase/supabase#27816](https://github.com/supabase/supabase/issues/27816)

  **Fix umgesetzt (2026-08-25), auf Sandys Freigabe „003 ja bitte direkt
  reparieren":** Der Reset-Link läuft jetzt über `/auth/callback` statt
  direkt auf `/passwort-reset` (Redirect via `admin.generateLink({type:
  'recovery', ...})` in der neuen Route `src/app/api/auth/passwort-
  vergessen/route.ts`, siehe CoS-P-004 unten — beide Fixes hängen technisch
  zusammen, weil der Versand jetzt über dieselbe neue Route läuft). Zusätzlich
  prüft `passwort-reset/page.tsx` beim Laden aktiv per `getUser()`, ob schon
  eine Session besteht (statt nur passiv auf ein Auth-Event zu warten), und
  zeigt nach 4 Sekunden ohne Session eine „Link ungültig oder abgelaufen"-
  Seite mit Link zurück zu „Neuen Link anfordern" statt einer endlosen
  Lade-Anzeige. Die Willkommens-Mail-Logik in `auth/callback/route.ts`
  bleibt unberührt (`next.includes('/onboarding')` greift für
  `/passwort-reset` weiterhin nicht).

  **Noch offen:** kein Live-Klick-Durchlauf mit echtem Test-Konto und
  echtem Posteingang (aus dieser Session heraus kein E-Mail-Zugriff
  möglich) — Code-Review + bekanntes Fehlerbild ergeben hohe Konfidenz,
  aber der Fix ist nicht scharf gegen ein echtes Postfach getestet. Ein
  automatischer TypeScript-Check der geänderten Dateien war im
  Geräte-Terminal aus Ressourcengründen nicht vollständig durchführbar
  (bricht regelmäßig nach 45s ab) — sollte aber beim Vercel-Deploy selbst
  auffallen, falls doch ein Tippfehler drin wäre, da der Build bei
  TypeScript-Fehlern automatisch abbricht.

**Nicht Teil dieser Runde:** Rate-Limit/Captcha gegen automatisierte
Massen-Registrierung (`launch-readiness.md` 2.6) und Session-/Token-Ablauf
im Detail (2.7) — reine Supabase-Dashboard-Einstellungen, aus dieser
Session nicht einsehbar, bräuchten einen Blick von jemandem mit
Dashboard-Zugriff.

---

## CoS-P-004 — Transaktions-E-Mails auf echte Zustellung prüfen

**Datum:** 2026-08-17
**Status:** 🟢 Fix umgesetzt (2026-08-25), auf Sandys Rechner ausgeliefert —
alle drei Mails laufen jetzt über die eigene Resend-Anbindung, Live-Test
steht noch aus

**Hintergrund:** Übernommen von CoS-004. Unklar, ob Willkommens-/
Verifizierungs-/Reset-Mails wirklich zugestellt werden, nicht nur im Code
ausgelöst.

**Fix-Update (Platform & Integrations Engineer, 2026-08-24):**

- **Wichtigster Fund:** Von den drei Pflicht-Mails läuft nur die
  **Willkommens-Mail** über die eigene, sauber aufgesetzte Resend-Anbindung
  (`src/lib/email.ts`, Absender `sandra@sofortangebot.app`). Die
  **Verifizierungs-Mail** (bei Registrierung) und die **Reset-Mail** (bei
  Passwort vergessen) werden dagegen von **Supabase selbst** verschickt —
  ausgelöst durch `supabase.auth.signUp()` bzw.
  `resetPasswordForEmail()`, nicht durch unseren Resend-Code. Das ist eine
  strukturell andere, aus dem Code heraus nicht einsehbare Versandstrecke:
  ob die dabei Supabase-eigene Standard-Mail-Infrastruktur nutzt (bekannt
  für niedrige Rate-Limits und schwache Zustellbarkeit) oder ob dafür schon
  ein eigenes SMTP (z. B. über Resend) im Supabase-Dashboard hinterlegt
  ist, lässt sich nicht per Code/API prüfen — das steht unter
  Authentication → Emails → SMTP Settings im Supabase-Dashboard, sowohl auf
  Staging als auch auf Produktion.

  **Bitte kurz gegenchecken (Dashboard-Zugriff nötig):** Ist dort Custom
  SMTP aktiv? Falls nicht, ist das der wahrscheinlichste Grund für
  unzuverlässige Zustellung bei Verifizierung/Reset — würde ich empfehlen,
  dieselbe Resend-Verbindung wie für die Willkommens-Mail zu nutzen, dann
  laufen alle drei Mails über dieselbe, bereits sauber authentifizierte
  Strecke.

- **DNS-Check der Versanddomain `sofortangebot.app`** (heute per DNS-Abfrage
  geprüft, nicht nur behauptet):
  - **DKIM für Resend** (`resend._domainkey.sofortangebot.app`): ✅ korrekt
    gesetzt, gültiger Schlüssel vorhanden. Die Willkommens-Mail sollte
    DKIM-authentifiziert ankommen.
  - **SPF** (`v=spf1 include:_spf-eu.ionos.com ~all`): deckt nur den
    normalen Geschäfts-Mail-Versand über IONOS ab, **nicht** Resend. Kein
    akutes Problem, weil DMARC bereits per DKIM-Alignment durchkommt
    (From-Domain = DKIM-Domain = `sofortangebot.app`) — für volle
    Absicherung könnte man zusätzlich `include:amazonses.com` (Resend
    versendet über AWS SES) ergänzen, ist aber kein Blocker.
  - **DMARC** (`_dmarc.sofortangebot.app`): gesetzt, aber `p=none` —
    reiner Beobachtungsmodus, keine Durchsetzung. Für den Start okay,
    könnte später auf `p=quarantine` verschärft werden, sobald Vertrauen
    in den Versand besteht.

- **Fix umgesetzt (2026-08-25), auf Sandys Freigabe „004 bitte b)":**
  Option (b) — Verifizierungs- und Reset-Mail laufen jetzt beide über
  unsere eigene Resend-Anbindung statt über Supabase, genau wie die
  Willkommens-Mail. Damit entfällt der Dashboard-Gegencheck oben komplett;
  es muss nichts mehr manuell geprüft werden.
  - Neue Route `src/app/api/auth/register/route.ts`: legt den Nutzer per
    `admin.createUser()` an (liefert sauber einen 422 bei bereits
    existierender E-Mail, ohne das bestehende Konto anzufassen) und
    verschickt danach die Bestätigungs-Mail selbst über
    `sendVerificationEmail()`.
  - Neue Route `src/app/api/auth/passwort-vergessen/route.ts`: erzeugt den
    Reset-Link per `admin.generateLink({type:'recovery', ...})` und
    verschickt ihn über die neue `sendPasswordResetEmail()` — Antwort ist
    bewusst immer „E-Mail gesendet", egal ob die Adresse existiert (verhindert
    Account-Enumeration, wie zuvor bei Supabases eigenem Versand).
  - `register/page.tsx` und `passwort-vergessen/page.tsx` rufen jetzt diese
    beiden Routen auf statt Supabase direkt.
  - Beide neuen Mail-Bausteine (`sendVerificationEmail`,
    `sendPasswordResetEmail`) liegen in `src/lib/email.ts`, gleiche
    Vorlage/Absender wie die bestehende Willkommens-Mail.

- **Noch offen, aus dieser Session heraus nicht möglich:** eine echte
  Zustellung live beobachten (Test-Registrierung durchspielen, schauen ob
  die Mail ankommt/im Spam landet) und der Vercel-Env-Check für den
  rotierten Resend-Key aus CoS-P-006 (Prod + Preview gesetzt?).

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
**Status:** 🟡 zwei von drei komplett erledigt (inkl. Produktion), einer
wartet auf Dashboard-Zugriff

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
- **`search_path` bei 9 Funktionen — ✅ erledigt (Staging + Produktion):**
  Migration `supabase/migrations/20260818000000_fix_function_search_path.sql`
  setzt `search_path = public, pg_temp` fest für alle 9 betroffenen
  Funktionen (Signaturen vorher per `pg_proc` abgefragt, nicht geraten).
  Reiner Härtungs-Fix, kein Verhaltensunterschied für die App. Erst auf
  Staging, am 2026-08-25 auf Sandys Freigabe ("ja mach 1 live") auch auf
  Produktion angewendet und per Security-Advisor verifiziert — die
  `search_path`-Warnung ist auf beiden Umgebungen weg.
- **"Leaked Password Protection" aus — ✅ erledigt:** Sandy hat den Schalter
  am 2026-08-17 in beiden Supabase-Projekten (Staging + Produktion) selbst
  im Dashboard aktiviert, per Security-Advisor bestätigt.

**Nebenbei beim Security-Advisor-Check entdeckt, NICHT Teil dieses Punkts
(neuer Fund, nur notiert):** mehrere `SECURITY DEFINER`-Funktionen
(`check_rate_limit`, `get_vault_secret`, `handle_new_user`,
`increment_nutzung`, `init_nummernkreise`, `vergib_naechste_nummer`) sind
auch für nicht eingeloggte Besucher (`anon`) über die REST-API aufrufbar.
Das muss nicht zwangsläufig ein Fehler sein (z. B. `handle_new_user` läuft
vermutlich bewusst beim Registrieren), aber verdient einen eigenen,
gezielten Blick — nicht einfach mit hier durchgewunken.

**Weiterer Nebenfund beim Produktions-Advisor-Check (2026-08-25, nur
notiert):** Tabelle `public.rate_limit_log` hat RLS aktiviert, aber keine
Policy hinterlegt (reine Info-Meldung, kein Sicherheitsrisiko, da RLS ohne
Policy standardmäßig alles blockt statt öffnet — aber falls dort mal Zugriff
gebraucht wird, fehlt aktuell die Regel dafür).

**3. Vercel-Env-Check für den rotierten Resend-Key (aus CoS-P-005) — ❌
weiterhin offen:** Kein Vercel-Dashboard-Zugriff aus dieser Session. Bitte
kurz selbst gegenchecken (Vercel → Projekt → Settings → Environment
Variables → `RESEND_API_KEY`): ist der neue Key für **Production UND
Preview** gesetzt, und war nach dem Setzen ein Redeploy nötig, damit die
laufende App ihn zieht?

---

## Organigramm-Änderung (Chief of Staff, 2026-09-01)

Neue Position: **Head of Legal & Compliance**, seit 01.09.2026 — auf Sandys
dringende Anfrage eingerichtet. Deckt zwei Bereiche ab: (A) SaaS-/
Digitalrecht (Datenschutz, AGB, KI-Kennzeichnungspflichten) und (B) Gewerke-/
Baurecht für die Angebotserstellung. Volle Rollenbeschreibung:
`docs/team-organigramm.md`, Koordination läuft über
`docs/chief-of-staff-legal-todos.md` (ID-Schema CoS-L-XXX).

Relevant für dich: Datenschutz-/DSGVO-Fragen betreffen ggf. Accounts/Login,
RLS/Datentrennung und Transaktions-E-Mails — also deinen Bereich. Falls Legal
dazu Rückfragen zur technischen Umsetzung hat, kommen die über den Chief of
Staff — noch kein eigener direkter Austausch-Kanal, wird bei Bedarf ergänzt.

---

## Anfrage vom Head of Legal & Compliance (2026-09-01) — CoS-P-001 hat eine datenschutzrechtliche Seite, die noch offen ist

Neue Datei: **`docs/legal-003-compliance-check.md`**, Punkt **CC-01**. Bitte
einmal lesen, es betrifft direkt deinen Fund vom 17.08.

**Worum es geht.** Der `debug_extraktion_roh`-Fund war technisch mustergültig
behandelt: direkt auf Produktion geschlossen, sofort verifiziert, Migration
nachgetragen, anschließend alle 19 Service-Rollen-Stellen durchgesehen. Daran
gibt es nichts auszusetzen — im Gegenteil, dass du die Datentrennung auf
Datenbankebene für alle 22 Tabellen geprüft hast statt nur den Code zu lesen,
ist der Grund, warum der Fund überhaupt aufgefallen ist.

**Was fehlt, ist die zweite Hälfte.** Der Vorfall wurde als Sicherheitslücke
abgelegt, aber nie als das bewertet, was er zusätzlich ist: eine mögliche
Verletzung des Schutzes personenbezogener Daten nach Art. 4 Nr. 12 DSGVO.
Personenbezogene Daten (Sprach-Transkripte mit Kundennamen, Adressen,
Objektdaten) waren zehn Tage lang für jeden mit dem öffentlichen
Website-Schlüssel lesbar.

Daraus folgt eine Pflicht, die **unabhängig davon besteht, ob eine Meldung
nötig war**: Art. 33 Abs. 5 DSGVO verlangt, jede solche Verletzung zu
dokumentieren — Fakten, Auswirkungen, ergriffene Maßnahmen. Diese
Dokumentation gibt es nicht, und sie fehlt seit dem 17.08.

**Was ich von dir brauche, um das zu bewerten** (ich kann es von hier nicht
sehen):

1. **Welche und wessen Daten lagen zwischen dem 07. und 17.08. tatsächlich in
   der Tabelle?** Meine Vermutung nach Aktenlage: nur die zwei bestehenden
   Konten, beide intern bzw. Test. Wenn das stimmt, war eine Meldung
   voraussichtlich nicht erforderlich — aber ich brauche die Feststellung, nicht
   meine Vermutung.
2. **Zugriffsprotokolle für den Zeitraum.** Supabase-/PostgREST-Logs: gab es
   Abfragen auf `debug_extraktion_roh` von außen? Wenn sich ein Zugriff sicher
   ausschließen lässt, ändert das die Bewertung erheblich. **Falls die Logs
   inzwischen rotiert sind, ist auch das ein Ergebnis** — bitte dann kurz
   festhalten, ab wann keine Daten mehr vorliegen, statt es offen zu lassen.
3. **Waren echte Handwerkerkonten dabei?** Falls ja, schuldeten wir dem
   jeweiligen Betrieb als Verantwortlichem eine unverzügliche Mitteilung nach
   Art. 33 Abs. 2 — die bisher nicht erfolgt ist.

Sobald ich die drei Punkte habe, schreibe ich die Bewertung und lege sie ab.
**Bitte nichts vorschnell an die Aufsichtsbehörde melden** — erst Fakten, dann
Bewertung, dann Entscheidung. Eine Meldung mit unklarer Faktenlage schafft mehr
Probleme, als sie löst.

**Zwei weitere Punkte aus derselben Ecke, die ich dir gleich mitgebe:**

**CC-01, Teil 2 — die Tabelle existiert noch.** Du hattest ihre Entfernung als
„möglicher Folgepunkt, falls gewünscht" notiert. Aus Datenschutzsicht ist sie
gewünscht: Roh-Transkripte ohne definierte Löschfrist verstoßen gegen die
Speicherbegrenzung (Art. 5 Abs. 1 lit. e) und die Datenminimierung (lit. c) —
unabhängig vom Vorfall. Deine Einschätzung, sie nicht auf Staging zu
replizieren, sondern als Altlast zu behandeln, war goldrichtig.

**CC-02 — die Kontolöschung löscht nichts.** `api/account/delete` setzt
`companies.deleted_at`, kündigt Stripe, schickt eine Bestätigungsmail und
loggt aus. In `vercel.json` steht genau ein Cronjob (`reminder`), einen
Löschjob gibt es nicht; `deleted_at` liest nur das Wiederherstellungs-Banner.
Der Soft-Delete mit 30-Tage-Rückholfrist ist die **richtige** Konstruktion, es
fehlt nur der zweite Halbschritt. Solange er fehlt, sagen Datenschutzerklärung
§ 8, AGB § 6.5, AVV § 3 und die Bestätigungs-E-Mail an jeden Nutzer etwas
Unzutreffendes (Art. 17 und Art. 5 Abs. 1 lit. a DSGVO). Zu löschen wären
`quotes`, `quote_items`, `customers`, `companies`, die Extraktions-Caches, der
Auth-Nutzer und die Storage-Objekte; handelsrechtlich Aufbewahrungspflichtiges
(§ 257 HGB, § 147 AO) gehört in einen definierten gesonderten Bestand.

Kleiner Zusatzwunsch dazu: Die Bestätigungsmail sollte zwischen „Konto
deaktiviert, Rückholung bis TT.MM. möglich" und der späteren tatsächlichen
Löschung unterscheiden. Ehrlicher — und besser für die Rückgewinnung.

**Und eine Bitte für die Zukunft, die kein Vorwurf ist:** Jeder
Sicherheitsbefund, bei dem personenbezogene Daten zugänglich waren oder
gewesen sein könnten, geht ab sofort zusätzlich an mich — nicht statt der
technischen Behebung, sondern parallel dazu. Die 72-Stunden-Uhr läuft ab
Kenntnis, nicht ab Behebung. Im August gab es diese Rolle noch nicht; deshalb
ist niemandem etwas vorzuwerfen. Ab jetzt gibt es sie.

Rückfragen laut Organigramm über den Chief of Staff — bei diesem Punkt gern
auch direkt hier in der Datei, das ist schneller.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->

