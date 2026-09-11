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

### EX-001 — Rückmeldung zu EX-002: Import-Block bei uns sauber

**Datum:** 2026-08-17
**Von:** Head of Product Engineering
**Für:** Platform & Integrations Engineer
**Status:** ✅ geprüft, kein Handlungsbedarf

Danke für den Fund + Fix. Bei uns lokal (Stand nach Commit `228bdc7`) sieht
der Import-Block in `angebot-extrahieren/route.ts` sauber aus — `import *
as Sentry from '@sentry/nextjs'` steht als eigene Zeile nach dem
`extraktion-masse`-Import, kein Merge-Rest, `tsc --noEmit` läuft grün. Kein
weiterer Handlungsbedarf von unserer Seite.

### EX-003 — Der ZUGFeRD/XRechnung-Export deklariert ein ANGEBOT als Rechnung

**Datum:** 2026-09-11
**Von:** Head of Product Engineering
**Für:** Platform & Integrations Engineer
**Status:** ❌ offen, gehört euch (Buchhaltung/E-Rechnung)

**Wie ich darauf gestoßen bin:** Sandy hat heute entschieden, dass der
Angebot/Rechnung-Umschalter in der Vorschau rausfliegt („Rechnung erstmal
raus", CoS-E-008/033/036 aus Manfreds Testlauf). Grund: Er hat nie eine
Rechnung erzeugt, sondern nur zwei Überschriften getauscht — gleiche Nummer,
gleiche Unterschriftszeile, kein Leistungsdatum. Beim Aufräumen habe ich
geprüft, ob irgendwo sonst noch eine „Rechnung" verspricht, was es nicht
gibt. Ein Fund, und der liegt bei euch:

`src/lib/zugferd/generateXML.ts:212` setzt fest `<ram:TypeCode>380</ram:TypeCode>`.
380 ist in UNTDID 1001 die **Handelsrechnung**. Erreichbar ist das über den
Knopf „XRechnung XML" im Angebots-Menü (`/api/pdf/xrechnung?id=…`) und über
den ZUGFeRD-Pfad, sichtbar sobald `e_rechnung_aktiv` an ist und der Kunde
gewerblich ist.

**Warum das mehr ist als ein Schönheitsfehler:** Das erzeugte XML behauptet
gegenüber dem Empfängersystem, ein steuerlich wirksames Rechnungsdokument zu
sein — mit der Angebotsnummer als Rechnungsnummer. Bei einem öffentlichen
Auftraggeber landet das in einer Rechnungseingangsprüfung. Genau davor hat
Manfred Angst (TN-015: „Ich hab lexoffice. Zwei Rechnungsnummernkreise
darf's nicht geben.").

**Was ich NICHT gemacht habe:** angefasst. E-Rechnung/ZUGFeRD/Buchhaltung ist
laut Rollen-Split (CoS-009, 17.08.) euer Gebiet, und die richtige Antwort
hängt davon ab, wie ihr den Bereich insgesamt schneidet. Zwei plausible
Wege, nur als Einordnung: TypeCode 325 (Proforma) für ein Angebot, oder den
Export am Angebot gar nicht anbieten, solange es keine echte Rechnung gibt.

**Verwandt, ebenfalls eher bei euch:** Die Einstellungen bieten weiterhin
einen getrennten Nummernkreis „Rechnungen"
(`src/app/(app)/einstellungen/nummern/page.tsx`). Aus ihm zieht aktuell
niemand eine Nummer — `api/quotes/[id]/nummer` fragt fest nach `p_typ:
'angebot'`. Inert, aber sichtbar; nach Sandys Entscheidung ist das dieselbe
Frage wie oben. Ich habe es bewusst stehen lassen statt einseitig zu
entfernen — sagt Bescheid, wenn ihr das mitnehmt, sonst frage ich Sandy
gesondert.

*Head of Product Engineering · 2026-09-11*
