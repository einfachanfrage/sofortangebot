# Engineering-Austausch: Head of Product Engineering ↔ Platform & Integrations Engineer

Direkte Austauschdatei zwischen den beiden Engineering-Rollen (Aufteilung
seit 17.08.2026, siehe CoS-009 in `chief-of-staff-todos.md`). Hier geht es
NICHT um offene Aufgaben mit Auftraggeber Sandy/Chief of Staff (dafür gibt es
`chief-of-staff-todos.md` und `chief-of-staff-platform-todos.md`), sondern um
das, was zwischen den beiden Rollen direkt hin- und herläuft:

- **Übergaben:** "Das hier gehört eigentlich in dein Gebiet, nicht meins."
- **Querfunde:** "Beim Fixen von X ist mir Y aufgefallen — betrifft dich,
  nicht mich, aber wollte es nicht einfach liegen lassen."
- **Abhängigkeiten:** "Bevor ich Z machen kann, brauche ich von dir W."

**Chief of Staff liest hier regelmäßig mit** (für den Gesamtüberblick), muss
aber nicht jeden Eintrag einzeln bearbeiten — das ist der Unterschied zu den
beiden CoS-Todo-Dateien.

## Wer ist wofür zuständig? (Kurzreferenz, damit die Abgrenzung nicht geraten werden muss)

**Head of Product Engineering** (Preis-Engine, KI-Pipeline, Positionen):
Whisper-Transkription, GPT-Extraktion, Mengen-Engine, Vollständigkeitsprüfung,
Preisdatenbank-Inhalte, Angebots-PDF-Logik, alles rund um "wird die Sprach-
eingabe richtig in Positionen verwandelt". QA für diesen Teil läuft über
`pruefmeister-testfaelle.md`.

**Platform & Integrations Engineer** (alles drumherum): Stripe/Zahlungen,
Lexware/sevDesk/Buchhaltungs-Anbindungen, Sentry/Fehler-Überwachung,
Accounts/Login/Passwort-Reset, Transaktions-E-Mails, Row-Level-Security/
Datentrennung, Deployment/Infrastruktur/Vercel/Supabase-Projekteinstellungen.

**Faustregel für Sandy:** Geht es darum, WAS aus der Spracheingabe wird
(Zahlen, Positionen, Preise, Angebot) → Head of Product Engineering. Geht es
darum, OB/WIE jemand sich einloggen, bezahlen, eine E-Mail bekommen kann,
oder ob etwas technisch läuft/sicher ist → Platform & Integrations Engineer.
Bei Unsicherheit: einfach die Aufgabe wie gewohnt stellen, die zuständige
Person meldet sich, falls sie eigentlich beim anderen landen sollte.

**Status-Zeichen:** ❌ offen · 🟡 in Arbeit · ✅ übernommen/erledigt.

---

## Einträge

*(Neue Einträge oben anfügen, ID hochzählen. Format: Datum, von wem, für
wen, was.)*

### EX-002 — Merge-Kollision hat Produktions-Build kaputt gemacht

**Datum:** 2026-08-17
**Von:** Platform & Integrations Engineer
**Für:** Head of Product Engineering
**Status:** ✅ gefixt

Beim Debuggen eines fehlgeschlagenen Vercel-Produktions-Deploys (im Rahmen
des Logo-Upload-Fixes, CoS-P-005) gefunden: `src/app/api/
angebot-extrahieren/route.ts` — eine Datei aus eurem Zuständigkeitsbereich —
ließ sich nicht mehr bauen (`Turbopack build failed ... Expected ',', got
'*'`). Root Cause: `import * as Sentry from '@sentry/nextjs'` war mitten in
das mehrzeilige `extraktion-masse`-Import-Statement hineingerutscht, statt
danach zu stehen — vermutlich eine Merge-Kollision zwischen zwei parallel
laufenden Änderungen (die Sentry-Zeile sieht nach Observability-Arbeit aus,
CoS-P-002). Ungültiges JavaScript, daher Build-Abbruch.

**Fix (schon erledigt):** Sentry-Import-Zeile hinter die schließende Klammer
des `extraktion-masse`-Imports verschoben, Klammer-Balance geprüft, Commit
`228bdc7` gepusht. Vercel bestätigt „Ready" für diesen Commit — Produktion
baut wieder. Kein weiterer Handlungsbedarf von eurer Seite, nur zur
Info: falls ihr parallel an dieser Datei arbeitet, kurz gegenchecken, dass
der aktuelle Import-Block bei euch lokal auch sauber aussieht (kein
Merge-Rest von der Kollision).

### EX-001 — Platzhalter: noch kein Austausch-Fund

**Datum:** 2026-08-17
**Von:** Head of Product Engineering
**Für:** Platform & Integrations Engineer
**Status:** —

Noch kein echter Fund — diese Datei wurde gerade erst angelegt (Sandys
Wunsch, 2026-08-17: sie lernt die Zuständigkeiten erst mit der Zeit und
möchte, dass wir beide Übergaben/Querfunde hier festhalten statt sie nur
mündlich zu klären). Der erste echte Eintrag kommt, sobald beim Arbeiten an
der Preis-Engine/Pipeline etwas auffällt, das ins Platform-Gebiet gehört
(z. B. während CoS-008 oder einem der offenen PM-Fälle).
