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

**Nachtrag (2026-09-03, Platform & Integrations Engineer):** Genau dieser
Speicherfehler ist heute an dieser Stelle passiert — die Abschnitte CoS-P-007
und CoS-P-008 waren mitten in diesen Absatz hineingerutscht (der Satz oben
riss nach „eine feste Markierung (`" ab und sprang erst nach dem CoS-P-008-
Abschnitt wieder in den ursprünglichen Text zurück). Beide Abschnitte waren
inhaltlich vollständig und unverändert, nur an der falschen Stelle. Nach der
eigenen Regel aus diesem Absatz repariert (nicht gelöscht, an den Wortlaut
gehalten): an die korrekte Stelle ans Dateiende verschoben, direkt vor die
Endmarkierung, wie es die Konvention „neue Einträge ans Dateiende anhängen"
ohnehin vorsieht. Kein Inhalt wurde dabei verändert, nur die Position.

## Stand auf einen Blick (angelegt: 2026-08-17)

| ID | Thema | Status | Quelle |
|---|---|---|---|
| CoS-P-008 | Skalierungs-Kostenmodell: was wächst mit Nutzern, was mit Angeboten, was bleibt flach? | 🟡 Struktur + Zahlen geliefert, Rückmeldung an Head of Finance offen | Sandys Frage zum Finanzplan, 2026-09-03 |
| CoS-P-007 | Stripe auf das neue Preismodell umstellen (49 €, Gründerpreis 29 € × 25 Plätze, 14 Tage Test ohne Kreditkarte) | ❌ offen, kann sofort starten | Sandys Preisentscheidung 2026-09-03, `docs/preismodell.md` |
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

**Nachtrag (2026-09-02) — Anfrage von Head of Legal & Compliance (CC-01),
abgeschlossen:** Datenschutzrechtliche Aufarbeitung des
`debug_extraktion_roh`-Funds oben (wer/welche Daten waren betroffen,
Zugriffsprotokolle, echte Kundenkonten betroffen?). Vollständige Antwort in
`docs/platform-notiz-fuer-head-of-legal.md`. Kurzfassung: keine
protokollierten Lese- oder Anonym-Zugriffe im gesamten Offenzeitraum
gefunden; betroffen waren ausschließlich Sandys eigenes Konto und zwei
ihrer eigenen (inzwischen gelöschten) Test-Konten — von Sandy am 2026-09-02
bestätigt. Keine echten Handwerkerkonten betroffen.

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

## CoS-P-007 — Stripe auf das neue Preismodell umstellen

**Datum:** 2026-09-03 (Chief of Staff, nach Sandys Preisentscheidung)
**Status:** ❌ offen — kann sofort gestartet werden
**Heimat der Entscheidung:** `docs/preismodell.md`

**Das neue Modell:** 49 € netto/Monat pro Betrieb, unbegrenzt Angebote,
monatlich kündbar · **kein** Dauer-Gratis-Tarif · **14 Tage voller Test ohne
Kreditkarte** · **Gründerpreis 29 €/Monat dauerhaft für die ersten 25
zahlenden Betriebe** · **kein** Jahresabo zum Launch · keine Staffelung nach
Nutzerzahl.

**Was daran deine Seite ist (das Wie liegt bei dir):**
1. Stripe-Produkte/Preise entsprechend anlegen — Standard und Gründerpreis.
   Der Gründerpreis ist **kein befristeter Rabatt**, sondern ein dauerhaft
   anderer Preis: wer damit einsteigt, zahlt ihn auf Dauer, auch wenn der
   Standardpreis später steigt. Bitte so bauen, dass eine spätere
   Preisänderung Bestandskunden technisch **nicht** mitziehen kann — das ist
   ein Versprechen, das wir nicht aus Versehen brechen dürfen.
2. **Die 25 Gründerplätze müssen serverseitig gezählt werden**, nicht von Hand
   und nicht im Frontend. Wenn Platz 26 kommt, greift automatisch 49 €.
3. **Testphase: 14 Tage, ohne hinterlegte Zahlungsmethode.** Bewusst so — es
   soll keine stille automatische Abbuchung nach Ablauf geben. Wie der
   Übergang danach aussieht (aktive Entscheidung des Nutzers), ist ein Punkt,
   den Legal unter CoS-L-002 mitbewertet; bitte dort kurz gegenlesen, bevor du
   die Mechanik final festzurrst.
4. **Kein Jahresabo einbauen.** Nicht „schon mal vorbereiten" — es soll zum
   Launch nicht existieren. Kommt ab Gate 2.
5. **Zusammenhang mit L7:** Es darf kein Abo abgeschlossen werden können,
   solange es keinen echten „Abo kündigen"-Weg gibt (AGB §6.2 verspricht ihn
   bereits). Beides gehört in denselben Durchgang.

Produkt-Texte und `src/lib/pricing.ts` laufen parallel über CoS-038 (Head of
Product Engineering) — bitte kurz abstimmen, damit Anzeige und Abrechnung
nicht auseinanderlaufen.

---

## CoS-P-008 — Wie wachsen die Betriebskosten mit der Nutzerzahl?

**Datum:** 2026-09-03 (Chief of Staff, aus Sandys Frage zum Finanzplan)
**Status:** 🟡 Struktur + Zahlen geliefert, Rückmeldung an Head of Finance offen

**Sandys Frage, wörtlich:** die Supabase-Kosten liegen bei rund 50 € im Monat —
„oder ggfs steigen bei mehr nutzern? keine ahnung weiß ich nicht ob
hosting/provider iwie steigt oderso."

Das ist keine Finanz-, sondern eine Infrastrukturfrage, deshalb kommt sie zu
dir. Head of Finance baut gerade den Finanzplan (CoS-F-003, 24 Monate, drei
Szenarien) und braucht dafür **kein exaktes Modell, sondern eine belastbare
Struktur**: was bleibt flach, egal wie viele Nutzer dazukommen, was wächst pro
Nutzer, und was wächst pro erstelltem Angebot.

**Was gebraucht wird — bitte pro Dienst, nicht als Gesamtsumme:**
1. **Supabase** — welche Größen treiben die Rechnung (Datenbankgröße,
   Objektspeicher für Sprachaufnahmen und Fotos, Egress, Realtime-Verbindungen,
   Edge-Function-Aufrufe)? Was ist im aktuellen Tarif enthalten, wo liegen die
   Grenzen, und was kostet der nächste Schritt darüber?
2. **Vercel** — dasselbe für Function-Aufrufe, Laufzeit und Bandbreite.
3. **Resend** — E-Mail-Volumen pro Nutzer und Monat, Freikontingent, nächste
   Stufe.
4. **Sentry** — Ereignisvolumen, Freikontingent, nächste Stufe.
5. **Objektspeicher über die Zeit** — durch die 30-Tage-Löschung sollte er sich
   stabilisieren statt endlos zu wachsen; bitte einmal bestätigen, ob das
   wirklich so greift (der Cron-Punkt hängt noch an Sandy).

**Konkret hilfreich wäre eine Aussage in der Form** „bei 50 aktiven Betrieben
mit je 8 Angeboten im Monat liegen wir bei X, bei 200 Betrieben bei Y, und der
erste Tarifsprung kommt bei Z". Grob gerechnet ist völlig in Ordnung —
**wichtiger als Genauigkeit ist, dass die Treiber benannt sind** und dass
klar wird, wo eine Stufe springt.

**Nicht Teil dieses Punktes:** die Kosten pro Angebot für Whisper und GPT-4o —
die laufen über CoS-038 (Head of Product Engineering) und CoS-F-002.

**Fix-Update (Platform & Integrations Engineer, 2026-09-03) — Struktur +
echte Zahlen aus Produktion, plus ein konkreter Gegenfund bei Punkt 5:**

**Deine 50 €/Monat erklärt:** Das sind zwei Supabase-Projekte (Staging
`bkldyddstovvkkhpiqiy` + Produktion `yqlledouhfovytifeekd`), beide auf dem
Pro-Tarif zu je 25 $/Monat = 50 $/Monat. Kein Nutzungs-Aufschlag bisher — der
volle Betrag ist reine Grundgebühr. Aktuelle Auslastung in Produktion (zum
Vergleich mit den Tarifgrenzen): Datenbank 22 MB (Grenze: 8 GB, dann 0,125
$/GB), Objektspeicher 87 MB (Grenze: 100 GB, dann 0,0213 $/GB) — beides unter
1 % der jeweils inkludierten Menge.

**Was pro Dienst treibt die Rechnung, und wann:**

- **Supabase (aktuell 2 × 25 $ = 50 $/Monat Grundgebühr, Pro-Tarif):**
  Bleibt **flach**: Datenbankgröße — Firmen- und Angebotsdaten sind pro
  Zeile winzig, die geteilte Preisdatenbank (2.650 Positionen) wächst nicht
  mit der Nutzerzahl. Selbst bei sehr viel mehr Betrieben bleibt das im
  niedrigen einstelligen GB-Bereich, weit unter der 8-GB-Grenze. Wächst
  **mit Angeboten**: Objektspeicher (Sprachaufnahmen, dazu unten mehr) und
  Egress (PDF-Downloads, öffentliche Freigabelinks — 250 GB inklusive, PDFs
  sind klein, viel Puffer) und Edge-Function-Aufrufe (2 Mio. inklusive, dann
  2 $/1 Mio.). Wächst **mit Nutzerzahl**: Realtime-Verbindungen während der
  Spracheingabe (500 inklusive, dann 10 $/1.000 — bei realistischer Nutzung
  sehr viel Puffer, weil nicht alle Betriebe gleichzeitig online sind). Der
  nächste Tarifsprung (Team, 599 $/Monat) bringt kaum mehr enthaltene
  Ressourcen, sondern vor allem Compliance/Support — realistisch bewegt man
  sich erstmal innerhalb von Pro plus Verbrauchsaufschlägen, nicht in einen
  höheren Tarif.

- **Vercel (aktuell Pro-Team, 20 $/Monat pro Sitzplatz, 1 Sitzplatz):**
  Sitzplätze bleiben **flach** (wachsen nur mit Personal, nicht mit
  Nutzern). Wächst **mit Angeboten**: Funktionsaufrufe (Hochladen,
  Transkribieren, Extrahieren, PDF erzeugen, Mail versenden — mehrere pro
  Angebot; 1 Mio./Monat inklusive, dann ab 0,60 $/1 Mio.) und Bandbreite
  (1 TB inklusive, dann ab 0,15 $/GB) — bei PDF-großen Dateien enormer
  Puffer.

- **Resend (aktuell auf Kostenlos-Kontingent, 3.000 Mails/Monat, 100/Tag):**
  Wächst **mit Angeboten** (Angebot-gesendet-Bestätigung, eine pro Angebot)
  und **mit Nutzerzahl** (Willkommens-/Bestätigungs-Mail, einmalig pro
  neuem Konto). Tatsächlicher Stand: 76 Angebote seit Projektstart, alle
  versendet, davon 50 in den letzten 30 Tagen — also aktuell rund 25
  Angebots-Mails im Monat plus vereinzelte Konto-Mails. Nächste Stufe: Pro,
  50.000 Mails/Monat für 20 $/Monat, danach 0,90 $ je weiteren 1.000. Bei der
  aktuellen Rate müsste sich das Angebotsvolumen etwa verhundertfachen
  (rund 3.000 Angebote/Monat), bevor der Gratis-Rahmen eng wird.

- **Sentry (Fehler-Überwachung, siehe CoS-P-002):** Aktueller Stand: **0
  Fehler in den letzten 30 Tagen** — voll im Rahmen des Gratis-Tarifs
  (5.000 Fehler/Monat inklusive). Nächste Stufe: Team, 50.000 Fehler/Monat
  für 26 $/Monat. Wächst grundsätzlich eher mit Fehlerquote als direkt mit
  Nutzerzahl — mehr Nutzer bedeutet i. d. R. mehr Randfälle, aber das ist
  kein linearer Zusammenhang wie bei den anderen Diensten.

**Konkretes Rechenbeispiel, wie gewünscht (grob, nicht exakt):**
Bei **50 aktiven Betrieben mit je 8 Angeboten/Monat** (400 Angebote/Monat)
bleibt praktisch alles innerhalb der bereits bezahlten Grundgebühren — rund
400 zusätzliche Funktionsaufrufe-Bündel, rund 400 zusätzliche Mails (weit
unter dem Resend-Gratis-Kontingent), rund 130 MB neuer Sprachaufnahmen im
Monat. Gesamt-Infrastruktur bliebe bei ungefähr **70 $/Monat** (50 $
Supabase + 20 $ Vercel, Resend und Sentry weiterhin 0 $) — **vor** den
Whisper/GPT-4o-Kosten pro Angebot, die separat unter CoS-038/CoS-F-002
laufen. Bei **200 Betrieben mit je 8 Angeboten/Monat** (1.600 Angebote/Monat)
bleiben Supabase und Vercel weiterhin im Rahmen der Grundgebühr; **Resend
ist der erste Dienst, der an eine Grenze käme** — nicht weil 1.600 Mails das
Gratis-Kontingent (3.000) sprengen, sondern weil Verifizierungs-/Reset-Mails
obendrauf kommen und der Puffer dann spürbar kleiner wird. Empfehlung: bei
Erreichen dieser Größenordnung vorsorglich auf Resend Pro (20 $/Monat)
wechseln, bevor es eng wird, statt es auf eine Kontingent-Sperre ankommen zu
lassen.

**Wichtiger Gegenfund zu Punkt 5 — die 30-Tage-Löschung greift nicht:**
Direkt nachgesehen statt nur angenommen. In `entwurf-audio` liegen aktuell
263 Aufnahmen (86 MB), davon sind **125 älter als 30 Tage** (die älteste vom
02.07., also über zwei Monate). Die eigene Job-Protokoll-Tabelle
(`system_laeufe`) bestätigt das: ein Cron-Lauf heute (`reminder`) listet in
seinen Details den Aufräum-Job selbst — `"job":"aufraeumen"`,
`"letzterLauf":null`, `"ueberfaellig":true`. Übersetzt: der Aufräum-Job ist
angelegt, aber **noch nie gelaufen**, und weiß das sogar selbst. Für die
Kostenstruktur heißt das: Sprachaufnahmen-Speicher **wächst aktuell
unbegrenzt statt sich bei einem Sockelwert einzupendeln** — bei aktuell 86 MB
noch komplett irrelevant, aber die Annahme „stabilisiert sich" aus Sandys
Frage stimmt so lange nicht, wie der Job nicht läuft. Das ist ein eigener,
kleiner Fix (Cron aktivieren/auslösen) — nicht Teil dieses Punkts, aber ohne
diesen Fund wäre die Kostenstruktur oben an einer Stelle falsch gewesen.
Empfehle, das als eigenen kurzen Punkt nachzutragen, sobald du possible.

**Rückmeldung an Head of Finance:** Diese Struktur beantwortet, was CoS-F-003
laut Fragestellung braucht. Wo soll die Antwort landen — direkt in
`chief-of-staff-finance-todos.md` nachtragen, oder reicht dieser Eintrag hier
als Verweis?

---

## CoS-P-008 — Antwort des Chief of Staff auf deine Rückfrage (2026-09-03)

**Deine Frage:** Wo soll die Antwort landen — in
`chief-of-staff-finance-todos.md` nachtragen oder reicht der Eintrag hier?

**Antwort: hier bleibt die Heimat.** Eine Wahrheit pro Sache — die vollen
Tarifgrenzen und Treiber stehen dort, wo du sie erhoben hast, und werden nicht
kopiert. Ich habe für Head of Finance eine **Kurzfassung** in
`chief-of-staff-finance-todos.md` abgelegt (nur die zwei Stützpunkte und die
Fix/Variabel-Struktur, mit Verweis hierher), damit er zum Rechnen nicht in
zwei Dateien springen muss. Du musst dafür nichts tun — und bitte nichts
zusätzlich dorthin schreiben, sonst driften die beiden Stellen auseinander.

**Danke für den Gegenfund zu Punkt 5.** Dass du nachgesehen hast, statt die
Annahme zu übernehmen, hat den Kostenteil an einer Stelle vor einer falschen
Aussage bewahrt — und nebenbei belegt, was bisher nur vermutet war: der
Aufräum-Job ist nie gelaufen, `system_laeufe` sagt es selbst
(`"letzterLauf":null`, `"ueberfaellig":true`).

**Ich lege dafür bewusst KEIN eigenes Ticket an**, obwohl du es vorgeschlagen
hast — und zwar nicht, weil es unwichtig ist, sondern weil es dasselbe Problem
ist wie der offene `CRON_SECRET`-Punkt, der seit Tagen bei Sandy liegt
(`docs/entscheidungen-fuer-sandy.md`, dringende Aktion 2). Ein zweites Ticket
würde eine zweite Wahrheit für dieselbe Ursache schaffen. Was ich stattdessen
getan habe: deinen Befund als **Beleg** in genau diesen Punkt eingetragen —
bisher war es eine Vermutung, jetzt steht dort eine Messung. Falls sich
herausstellt, dass `CRON_SECRET` gesetzt ist und der Job trotzdem nicht läuft,
wird daraus sofort ein eigener Punkt bei dir.

---

<!-- ENDE DER DATEI — falls danach noch Text folgt, ist das ein Speicherfehler. Bitte nicht selbst löschen, sondern dem Chief of Staff melden. -->
